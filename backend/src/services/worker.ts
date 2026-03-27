import { Worker, Queue, Job } from 'bullmq';
import { redis } from '../lib/redis';
import { prisma } from '../lib/prisma';
import { extractFromDocument, computeOverallConfidence } from './extraction';
import { getFileAsBuffer } from './storage';
import { logger } from '../lib/logger';
import { dispatchWebhook } from './webhook';

export const documentQueue = new Queue('document-processing', { connection: redis as any });

export interface DocumentJob {
  documentId: string;
  orgId: string;
  templateId: string;
  storageKey: string;
  mimeType: string;
}

export function startWorker() {
  const worker = new Worker<DocumentJob>(
    'document-processing',
    async (job: Job<DocumentJob>) => {
      const { documentId, orgId, storageKey, mimeType, templateId } = job.data;
      logger.info(`Processing document ${documentId}`);

      try {
        // Mark as processing
        await prisma.document.update({
          where: { id: documentId },
          data: { status: 'PROCESSING' },
        });

        // Load template
        const template = await prisma.template.findUnique({
          where: { id: templateId },
        });
        if (!template) throw new Error('Template not found');

        const fields = template.fields as any[];

        // Get file from storage
        const { buffer, resolvedMimeType } = await getFileAsBuffer(storageKey, mimeType);

        // Run hybrid extraction (Azure DI → GPT-4.1 mini fallback)
        const start = Date.now();
        const extraction = await extractFromDocument(
          buffer,
          resolvedMimeType,
          template.documentType,
          fields
        );

        // Save extraction
        await prisma.extraction.create({
          data: {
            documentId,
            fields: extraction.fields,
            confidenceScores: Object.fromEntries(
              Object.entries(extraction.fields).map(([k, v]) => [k, v.confidence])
            ),
            modelVersion: extraction.modelVersion,
            processingMs: extraction.processingMs,
            extractionMethod: extraction.extractionMethod,
          },
        });

        // Create record with extracted data
        const recordData: Record<string, any> = {};
        for (const [key, val] of Object.entries(extraction.fields)) {
          recordData[key] = val.value;
        }

        await prisma.record.create({
          data: {
            orgId,
            documentId,
            data: recordData,
            tags: [],
          },
        });

        // Update document status
        await prisma.document.update({
          where: { id: documentId },
          data: {
            status: 'REVIEW',
            processingMs: Date.now() - start,
          },
        });

        // Increment org usage
        await prisma.organization.update({
          where: { id: orgId },
          data: { documentsUsed: { increment: 1 } },
        });

        // Log usage event
        await prisma.usageEvent.create({
          data: { orgId, type: 'document_processed', quantity: 1 },
        });

        // Fire webhook if configured
        await dispatchWebhook(orgId, 'document.extracted', {
          documentId,
          status: 'REVIEW',
          confidence: computeOverallConfidence(extraction.fields),
          fields: recordData,
        });

        logger.info(`Document ${documentId} processed successfully in ${extraction.processingMs}ms`);
      } catch (err: any) {
        logger.error(`Document ${documentId} processing failed`, { error: err.message });
        await prisma.document.update({
          where: { id: documentId },
          data: { status: 'FAILED', errorMessage: err.message },
        });
        throw err;
      }
    },
    {
      connection: redis as any,
      concurrency: 5,
      limiter: { max: 10, duration: 1000 }, // 10 jobs/sec max
    }
  );

  worker.on('completed', job => {
    logger.info(`Job ${job.id} completed`);
  });

  worker.on('failed', (job, err) => {
    logger.error(`Job ${job?.id} failed`, { error: err.message });
  });

  logger.info('Document processing worker started');
  return worker;
}
