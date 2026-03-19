import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { getPlanForPlanCode, getQuotaForPlan, verifyPaystackSignature } from '../lib/paystack';
import { logger } from '../lib/logger';

export function handlePaystackWebhook(req: Request, res: Response): void {
    const signature = req.headers['x-paystack-signature'];
    if (!signature || typeof signature !== 'string') {
        res.status(400).json({ error: 'Missing x-paystack-signature' });
        return;
    }

    const rawBody = JSON.stringify(req.body);
    if (!verifyPaystackSignature(rawBody, signature)) {
        logger.warn('Paystack webhook signature verification failed');
        res.status(400).json({ error: 'Invalid signature' });
        return;
    }

    const event = req.body as { event: string; data: any };

    (async () => {
        switch (event.event) {
            /**
             * charge.success fires when a subscription payment succeeds.
             * The data.plan object is present when the charge is tied to a subscription plan.
             */
            case 'charge.success': {
                const charge = event.data;
                const planCode: string | undefined = charge.plan?.plan_code;
                const orgId: string | undefined = charge.metadata?.orgId;
                const subscriptionCode: string | undefined = charge.subscription_code;

                if (!planCode || !orgId) break;

                const plan = getPlanForPlanCode(planCode);
                if (!plan) break;

                const quota = getQuotaForPlan(plan);
                await prisma.organization.update({
                    where: { id: orgId },
                    data: {
                        plan,
                        documentQuota: quota,
                        ...(subscriptionCode ? { paystackSubCode: subscriptionCode } : {}),
                    },
                });
                logger.info('Paystack charge success — plan upgraded', { orgId, plan });
                break;
            }

            /**
             * subscription.create fires when a new subscription is created on Paystack.
             */
            case 'subscription.create': {
                const sub = event.data;
                const planCode: string | undefined = sub.plan?.plan_code;
                const subscriptionCode: string | undefined = sub.subscription_code;
                const customerCode: string | undefined = sub.customer?.customer_code;

                if (!planCode) break;

                const plan = getPlanForPlanCode(planCode);
                if (!plan) break;

                const org = await prisma.organization.findFirst({
                    where: { paystackCustomerCode: customerCode },
                    select: { id: true },
                });
                if (!org) break;

                const quota = getQuotaForPlan(plan);
                await prisma.organization.update({
                    where: { id: org.id },
                    data: { plan, documentQuota: quota, paystackSubCode: subscriptionCode ?? null },
                });
                logger.info('Paystack subscription created', { orgId: org.id, plan });
                break;
            }

            /**
             * subscription.disable fires when a subscription is cancelled (by customer or admin).
             */
            case 'subscription.disable': {
                const sub = event.data;
                const subscriptionCode: string | undefined = sub.subscription_code;
                if (!subscriptionCode) break;

                const org = await prisma.organization.findFirst({
                    where: { paystackSubCode: subscriptionCode },
                    select: { id: true },
                });
                if (!org) break;

                await prisma.organization.update({
                    where: { id: org.id },
                    data: { plan: 'FREE', documentQuota: 50, paystackSubCode: null },
                });
                logger.info('Paystack subscription disabled — downgraded to FREE', { orgId: org.id });
                break;
            }

            /**
             * invoice.payment_failed — log warning, no action needed (Paystack retries automatically).
             */
            case 'invoice.payment_failed': {
                const invoice = event.data;
                logger.warn('Paystack payment failed', { subscriptionCode: invoice.subscription?.subscription_code });
                break;
            }

            default:
                break;
        }
    })().catch((err) => logger.error('Paystack webhook handler error', { error: err }));

    // Always acknowledge immediately so Paystack doesn't retry
    res.status(200).json({ received: true });
}
