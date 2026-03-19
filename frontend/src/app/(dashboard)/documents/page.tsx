'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { FileText, Search, Upload, ChevronLeft, ChevronRight, Download, SlidersHorizontal } from 'lucide-react';
import Link from 'next/link';

const STATUS_OPTIONS = ['PENDING', 'PROCESSING', 'REVIEW', 'APPROVED', 'FAILED'];

const STATUS_CLS: Record<string, string> = {
  PENDING: 'bg-gray-100 text-gray-600',
  PROCESSING: 'bg-emerald-100 text-emerald-800',
  REVIEW: 'bg-amber-100 text-amber-700',
  APPROVED: 'bg-emerald-100 text-emerald-700',
  FAILED: 'bg-red-100 text-red-600',
};

export default function DocumentsPage() {
  const [docs, setDocs] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [templates, setTemplates] = useState<any[]>([]);
  const [templateFilter, setTemplateFilter] = useState('');

  const load = (pg = page) => {
    setLoading(true);
    const params: Record<string, string> = { page: String(pg), limit: '15' };
    if (search) params.search = search;
    if (status) params.status = status;
    if (templateFilter) params.templateId = templateFilter;
    api.documents.list(params)
      .then(d => { setDocs(d.documents); setTotal(d.total); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { api.templates.list().then(setTemplates); }, []);
  useEffect(() => { load(); }, [page, status, templateFilter]);
  useEffect(() => {
    const t = setTimeout(() => { setPage(1); load(1); }, 400);
    return () => clearTimeout(t);
  }, [search]);

  const pages = Math.max(1, Math.ceil(total / 15));

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Documents</h1>
          <p className="text-sm text-slate-600 mt-0.5">{total.toLocaleString()} total documents</p>
        </div>
        <Link
          href="/upload"
          className="app-btn-primary"
        >
          <Upload className="w-4 h-4" />
          Upload
        </Link>
      </div>

      {/* Filter bar */}
      <div className="app-card p-4 flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-48">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search filename…"
            className="app-input pl-9 pr-3"
          />
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-gray-400 shrink-0" />
          <select
            value={status}
            onChange={e => { setStatus(e.target.value); setPage(1); }}
            className="app-input w-auto px-3"
          >
            <option value="">All statuses</option>
            {STATUS_OPTIONS.map(s => (
              <option key={s} value={s}>{s.charAt(0) + s.slice(1).toLowerCase()}</option>
            ))}
          </select>
        </div>

        {/* Type filter */}
        <select
          value={templateFilter}
          onChange={e => { setTemplateFilter(e.target.value); setPage(1); }}
          className="app-input w-auto px-3"
        >
          <option value="">All types</option>
          {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>

        {/* Export */}
        <a
          href={api.records.exportUrl({ format: 'csv' })}
          className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 text-sm font-medium px-3 py-2.5 rounded-lg transition-colors"
        >
          <Download className="w-4 h-4" />
          Export CSV/XLSX/JSON
        </a>
      </div>

      {/* Table */}
      <div className="app-card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : docs.length === 0 ? (
          <div className="py-20 text-center">
            <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mx-auto mb-3">
              <FileText className="w-6 h-6 text-gray-300" />
            </div>
            <p className="text-sm font-semibold text-gray-500">No documents found</p>
            <p className="text-xs text-gray-400 mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Document</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Type</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Status</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Uploaded by</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Date</th>
                </tr>
              </thead>
              <tbody>
                {docs.map((doc, i) => (
                  <tr
                    key={doc.id}
                    className={`hover:bg-gray-50 transition-colors cursor-pointer ${i < docs.length - 1 ? 'border-b border-gray-50' : ''}`}
                  >
                    <td className="px-5 py-3.5">
                      <Link href={`/documents/${doc.id}`} className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4 text-emerald-700" />
                        </div>
                        <span className="font-semibold text-slate-800 hover:text-emerald-800 transition-colors truncate max-w-[200px]">
                          {doc.originalFilename}
                        </span>
                      </Link>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500 text-xs font-medium">{doc.template?.name || '—'}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full ${STATUS_CLS[doc.status] || 'bg-gray-100 text-gray-600'}`}>
                        {doc.status.toLowerCase()}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500 text-xs">{doc.uploader?.name || '—'}</td>
                    <td className="px-5 py-3.5 text-gray-400 text-xs">
                      {new Date(doc.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {pages > 1 && (
              <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-gray-50">
                <p className="text-xs text-gray-500">
                  Page <span className="font-semibold text-gray-700">{page}</span> of{' '}
                  <span className="font-semibold text-gray-700">{pages}</span>
                  {' '}· {total} total
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="flex items-center gap-1 text-xs font-medium border border-gray-200 bg-white hover:bg-gray-100 px-3 py-1.5 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" /> Prev
                  </button>
                  <button
                    onClick={() => setPage(p => Math.min(pages, p + 1))}
                    disabled={page === pages}
                    className="flex items-center gap-1 text-xs font-medium border border-gray-200 bg-white hover:bg-gray-100 px-3 py-1.5 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Next <ChevronRight className="w-3.5 h-3.5" />
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
