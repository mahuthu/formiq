import { Router } from 'express';
import multer from 'multer';
import { v4 as uuid } from 'uuid';
import { requireAuth, checkQuota, requireRole, AuthRequest } from '../middleware/auth';
import { prisma } from '../lib/prisma';
import { uploadFile, getSignedUrl, deleteFile } from '../services/storage';
import { documentQueue } from '../services/worker';
import { logger } from '../lib/logger';
import { z } from 'zod';

export const documentsRouter = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
  fileFilter: (_, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    cb(null, allowed.includes(file.mimetype));
  },
});

// POST /api/documents/upload
documentsRouter.post(
  '/upload',
  requireAuth,
  checkQuota,
  upload.array('files', 20),
  async (req: AuthRequest, res) => {
    try {
      const files = req.files as Express.Multer.File[];
      if (!files?.length) return res.status(400).json({ error: 'No files provided' });

      const { templateId } = req.body;
      if (!templateId) return res.status(400).json({ error: 'templateId required' });

      const template = await prisma.template.findFirst({
        where: {
          id: templateId,
          OR: [{ orgId: req.user!.orgId }, { isSystem: true }],
        },
      });
      if (!template) return res.status(404).json({ error: 'Template not found' });

      const created = [];
      for (const file of files) {
        const storageKey = `${req.user!.orgId}/${uuid()}/${file.originalname}`;
        await uploadFile(storageKey, file.buffer, file.mimetype);

        const doc = await prisma.document.create({
          data: {
            orgId: req.user!.orgId,
            uploadedBy: req.user!.id,
            templateId,
            originalFilename: file.originalname,
            storageKey,
            mimeType: file.mimetype,
            fileSize: file.size,
            status: 'PENDING',
          },
        });

        await documentQueue.add('process', {
          documentId: doc.id,
          orgId: req.user!.orgId,
          templateId,
          storageKey,
          mimeType: file.mimetype,
        }, {
          attempts: 3,
          backoff: { type: 'exponential', delay: 2000 },
        });

        created.push({ id: doc.id, filename: doc.originalFilename, status: 'PENDING' });
      }

      res.status(201).json({ documents: created, count: created.length });
    } catch (err: any) {
      logger.error('Upload error', { error: err.message });
      res.status(500).json({ error: 'Upload failed' });
    }
  }
);

// GET /api/documents
documentsRouter.get('/', requireAuth, async (req: AuthRequest, res) => {
  const { status, templateId, page = '1', limit = '20', search } = req.query as any;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const where: any = { orgId: req.user!.orgId };
  if (status) where.status = status;
  if (templateId) where.templateId = templateId;
  if (search) where.originalFilename = { contains: search, mode: 'insensitive' };

  const [docs, total] = await Promise.all([
    prisma.document.findMany({
      where,
      skip,
      take: parseInt(limit),
      orderBy: { createdAt: 'desc' },
      include: {
        template: { select: { name: true, documentType: true } },
        uploader: { select: { name: true, email: true } },
        record: { select: { id: true, approvedAt: true } },
      },
    }),
    prisma.document.count({ where }),
  ]);

  res.json({ documents: docs, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
});

// GET /api/documents/:id
documentsRouter.get('/:id', requireAuth, async (req: AuthRequest, res) => {
  const doc = await prisma.document.findFirst({
    where: { id: req.params.id, orgId: req.user!.orgId },
    include: {
      template: true,
      extraction: true,
      record: true,
      uploader: { select: { name: true, email: true } },
    },
  });
  if (!doc) return res.status(404).json({ error: 'Document not found' });

  const signedUrl = await getSignedUrl(doc.storageKey);
  res.json({ ...doc, signedUrl });
});

// PATCH /api/documents/:id/fields — update extracted fields
documentsRouter.patch('/:id/fields', requireAuth, async (req: AuthRequest, res) => {
  const { fields } = req.body;
  if (!fields || typeof fields !== 'object') {
    return res.status(400).json({ error: 'fields object required' });
  }

  const doc = await prisma.document.findFirst({
    where: { id: req.params.id, orgId: req.user!.orgId },
    include: { record: true },
  });
  if (!doc) return res.status(404).json({ error: 'Document not found' });
  if (!doc.record) return res.status(400).json({ error: 'No record to update' });

  const updatedRecord = await prisma.record.update({
    where: { id: doc.record.id },
    data: {
      data: { ...(doc.record.data as object), ...fields },
      reviewedBy: req.user!.id,
    },
  });

  res.json(updatedRecord);
});

// POST /api/documents/:id/approve
documentsRouter.post('/:id/approve', requireAuth, requireRole('OWNER', 'ADMIN', 'REVIEWER'), async (req: AuthRequest, res) => {
  const doc = await prisma.document.findFirst({
    where: { id: req.params.id, orgId: req.user!.orgId },
    include: { record: true },
  });
  if (!doc) return res.status(404).json({ error: 'Document not found' });

  await Promise.all([
    prisma.document.update({ where: { id: doc.id }, data: { status: 'APPROVED' } }),
    prisma.record.update({
      where: { id: doc.record!.id },
      data: { approvedBy: req.user!.id, approvedAt: new Date() },
    }),
  ]);

  res.json({ message: 'Document approved', documentId: doc.id });
});

// DELETE /api/documents/:id
documentsRouter.delete('/:id', requireAuth, requireRole('OWNER', 'ADMIN'), async (req: AuthRequest, res) => {
  const doc = await prisma.document.findFirst({
    where: { id: req.params.id, orgId: req.user!.orgId },
  });
  if (!doc) return res.status(404).json({ error: 'Document not found' });

  await deleteFile(doc.storageKey);
  await prisma.document.delete({ where: { id: doc.id } });

  res.json({ message: 'Document deleted' });
});
