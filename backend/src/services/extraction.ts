import Anthropic from '@anthropic-ai/sdk';
import { logger } from '../lib/logger';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

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
  rawResponse?: string;
}

export async function extractFromDocument(
  imageBase64: string,
  mimeType: string,
  documentType: string,
  fields: FieldDefinition[],
  options?: { debug?: boolean }
): Promise<ExtractionResult> {
  const start = Date.now();

  const fieldList = fields.map(f =>
    `- "${f.name}" (${f.type}${f.description ? ': ' + f.description : ''})`
  ).join('\n');

  const systemPrompt = `You are a document data extraction specialist. You extract structured information from documents with high accuracy, including printed and handwritten text. You always respond with valid JSON only — no markdown, no explanation.`;

  const userPrompt = `Extract the following fields from this ${documentType} document. The document may be printed or handwritten, possibly in English or Swahili.

FIELDS TO EXTRACT:
${fieldList}

Respond ONLY with a JSON object in this exact format:
{
  "FieldName": {
    "value": <extracted value or null if not found>,
    "confidence": "high" | "medium" | "low"
  }
}

Confidence guide:
- "high": clearly readable, certain of value
- "medium": somewhat readable, best guess
- "low": barely readable or inferred, or field not found (value = null)

For dates, use ISO format (YYYY-MM-DD) if determinable.
For currency, extract numeric value and currency code separately if possible.
Be thorough. Do not skip fields.`;

  const content: Anthropic.MessageParam['content'] = [
    {
      type: 'image',
      source: {
        type: 'base64',
        media_type: mimeType as any,
        data: imageBase64,
      },
    },
    { type: 'text', text: userPrompt },
  ];

  try {
    const response = await anthropic.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 2048,
      system: systemPrompt,
      messages: [{ role: 'user', content }],
    });

    const rawText = response.content
      .filter(b => b.type === 'text')
      .map(b => (b as any).text)
      .join('');

    const cleanJson = rawText.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleanJson);

    const processingMs = Date.now() - start;

    // Normalize: ensure all requested fields are present
    const result: ExtractionResult['fields'] = {};
    for (const field of fields) {
      if (parsed[field.name]) {
        result[field.name] = {
          value: parsed[field.name].value ?? null,
          confidence: parsed[field.name].confidence ?? 'low',
        };
      } else {
        result[field.name] = { value: null, confidence: 'low' };
      }
    }

    return {
      fields: result,
      processingMs,
      modelVersion: response.model,
      rawResponse: options?.debug ? rawText : undefined,
    };
  } catch (err: any) {
    logger.error('Extraction failed', { error: err.message });
    throw new Error(`AI extraction failed: ${err.message}`);
  }
}

export function computeOverallConfidence(
  fields: ExtractionResult['fields']
): number {
  const scores = Object.values(fields).map(f => {
    if (f.confidence === 'high') return 1;
    if (f.confidence === 'medium') return 0.6;
    return 0.2;
  });
  if (!scores.length) return 0;
  return Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 100);
}
