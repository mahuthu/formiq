'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { Copy, RefreshCw, Check, Eye, EyeOff, UserPlus, Trash2, CreditCard, Loader2 } from 'lucide-react';

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <button onClick={copy} className="p-1.5 hover:bg-gray-100 rounded transition-colors" title="Copy">
      {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5 text-gray-400" />}
    </button>
  );
}

type BillingData = {
  billingEnabled: boolean;
  currentPlan: string;
  documentQuota: number;
  documentsUsed: number;
  hasActiveSubscription: boolean;
  plans: { id: string; name: string; quota: number; planCode: string | null }[];
};

export default function SettingsPage() {
  const searchParams = useSearchParams();
  const { user, org } = useAuth();
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [webhookSecret, setWebhookSecret] = useState('');
  const [members, setMembers] = useState<any[]>([]);
  const [inviteForm, setInviteForm] = useState({ name: '', email: '', role: 'UPLOADER', password: '' });
  const [inviting, setInviting] = useState(false);
  const [msg, setMsg] = useState('');
  const [orgName, setOrgName] = useState('');
  const [savingOrg, setSavingOrg] = useState(false);
  const [billing, setBilling] = useState<BillingData | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);
  const isAdmin = user?.role === 'OWNER' || user?.role === 'ADMIN';

  useEffect(() => {
    const billingParam = searchParams.get('billing');
    if (billingParam === 'success') setMsg('Subscription updated successfully.');
    if (billingParam === 'cancelled') setMsg('Checkout was cancelled.');
    if (billingParam) window.history.replaceState({}, '', '/settings');
  }, [searchParams]);

  useEffect(() => {
    if (org) { setOrgName(org.name); }
    if (isAdmin) {
      api.org.profile().then(p => { if (p.apiKey) setApiKey(p.apiKey); });
      api.org.members().then(setMembers);
      api.org.webhook().then(w => { setWebhookUrl(w.webhookUrl || ''); });
      api.billing.getPlans().then(setBilling).catch(() => setBilling(null));
    }
  }, [isAdmin, org?.plan]);

  const refreshApiKey = async () => {
    if (!confirm('Regenerate API key? The old key will stop working immediately.')) return;
    const data = await api.auth.refreshApiKey();
    setApiKey(data.apiKey);
  };

  const saveWebhook = async () => {
    await api.org.setWebhook({ webhookUrl, webhookSecret: webhookSecret || undefined });
    setMsg('Webhook saved');
    setTimeout(() => setMsg(''), 2000);
  };

  const testWebhook = async () => {
    await api.org.testWebhook();
    setMsg('Test event fired — check your endpoint');
    setTimeout(() => setMsg(''), 3000);
  };

  const invite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviting(true);
    try {
      const member = await api.org.invite(inviteForm);
      setMembers(m => [...m, member]);
      setInviteForm({ name: '', email: '', role: 'UPLOADER', password: '' });
    } catch (err: any) {
      setMsg(err.message);
    } finally {
      setInviting(false);
    }
  };

  const removeMember = async (id: string) => {
    if (!confirm('Remove this team member?')) return;
    await api.org.removeMember(id);
    setMembers(m => m.filter(x => x.id !== id));
  };

  const saveOrgName = async () => {
    setSavingOrg(true);
    await api.org.updateProfile({ name: orgName });
    setMsg('Organization name updated');
    setTimeout(() => setMsg(''), 2000);
    setSavingOrg(false);
  };

  const handleUpgrade = async (planCode: string) => {
    setCheckoutLoading(planCode);
    try {
      const { url } = await api.billing.createCheckoutSession(planCode);
      if (url) window.location.href = url;
    } catch (e: any) {
      setMsg(e.message || 'Could not start checkout');
    } finally {
      setCheckoutLoading(null);
    }
  };

  const handleCancelSubscription = async () => {
    if (!confirm('Cancel your subscription? You will be downgraded to the Free plan immediately.')) return;
    setPortalLoading(true);
    try {
      const data = await api.billing.cancelSubscription();
      setMsg(data.message || 'Subscription cancelled.');
      api.billing.getPlans().then(setBilling).catch(() => setBilling(null));
    } catch (e: any) {
      setMsg(e.message || 'Could not cancel subscription');
    } finally {
      setPortalLoading(false);
    }
  };

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="app-card overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100">
        <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );

  return (
    <div className="max-w-2xl space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Settings</h1>
        {msg && <p className="text-xs text-emerald-700 mt-1">{msg}</p>}
      </div>

      {/* Org */}
      <Section title="Organization">
        <div className="flex gap-2">
          <input value={orgName} onChange={e => setOrgName(e.target.value)}
            className="app-input flex-1 px-3 py-2" />
          <button onClick={saveOrgName} disabled={savingOrg}
            className="app-btn-primary px-4 py-2 disabled:opacity-50">
            {savingOrg ? 'Saving...' : 'Save'}
          </button>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3">
          {[
            { label: 'Plan', value: org?.plan?.toLowerCase() },
            { label: 'Documents used', value: org?.documentsUsed },
            { label: 'Monthly quota', value: org?.documentQuota },
          ].map(({ label, value }) => (
            <div key={label} className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-500 mb-0.5">{label}</p>
              <p className="text-sm font-semibold text-slate-900 capitalize">{value}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Billing */}
      {isAdmin && billing && (
        <Section title="Billing & plan">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-slate-500" />
              <span className="text-sm font-medium text-slate-700">
                Current: {billing.currentPlan} · {billing.documentsUsed} / {billing.documentQuota} documents this month
              </span>
            </div>
            <span className="text-xs text-slate-400 bg-slate-50 border border-slate-200 rounded-full px-2.5 py-1">
              M-PESA · Cards · Pesalink · Airtel · Apple Pay
            </span>
          </div>
          {billing.hasActiveSubscription && (
            <button
              type="button"
              onClick={handleCancelSubscription}
              disabled={portalLoading}
              className="mb-4 app-btn-secondary disabled:opacity-60 text-red-600 border-red-200 hover:bg-red-50"
            >
              {portalLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {portalLoading ? 'Cancelling…' : 'Cancel subscription'}
            </button>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {billing.plans.map((plan) => {
              const isCurrent = billing.currentPlan === plan.id;
              const canUpgrade = billing.billingEnabled && plan.planCode && !isCurrent;
              return (
                <div
                  key={plan.id}
                  className={`rounded-xl border p-4 ${isCurrent ? 'border-emerald-600 bg-emerald-50/60' : 'border-slate-200 bg-white'
                    }`}
                >
                  <p className="text-sm font-semibold text-slate-900">{plan.name}</p>
                  <p className="text-xs text-slate-600 mt-0.5">{plan.quota.toLocaleString()} docs / month</p>
                  {plan.id === 'FREE' && <p className="text-xs text-slate-600 mt-1">No credit card required</p>}
                  {canUpgrade && (
                    <button
                      type="button"
                      onClick={() => handleUpgrade(plan.planCode!)}
                      disabled={checkoutLoading !== null}
                      className="mt-3 w-full app-btn-primary text-xs px-3 py-2 disabled:opacity-60"
                    >
                      {checkoutLoading === plan.planCode ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                      {checkoutLoading === plan.planCode ? 'Redirecting…' : 'Upgrade'}
                    </button>
                  )}
                  {isCurrent && (
                    <p className="mt-3 text-xs font-medium text-slate-600">Current plan</p>
                  )}
                </div>
              );
            })}
          </div>
          {!billing.billingEnabled && (
            <p className="mt-3 text-xs text-slate-600">
              Paid plans require Paystack to be configured. Set <code className="bg-slate-100 px-1 rounded">PAYSTACK_SECRET_KEY</code> and plan codes in the backend environment.
            </p>
          )}
        </Section>
      )}

      {/* API Key */}
      {isAdmin && (
        <Section title="API key">
          <p className="text-xs text-slate-600 mb-3">Use this key to authenticate API requests from your applications.</p>
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5">
            <code className="flex-1 text-xs font-mono text-slate-700 truncate">
              {showKey ? apiKey : apiKey.slice(0, 8) + '•'.repeat(28)}
            </code>
            <button onClick={() => setShowKey(s => !s)} className="p-1 hover:bg-slate-200 rounded">
              {showKey ? <EyeOff className="w-3.5 h-3.5 text-slate-400" /> : <Eye className="w-3.5 h-3.5 text-slate-400" />}
            </button>
            <CopyButton value={apiKey} />
          </div>
          <div className="mt-3 flex items-center gap-2">
            <button onClick={refreshApiKey}
              className="flex items-center gap-1.5 text-xs text-red-600 hover:underline">
              <RefreshCw className="w-3 h-3" /> Regenerate key
            </button>
            <span className="text-slate-200">|</span>
            <p className="text-xs text-slate-500">API base URL: <code className="bg-slate-100 px-1 rounded">{process.env.NEXT_PUBLIC_API_URL}</code></p>
          </div>

          <div className="mt-4 bg-slate-50 border border-slate-100 rounded-lg p-3">
            <p className="text-xs font-medium text-slate-700 mb-1.5">Example usage</p>
            <pre className="text-xs text-slate-600 overflow-x-auto">{`curl -H "Authorization: ApiKey ${apiKey.slice(0, 8)}..." \\
  ${process.env.NEXT_PUBLIC_API_URL}/documents`}</pre>
          </div>
        </Section>
      )}

      {/* Webhook */}
      {isAdmin && (
        <Section title="Webhook">
          <p className="text-xs text-slate-600 mb-3">
            FormIQ will POST extracted data to this URL whenever a document is processed.
          </p>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">Endpoint URL</label>
              <input value={webhookUrl} onChange={e => setWebhookUrl(e.target.value)}
                placeholder="https://your-app.com/webhooks/formiq"
                className="app-input px-3 py-2" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">Signing secret (optional)</label>
              <input value={webhookSecret} onChange={e => setWebhookSecret(e.target.value)}
                type="password" placeholder="Used to sign X-FormIQ-Signature header"
                className="app-input px-3 py-2" />
            </div>
            <div className="flex gap-2">
              <button onClick={saveWebhook}
                className="app-btn-primary px-4 py-2">
                Save webhook
              </button>
              {webhookUrl && (
                <button onClick={testWebhook}
                  className="app-btn-secondary px-4 py-2 text-sm font-medium">
                  Send test event
                </button>
              )}
            </div>
          </div>
        </Section>
      )}

      {/* Team */}
      {isAdmin && (
        <Section title="Team members">
          <div className="divide-y divide-slate-100 -mx-5 -mt-5 mb-4">
            {members.map(m => (
              <div key={m.id} className="flex items-center gap-3 px-5 py-3">
                <div className="w-7 h-7 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-semibold text-emerald-800">{m.name?.charAt(0)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800">{m.name}</p>
                  <p className="text-xs text-slate-500">{m.email}</p>
                </div>
                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded capitalize">
                  {m.role?.toLowerCase()}
                </span>
                {m.role !== 'OWNER' && m.id !== user?.id && (
                  <button onClick={() => removeMember(m.id)} className="p-1.5 hover:bg-red-50 rounded transition-colors">
                    <Trash2 className="w-3.5 h-3.5 text-red-400" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="border-t border-slate-100 pt-4">
            <h3 className="text-xs font-semibold text-slate-700 mb-3 flex items-center gap-1.5">
              <UserPlus className="w-3.5 h-3.5" /> Invite member
            </h3>
            <form onSubmit={invite} className="grid grid-cols-2 gap-2">
              <input value={inviteForm.name} onChange={e => setInviteForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Name" required
                className="app-input px-3 py-2" />
              <input value={inviteForm.email} onChange={e => setInviteForm(f => ({ ...f, email: e.target.value }))}
                placeholder="Email" type="email" required
                className="app-input px-3 py-2" />
              <input value={inviteForm.password} onChange={e => setInviteForm(f => ({ ...f, password: e.target.value }))}
                placeholder="Temp password (min 8 chars)" type="password" minLength={8} required
                className="app-input px-3 py-2" />
              <select value={inviteForm.role} onChange={e => setInviteForm(f => ({ ...f, role: e.target.value }))}
                className="app-input px-3 py-2">
                <option value="UPLOADER">Uploader</option>
                <option value="REVIEWER">Reviewer</option>
                <option value="ADMIN">Admin</option>
              </select>
              <button type="submit" disabled={inviting}
                className="col-span-2 py-2 app-btn-primary disabled:opacity-50">
                {inviting ? 'Inviting...' : 'Add team member'}
              </button>
            </form>
          </div>
        </Section>
      )}
    </div>
  );
}
