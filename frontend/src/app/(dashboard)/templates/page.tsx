'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Plus, Trash2, BookTemplate, Lock, Pencil, ChevronUp } from 'lucide-react';

const FIELD_TYPES = ['TEXT', 'NUMBER', 'DATE', 'CURRENCY', 'BOOLEAN', 'LIST', 'EMAIL', 'PHONE', 'URL', 'TEXTAREA'];

function TemplateBuilder({ template, onSave, onCancel }: { template?: any; onSave: (t: any) => void; onCancel: () => void }) {
  const [name, setName] = useState(template?.name || '');
  const [docType, setDocType] = useState(template?.documentType || '');
  const [description, setDescription] = useState(template?.description || '');
  const [fields, setFields] = useState<any[]>(template?.fields || [{ name: '', type: 'TEXT', required: false }]);
  const [saving, setSaving] = useState(false);

  const addField = () => setFields(f => [...f, { name: '', type: 'TEXT', required: false }]);
  const removeField = (i: number) => setFields(f => f.filter((_, idx) => idx !== i));
  const updateField = (i: number, key: string, val: any) =>
    setFields(f => f.map((field, idx) => idx === i ? { ...field, [key]: val } : field));

  const handleSave = async () => {
    if (!name || !docType || fields.some(f => !f.name)) return;
    setSaving(true);
    try {
      const validFields = fields.filter(f => f.name.trim());
      const result = template?.id
        ? await api.templates.update(template.id, { name, documentType: docType, description, fields: validFields })
        : await api.templates.create({ name, documentType: docType, description, fields: validFields });
      onSave(result);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="app-card p-6 space-y-5">
      <h2 className="text-sm font-semibold text-slate-900">{template ? 'Edit template' : 'New template'}</h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1.5">Template name</label>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Loan Application"
            className="app-input px-3 py-2" />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1.5">Document type</label>
          <input value={docType} onChange={e => setDocType(e.target.value)} placeholder="e.g. Bank Loan Form"
            className="app-input px-3 py-2" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1.5">Description (optional)</label>
        <input value={description} onChange={e => setDescription(e.target.value)}
          className="app-input px-3 py-2" />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-medium text-slate-700">Fields to extract</label>
          <button onClick={addField} className="text-xs app-link hover:underline flex items-center gap-1">
            <Plus className="w-3 h-3" /> Add field
          </button>
        </div>
        <div className="space-y-2 border-t border-slate-100 pt-3 mt-1">
          {fields.map((field, i) => (
            <div key={i} className="flex gap-3 items-center">
              <div className="flex-[3]">
                <input value={field.name} onChange={e => updateField(i, 'name', e.target.value)}
                  placeholder="Field name (e.g. Invoice Number)"
                  className="app-input px-3 py-1.5" />
              </div>
              <div className="flex-[1.5]">
                <select value={field.type} onChange={e => updateField(i, 'type', e.target.value)}
                  className="app-input px-2 py-1.5 text-xs">
                  {FIELD_TYPES.map(t => <option key={t} value={t}>{t.toLowerCase() === 'textarea' ? 'long text' : t.toLowerCase()}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-slate-400 cursor-pointer hover:text-slate-600 transition-colors">
                  <input type="checkbox" checked={field.required} onChange={e => updateField(i, 'required', e.target.checked)}
                    className="w-3.5 h-3.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                  Req
                </label>
                <button onClick={() => removeField(i)} className="p-1.5 hover:bg-red-50 rounded text-gray-300 hover:text-red-500 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <button onClick={handleSave} disabled={saving}
          className="app-btn-primary px-4 py-2 disabled:opacity-50">
          {saving ? 'Saving...' : 'Save template'}
        </button>
        <button onClick={onCancel} className="app-btn-secondary px-4 py-2 text-sm font-medium">
          Cancel
        </button>
      </div>
    </div>
  );
}

const VISIBLE_FIELDS = 5;

function TemplateFieldsPreview({
  fields,
  templateId,
  expandedId,
  onToggleExpand,
  variant = 'org',
}: {
  fields: any[];
  templateId: string;
  expandedId: string | null;
  onToggleExpand: (id: string) => void;
  variant?: 'org' | 'system';
}) {
  const list = Array.isArray(fields) ? fields : [];
  const isExpanded = expandedId === templateId;
  const visibleFields = isExpanded ? list : list.slice(0, VISIBLE_FIELDS);
  const hasMore = list.length > VISIBLE_FIELDS;
  const moreCount = list.length - VISIBLE_FIELDS;

  const badgeCls = variant === 'system'
    ? 'text-xs bg-slate-50 text-slate-600 px-2 py-0.5 rounded border border-slate-100'
    : 'text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded';

  return (
    <div className="flex flex-wrap gap-1">
      {visibleFields.map((f: any) => (
        <span key={f.name} className={badgeCls}>{f.name}</span>
      ))}
      {hasMore && !isExpanded && (
        <button
          type="button"
          onClick={() => onToggleExpand(templateId)}
          className="text-xs text-emerald-800 hover:text-slate-950 hover:underline px-1 py-0.5 rounded focus:outline-none focus:ring-1 focus:ring-emerald-400"
        >
          +{moreCount} more fields
        </button>
      )}
      {hasMore && isExpanded && (
        <button
          type="button"
          onClick={() => onToggleExpand(templateId)}
          className="text-xs text-gray-500 hover:text-gray-700 inline-flex items-center gap-0.5 px-1 py-0.5 rounded focus:outline-none"
        >
          <ChevronUp className="w-3 h-3" /> Show less
        </button>
      )}
    </div>
  );
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const load = () => api.templates.list().then(setTemplates).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this template?')) return;
    await api.templates.delete(id);
    setTemplates(t => t.filter(x => x.id !== id));
  };

  const systemTemplates = templates.filter(t => t.isSystem);
  const orgTemplates = templates.filter(t => !t.isSystem);

  if (loading) return <div className="flex justify-center pt-12"><div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Templates</h1>
          <p className="text-sm text-slate-600 mt-0.5">Define what fields to extract from each document type</p>
        </div>
        {!creating && !editing && (
          <button onClick={() => setCreating(true)}
            className="app-btn-primary">
            <Plus className="w-4 h-4" /> New template
          </button>
        )}
      </div>

      {creating && (
        <TemplateBuilder
          onSave={(t) => { setTemplates(p => [...p, t]); setCreating(false); }}
          onCancel={() => setCreating(false)}
        />
      )}

      {editing && (
        <TemplateBuilder
          template={editing}
          onSave={(t) => { setTemplates(p => p.map(x => x.id === t.id ? t : x)); setEditing(null); }}
          onCancel={() => setEditing(null)}
        />
      )}

      {/* Org templates */}
      {orgTemplates.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Your templates</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {orgTemplates.map(t => (
              <div key={t.id} className="app-card p-4">
                <div className="flex items-start justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <BookTemplate className="w-4 h-4 text-emerald-800" />
                    <span className="text-sm font-semibold text-slate-900">{t.name}</span>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => setEditing(t)} className="p-1.5 hover:bg-gray-100 rounded transition-colors">
                      <Pencil className="w-3.5 h-3.5 text-gray-400" />
                    </button>
                    <button onClick={() => handleDelete(t.id)} className="p-1.5 hover:bg-red-50 rounded transition-colors">
                      <Trash2 className="w-3.5 h-3.5 text-red-400" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-slate-600 mb-2">{t.documentType}</p>
                <TemplateFieldsPreview
                  fields={t.fields as any[]}
                  templateId={t.id}
                  expandedId={expandedId}
                  onToggleExpand={(id) => setExpandedId((prev) => (prev === id ? null : id))}
                  variant="org"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* System templates */}
      <div>
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">System templates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {systemTemplates.map(t => (
            <div key={t.id} className="bg-white rounded-xl border border-gray-200 p-4 opacity-90">
              <div className="flex items-start justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <BookTemplate className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-semibold text-gray-800">{t.name}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Lock className="w-3 h-3" /> System
                </div>
              </div>
              <p className="text-xs text-gray-500 mb-2">{t.description}</p>
              <TemplateFieldsPreview
                fields={t.fields as any[]}
                templateId={t.id}
                expandedId={expandedId}
                onToggleExpand={(id) => setExpandedId((prev) => (prev === id ? null : id))}
                variant="system"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
