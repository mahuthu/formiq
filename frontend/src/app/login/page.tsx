'use client';
import { useState } from 'react';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { FileText, Loader2, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      router.replace('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen app-shell-bg flex">

      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-96 shrink-0 bg-slate-900 p-10">
        <div>
          <div className="flex items-center gap-3 mb-10">
            <div className="w-9 h-9 bg-emerald-800 rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-lg">FormIQ</span>
          </div>
          <h2 className="text-white text-2xl font-bold leading-snug mb-3">
            Intelligent document<br />digitization platform
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Transform printed and handwritten forms into clean, structured data — powered by AI.
          </p>
        </div>

        <div className="space-y-4">
          {[
            'AI-powered field extraction',
            'Supports PDFs, scans & photos',
            'Webhook & REST API included',
            'Free tier — no credit card needed',
          ].map(f => (
            <div key={f} className="flex items-center gap-3">
              <div className="w-4 h-4 bg-emerald-800 rounded-full flex items-center justify-center shrink-0">
                <div className="w-1.5 h-1.5 bg-white rounded-full" />
              </div>
              <p className="text-slate-300 text-sm">{f}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">

          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2.5 mb-8 justify-center">
            <div className="w-8 h-8 bg-emerald-800 rounded-xl flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white text-lg">FormIQ</span>
          </div>

          <div className="app-card p-8">
            <h1 className="text-xl font-bold text-slate-900 mb-1">Welcome back</h1>
            <p className="text-sm text-slate-600 mb-6">Sign in to your workspace</p>

            <form onSubmit={submit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-3 py-2.5">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="you@company.com"
                  className="app-input"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className="app-input pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(s => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full app-btn-primary"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? 'Signing in…' : 'Sign in'}
              </button>
            </form>

            <p className="text-center text-sm text-slate-600 mt-5">
              No account?{' '}
              <Link href="/register" className="app-link font-semibold">
                Create one free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return <AuthProvider><LoginForm /></AuthProvider>;
}
