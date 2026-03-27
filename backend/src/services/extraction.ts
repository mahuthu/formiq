import { AzureKeyCredential, DocumentAnalysisClient } from '@azure/ai-form-recognizer';
import OpenAI from 'openai';
import sharp from 'sharp';
import { logger } from '../lib/logger';

// ─── Clients ──────────────────────────────────────────────────────────────────

const azureEndpoint = process.env.AZURE_FORM_RECOGNIZER_ENDPOINT!;
const azureKey = process.env.AZURE_FORM_RECOGNIZER_KEY!;
const azureModelId = process.env.AZURE_DI_MODEL_ID || 'prebuilt-document';
const confidenceThreshold = parseFloat(process.env.AZURE_DI_CONFIDENCE_THRESHOLD || '0.70');

let azureClient: DocumentAnalysisClient | null = null;
function getAzureClient(): DocumentAnalysisClient {
  if (!azureClient) {
    if (!azureEndpoint || !azureKey) {
      throw new Error('AZURE_FORM_RECOGNIZER_ENDPOINT and AZURE_FORM_RECOGNIZER_KEY must be set');
    }
    azureClient = new DocumentAnalysisClient(azureEndpoint, new AzureKeyCredential(azureKey));
  }
  return azureClient;
}

let openaiClient: OpenAI | null = null;
function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    const apiKey = process.env.AZURE_OPENAI_KEY;
    const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
    const deployment = process.env.AZURE_OPENAI_DEPLOYMENT_NAME;
    const version = process.env.AZURE_OPENAI_VERSION || '2024-12-01-preview';

    if (!apiKey || !endpoint || !deployment) {
      throw new Error('AZURE_OPENAI_KEY, AZURE_OPENAI_ENDPOINT, and AZURE_OPENAI_DEPLOYMENT_NAME must be set');
    }

    openaiClient = new OpenAI({
      apiKey,
      baseURL: `${endpoint.replace(/\/$/, '')}/openai/deployments/${deployment}`,
      defaultQuery: { 'api-version': version },
      defaultHeaders: { 'api-key': apiKey },
    });
  }
  return openaiClient;
}

// ─── Types ──────────────────────────────────────────────────────────────────

export interface FieldDefinition {
  name: string;
  type: string;
  description?: string;
  required?: boolean;
}

export interface ExtractionResult {
  fields: Record<string, { value: any; confidence: 'high' | 'medium' | 'low' }>;
  processingMs: number;
  modelVersion: string;
  extractionMethod: 'azure-di' | 'azure-di+gpt-fallback';
  rawAzureText?: string;
  rawResponse?: string;
}

// ─── Confidence helpers ──────────────────────────────────────────────────────

function toConfidenceLevel(score: number | undefined): 'high' | 'medium' | 'low' {
  if (score === undefined || score === null) return 'low';
  if (score >= 0.85) return 'high';
  if (score >= 0.60) return 'medium';
  return 'low';
}

export function computeOverallConfidence(fields: ExtractionResult['fields']): number {
  const scores = Object.values(fields).map(f => {
    if (f.confidence === 'high') return 1;
    if (f.confidence === 'medium') return 0.6;
    return 0.2;
  });
  if (!scores.length) return 0;
  return Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 100);
}

// ─── Stage 1: Azure Document Intelligence ───────────────────────────────────

export async function extractWithAzureDI(
  fileBuffer: Buffer,
  mimeType: string,
  documentType: string,
  fields: FieldDefinition[]
): Promise<{ result: ExtractionResult['fields']; rawText: string; modelVersion: string }> {
  const client = getAzureClient();

  try {
    // Standardize to PNG for maximum compatibility with Azure DI
    logger.info(`[Extraction] Standardizing image to PNG via sharp...`);
    const processedBuffer = await sharp(fileBuffer)
      .rotate() // fix orientation based on EXIF
      .png()
      .toBuffer();

    const poller = await client.beginAnalyzeDocument(
      azureModelId as any,
      processedBuffer
    );

    const analyzeResult = await poller.pollUntilDone();

    // Collect all raw text content (for GPT fallback if needed)
    const rawText = analyzeResult.content || '';

    // Build a lookup of key-value pairs from Azure DI (case-insensitive keys)
    const kvMap: Record<string, { value: string; confidence: number }> = {};

    if (analyzeResult.keyValuePairs) {
      for (const kv of analyzeResult.keyValuePairs) {
        const key = kv.key?.content?.trim().toLowerCase();
        const val = kv.value?.content?.trim();
        const conf = kv.confidence ?? 0;
        if (key) {
          kvMap[key] = { value: val ?? '', confidence: conf };
        }
      }
    }

    // Map Azure DI results to the requested field definitions
    const resultFields: ExtractionResult['fields'] = {};
    for (const field of fields) {
      const normalizedName = field.name.toLowerCase();

      // Try exact match, then partial match in the KV map keys
      const matchedKey = Object.keys(kvMap).find(k =>
        k === normalizedName ||
        k.includes(normalizedName) ||
        normalizedName.includes(k)
      );

      if (matchedKey && kvMap[matchedKey].value) {
        resultFields[field.name] = {
          value: kvMap[matchedKey].value,
          confidence: toConfidenceLevel(kvMap[matchedKey].confidence),
        };
      } else {
        resultFields[field.name] = { value: null, confidence: 'low' };
      }
    }

    return {
      result: resultFields,
      rawText,
      modelVersion: `azure-di/${azureModelId}`,
    };
  } catch (err: any) {
    logger.error('[Extraction] Azure DI raw error details', {
      message: err.message,
      code: err.code,
      details: err.details,
      statusCode: err.statusCode,
      response: err.response?.body,
    });
    throw err;
  }
}

// ─── Stage 2: GPT-4.1 mini cleanup / fallback ────────────────────────────────

export async function cleanupWithGPT(
  rawAzureText: string,
  partialFields: ExtractionResult['fields'],
  fields: FieldDefinition[],
  documentType: string
): Promise<ExtractionResult['fields']> {
  const openai = getOpenAIClient();

  // Only re-extract fields that are missing or low-confidence
  const fieldsNeedingHelp = fields.filter(f => {
    const cur = partialFields[f.name];
    return !cur || cur.value === null || cur.confidence === 'low';
  });

  if (fieldsNeedingHelp.length === 0) return partialFields;

  const fieldList = fieldsNeedingHelp.map(f =>
    `- "${f.name}" (${f.type}${f.description ? ': ' + f.description : ''})`
  ).join('\n');

  const partialContext = fieldsNeedingHelp
    .filter(f => partialFields[f.name]?.value !== null)
    .map(f => `- "${f.name}": partially read as "${partialFields[f.name]?.value}" (low confidence)`)
    .join('\n');

  const systemPrompt = `You are a document entity extraction specialist. You receive the raw text content from a scanned document (already OCR'd by Azure Document Intelligence) and a list of fields that could not be reliably extracted. Your job is to find those field values in the raw text and return them with confidence levels. Respond ONLY with valid JSON — no markdown, no explanation.`;

  const userPrompt = `Document type: ${documentType}

RAW DOCUMENT TEXT (from OCR):
---
${rawAzureText.slice(0, 8000)}
---

${partialContext ? `Partially extracted (low confidence — verify and correct):\n${partialContext}\n` : ''}
Fields to extract or fix:
${fieldList}

Respond ONLY with a JSON object in this exact format:
{
  "FieldName": {
    "value": <extracted value or null if not found>,
    "confidence": "high" | "medium" | "low"
  }
}

Confidence guide:
- "high": clearly found in text, certain of value
- "medium": inferred or partially readable, best guess
- "low": not found or uncertain (use null for value)

For dates, use ISO format (YYYY-MM-DD). For currency, use numeric value only.`;

  const response = await openai.chat.completions.create({
    model: process.env.AZURE_OPENAI_DEPLOYMENT_NAME || 'gpt-4.1-mini',
    max_tokens: 1024,
    temperature: 0.1,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
  });

  const rawText = response.choices[0]?.message?.content || '{}';
  const cleanJson = rawText.replace(/```json|```/g, '').trim();
  const parsed: Record<string, { value: any; confidence: string }> = JSON.parse(cleanJson);

  // Merge GPT results into partialFields — only override low/null fields
  const merged = { ...partialFields };
  for (const field of fieldsNeedingHelp) {
    if (parsed[field.name]) {
      merged[field.name] = {
        value: parsed[field.name].value ?? null,
        confidence: (parsed[field.name].confidence as any) ?? 'low',
      };
    }
  }

  return merged;
}

// ─── Orchestrator ────────────────────────────────────────────────────────────

export async function extractFromDocument(
  fileBuffer: Buffer,
  mimeType: string,
  documentType: string,
  fields: FieldDefinition[],
  options?: { debug?: boolean }
): Promise<ExtractionResult> {
  const start = Date.now();

  // Stage 1: Azure Document Intelligence
  logger.info(`[Extraction] Running Azure DI (model: ${azureModelId}) on ${documentType}`);
  const { result: azureFields, rawText, modelVersion } = await extractWithAzureDI(
    fileBuffer,
    mimeType,
    documentType,
    fields
  );

  const azureScore = computeOverallConfidence(azureFields) / 100;
  logger.info(`[Extraction] Azure DI overall confidence: ${Math.round(azureScore * 100)}% (threshold: ${Math.round(confidenceThreshold * 100)}%)`);

  // Stage 2: GPT-4.1 mini fallback if confidence is below threshold
  let finalFields = azureFields;
  let extractionMethod: ExtractionResult['extractionMethod'] = 'azure-di';

  if (azureScore < confidenceThreshold) {
    logger.info(`[Extraction] Confidence below threshold — running GPT-4.1-mini cleanup`);
    try {
      finalFields = await cleanupWithGPT(rawText, azureFields, fields, documentType);
      extractionMethod = 'azure-di+gpt-fallback';
    } catch (gptErr: any) {
      logger.error('[Extraction] GPT-4.1-mini fallback failed, using Azure DI results', { error: gptErr.message });
      // Fall back gracefully to whatever Azure DI gave us
    }
  }

  const processingMs = Date.now() - start;
  logger.info(`[Extraction] Completed in ${processingMs}ms via ${extractionMethod}`);

  return {
    fields: finalFields,
    processingMs,
    modelVersion,
    extractionMethod,
    rawAzureText: options?.debug ? rawText : undefined,
  };
}
