import Link from 'next/link';
import { Playfair_Display, DM_Sans } from 'next/font/google';

const serif = Playfair_Display({ subsets: ['latin'], weight: ['400', '500', '600'] });
const sans = DM_Sans({ subsets: ['latin'], weight: ['300', '400', '500'] });

export const metadata = {
  title: 'Data Processing Agreement — FormIQ',
  description: 'Data Processing Agreement (DPA) information for FormIQ customers.',
};

export default function DpaPage() {
  return (
    <div className={`${sans.className} min-h-screen bg-white text-slate-950`}>
      <div className="mx-auto max-w-3xl px-6 py-14">
        <div className="mb-12">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-emerald-800 transition-colors">
            ← Back to home
          </Link>
          <h1 className={`mt-6 text-4xl font-semibold tracking-tight text-slate-950 ${serif.className}`}>Data Processing Agreement</h1>
          <p className="mt-3 text-sm text-slate-500">Commitments to data privacy and protection</p>
        </div>

        <div className={`prose prose-slate prose-lg max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-slate-950 prose-a:text-emerald-800 prose-strong:text-slate-950 ${sans.className}`}>
          <p className={`lead text-xl text-slate-600 font-light ${serif.className}`}>
            This Data Processing Agreement (“DPA”) describes the commitment of FormIQ to its customers regarding the processing of Personal Data in connection with the Services.
          </p>

          <h2 className={`pt-8 border-t border-slate-100 ${serif.className}`}>1. Role of the Parties</h2>
          <p>
            In the context of the Services provided, the Customer acts as the <strong>Data Controller</strong> and FormIQ acts as the <strong>Data Processor</strong>. FormIQ processes Personal Data only upon the documented instructions of the Customer.
          </p>

          <h2 className={`pt-8 border-t border-slate-100 ${serif.className}`}>2. Processing of Personal Data</h2>
          <p>
            FormIQ will process Personal Data only as necessary to provide the Services, and in accordance with the Customer's documented instructions and applicable data protection laws (such as GDPR or Kenya Data Protection Act).
          </p>

          <h2 className={`pt-8 border-t border-slate-100 ${serif.className}`}>3. Confidentiality</h2>
          <p>
            FormIQ ensures that its personnel authorized to process Personal Data have committed themselves to confidentiality or are under an appropriate statutory obligation of confidentiality.
          </p>

          <h2 className={`pt-8 border-t border-slate-100 ${serif.className}`}>4. Security Measures</h2>
          <p>
            FormIQ has implemented appropriate technical and organizational measures to ensure a level of security appropriate to the risk, as described in our <Link href="/security">Security</Link> documentation.
          </p>

          <h2 className={`pt-8 border-t border-slate-100 ${serif.className}`}>5. Sub-processing</h2>
          <p>
            Customer provides a general authorization to FormIQ to engage sub-processors to support the delivery of the Services. We will inform the Customer of any intended changes concerning the addition or replacement of sub-processors.
          </p>

          <h2 className={`pt-8 border-t border-slate-100 ${serif.className}`}>6. Data Subject Rights</h2>
          <p>
            FormIQ will assist the Customer, insofar as this is possible, for the fulfilment of the Customer's obligation to respond to requests for exercising the Data Subject's rights.
          </p>

          <h2 className={`pt-8 border-t border-slate-100 ${serif.className}`}>7. Data Breach Notification</h2>
          <p>
            FormIQ will notify the Customer without undue delay after becoming aware of a Personal Data Breach.
          </p>

          <div className="mt-16 p-8 rounded-2xl bg-amber-50 border border-amber-800/15">
            <h3 className={`text-amber-900 mt-0 ${serif.className}`}>Request a Signed DPA</h3>
            <p className="text-amber-800 text-base mb-0">
              If your organization requires a formally signed copy of our Data Processing Agreement, please email <a href="mailto:legal@formiq.ke" className="font-semibold underline decoration-amber-800/30 hover:decoration-amber-800">legal@formiq.ke</a> with your organization details.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

