'use client';

import { useJournal } from '@/hooks/useJournal';
import { useSystemLogs } from '@/hooks/useSystemLogs';
import { faDigits, cn } from '@/lib/utils';
import { todayStr } from '@/lib/utils';
import { BarChart3, TrendingUp, AlertTriangle, Save, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

export function StatsClient({ userId }: { userId: string }) {
  const { journal, loading: journalLoading } = useJournal(userId);
  const { logs, addLog, loading: logsLoading } = useSystemLogs(userId);

  const [stability, setStability] = useState(3);
  const [adaptability, setAdaptability] = useState(3);
  const [resilience, setResilience] = useState(3);
  const [calm, setCalm] = useState(3);
  const [saving, setSaving] = useState(false);

  const totalTrades = journal?.length || 0;
  const wins = journal?.filter((e) => e.outcome === 'win').length || 0;
  const winRate = totalTrades ? Math.round((wins / totalTrades) * 100) : 0;

  const withAdherence = journal?.filter((e) => e.rule_adherence !== null) || [];
  const adhOk = withAdherence.filter((e) => e.rule_adherence === true).length;
  const adherencePct = withAdherence.length ? Math.round((adhOk / withAdherence.length) * 100) : 0;

  const stressVals = journal?.map((e) => e.stress).filter((v) => typeof v === 'number') || [];
  const satVals = journal?.map((e) => e.satisfaction).filter((v) => typeof v === 'number') || [];
  const avgStress = stressVals.length ? (stressVals.reduce((a, b) => a + b, 0) / stressVals.length).toFixed(1) : null;
  const avgSat = satVals.length ? (satVals.reduce((a, b) => a + b, 0) / satVals.length).toFixed(1) : null;

  const violations = journal?.reduce(
    (s, e) => s + (e.forbidden_violated?.length || 0),
    0
  ) || 0;

  const recent = journal?.slice(0, 10).reverse() || [];

  async function handleSave() {
    setSaving(true);
    const result = await addLog({
      log_date: todayStr(),
      stability,
      adaptability,
      resilience,
      calm,
    });
    setSaving(false);
    toast(result ? 'ثبت شد' : 'خطا در ثبت');
  }

  if (journalLoading || logsLoading) {
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
          <BarChart3 className="size-6" />
          آمار و روند
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          این‌ها را برای قضاوت لحظه‌ای نگاه نکن؛ خروجی‌ها با تاخیر می‌آیند.
          برای دیدن روند بلندمدت سیستم خودت اینجا رو نگاه کن.
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card p-4 text-center">
          <p className="text-sm text-muted-foreground mb-1">تعداد معاملات</p>
          <p className="text-2xl font-mono font-semibold text-foreground">{faDigits(totalTrades)}</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-[10px] font-semibold text-[#5c6b64] uppercase tracking-widest mb-2">نرخ برد</p>
          <p className="text-2xl font-mono font-bold text-[#3cff7a]">
            {totalTrades ? faDigits(winRate + '٪') : '—'}
          </p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-sm text-muted-foreground mb-1">پایبندی به قوانین</p>
          <p className="text-2xl font-mono font-semibold text-foreground">
            {withAdherence.length ? faDigits(adherencePct + '٪') : '—'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="card p-4 text-center">
          <p className="text-sm text-muted-foreground mb-1">میانگین استرس</p>
          <p className="text-2xl font-mono font-semibold text-foreground">
            {avgStress || '—'}
          </p>
          <p className="text-xs text-muted-foreground">از ۵</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-sm text-muted-foreground mb-1">میانگین رضایت</p>
          <p className="text-2xl font-mono font-semibold text-foreground">
            {avgSat || '—'}
          </p>
          <p className="text-xs text-muted-foreground">از ۵</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-[10px] font-semibold text-[#5c6b64] uppercase tracking-widest mb-2">نقض ممنوعیت‌ها</p>
          <p className="text-2xl font-mono font-bold text-[#d9695f]">
            {faDigits(violations)}
          </p>
          <p className="text-xs text-muted-foreground">تعداد کل</p>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="card p-5">
        <h3 className="font-semibold text-foreground mb-3">۱۰ معامله اخیر</h3>
        {recent.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground text-sm">
            <BarChart3 className="size-8 mx-auto mb-1 opacity-50" />
            هنوز داده‌ای نیست
          </div>
        ) : (
          <div className="flex items-end gap-1.5 h-20">
            {recent.map((entry) => {
              const height = entry.outcome === 'win' ? 100 : entry.outcome === 'loss' ? 45 : 20;
              return (
                <div
                  key={entry.id}
                  title={`${entry.date} — ${entry.symbol}`}
                  className={cn(
                    'flex-1 rounded-t-sm transition-colors min-w-[6px]',
                    entry.outcome === 'win'
                      ? 'bg-[#3cff7a] shadow-[0_0_6px_rgba(60,255,122,0.4)]'
                      : entry.outcome === 'loss'
                      ? 'bg-[#d9695f]'
                      : 'bg-[rgba(255,255,255,0.08)]'
                  )}
                  style={{ height: `${height}%` }}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Weekly Assessment */}
      <div className="card p-5">
        <h3 className="font-semibold text-foreground mb-1">ارزیابی سیستمی</h3>
        <p className="text-xs text-muted-foreground mb-4">
          پایداری، سازگاری، تاب‌آوری و آرامش — خصوصیاتی که از کل سیستم بیرون
          میان، نه از یک معامله‌ی خاص.
        </p>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm text-muted-foreground mb-1">پایداری در شرایط مختلف</label>
            <div className="flex items-center gap-3">
              <input type="range" min={1} max={5} value={stability} onChange={(e) => setStability(Number(e.target.value))} className="flex-1" />
              <span className="font-mono text-sm text-gold w-4 text-center">{faDigits(stability)}</span>
            </div>
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-1">سازگاری با شرایط جدید</label>
            <div className="flex items-center gap-3">
              <input type="range" min={1} max={5} value={adaptability} onChange={(e) => setAdaptability(Number(e.target.value))} className="flex-1" />
              <span className="font-mono text-sm text-gold w-4 text-center">{faDigits(adaptability)}</span>
            </div>
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-1">تاب‌آوری بعد از ضرر</label>
            <div className="flex items-center gap-3">
              <input type="range" min={1} max={5} value={resilience} onChange={(e) => setResilience(Number(e.target.value))} className="flex-1" />
              <span className="font-mono text-sm text-gold w-4 text-center">{faDigits(resilience)}</span>
            </div>
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-1">آرامش هنگام معامله</label>
            <div className="flex items-center gap-3">
              <input type="range" min={1} max={5} value={calm} onChange={(e) => setCalm(Number(e.target.value))} className="flex-1" />
              <span className="font-mono text-sm text-gold w-4 text-center">{faDigits(calm)}</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-[rgba(60,255,122,0.12)] border border-[rgba(60,255,122,0.3)] rounded-[14px] text-sm text-[#3cff7a] font-medium hover:shadow-[0_0_12px_rgba(60,255,122,0.25)] transition-all duration-200 flex items-center gap-2"
        >
          <Save className="size-4" />
          {saving ? 'در حال ثبت...' : 'ثبت ارزیابی این هفته'}
        </button>

        {logs.length > 0 && (
          <div className="mt-4">
            <p className="text-xs text-muted-foreground mb-2">ثبت‌های قبلی:</p>
            <div className="space-y-1">
              {logs.slice(0, 6).map((log) => (
                <div
                  key={log.id}
                  className="flex justify-between text-xs text-muted-foreground py-2 border-b border-border last:border-0 font-mono"
                >
                  <span>{faDigits(log.log_date)}</span>
                  <span>
                    پایداری {faDigits(log.stability)} · سازگاری {faDigits(log.adaptability)} · تاب‌آوری {faDigits(log.resilience)} · آرامش {faDigits(log.calm)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}