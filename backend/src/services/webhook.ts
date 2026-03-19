import { prisma } from '../lib/prisma';
import { logger } from '../lib/logger';
import crypto from 'crypto';

export async function dispatchWebhook(orgId: string, event: string, payload: object) {
  const org = await prisma.organization.findUnique({ where: { id: orgId } });
  if (!org?.webhookUrl) return;

  const body = JSON.stringify({ event, data: payload, timestamp: new Date().toISOString() });
  const sig = org.webhookSecret
    ? crypto.createHmac('sha256', org.webhookSecret).update(body).digest('hex')
    : null;

  try {
    const res = await fetch(org.webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(sig ? { 'X-FormIQ-Signature': sig } : {}),
      },
      body,
    });
    logger.info(`Webhook dispatched: ${event} -> ${org.webhookUrl} [${res.status}]`);
  } catch (err: any) {
    logger.error(`Webhook failed: ${err.message}`);
  }
}
