'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { CheckCircle, Loader2, ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const confidenceColor: Record<string, string> = {
  high: 'bg-green-100 text-green-700',
  medium: 'bg-amber-100 text-amber-700',
  low: 'bg-gray-100 text-gray-500',
};

export default function DocumentReviewPage({ params }: { params: { id: string } }) {
  const [doc, setDoc] = useState<any>(null);
  const [fields, setFields] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);
  const [approving, setApproving] = useState(false);
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  useEffect(() => {
    api.documents.get(params.id).then(d => {
      setDoc(d);
      if (d.record?.data) setFields(d.record.data);
    });
  }, [params.id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.documents.updateFields(params.id, fields);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  const handleApprove = async () => {
    setApproving(true);
    try {
      await api.documents.updateFields(params.id, fields);
      await api.documents.approve(params.id);
      router.push('/documents');
    } finally {
      setApproving(false);
    }
  };

  if (!doc) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
    </div>
  );

  const extractionFields = doc.extraction?.fields as Record<string, { value: any; confidence: string }> || {};
  const templateFields = (doc.template?.fields || []) as any[];

  const statusBar: Record<string, string> = {
    PENDING: 'bg-gray-100 text-gray-600',
    PROCESSING: 'bg-emerald-100 text-emerald-800',
    REVIEW: 'bg-amber-100 text-amber-700',
    APPROVED: 'bg-green-100 text-green-700',
    FAILED: 'bg-red-100 text-red-700',
  };

  const highCount = Object.values(extractionFields).filter(f => f.confidence === 'high').length;
  const total = Object.keys(extractionFields).length;
  const confidence = total ? Math.round((highCount / total) * 100) : 0;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/documents" className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <ArrowLeft className="w-4 h-4 text-slate-500" />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-semibold text-slate-900 truncate">{doc.originalFilename}</h1>
          <div className="flex items-center gap-2 mt-0.5">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusBar[doc.status]}`}>
              {doc.status.toLowerCase()}
            </span>
            <span className="text-xs text-slate-500">{doc.template?.name}</span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-slate-500">{confidence}% confidence</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={handleSave} disabled={saving}
            className="app-btn-secondary px-3 py-2 text-sm font-medium disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : saved ? <CheckCircle className="w-3.5 h-3.5 text-green-500" /> : <Save className="w-3.5 h-3.5" />}
            {saved ? 'Saved' : 'Save'}
          </button>
          <button onClick={handleApprove} disabled={approving || doc.status === 'APPROVED'}
            className="app-btn-primary px-4 py-2 text-sm disabled:opacity-50"
          >
            {approving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
            Approve
          </button>
        </div>
      </div>

      {/* Side-by-side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Document preview */}
        <div className="app-card overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100">
            <p className="text-sm font-medium text-slate-700">Original document</p>
          </div>
          <div className="p-4 flex items-center justify-center min-h-64 bg-slate-50">
            {doc.signedUrl && doc.mimeType?.startsWith('image/') ? (
              <img src={doc.signedUrl} alt="Document" className="max-w-full max-h-[600px] object-contain rounded shadow-sm" />
            ) : doc.signedUrl ? (
              <div className="text-center">
                <p className="text-sm text-slate-600 mb-2">PDF document</p>
                <a href={doc.signedUrl} target="_blank" rel="noopener noreferrer"
                  className="text-sm app-link hover:underline">Open PDF</a>
              </div>
            ) : (
              <p className="text-sm text-gray-400">Preview not available</p>
            )}
          </div>
        </div>

        {/* Extracted fields */}
        <div className="app-card">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
            <p className="text-sm font-medium text-slate-700">Extracted data</p>
            <div className="flex items-center gap-2">
              <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${confidence}%` }} />
              </div>
              <span className="text-xs text-slate-500">{confidence}%</span>
            </div>
          </div>
          <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
            {templateFields.map((field: any) => {
              const extracted = extractionFields[field.name];
              const currentVal = fields[field.name] ?? extracted?.value ?? '';
              return (
                <div key={field.name} className="px-4 py-3">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs text-slate-600 font-medium">{field.name}</label>
                    {extracted?.confidence && (
                      <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${confidenceColor[extracted.confidence]}`}>
                        {extracted.confidence}
                      </span>
                    )}
                  </div>
                  {field.type === 'BOOLEAN' ? (
                    <select
                      value={String(currentVal)}
                      onChange={e => setFields(prev => ({ ...prev, [field.name]: e.target.value === 'true' }))}
                      className="app-input px-3 py-2"
                    >
                      <option value="">—</option>
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  ) : (
                    <input
                      type={field.type === 'DATE' ? 'date' : field.type === 'NUMBER' ? 'number' : 'text'}
                      value={currentVal || ''}
                      onChange={e => setFields(prev => ({ ...prev, [field.name]: e.target.value }))}
                      placeholder={extracted?.value === null ? 'Not found' : ''}
                      className={`app-input px-3 py-2 ${
                        !currentVal && !extracted?.value ? 'border-gray-100 bg-gray-50 text-gray-400' : 'border-gray-200'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
