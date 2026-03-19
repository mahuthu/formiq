import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { signToken, requireAuth, AuthRequest } from '../middleware/auth';
import { generateSlug } from '../lib/utils';

export const authRouter = Router();

const registerSchema = z.object({
  orgName: z.string().min(2),
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// POST /api/auth/register
authRouter.post('/register', async (req: Request, res: Response) => {
  try {
    const body = registerSchema.parse(req.body);

    const existing = await prisma.user.findFirst({ where: { email: body.email } });
    if (existing) return res.status(409).json({ error: 'Email already registered' });

    const slug = await generateSlug(body.orgName);
    const passwordHash = await bcrypt.hash(body.password, 12);

    const org = await prisma.organization.create({
      data: {
        name: body.orgName,
        slug,
        plan: 'FREE',
        documentQuota: 50,
        users: {
          create: {
            email: body.email,
            name: body.name,
            passwordHash,
            role: 'OWNER',
          },
        },
      },
      include: { users: true },
    });

    const user = org.users[0];
    const token = signToken({ userId: user.id, orgId: org.id });

    res.status(201).json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      org: { id: org.id, name: org.name, slug: org.slug, plan: org.plan },
    });
  } catch (err: any) {
    if (err.name === 'ZodError') return res.status(400).json({ error: err.errors });
    res.status(500).json({ error: 'Registration failed' });
  }
});

// POST /api/auth/login
authRouter.post('/login', async (req: Request, res: Response) => {
  try {
    const body = loginSchema.parse(req.body);

    const user = await prisma.user.findFirst({
      where: { email: body.email },
      include: { org: true },
    });
    if (!user || !user.passwordHash) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const valid = await bcrypt.compare(body.password, user.passwordHash);
    if (!valid) return res.status(401).json({ error: 'Invalid email or password' });

    await prisma.user.update({ where: { id: user.id }, data: { lastActiveAt: new Date() } });

    const token = signToken({ userId: user.id, orgId: user.orgId });

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      org: {
        id: user.org.id,
        name: user.org.name,
        slug: user.org.slug,
        plan: user.org.plan,
        documentQuota: user.org.documentQuota,
        documentsUsed: user.org.documentsUsed,
        apiKey: user.role === 'OWNER' || user.role === 'ADMIN' ? user.org.apiKey : undefined,
      },
    });
  } catch (err: any) {
    if (err.name === 'ZodError') return res.status(400).json({ error: err.errors });
    res.status(500).json({ error: 'Login failed' });
  }
});

// GET /api/auth/me
authRouter.get('/me', requireAuth, async (req: AuthRequest, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    include: { org: true },
  });
  if (!user) return res.status(404).json({ error: 'Not found' });
  
  res.json({
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
    org: {
      id: user.org.id,
      name: user.org.name,
      plan: user.org.plan,
      documentQuota: user.org.documentQuota,
      documentsUsed: user.org.documentsUsed,
    },
  });
});

// POST /api/auth/refresh-api-key
authRouter.post('/refresh-api-key', requireAuth, async (req: AuthRequest, res: Response) => {
  if (!['OWNER', 'ADMIN'].includes(req.user!.role)) {
    return res.status(403).json({ error: 'Insufficient permissions' });
  }
  const { v4: uuid } = await import('uuid');
  const org = await prisma.organization.update({
    where: { id: req.user!.orgId },
    data: { apiKey: uuid() },
  });
  res.json({ apiKey: org.apiKey });
});
