'use client';
import { useState } from 'react';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { FileText, Loader2 } from 'lucide-react';
import Link from 'next/link';

function RegisterForm() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ orgName: '', name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form.orgName, form.name, form.email, form.password);
      router.replace('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { key: 'orgName', label: 'Organization name', placeholder: 'Acme Corp', type: 'text' },
    { key: 'name', label: 'Your full name', placeholder: 'Jane Smith', type: 'text' },
    { key: 'email', label: 'Work email', placeholder: 'jane@acme.com', type: 'email' },
    { key: 'password', label: 'Password', placeholder: 'Minimum 8 characters', type: 'password' },
  ];

  return (
    <div className="min-h-screen app-shell-bg flex items-center justify-center p-6">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-7 justify-center">
          <div className="w-9 h-9 bg-emerald-800 rounded-xl flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-white text-lg">FormIQ</span>
        </div>

        <div className="app-card p-8">
          <h1 className="text-xl font-bold text-slate-900 mb-1">Create your account</h1>
          <p className="text-sm text-slate-600 mb-6">Free plan · 50 documents/month · No credit card</p>

          <form onSubmit={submit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-3 py-2.5">
                {error}
              </div>
            )}

            {fields.map(({ key, label, placeholder, type }) => (
              <div key={key}>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                  {label}
                </label>
                <input
                  type={type}
                  value={(form as any)[key]}
                  onChange={set(key)}
                  required
                  placeholder={placeholder}
                  minLength={key === 'password' ? 8 : undefined}
                  className="app-input"
                />
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="w-full app-btn-primary mt-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Creating account…' : 'Create free account'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-600 mt-5">
            Already have an account?{' '}
            <Link href="/login" className="app-link font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return <AuthProvider><RegisterForm /></AuthProvider>;
}
