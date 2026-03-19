'use client';
import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { api } from '@/lib/api';
import { CloudUpload, FileText, X, CheckCircle, AlertCircle, Loader2, Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface FileItem {
  file: File;
  status: 'queued' | 'uploading' | 'done' | 'error';
  error?: string;
}

export default function UploadPage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    api.templates.list().then(t => {
      setTemplates(t);
      if (t.length) setSelectedTemplate(t[0].id);
    });
  }, []);

  const onDrop = useCallback((accepted: File[]) => {
    const items: FileItem[] = accepted.slice(0, 20).map(f => ({ file: f, status: 'queued' }));
    setFiles(prev => [...prev, ...items].slice(0, 20));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [], 'application/pdf': [] },
    maxFiles: 20,
  });

  const removeFile = (i: number) => setFiles(prev => prev.filter((_, idx) => idx !== i));

  const handleUpload = async () => {
    if (!selectedTemplate || !files.length) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('templateId', selectedTemplate);
    files.forEach(f => formData.append('files', f.file));
    try {
      setFiles(prev => prev.map(f => ({ ...f, status: 'uploading' })));
      await api.documents.upload(formData);
      setFiles(prev => prev.map(f => ({ ...f, status: 'done' })));
      setTimeout(() => router.push('/documents'), 1500);
    } catch (err: any) {
      setFiles(prev => prev.map(f => ({ ...f, status: 'error', error: err.message })));
    } finally {
      setUploading(false);
    }
  };

  const allDone = files.length > 0 && files.every(f => f.status === 'done');

  return (
    <div className="max-w-2xl mx-auto space-y-5">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Upload Documents</h1>
        <p className="text-sm text-slate-600 mt-0.5">Upload printed or handwritten documents for AI data extraction</p>
      </div>

      {/* Template selector */}
      <div className="app-card p-5">
        <h2 className="text-sm font-bold text-slate-900 mb-3">Select Document Type</h2>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Template</label>
        <select
          value={selectedTemplate}
          onChange={e => setSelectedTemplate(e.target.value)}
          className="app-input bg-white"
        >
          {templates.map(t => (
            <option key={t.id} value={t.id}>{t.name}{t.isSystem ? ' (System)' : ''}</option>
          ))}
        </select>
        {selectedTemplate && (
          <p className="text-xs text-slate-500 mt-2">
            {templates.find(t => t.id === selectedTemplate)?.description}
          </p>
        )}
      </div>

      {/* Drop zone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${isDragActive
            ? 'border-emerald-600 bg-emerald-50'
            : 'border-slate-300 bg-white hover:border-emerald-500 hover:bg-emerald-50/40'
          }`}
      >
        <input {...getInputProps()} />
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors ${isDragActive ? 'bg-emerald-100' : 'bg-slate-100'
          }`}>
          <CloudUpload className={`w-7 h-7 transition-colors ${isDragActive ? 'text-emerald-700' : 'text-slate-400'}`} />
        </div>
        <p className="text-sm font-semibold text-slate-700 mb-1">
          {isDragActive ? 'Drop your files here' : 'Drag & drop files, or click to browse'}
        </p>
        <p className="text-xs text-slate-500">PDF, JPG, PNG · Max 20 files · 20 MB each</p>
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div className="app-card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
            <p className="text-sm font-bold text-slate-900">
              {files.length} file{files.length > 1 ? 's' : ''} selected
            </p>
            {!uploading && (
              <button
                onClick={() => setFiles([])}
                className="text-xs font-medium text-red-500 hover:text-red-700 transition-colors"
              >
                Clear all
              </button>
            )}
          </div>

          <div className="divide-y divide-slate-100">
            {files.map((f, i) => (
              <div key={i} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition-colors">
                <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4 text-slate-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{f.file.name}</p>
                  <p className="text-xs text-slate-500">{(f.file.size / 1024).toFixed(0)} KB</p>
                </div>
                <div className="shrink-0">
                  {f.status === 'queued' && (
                    <button
                      onClick={() => removeFile(i)}
                      className="p-1.5 hover:bg-red-50 rounded-lg transition-colors text-slate-400 hover:text-red-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  {f.status === 'uploading' && <Loader2 className="w-5 h-5 text-emerald-700 animate-spin" />}
                  {f.status === 'done' && <CheckCircle className="w-5 h-5 text-emerald-500" />}
                  {f.status === 'error' && (
                    <span title={f.error}>
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload button */}
      {files.length > 0 && !allDone && (
        <button
          onClick={handleUpload}
          disabled={uploading || !selectedTemplate}
          className="w-full app-btn-primary py-3 rounded-xl disabled:opacity-50"
        >
          {uploading
            ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing documents…</>
            : <><Upload className="w-4 h-4" /> Extract data from {files.length} document{files.length > 1 ? 's' : ''}</>
          }
        </button>
      )}

      {/* Success */}
      {allDone && (
        <div className="app-card border-emerald-200 p-6 text-center">
          <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-900">Upload complete!</p>
          <p className="text-xs text-slate-500 mt-1">Redirecting to documents…</p>
        </div>
      )}
    </div>
  );
}
