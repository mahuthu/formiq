import axios from 'axios';
import crypto from 'crypto';
import type { Plan } from '@prisma/client';

const secret = process.env.PAYSTACK_SECRET_KEY;

export const paystackHttp = axios.create({
    baseURL: 'https://api.paystack.co',
    headers: {
        Authorization: `Bearer ${secret || ''}`,
        'Content-Type': 'application/json',
    },
});

export const PLANS: Record<Exclude<Plan, 'FREE'>, { quota: number; name: string }> = {
    STARTER: { quota: 500, name: 'Starter' },
    PROFESSIONAL: { quota: 2000, name: 'Professional' },
    ENTERPRISE: { quota: 10000, name: 'Enterprise' },
};

export const FREE_QUOTA = 50;

/** Map Paystack Plan Code (env) → internal Plan */
export function getPlanForPlanCode(planCode: string): Plan | null {
    if (process.env.PAYSTACK_STARTER_PLAN_CODE === planCode) return 'STARTER';
    if (process.env.PAYSTACK_PROFESSIONAL_PLAN_CODE === planCode) return 'PROFESSIONAL';
    if (process.env.PAYSTACK_ENTERPRISE_PLAN_CODE === planCode) return 'ENTERPRISE';
    return null;
}

/** Get Paystack plan code for an internal Plan */
export function getPlanCodeForPlan(plan: Exclude<Plan, 'FREE'>): string | null {
    if (plan === 'STARTER') return process.env.PAYSTACK_STARTER_PLAN_CODE || null;
    if (plan === 'PROFESSIONAL') return process.env.PAYSTACK_PROFESSIONAL_PLAN_CODE || null;
    if (plan === 'ENTERPRISE') return process.env.PAYSTACK_ENTERPRISE_PLAN_CODE || null;
    return null;
}

export function getQuotaForPlan(plan: Plan): number {
    if (plan === 'FREE') return FREE_QUOTA;
    return PLANS[plan]?.quota ?? FREE_QUOTA;
}

export function isBillingEnabled(): boolean {
    return Boolean(secret);
}

/** Verify Paystack webhook HMAC-SHA512 signature */
export function verifyPaystackSignature(body: string, signature: string): boolean {
    const webhookSecret = process.env.PAYSTACK_WEBHOOK_SECRET;
    if (!webhookSecret) return false;
    const hash = crypto.createHmac('sha512', webhookSecret).update(body).digest('hex');
    return hash === signature;
}
