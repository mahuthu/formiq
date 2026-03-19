import { Router } from 'express';
import { requireAuth, requireRole, AuthRequest } from '../middleware/auth';
import { prisma } from '../lib/prisma';

export const webhooksRouter = Router();

// GET /api/webhooks — get org webhook config
webhooksRouter.get('/', requireAuth, requireRole('OWNER', 'ADMIN'), async (req: AuthRequest, res) => {
  const org = await prisma.organization.findUnique({
    where: { id: req.user!.orgId },
    select: { webhookUrl: true, webhookSecret: true },
  });
  res.json({ webhookUrl: org?.webhookUrl, hasSecret: !!org?.webhookSecret });
});

// PUT /api/webhooks — set/update webhook
webhooksRouter.put('/', requireAuth, requireRole('OWNER', 'ADMIN'), async (req: AuthRequest, res) => {
  const { webhookUrl, webhookSecret } = req.body;
  const updated = await prisma.organization.update({
    where: { id: req.user!.orgId },
    data: {
      webhookUrl: webhookUrl || null,
      webhookSecret: webhookSecret || null,
    },
    select: { webhookUrl: true },
  });
  res.json({ webhookUrl: updated.webhookUrl, message: 'Webhook updated' });
});

// POST /api/webhooks/test — fire test event
webhooksRouter.post('/test', requireAuth, requireRole('OWNER', 'ADMIN'), async (req: AuthRequest, res) => {
  const { dispatchWebhook } = await import('../services/webhook');
  await dispatchWebhook(req.user!.orgId, 'test.ping', { message: 'FormIQ webhook test', timestamp: new Date() });
  res.json({ message: 'Test webhook dispatched' });
});
