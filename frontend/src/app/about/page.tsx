import Link from 'next/link';

export const metadata = {
  title: 'About — FormIQ',
  description: 'About FormIQ.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-slate-950">
      <div className="mx-auto max-w-3xl px-6 py-14">
        <Link href="/" className="text-sm text-emerald-800 hover:text-slate-950">← Back to home</Link>
        <h1 className="mt-4 text-3xl font-semibold">About FormIQ</h1>
        <p className="mt-3 text-slate-600 leading-relaxed">
          FormIQ helps organizations across East Africa convert paper-based records into structured, searchable data — fast.
        </p>
        <p className="mt-4 text-slate-600 leading-relaxed">
          We built FormIQ for real operational constraints: handwritten forms, inconsistent templates, low-quality scans, and the need to export data
          into existing systems via CSV/XLSX/JSON, APIs, and webhooks.
        </p>
      </div>
    </div>
  );
}

