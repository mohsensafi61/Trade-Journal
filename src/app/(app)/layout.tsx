'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  ClipboardCheck,
  Settings,
  Ban,
  BookOpen,
  BarChart3,
  LogOut,
  Menu,
  X,
  User,
  Download,
  Upload,
  Settings2,
} from 'lucide-react';
import { Toaster } from 'sonner';
import { NAV_LINKS } from '@/lib/constants';
import type { User as SupaUser } from '@supabase/supabase-js';

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<SupaUser | null>(null);
  const [supabaseReady, setSupabaseReady] = useState(false);
  const [supabase, setSupabase] = useState<ReturnType<typeof createClient> | null>(null);

  useEffect(() => {
    const client = createClient();
    setSupabase(client);
    client.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setSupabaseReady(true);
    });
  }, []);

  useEffect(() => {
    if (!supabase) return;
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => setUser(session?.user ?? null)
    );
    return () => subscription.unsubscribe();
  }, [supabase]);

  async function handleSignOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
    window.location.href = '/login';
  }

  if (!supabaseReady) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="size-8 border-2 border-[rgb(60,255,122)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'bg-card border border-[rgba(255,255,255,0.08)] rounded-[14px] shadow-card',
          style: { background: 'rgb(18,24,21)', color: '#fff', border: '1px solid rgba(255,255,255,0.08)' },
        }}
      />

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ─── Sidebar ─── */}
      <aside
        className={cn(
          'fixed lg:static inset-y-0 right-0 z-50 w-[240px] flex flex-col transition-transform duration-300',
          'bg-background border-l border-[rgba(255,255,255,0.06)]',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
        aria-label="منوی اصلی"
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 px-5">
          <div className="size-9 rounded-[14px] bg-[rgba(60,255,122,0.12)] flex items-center justify-center">
            <LayoutDashboard className="size-5 text-[#3cff7a]" />
          </div>
          <div>
            <span className="font-semibold text-sm text-white block leading-tight">پنل معاملاتی</span>
            <span className="text-[10px] text-[#5c6b64] tracking-wide uppercase">Trading System</span>
          </div>
          <button
            className="lg:hidden mr-auto p-1 rounded-[10px] hover:bg-[rgba(255,255,255,0.04)] text-[#94a39c]"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {NAV_LINKS.map((link) => {
            const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
              LayoutDashboard, ClipboardCheck, Settings, Ban, BookOpen, BarChart3, Settings2,
            };
            const Icon = link.icon ? iconMap[link.icon] : null;
            const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-[14px] text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-[#3cff7a] text-[#06180d] shadow-[0_0_24px_rgba(60,255,122,0.45)]'
                    : 'text-[#94a39c] hover:bg-[rgba(255,255,255,0.04)] hover:text-white'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                {Icon && <Icon className="size-5 flex-shrink-0" />}
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-[rgba(255,255,255,0.06)]">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="size-9 rounded-full bg-[rgba(60,255,122,0.12)] flex items-center justify-center">
              <User className="size-5 text-[#3cff7a]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.user_metadata?.full_name || 'کاربر'}
              </p>
              <p className="text-[11px] text-[#5c6b64] truncate font-mono">
                {user?.email || '—'}
              </p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-[#94a39c] hover:text-white hover:bg-[rgba(255,255,255,0.04)] rounded-[14px] transition-colors"
          >
            <LogOut className="size-5" />
            خروج از حساب
          </button>
        </div>
      </aside>

      {/* ─── Main ─── */}
      <main className="flex-1 flex flex-col min-w-0 lg:ml-0">
        {/* Top bar */}
        <header className="h-16 bg-background/80 backdrop-blur-md border-b border-[rgba(255,255,255,0.06)] sticky top-0 z-30 lg:z-auto">
          <div className="h-full flex items-center justify-between px-4 lg:px-6">
            <button
              className="lg:hidden p-2 rounded-[14px] hover:bg-[rgba(255,255,255,0.04)] text-[#94a39c]"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="size-6" />
            </button>

            <div className="flex-1 lg:flex-none" />

            <div className="flex items-center gap-2">
              <button
                className="p-2 rounded-[14px] bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.06)] text-[#94a39c] hover:text-white hover:border-[rgba(60,255,122,0.3)] transition-all duration-200"
                title="پشتیبان‌گیری"
              >
                <Download className="size-5" />
              </button>
              <button
                onClick={() => document.getElementById('import-file')?.click()}
                className="p-2 rounded-[14px] bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.06)] text-[#94a39c] hover:text-white hover:border-[rgba(60,255,122,0.3)] transition-all duration-200"
                title="بازیابی"
              >
                <Upload className="size-5" />
              </button>
              <input id="import-file" type="file" accept="application/json" className="hidden" />
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-4 lg:p-6 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}