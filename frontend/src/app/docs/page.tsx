import Link from 'next/link';
import { Playfair_Display, DM_Sans, DM_Mono } from 'next/font/google';

const serif = Playfair_Display({ subsets: ['latin'], weight: ['400', '500', '600'] });
const sans = DM_Sans({ subsets: ['latin'], weight: ['300', '400', '500'] });
const mono = DM_Mono({ subsets: ['latin'], weight: ['400'] });

export const metadata = {
  title: 'API Reference — FormIQ',
  description: 'Detailed API documentation for FormIQ integrations.',
};

export default function DocsPage() {
  return (
    <div className={`${sans.className} min-h-screen bg-white text-slate-950`}>
      <div className="mx-auto max-w-4xl px-6 py-14">
        <div className="mb-12">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-emerald-800 transition-colors">
            ← Back to home
          </Link>
          <h1 className={`mt-6 text-4xl font-semibold tracking-tight text-slate-950 ${serif.className}`}>API Reference</h1>
          <p className="mt-3 text-sm text-slate-500">Integrate FormIQ document intelligence into your own applications.</p>
        </div>

        <div className={`prose prose-slate prose-lg max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-slate-950 prose-a:text-emerald-800 prose-strong:text-slate-950 ${sans.className}`}>
          <p className={`lead text-xl text-slate-600 font-light ${serif.className}`}>
            The FormIQ API is organized around REST. Our API has predictable resource-oriented URLs, accepts form-data and JSON bodies, and returns JSON-encoded responses.
          </p>

          <h2 className={`pt-8 border-t border-slate-100 ${serif.className}`}>Authentication</h2>
          <p>
            Authenticate your requests by including your secret API key in the <code>Authorization</code> header. You can manage your API keys in the <strong>Settings</strong> section of your dashboard.
          </p>
          <div className="not-prose mt-4">
            <div className="rounded-xl bg-slate-950 p-4 overflow-x-auto">
              <code className={`${mono.className} text-sm text-emerald-400`}>
                Authorization: Bearer YOUR_API_KEY
              </code>
            </div>
          </div>

          <h2 className={`pt-8 border-t border-slate-100 ${serif.className}`}>1. Documents</h2>
          <p>The Documents API allows you to upload files for processing and retrieve extraction results.</p>

          <h3 className={serif.className}>Upload a Document</h3>
          <p className="text-sm font-mono text-emerald-800 bg-emerald-50 px-2 py-1 rounded inline-block">POST /api/documents</p>
          <p>Upload a file (PDF, JPG, PNG) along with a template ID to start the extraction process.</p>

          <div className="not-prose mt-4">
            <div className="rounded-xl bg-slate-950 p-6 overflow-x-auto">
              <pre className={`${mono.className} text-xs leading-relaxed text-slate-300`}>
                {`curl -X POST https://api.formiq.ke/api/documents \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -F "file=@/path/to/invoice.pdf" \\
  -F "templateId=tmpl_12345"`}
              </pre>
            </div>
          </div>

          <h3 className={`mt-10 ${serif.className}`}>Retrieve a Document</h3>
          <p className="text-sm font-mono text-emerald-800 bg-emerald-50 px-2 py-1 rounded inline-block">GET /api/documents/:id</p>
          <p>Check the status and retrieve the extracted fields of a specific document.</p>

          <h2 className={`pt-8 border-t border-slate-100 ${serif.className}`}>2. Records</h2>
          <p>Records are the finalized, approved data extractions. You can query your records to sync them with your database.</p>

          <h3 className={serif.className}>List Records</h3>
          <p className="text-sm font-mono text-indigo-800 bg-indigo-50 px-2 py-1 rounded inline-block">GET /api/records</p>
          <p>Retrieve a paginated list of all approved records for your organization.</p>

          <h2 className={`pt-8 border-t border-slate-100 ${serif.className}`}>3. Templates</h2>
          <p>Templates define the schema of the fields you want to extract (e.g., Patient Name, Total Amount).</p>

          <h3 className={serif.className}>List Templates</h3>
          <p className="text-sm font-mono text-amber-800 bg-amber-50 px-2 py-1 rounded inline-block">GET /api/templates</p>
          <p>Retrieve all templates available to your organization, including system templates and custom ones.</p>

          <h2 className={`pt-8 border-t border-slate-100 ${serif.className}`}>4. Webhooks</h2>
          <p>Webhooks allow you to receive real-time notifications when a document has finished processing or has been approved.</p>

          <h3 className={serif.className}>Create a Webhook</h3>
          <p className="text-sm font-mono text-slate-800 bg-slate-100 px-2 py-1 rounded inline-block">POST /api/webhooks</p>
          <p>Register a URL to receive <code>POST</code> requests when document events occur.</p>

          <div className="mt-16 p-8 rounded-2xl bg-slate-50 border border-slate-200">
            <h3 className={`mt-0 ${serif.className}`}>Need more help?</h3>
            <p className="text-slate-600 text-base mb-4">
              Our engineering team is happy to help you with your integration. Reach out for a dedicated Slack channel or technical deep-dive.
            </p>
            <Link href="/contact" className="inline-flex items-center gap-2 text-emerald-800 font-semibold hover:gap-3 transition-all">
              Contact Developer Support →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

