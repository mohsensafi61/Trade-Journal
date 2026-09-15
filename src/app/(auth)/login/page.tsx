'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter, useSearchParams } from 'next/navigation';
import { Toaster, toast } from 'sonner';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Zap } from 'lucide-react';
import { Suspense } from 'react';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/dashboard';
  const supabase = createClient();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isMagicLink, setIsMagicLink] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    if (isMagicLink) {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback?redirect=${redirectTo}` },
      });
      if (error) toast.error(error.message);
      else toast.success('لینک ورود به ایمیل شما ارسال شد');
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) toast.error(error.message);
      else router.push(redirectTo);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: 'rgb(18,24,21)', color: '#fff', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px' },
        }}
      />
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="size-14 mx-auto mb-4 rounded-[18px] bg-[rgba(60,255,122,0.12)] flex items-center justify-center shadow-[0_0_30px_rgba(60,255,122,0.2)]">
            <Zap className="size-7 text-[#3cff7a]" />
          </div>
          <span className="text-[10px] font-semibold text-[#3cff7a] uppercase tracking-[0.2em] block mb-2">
            Trading System
          </span>
          <h1 className="text-2xl font-bold text-white">ورود به پنل</h1>
          <p className="text-sm text-[#94a39c] mt-1">ورودی‌ها را کنترل کن، خروجی‌ها را تماشا کن</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-[11px] font-semibold text-[#5c6b64] uppercase tracking-widest mb-2">
              ایمیل
            </label>
            <div className="relative">
              <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5c6b64] size-4" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pr-11 pl-4 py-3 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-[14px] text-white text-sm placeholder:text-[#5c6b64] focus:outline-none focus:border-[rgba(60,255,122,0.4)] focus:shadow-[0_0_0_3px_rgba(60,255,122,0.1)] transition-all"
                placeholder="you@example.com"
                disabled={loading}
              />
            </div>
          </div>

          {!isMagicLink && (
            <div>
              <label htmlFor="password" className="block text-[11px] font-semibold text-[#5c6b64] uppercase tracking-widest mb-2">
                رمز عبور
              </label>
              <div className="relative">
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5c6b64] size-4" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pr-11 pl-11 py-3 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-[14px] text-white text-sm placeholder:text-[#5c6b64] focus:outline-none focus:border-[rgba(60,255,122,0.4)] focus:shadow-[0_0_0_3px_rgba(60,255,122,0.1)] transition-all"
                  placeholder="••••••••"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5c6b64] hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-1">
            {!isMagicLink && (
              <a href={`/forgot-password?redirect=${redirectTo}`} className="text-xs text-[#94a39c] hover:text-[#3cff7a] transition-colors">
                رمز عبور را فراموش کرده‌ام
              </a>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !email || (!isMagicLink && !password)}
            className="w-full py-3 bg-[#3cff7a] text-[#06180d] font-bold rounded-[14px] hover:shadow-[0_0_24px_rgba(60,255,122,0.45)] focus:outline-none focus:ring-2 focus:ring-[#3cff7a] focus:ring-offset-2 focus:ring-offset-background disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm transition-all duration-200"
          >
            {loading ? 'در حال ورود...' : isMagicLink ? 'ارسال لینک جادویی' : 'ورود با رمز عبور'}
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[rgba(255,255,255,0.06)]" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-background px-3 text-[10px] text-[#5c6b64] uppercase tracking-widest font-semibold">یا</span>
          </div>
        </div>

        <p className="text-center text-sm text-[#94a39c]">
          حساب کاربری ندارید؟{' '}
          <a href={`/signup?redirect=${redirectTo}`} className="text-[#3cff7a] hover:underline font-semibold">
            ثبت‌نام
          </a>
        </p>

        <div className="mt-6 pt-5 border-t border-[rgba(255,255,255,0.06)]">
          <button
            type="button"
            onClick={() => setIsMagicLink(!isMagicLink)}
            className="w-full py-2 text-xs text-[#5c6b64] hover:text-[#3cff7a] flex items-center justify-center gap-2 transition-colors"
          >
            {isMagicLink ? (
              <>
                <ArrowRight className="size-3.5" />
                بازگشت به ورود با رمز عبور
              </>
            ) : (
              <>
                <Mail className="size-3.5" />
                ورود با لینک جادویی (Magic Link)
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="size-8 border-2 border-[#3cff7a] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}