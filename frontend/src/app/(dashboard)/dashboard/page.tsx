'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { FileText, CheckCircle, Clock, AlertCircle, Upload, TrendingUp } from 'lucide-react';
import Link from 'next/link';

interface UsageData {
  plan: string; quota: number; used: number; remaining: number; percentUsed: number;
  byStatus: Record<string, number>;
}

const STATUS_CLS: Record<string, string> = {
  PENDING: 'bg-gray-100 text-gray-600',
  PROCESSING: 'bg-emerald-100 text-emerald-800',
  REVIEW: 'bg-amber-100 text-amber-700',
  APPROVED: 'bg-emerald-100 text-emerald-700',
  FAILED: 'bg-red-100 text-red-600',
};

export default function DashboardPage() {
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [recentDocs, setRecentDocs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.org.usage(), api.documents.list({ limit: '8' })])
      .then(([u, d]) => { setUsage(u); setRecentDocs(d.documents); })
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    { label: 'Total Processed', value: usage?.used ?? 0, icon: FileText, bg: 'bg-emerald-50', iconCls: 'text-emerald-800' },
    { label: 'Pending Review', value: usage?.byStatus?.REVIEW ?? 0, icon: Clock, bg: 'bg-amber-50', iconCls: 'text-amber-600' },
    { label: 'Approved', value: usage?.byStatus?.APPROVED ?? 0, icon: CheckCircle, bg: 'bg-emerald-50', iconCls: 'text-emerald-600' },
    { label: 'Failed', value: usage?.byStatus?.FAILED ?? 0, icon: AlertCircle, bg: 'bg-red-50', iconCls: 'text-red-600' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const pct = Math.min(usage?.percentUsed || 0, 100);

  return (
    <div className="space-y-6">

      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-600 mt-0.5">Document processing overview</p>
        </div>
        <Link
          href="/upload"
          className="app-btn-primary"
        >
          <Upload className="w-4 h-4" />
          Upload documents
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="app-card p-5">
            <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center mb-3`}>
              <s.icon className={`w-5 h-5 ${s.iconCls}`} />
            </div>
            <p className="text-3xl font-bold text-slate-900">{s.value}</p>
            <p className="text-xs font-medium text-slate-600 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid lg:grid-cols-3 gap-5">

        {/* Recent Documents */}
        <div className="lg:col-span-2 app-card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Recent Documents</h2>
              <p className="text-xs text-slate-500 mt-0.5">Latest uploads</p>
            </div>
            <Link href="/documents" className="text-xs font-semibold app-link">
              View all →
            </Link>
          </div>

          {recentDocs.length === 0 ? (
            <div className="py-14 text-center">
              <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                <FileText className="w-6 h-6 text-gray-300" />
              </div>
              <p className="text-sm font-semibold text-gray-500">No documents yet</p>
              <Link href="/upload" className="text-sm app-link hover:underline mt-1 block">
                Upload your first document
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Document</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Type</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Status</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentDocs.map((doc, i) => (
                    <tr key={doc.id} className={`border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer ${i === recentDocs.length - 1 ? 'border-b-0' : ''}`}
                      onClick={() => window.location.href = `/documents/${doc.id}`}>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 bg-emerald-50 rounded-lg flex items-center justify-center shrink-0">
                            <FileText className="w-3.5 h-3.5 text-emerald-700" />
                          </div>
                          <span className="font-medium text-gray-800 truncate max-w-[160px]">{doc.originalFilename}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-gray-500 text-xs">{doc.template?.name || '—'}</td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full ${STATUS_CLS[doc.status] || 'bg-gray-100 text-gray-600'}`}>
                          {doc.status.toLowerCase()}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-gray-400 text-xs">
                        {new Date(doc.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quota card */}
        <div className="app-card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Plan Usage</h2>
              <p className="text-xs text-slate-500 mt-0.5 capitalize">{usage?.plan?.toLowerCase()} plan</p>
            </div>
            <TrendingUp className="w-4 h-4 text-gray-300" />
          </div>

          <div className="p-5">
            {/* Circle */}
            <div className="relative w-28 h-28 mx-auto mb-5">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#f1f5f9" strokeWidth="10" />
                <circle
                  cx="50" cy="50" r="40" fill="none"
                  stroke={pct > 80 ? '#ef4444' : '#065f46'}
                  strokeWidth="10" strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - pct / 100)}`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-xl font-bold text-slate-900">{Math.round(pct)}%</p>
                <p className="text-[10px] text-gray-400">used</p>
              </div>
            </div>

            <div className="space-y-2.5">
              {[
                { label: 'Documents used', value: usage?.used, cls: 'text-gray-900' },
                { label: 'Monthly quota', value: usage?.quota, cls: 'text-gray-900' },
                { label: 'Remaining', value: usage?.remaining, cls: 'text-emerald-600' },
              ].map(row => (
                <div key={row.label} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                  <p className="text-xs text-gray-500">{row.label}</p>
                  <p className={`text-sm font-bold ${row.cls}`}>{row.value}</p>
                </div>
              ))}
            </div>

            <Link
              href="/settings"
              className="mt-4 w-full app-btn-secondary"
            >
              Manage plan
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
