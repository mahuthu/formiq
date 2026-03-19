import { Router } from 'express';
import { requireAuth, requireRole, AuthRequest } from '../middleware/auth';
import { prisma } from '../lib/prisma';
import { z } from 'zod';

export const templatesRouter = Router();

const fieldSchema = z.object({
  name: z.string(),
  type: z.enum(['TEXT', 'NUMBER', 'DATE', 'CURRENCY', 'BOOLEAN', 'LIST', 'EMAIL', 'PHONE']),
  description: z.string().optional(),
  required: z.boolean().optional(),
});

const templateSchema = z.object({
  name: z.string().min(2),
  documentType: z.string(),
  description: z.string().optional(),
  fields: z.array(fieldSchema).min(1),
});

// GET /api/templates — system + org templates
templatesRouter.get('/', requireAuth, async (req: AuthRequest, res) => {
  const templates = await prisma.template.findMany({
    where: {
      OR: [{ isSystem: true }, { orgId: req.user!.orgId }],
    },
    orderBy: [{ isSystem: 'desc' }, { name: 'asc' }],
  });
  res.json(templates);
});

// GET /api/templates/:id
templatesRouter.get('/:id', requireAuth, async (req: AuthRequest, res) => {
  const t = await prisma.template.findFirst({
    where: {
      id: req.params.id,
      OR: [{ isSystem: true }, { orgId: req.user!.orgId }],
    },
  });
  if (!t) return res.status(404).json({ error: 'Template not found' });
  res.json(t);
});

// POST /api/templates — create org template
templatesRouter.post('/', requireAuth, requireRole('OWNER', 'ADMIN'), async (req: AuthRequest, res) => {
  const body = templateSchema.parse(req.body);
  const template = await prisma.template.create({
    data: {
      orgId: req.user!.orgId,
      name: body.name,
      documentType: body.documentType,
      description: body.description,
      fields: body.fields,
      isSystem: false,
    },
  });
  res.status(201).json(template);
});

// PUT /api/templates/:id
templatesRouter.put('/:id', requireAuth, requireRole('OWNER', 'ADMIN'), async (req: AuthRequest, res) => {
  const t = await prisma.template.findFirst({
    where: { id: req.params.id, orgId: req.user!.orgId, isSystem: false },
  });
  if (!t) return res.status(404).json({ error: 'Template not found or is system template' });

  const body = templateSchema.parse(req.body);
  const updated = await prisma.template.update({
    where: { id: t.id },
    data: { name: body.name, documentType: body.documentType, description: body.description, fields: body.fields },
  });
  res.json(updated);
});

// DELETE /api/templates/:id
templatesRouter.delete('/:id', requireAuth, requireRole('OWNER', 'ADMIN'), async (req: AuthRequest, res) => {
  const t = await prisma.template.findFirst({
    where: { id: req.params.id, orgId: req.user!.orgId, isSystem: false },
  });
  if (!t) return res.status(404).json({ error: 'Template not found or is system template' });
  await prisma.template.delete({ where: { id: t.id } });
  res.json({ message: 'Deleted' });
});
