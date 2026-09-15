'use client';

import { useState, useEffect } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { toast } from 'sonner';
import { Settings, Download, Upload, User, Mail, Key, Save, AlertTriangle, Trash2, LogOut } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { exportToJson, importFromJson } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { useChecklist } from '@/hooks/useChecklist';
import { useJournal } from '@/hooks/useJournal';
import { useSystem } from '@/hooks/useSystem';
import { useForbidden } from '@/hooks/useForbidden';
import { useSystemLogs } from '@/hooks/useSystemLogs';

export function SettingsClient({ userId }: { userId: string }) {
  const { profile, updateProfile, loading: profileLoading } = useProfile(userId);
  const { checklist } = useChecklist(userId);
  const { journal } = useJournal(userId);
  const { system } = useSystem(userId);
  const { forbidden } = useForbidden(userId);
  const { logs } = useSystemLogs(userId);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setEmail(profile.id); // we'll get email from auth
    }
  }, [profile]);

  // Get user email from auth
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) setEmail(user.email);
    });
  }, []);

  async function handleSaveProfile() {
    setSavingProfile(true);
    const ok = await updateProfile({ full_name: fullName });
    setSavingProfile(false);
    toast(ok ? 'پروفایل به‌روزرسانی شد' : 'خطا در به‌روزرسانی');
  }

  async function handlePasswordChange() {
    if (!newPassword || newPassword.length < 6) {
      toast.error('رمز عبور باید حداقل ۶ کاراکتر باشد');
      return;
    }
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) toast.error(error.message);
    else {
      toast('رمز عبور تغییر کرد');
      setNewPassword('');
    }
  }

  async function handleExport() {
    setExporting(true);
    try {
      const data = {
        profile,
        checklist,
        journal,
        system,
        forbidden,
        systemLogs: logs,
        exportedAt: new Date().toISOString(),
      };
      exportToJson(data, `trading-panel-backup-${new Date().toISOString().split('T')[0]}.json`);
      toast('پشتیبان‌گیری انجام شد');
    } catch {
      toast.error('خطا در خروجی');
    }
    setExporting(false);
  }

  async function handleImport() {
    if (!importFile) return;
    setImporting(true);
    try {
      const data = await importFromJson(importFile);
      // TODO: implement import logic - for now just show success
      toast('فایل خوانده شد - پیاده‌سازی وارد کردن در دیتابیس نیاز به Server Action دارد');
      setImportFile(null);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'خطا در وارد کردن');
    }
    setImporting(false);
  }

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="size-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadein">
      <div>
        <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <Settings className="size-6" />
          تنظیمات
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          مدیریت حساب کاربری، پشتیبان‌گیری و بازیابی داده‌ها
        </p>
      </div>

      {/* Profile Section */}
      <div className="card p-6 space-y-5">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <User className="size-5" />
          پروفایل
        </h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="fullName" className="block text-sm text-muted-foreground mb-1.5">
              نام نمایشی
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-input border border-border rounded-md px-3 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="نام و نام خانوادگی"
            />
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-1.5">ایمیل</label>
            <div className="flex items-center gap-2">
              <Mail className="size-4 text-muted-foreground" />
              <span className="text-sm text-foreground font-mono">{email}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">تغییر ایمیل از طریق Supabase Dashboard امکان‌پذیر است</p>
          </div>
          <div>
            <label htmlFor="newPassword" className="block text-sm text-muted-foreground mb-1.5">
              رمز عبور جدید
            </label>
            <div className="flex gap-2">
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="حداقل ۶ کاراکتر"
                className="flex-1 bg-input border border-border rounded-md px-3 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                onClick={handlePasswordChange}
                disabled={!newPassword || newPassword.length < 6 || savingProfile}
                className="px-4 py-2.5 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2"
              >
                <Key className="size-4" />
                تغییر
              </button>
            </div>
          </div>
          <button
            onClick={handleSaveProfile}
            disabled={savingProfile}
            className="w-full py-2.5 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Save className="size-5" />
            {savingProfile ? 'در حال ذخیره...' : 'ذخیره پروفایل'}
          </button>
        </div>
      </div>

      {/* Backup Section */}
      <div className="card p-6 space-y-5">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <Download className="size-5" />
          پشتیبان‌گیری و بازیابی
        </h3>
        <p className="text-sm text-muted-foreground">
          تمام داده‌های شما (چک‌لیست‌ها، ژورنال، سیستم، ممنوعیت‌ها، ارزیابی‌های سیستمی) را به صورت یک فایل JSON دانلود یا بازیابی کنید.
        </p>

        <div className="flex flex-wrap gap-4">
          <button
            onClick={handleExport}
            disabled={exporting}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 disabled:opacity-50"
          >
            <Download className="size-5" />
            {exporting ? 'در حال دانلود...' : 'دانلود پشتیبان (JSON)'}
          </button>

          <div className="flex items-center gap-2 flex-1 min-w-[200px]">
            <input
              id="import-file"
              type="file"
              accept="application/json"
              className="flex-1 bg-input border border-border rounded-md px-3 py-2 text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:bg-primary file:text-primary-foreground file:border-0 hover:file:bg-primary/90"
              onChange={(e) => setImportFile(e.target.files?.[0] || null)}
              disabled={importing}
            />
            <button
              onClick={handleImport}
              disabled={importing || !importFile}
              className="px-4 py-2.5 bg-muted border border-border text-muted-foreground font-medium rounded-md hover:text-foreground hover:bg-accent disabled:opacity-50 flex items-center gap-2"
            >
              <Upload className="size-5" />
              {importing ? 'در حال ورود...' : 'بازیابی'}
            </button>
          </div>
        </div>

        <div className="pt-4 border-t border-border">
          <h4 className="font-medium text-foreground mb-2">داده‌های حاضر در پنل:</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
            <StatItem label="چک‌لیست امروز" value={checklist ? '✓' : '—'} />
            <StatItem label="معاملات ژورنال" value={journal?.length || 0} />
            <StatItem label="سیستم معاملاتی" value={system ? '✓' : '—'} />
            <StatItem label="ممنوعیت‌ها" value={forbidden?.length || 0} />
            <StatItem label="ارزیابی‌های سیستمی" value={logs?.length || 0} />
            <StatItem label="پروفایل" value={profile?.full_name ? '✓' : '—'} />
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="card p-6 space-y-5 border-red/30">
        <h3 className="font-semibold text-foreground flex items-center gap-2 text-red">
          <AlertTriangle className="size-5" />
          منطقه خطرناک
        </h3>
        <p className="text-sm text-muted-foreground">
          عملیات‌های زیر غیرقابل برگشت هستند. با احتیاط انجام دهید.
        </p>
        <div className="space-y-3">
          <button className="w-full px-4 py-2.5 bg-red/10 border border-red/30 text-red font-medium rounded-md hover:bg-red/20 transition-colors flex items-center justify-center gap-2">
            <Trash2 className="size-5" />
            حذف تمام داده‌های من (پیاده‌سازی نشده)
          </button>
          <button className="w-full px-4 py-2.5 bg-muted border border-border text-muted-foreground font-medium rounded-md hover:text-foreground hover:bg-accent transition-colors flex items-center justify-center gap-2">
            <LogOut className="size-5" />
            خروج از تمام جلسات (پیاده‌سازی نشده)
          </button>
        </div>
      </div>
    </div>
  );
}

function StatItem({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between px-3 py-2 bg-muted/50 rounded-md">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-mono font-medium text-foreground">{value}</span>
    </div>
  );
}