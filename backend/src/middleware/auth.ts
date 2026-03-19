import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';

export interface AuthRequest extends Request {
  user?: { id: string; orgId: string; role: string; email: string };
  org?: { id: string; plan: string; documentQuota: number; documentsUsed: number };
}

const JWT_SECRET = process.env.JWT_SECRET || 'changeme-in-production';

export function signToken(payload: object): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): any {
  return jwt.verify(token, JWT_SECRET);
}

export async function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization;
    
    // API key auth
    if (header?.startsWith('ApiKey ')) {
      const apiKey = header.slice(7);
      const org = await prisma.organization.findUnique({ where: { apiKey } });
      if (!org) return res.status(401).json({ error: 'Invalid API key' });
      req.org = org as any;
      req.user = { id: 'api', orgId: org.id, role: 'ADMIN', email: 'api@system' };
      return next();
    }

    // JWT auth
    if (!header?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization header required' });
    }
    const token = header.slice(7);
    const decoded = verifyToken(token);
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { org: true },
    });
    if (!user) return res.status(401).json({ error: 'User not found' });
    
    req.user = { id: user.id, orgId: user.orgId, role: user.role, email: user.email };
    req.org = user.org as any;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

export function requireRole(...roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
}

export async function checkQuota(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.org) return res.status(401).json({ error: 'No org context' });
  if (req.org.documentsUsed >= req.org.documentQuota) {
    return res.status(402).json({
      error: 'Monthly document quota exceeded',
      quota: req.org.documentQuota,
      used: req.org.documentsUsed,
      upgradeUrl: `${process.env.FRONTEND_URL}/settings/billing`,
    });
  }
  next();
}
