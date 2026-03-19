import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { requireAuth, requireRole, AuthRequest } from '../middleware/auth';
import { prisma } from '../lib/prisma';
import { z } from 'zod';

export const orgRouter = Router();

// GET /api/org/usage
orgRouter.get('/usage', requireAuth, async (req: AuthRequest, res) => {
  const [org, events] = await Promise.all([
    prisma.organization.findUnique({ where: { id: req.user!.orgId } }),
    prisma.usageEvent.groupBy({
      by: ['type'],
      where: {
        orgId: req.user!.orgId,
        createdAt: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
      },
      _sum: { quantity: true },
    }),
  ]);

  const docStats = await prisma.document.groupBy({
    by: ['status'],
    where: { orgId: req.user!.orgId },
    _count: true,
  });

  res.json({
    plan: org?.plan,
    quota: org?.documentQuota,
    used: org?.documentsUsed,
    remaining: (org?.documentQuota || 0) - (org?.documentsUsed || 0),
    percentUsed: Math.round(((org?.documentsUsed || 0) / (org?.documentQuota || 1)) * 100),
    byStatus: Object.fromEntries(docStats.map(s => [s.status, s._count])),
    events: Object.fromEntries(events.map(e => [e.type, e._sum.quantity])),
  });
});

// GET /api/org/members
orgRouter.get('/members', requireAuth, requireRole('OWNER', 'ADMIN'), async (req: AuthRequest, res) => {
  const members = await prisma.user.findMany({
    where: { orgId: req.user!.orgId },
    select: { id: true, name: true, email: true, role: true, lastActiveAt: true, createdAt: true },
    orderBy: { createdAt: 'asc' },
  });
  res.json(members);
});

// POST /api/org/invite
orgRouter.post('/invite', requireAuth, requireRole('OWNER', 'ADMIN'), async (req: AuthRequest, res) => {
  const schema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    role: z.enum(['ADMIN', 'REVIEWER', 'UPLOADER']),
    password: z.string().min(8),
  });

  const body = schema.parse(req.body);

  const existing = await prisma.user.findFirst({ where: { email: body.email, orgId: req.user!.orgId } });
  if (existing) return res.status(409).json({ error: 'User already exists in this organization' });

  const passwordHash = await bcrypt.hash(body.password, 12);
  const user = await prisma.user.create({
    data: {
      orgId: req.user!.orgId,
      name: body.name,
      email: body.email,
      passwordHash,
      role: body.role as any,
    },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  res.status(201).json(user);
});

// PATCH /api/org/members/:id
orgRouter.patch('/members/:id', requireAuth, requireRole('OWNER', 'ADMIN'), async (req: AuthRequest, res) => {
  const { role } = req.body;
  if (!['ADMIN', 'REVIEWER', 'UPLOADER'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }

  const user = await prisma.user.findFirst({
    where: { id: req.params.id, orgId: req.user!.orgId },
  });
  if (!user) return res.status(404).json({ error: 'User not found' });
  if (user.role === 'OWNER') return res.status(403).json({ error: 'Cannot change owner role' });

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: { role },
    select: { id: true, name: true, email: true, role: true },
  });
  res.json(updated);
});

// DELETE /api/org/members/:id
orgRouter.delete('/members/:id', requireAuth, requireRole('OWNER', 'ADMIN'), async (req: AuthRequest, res) => {
  if (req.params.id === req.user!.id) return res.status(400).json({ error: 'Cannot remove yourself' });
  const user = await prisma.user.findFirst({ where: { id: req.params.id, orgId: req.user!.orgId } });
  if (!user) return res.status(404).json({ error: 'User not found' });
  if (user.role === 'OWNER') return res.status(403).json({ error: 'Cannot remove owner' });
  await prisma.user.delete({ where: { id: user.id } });
  res.json({ message: 'Member removed' });
});

// GET /api/org/profile
orgRouter.get('/profile', requireAuth, async (req: AuthRequest, res) => {
  const org = await prisma.organization.findUnique({
    where: { id: req.user!.orgId },
    select: { id: true, name: true, slug: true, plan: true, documentQuota: true, documentsUsed: true, webhookUrl: true, apiKey: true, createdAt: true },
  });
  res.json(org);
});

// PATCH /api/org/profile
orgRouter.patch('/profile', requireAuth, requireRole('OWNER'), async (req: AuthRequest, res) => {
  const { name, webhookUrl, webhookSecret } = req.body;
  const updated = await prisma.organization.update({
    where: { id: req.user!.orgId },
    data: { ...(name && { name }), ...(webhookUrl !== undefined && { webhookUrl }), ...(webhookSecret && { webhookSecret }) },
    select: { id: true, name: true, webhookUrl: true },
  });
  res.json(updated);
});
