'use client';
import { ReactNode } from 'react';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard, FileText, Upload, Settings,
  LogOut, ChevronRight, Database, BookOpen,
} from 'lucide-react';

const NAV = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/upload', label: 'Upload', icon: Upload },
  { href: '/documents', label: 'Documents', icon: FileText },
  { href: '/templates', label: 'Templates', icon: BookOpen },
  { href: '/records', label: 'Records', icon: Database },
  { href: '/settings', label: 'Settings', icon: Settings },
];

function Guard({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace('/login');
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen app-shell-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-300">Loading…</p>
        </div>
      </div>
    );
  }
  return <>{children}</>;
}

function Sidebar() {
  const { user, org, logout } = useAuth();
  const path = usePathname();
  const used = org?.documentsUsed || 0;
  const quota = org?.documentQuota || 1;
  const pct = Math.min(Math.round((used / quota) * 100), 100);

  return (
    <div className="w-60 bg-slate-900 flex flex-col h-screen sticky top-0 shrink-0">

      {/* Brand */}
      <div className="px-5 py-5 border-b border-slate-700/60">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-emerald-800 rounded-lg flex items-center justify-center shrink-0">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">FormIQ</p>
            <p className="text-slate-400 text-[10px]">Document Intelligence</p>
          </div>
        </div>
      </div>

      {/* Org */}
      <div className="mx-3 mt-3 px-3 py-2 rounded-lg bg-slate-800 border border-slate-700/40">
        <p className="text-slate-500 text-[10px] uppercase tracking-wider font-semibold">Workspace</p>
        <p className="text-white text-xs font-semibold mt-0.5 truncate">{org?.name || '—'}</p>
        <p className="text-emerald-300 text-[10px] capitalize mt-0.5">{org?.plan?.toLowerCase()} plan</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = path === href || (href !== '/dashboard' && path.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${active
                  ? 'bg-emerald-800 text-white'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="flex-1">{label}</span>
              {active && <ChevronRight className="w-3.5 h-3.5 opacity-60" />}
            </Link>
          );
        })}
      </nav>

      {/* Quota */}
      <div className="mx-3 mb-3 px-3 py-3 rounded-lg bg-slate-800 border border-slate-700/40">
        <div className="flex justify-between mb-1.5">
          <p className="text-slate-400 text-[11px] font-medium">Monthly quota</p>
          <p className="text-white text-[11px] font-bold">{pct}%</p>
        </div>
        <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${pct > 80 ? 'bg-red-500' : 'bg-emerald-500'}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="text-slate-500 text-[10px] mt-1.5">{used} / {quota} documents</p>
      </div>

      {/* User */}
      <div className="border-t border-slate-700/60 px-3 py-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-emerald-800 rounded-full flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-bold">{user?.name?.charAt(0).toUpperCase()}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-semibold truncate">{user?.name}</p>
            <p className="text-slate-500 text-[10px] capitalize">{user?.role?.toLowerCase()}</p>
          </div>
          <button
            onClick={logout}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Sign out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <Guard>
        <div className="flex min-h-screen app-shell-bg text-slate-50">
          <Sidebar />
          <main className="flex-1 overflow-auto app-scrollbar">
            <div className="max-w-6xl mx-auto px-6 lg:px-10 py-8 space-y-6">
              {children}
            </div>
          </main>
        </div>
      </Guard>
    </AuthProvider>
  );
}
