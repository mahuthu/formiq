import { Router, Response } from 'express';
import { requireAuth, requireRole, AuthRequest } from '../middleware/auth';
import { prisma } from '../lib/prisma';
import {
  paystackHttp,
  isBillingEnabled,
  PLANS,
  FREE_QUOTA,
} from '../lib/paystack';

export const billingRouter = Router();

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

/** GET /api/billing/plans — list available plans and current org plan */
billingRouter.get('/plans', requireAuth, async (req: AuthRequest, res: Response) => {
  const org = await prisma.organization.findUnique({
    where: { id: req.user!.orgId },
    select: { plan: true, documentQuota: true, documentsUsed: true, paystackSubCode: true },
  });
  if (!org) return res.status(404).json({ error: 'Organization not found' });

  const plans = [
    { id: 'FREE', name: 'Free', quota: FREE_QUOTA, planCode: null as string | null },
    ...(process.env.PAYSTACK_STARTER_PLAN_CODE
      ? [{ id: 'STARTER', name: PLANS.STARTER.name, quota: PLANS.STARTER.quota, planCode: process.env.PAYSTACK_STARTER_PLAN_CODE }]
      : []),
    ...(process.env.PAYSTACK_PROFESSIONAL_PLAN_CODE
      ? [{ id: 'PROFESSIONAL', name: PLANS.PROFESSIONAL.name, quota: PLANS.PROFESSIONAL.quota, planCode: process.env.PAYSTACK_PROFESSIONAL_PLAN_CODE }]
      : []),
    ...(process.env.PAYSTACK_ENTERPRISE_PLAN_CODE
      ? [{ id: 'ENTERPRISE', name: PLANS.ENTERPRISE.name, quota: PLANS.ENTERPRISE.quota, planCode: process.env.PAYSTACK_ENTERPRISE_PLAN_CODE }]
      : []),
  ];

  res.json({
    billingEnabled: isBillingEnabled(),
    currentPlan: org.plan,
    documentQuota: org.documentQuota,
    documentsUsed: org.documentsUsed,
    hasActiveSubscription: Boolean(org.paystackSubCode),
    plans,
  });
});

/** POST /api/billing/create-checkout-session — initialize Paystack transaction for subscription */
billingRouter.post('/create-checkout-session', requireAuth, requireRole('OWNER', 'ADMIN'), async (req: AuthRequest, res: Response) => {
  if (!isBillingEnabled()) {
    return res.status(503).json({ error: 'Billing is not configured' });
  }

  const { planCode } = req.body as { planCode?: string };
  if (!planCode || typeof planCode !== 'string') {
    return res.status(400).json({ error: 'planCode is required' });
  }

  // Validate that planCode matches a known plan
  const validCodes = [
    process.env.PAYSTACK_STARTER_PLAN_CODE,
    process.env.PAYSTACK_PROFESSIONAL_PLAN_CODE,
    process.env.PAYSTACK_ENTERPRISE_PLAN_CODE,
  ].filter(Boolean);

  if (!validCodes.includes(planCode)) {
    return res.status(400).json({ error: 'Invalid plan code' });
  }

  // Get the user's email for Paystack customer identification
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: { email: true, name: true },
  });
  if (!user) return res.status(404).json({ error: 'User not found' });

  const org = await prisma.organization.findUnique({
    where: { id: req.user!.orgId },
    select: { id: true, name: true, paystackCustomerCode: true },
  });
  if (!org) return res.status(404).json({ error: 'Organization not found' });

  // Create or reuse Paystack customer
  let customerCode = org.paystackCustomerCode;
  if (!customerCode) {
    const customerRes = await paystackHttp.post('/customer', {
      email: user.email,
      first_name: user.name?.split(' ')[0] || '',
      last_name: user.name?.split(' ').slice(1).join(' ') || '',
      metadata: { orgId: org.id },
    });
    customerCode = customerRes.data.data.customer_code;
    await prisma.organization.update({
      where: { id: org.id },
      data: { paystackCustomerCode: customerCode },
    });
  }

  // Initialize Paystack transaction with the subscription plan
  const txRes = await paystackHttp.post('/transaction/initialize', {
    email: user.email,
    amount: 0, // plan billing is handled by Paystack subscription, amount can be 0
    plan: planCode,
    callback_url: `${FRONTEND_URL}/settings?billing=success`,
    metadata: {
      orgId: org.id,
      planCode,
      cancel_action: `${FRONTEND_URL}/settings?billing=cancelled`,
    },
  });

  const { authorization_url, reference } = txRes.data.data;
  res.json({ url: authorization_url, reference });
});

/** POST /api/billing/cancel-subscription — disable active Paystack subscription */
billingRouter.post('/cancel-subscription', requireAuth, requireRole('OWNER', 'ADMIN'), async (req: AuthRequest, res: Response) => {
  if (!isBillingEnabled()) {
    return res.status(503).json({ error: 'Billing is not configured' });
  }

  const org = await prisma.organization.findUnique({
    where: { id: req.user!.orgId },
    select: { paystackSubCode: true, paystackCustomerCode: true },
  });

  if (!org?.paystackSubCode) {
    return res.status(400).json({ error: 'No active subscription found.' });
  }

  // Get subscription token (required by Paystack to disable a subscription)
  const subRes = await paystackHttp.get(`/subscription/${org.paystackSubCode}`);
  const emailToken = subRes.data.data?.email_token;

  await paystackHttp.post('/subscription/disable', {
    code: org.paystackSubCode,
    token: emailToken,
  });

  // Downgrade org immediately
  await prisma.organization.update({
    where: { id: req.user!.orgId },
    data: { plan: 'FREE', documentQuota: 50, paystackSubCode: null },
  });

  res.json({ message: 'Subscription cancelled. You have been downgraded to the Free plan.' });
});
