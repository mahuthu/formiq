import Link from 'next/link';

export const metadata = {
  title: 'Contact — FormIQ',
  description: 'Contact FormIQ for a demo, enterprise pricing, or support.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white text-slate-950">
      <div className="mx-auto max-w-3xl px-6 py-14">
        <div className="mb-8">
          <Link href="/" className="text-sm text-emerald-800 hover:text-slate-950">← Back to home</Link>
          <h1 className="mt-4 text-3xl font-semibold">Contact</h1>
          <p className="mt-2 text-sm text-slate-600">
            Tell us what you’re trying to digitize and we’ll help you set up the right workflow.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-base font-semibold">Email</h2>
            <p className="mt-2 text-sm text-slate-600">
              For demos, enterprise deployments, or billing questions:
            </p>
            <a
              className="mt-3 inline-flex items-center text-sm font-semibold text-emerald-800 hover:text-slate-950"
              href="mailto:hello@formiq.ke"
            >
              hello@formiq.ke
            </a>

            <div className="mt-6 rounded-xl bg-slate-50 border border-slate-200 p-4">
              <p className="text-xs font-medium text-slate-700">What to include</p>
              <ul className="mt-2 space-y-1 text-xs text-slate-600 list-disc pl-4">
                <li>Document types (e.g., lab results, KYC, invoices)</li>
                <li>Estimated volume per month</li>
                <li>Integration needs (CSV, API, webhook)</li>
                <li>Deployment preference (cloud vs on‑prem)</li>
              </ul>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-base font-semibold">Quick message</h2>
            <p className="mt-2 text-sm text-slate-600">
              This form opens your email client with a prefilled message.
            </p>

            <form
              className="mt-4 space-y-3"
              action="mailto:hello@formiq.ke"
              method="post"
              encType="text/plain"
            >
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">Name</label>
                <input name="name" className="app-input" placeholder="Your name" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">Organization</label>
                <input name="organization" className="app-input" placeholder="Your organization" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">Message</label>
                <textarea
                  name="message"
                  className="w-full text-sm border border-slate-300 rounded-lg px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-colors min-h-32"
                  placeholder="What document types are you processing? Any required fields? Any integrations?"
                />
              </div>

              <button type="submit" className="w-full app-btn-primary">
                Send message
              </button>
              <p className="text-xs text-slate-500">
                If your email app doesn’t open, email us directly at <a className="app-link font-semibold" href="mailto:hello@formiq.ke">hello@formiq.ke</a>.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

