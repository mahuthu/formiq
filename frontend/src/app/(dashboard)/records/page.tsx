'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Database, Download, Search, Filter } from 'lucide-react';
import Link from 'next/link';

export default function RecordsPage() {
  const [records, setRecords] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [templates, setTemplates] = useState<any[]>([]);
  const [filters, setFilters] = useState({ templateId: '', from: '', to: '', page: '1' });

  const load = () => {
    setLoading(true);
    const params: Record<string, string> = { page: filters.page, limit: '20' };
    if (filters.templateId) params.templateId = filters.templateId;
    if (filters.from) params.from = filters.from;
    if (filters.to) params.to = filters.to;
    api.records.list(params).then(d => { setRecords(d.records); setTotal(d.total); }).finally(() => setLoading(false));
  };

  useEffect(() => { api.templates.list().then(setTemplates); }, []);
  useEffect(() => { load(); }, [filters]);

  const pages = Math.ceil(total / 20);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Records</h1>
          <p className="text-sm text-slate-600 mt-0.5">{total} approved records</p>
        </div>
        <a href={api.records.exportUrl({ format: 'csv', ...(filters.templateId ? { templateId: filters.templateId } : {}), ...(filters.from ? { from: filters.from } : {}), ...(filters.to ? { to: filters.to } : {}) })}
          className="app-btn-secondary">
          <Download className="w-4 h-4" /> Export CSV
        </a>
      </div>

      {/* Filters */}
      <div className="app-card p-4 flex flex-wrap gap-3">
        <select value={filters.templateId} onChange={e => setFilters(f => ({ ...f, templateId: e.target.value, page: '1' }))}
          className="app-input w-auto px-3 py-2">
          <option value="">All document types</option>
          {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-600">From</label>
          <input type="date" value={filters.from} onChange={e => setFilters(f => ({ ...f, from: e.target.value, page: '1' }))}
            className="app-input w-auto px-3 py-2" />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-600">To</label>
          <input type="date" value={filters.to} onChange={e => setFilters(f => ({ ...f, to: e.target.value, page: '1' }))}
            className="app-input w-auto px-3 py-2" />
        </div>
      </div>

      {/* Records table */}
      <div className="app-card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : records.length === 0 ? (
          <div className="py-12 text-center">
            <Database className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No records yet</p>
            <p className="text-xs text-gray-400 mt-1">Approve documents to build your records database</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Document</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Type</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Key data</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Approved</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {records.map(r => {
                    const data = r.data as Record<string, any>;
                    const keyFields = Object.entries(data).slice(0, 2);
                    return (
                      <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <Link href={`/documents/${r.documentId}`} className="app-link hover:underline text-sm truncate max-w-[160px] block">
                            {r.document?.originalFilename}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-xs">{r.document?.template?.name}</td>
                        <td className="px-4 py-3">
                          <div className="space-y-0.5">
                            {keyFields.map(([k, v]) => v && (
                              <p key={k} className="text-xs text-gray-600">
                                <span className="text-gray-400">{k}:</span> {String(v).slice(0, 40)}
                              </p>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-500">{r.approver?.name || '—'}</td>
                        <td className="px-4 py-3 text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {pages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 bg-slate-50">
                <p className="text-xs text-gray-400">Page {filters.page} of {pages}</p>
                <div className="flex gap-1">
                  <button onClick={() => setFilters(f => ({ ...f, page: String(Math.max(1, parseInt(f.page) - 1)) }))}
                    disabled={filters.page === '1'} className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg disabled:opacity-40 hover:bg-white">
                    Previous
                  </button>
                  <button onClick={() => setFilters(f => ({ ...f, page: String(Math.min(pages, parseInt(f.page) + 1)) }))}
                    disabled={parseInt(filters.page) === pages} className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg disabled:opacity-40 hover:bg-white">
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
