// lib/utils.ts
import { prisma } from './prisma';

export async function generateSlug(name: string): Promise<string> {
  let slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').slice(0, 40);
  const existing = await prisma.organization.findUnique({ where: { slug } });
  if (existing) slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`;
  return slug;
}

export function paginate(page = 1, limit = 20) {
  return { skip: (page - 1) * limit, take: limit };
}
