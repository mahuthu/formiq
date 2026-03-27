import { Router } from 'express';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { prisma } from '../lib/prisma';
import { stringify } from 'csv-stringify/sync';

export const recordsRouter = Router();

// GET /api/records — search and filter
recordsRouter.get('/', requireAuth, async (req: AuthRequest, res) => {
  const { templateId, status, from, to, tag, search, page = '1', limit = '20' } = req.query as any;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const recWhere: any = { orgId: req.user!.orgId };

  // Filter by Template (relation filtering)
  if (templateId) {
    recWhere.document = { templateId };
  }

  // Status filtering (now via document status)
  if (status) {
    recWhere.document = { ...recWhere.document, status };
  }

  if (from || to) {
    recWhere.createdAt = {};
    if (from) recWhere.createdAt.gte = new Date(from);
    if (to) {
      const toDate = new Date(to);
      toDate.setHours(23, 59, 59, 999);
      recWhere.createdAt.lte = toDate;
    }
  }
  if (tag) recWhere.tags = { has: tag };

  const [records, total] = await Promise.all([
    prisma.record.findMany({
      where: recWhere,
      skip,
      take: parseInt(limit),
      orderBy: { createdAt: 'desc' },
      include: {
        document: {
          include: {
            template: { select: { name: true, documentType: true } },
            uploader: { select: { name: true } },
          },
        },
        approver: { select: { name: true } },
      },
    }),
    prisma.record.count({ where: recWhere }),
  ]);

  res.json({ records, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
});

// GET /api/records/export — bulk CSV/JSON export
recordsRouter.get('/export', requireAuth, async (req: AuthRequest, res) => {
  const { format = 'csv', templateId, from, to } = req.query as any;

  const where: any = { orgId: req.user!.orgId };

  if (templateId) {
    where.document = { templateId };
  }

  if (from || to) {
    where.createdAt = {};
    if (from) where.createdAt.gte = new Date(from);
    if (to) {
      const toDate = new Date(to);
      toDate.setHours(23, 59, 59, 999);
      where.createdAt.lte = toDate;
    }
  }

  const records = await prisma.record.findMany({
    where,
    include: {
      document: { include: { template: { select: { name: true } } } },
    },
    orderBy: { createdAt: 'desc' },
    take: 10000,
  });

  if (format === 'json') {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="formiq-export.json"');
    return res.json(records.map(r => ({
      id: r.id,
      template: r.document.template?.name,
      filename: r.document.originalFilename,
      approvedAt: r.approvedAt,
      createdAt: r.createdAt,
      ...((r.data as object) || {}),
    })));
  }

  // CSV: collect all field keys
  const allKeys = new Set<string>();
  records.forEach(r => Object.keys(r.data as object).forEach(k => allKeys.add(k)));
  const fieldKeys = [...allKeys];

  const rows = records.map(r => ({
    id: r.id,
    template: r.document.template?.name,
    filename: r.document.originalFilename,
    approvedAt: r.approvedAt?.toISOString() || '',
    createdAt: r.createdAt.toISOString(),
    ...Object.fromEntries(fieldKeys.map(k => [k, (r.data as any)[k] ?? ''])),
  }));

  const csv = stringify(rows, { header: true });
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="formiq-export.csv"');
  res.send(csv);
});

// GET /api/records/:id
recordsRouter.get('/:id', requireAuth, async (req: AuthRequest, res) => {
  const record = await prisma.record.findFirst({
    where: { id: req.params.id, orgId: req.user!.orgId },
    include: {
      document: { include: { template: true, extraction: true } },
      approver: { select: { name: true, email: true } },
    },
  });
  if (!record) return res.status(404).json({ error: 'Record not found' });
  res.json(record);
});

// PATCH /api/records/:id/tags
recordsRouter.patch('/:id/tags', requireAuth, async (req: AuthRequest, res) => {
  const { tags } = req.body;
  if (!Array.isArray(tags)) return res.status(400).json({ error: 'tags must be an array' });
  const record = await prisma.record.findFirst({
    where: { id: req.params.id, orgId: req.user!.orgId },
  });
  if (!record) return res.status(404).json({ error: 'Not found' });
  const updated = await prisma.record.update({ where: { id: record.id }, data: { tags } });
  res.json(updated);
});
