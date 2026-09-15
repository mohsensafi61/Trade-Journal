'use client';

import { useState, useEffect } from 'react';
import { useSystem } from '@/hooks/useSystem';
import { SYSTEM_FIELDS } from '@/lib/constants';
import { Settings, Save } from 'lucide-react';
import { toast } from 'sonner';

export function SystemClient({ userId }: { userId: string }) {
  const { system, upsertSystem, loading } = useSystem(userId);
  const [form, setForm] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (system) {
      const map: Record<string, string> = {};
      SYSTEM_FIELDS.forEach((f) => {
        map[f.id] = system[f.id as keyof typeof system] as string || '';
      });
      setForm(map);
    }
  }, [system]);

  const handleSave = async () => {
    setSaving(true);
    const ok = await upsertSystem(form);
    setSaving(false);
    toast(ok ? 'سیستم ذخیره شد' : 'خطا در ذخیره‌سازی');
  };

  if (loading) {
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
          سیستم معاملاتی من
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          قوانین ثابت خودت را اینجا بنویس. این‌ها ریل‌های تو هستن — وقتی مشخص
          باشن، دیگه هر لحظه لازم نیست از صفر تصمیم بگیری.
        </p>
      </div>

      <div className="card p-6 space-y-5">
        {SYSTEM_FIELDS.map((field) => (
          <div key={field.id}>
            <label className="block text-sm font-medium text-foreground mb-1">
              {field.label}
            </label>
            <p className="text-xs text-muted-foreground mb-2">{field.hint}</p>
            <textarea
              value={form[field.id] || ''}
              onChange={(e) => setForm((prev) => ({ ...prev, [field.id]: e.target.value }))}
              rows={3}
              className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-[14px] px-4 py-3 text-white placeholder:text-[#5c6b64] focus:outline-none focus:border-[rgba(60,255,122,0.4)] focus:shadow-[0_0_0_3px_rgba(60,255,122,0.1)] resize-vertical text-sm transition-all"
              placeholder={field.label}
            />
          </div>
        ))}

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-3 bg-[#3cff7a] text-[#06180d] font-bold rounded-[14px] hover:shadow-[0_0_24px_rgba(60,255,122,0.45)] focus:outline-none focus:ring-2 focus:ring-[#3cff7a] focus:ring-offset-2 focus:ring-offset-background disabled:opacity-40 flex items-center justify-center gap-2 text-sm transition-all duration-200"
        >
          <Save className="size-5" />
          {saving ? 'در حال ذخیره...' : 'ذخیره سیستم'}
        </button>
      </div>
    </div>
  );
}