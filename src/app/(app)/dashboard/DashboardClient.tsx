'use client';

import { useChecklist } from '@/hooks/useChecklist';
import { useJournal } from '@/hooks/useJournal';
import { useSystem } from '@/hooks/useSystem';
import { useForbidden } from '@/hooks/useForbidden';
import { CHECKLIST_SECTIONS } from '@/lib/constants';
import { faDigits, formatDateFa } from '@/lib/utils';
import {
  LayoutDashboard,
  ClipboardCheck,
  TrendingUp,
  Target,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  MinusCircle,
  ArrowLeft,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardClientProps {
  userId: string;
}

export function DashboardClient({ userId }: DashboardClientProps) {
  const { checklist } = useChecklist(userId);
  const { journal } = useJournal(userId);
  const { system } = useSystem(userId);
  const { forbidden } = useForbidden(userId);

  const totalItems = CHECKLIST_SECTIONS.reduce((s, sec) => s + sec.items.length, 0);
  const checkedItems = checklist?.checks
    ? Object.values(checklist.checks).filter(Boolean).length
    : 0;
  const checklistPct = totalItems ? Math.round((checkedItems / totalItems) * 100) : 0;

  const totalTrades = journal?.length || 0;
  const wins = journal?.filter((e) => e.outcome === 'win').length || 0;
  const winRate = totalTrades ? Math.round((wins / totalTrades) * 100) : 0;

  const withAdherence = journal?.filter((e) => e.rule_adherence !== null) || [];
  const adhOk = withAdherence.filter((e) => e.rule_adherence === true).length;
  const adherencePct = withAdherence.length ? Math.round((adhOk / withAdherence.length) * 100) : 0;

  const withQuality = journal?.filter((e) => e.decision_quality) || [];
  const goodQ = withQuality.filter((e) => e.decision_quality === 'good').length;
  const qualityPct = withQuality.length ? Math.round((goodQ / withQuality.length) * 100) : 0;

  const loading = !checklist && !journal && !system && !forbidden;

  if (loading && totalTrades === 0 && checklistPct === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="size-8 border-2 border-[#3cff7a] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-fadein max-w-4xl mx-auto">
      {/* ─── Flow Diagram ─── */}
      <div className="card flex items-center justify-between gap-3 p-5 overflow-x-auto">
        <div className="flex items-center gap-2 text-[#5c6b64] text-xs font-semibold uppercase tracking-widest flex-shrink-0">
          <LayoutDashboard className="size-4" />
          <span>جریان سیستم</span>
        </div>
        <div className="flex items-center gap-1 flex-1 min-w-0">
          {[
            { label: 'ورودی‌ها', icon: ClipboardCheck, step: 1 },
            { label: 'فرآیند', icon: TrendingUp, step: 2 },
            { label: 'خروجی‌ها', icon: Target, step: 3, current: true },
            { label: 'بازخورد', icon: AlertTriangle, step: 4 },
          ].map((item, i) => (
            <div key={item.step} className="flex items-center gap-2 flex-1 min-w-[80px]">
              <div
                className={cn(
                  'size-10 rounded-[14px] border flex items-center justify-center text-xs font-mono font-semibold transition-all duration-200',
                  item.current
                    ? 'border-[#3cff7a] bg-[rgba(60,255,122,0.12)] text-[#3cff7a] shadow-[0_0_16px_rgba(60,255,122,0.3)]'
                    : 'border-[rgba(255,255,255,0.08)] text-[#5c6b64] bg-[rgba(255,255,255,0.03)]'
                )}
              >
                {item.step}
              </div>
              <span className="text-xs font-medium text-[#94a39c] whitespace-nowrap">
                {item.label}
              </span>
              {i < 3 && (
                <span className="text-[#5c6b64] text-sm mr-1">‹</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ─── Gauge Cards ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <GaugeCard
          label="چک‌لیست امروز"
          percent={checklistPct}
          sub="تکمیل‌شده"
          color="#3cff7a"
          icon={<ClipboardCheck className="size-5" />}
        />
        <GaugeCard
          label="نرخ برد"
          percent={winRate}
          sub={totalTrades ? `از ${faDigits(totalTrades)} معامله` : 'هنوز معامله‌ای نیست'}
          color="#3cff7a"
          icon={<TrendingUp className="size-5" />}
          hasData={totalTrades > 0}
        />
        <GaugeCard
          label="پایبندی به قوانین"
          percent={adherencePct}
          sub={withAdherence.length ? `از ${faDigits(withAdherence.length)} معامله` : 'داده‌ای نیست'}
          color="#f4c430"
          icon={<Target className="size-5" />}
          hasData={withAdherence.length > 0}
        />
        <GaugeCard
          label="کیفیت تصمیم‌ها"
          percent={qualityPct}
          sub={withQuality.length ? 'مستقل از نتیجه مالی' : 'داده‌ای نیست'}
          color="#d3a24a"
          icon={<Target className="size-5" />}
          hasData={withQuality.length > 0}
        />
      </div>

      {/* ─── Recent Trades ─── */}
      <div className="card">
        <div className="flex items-center justify-between mb-4 px-1">
          <h3 className="font-semibold text-white text-sm flex items-center gap-2">
            <Clock className="size-4 text-[#5c6b64]" />
            آخرین معاملات
          </h3>
          {totalTrades > 0 && (
            <a href="/journal" className="text-xs text-[#3cff7a] hover:underline flex items-center gap-1">
              مشاهده همه
              <ArrowLeft className="size-3" />
            </a>
          )}
        </div>

        {totalTrades === 0 ? (
          <div className="text-center py-10 text-[#5c6b64]">
            <Clock className="size-10 mx-auto mb-2 opacity-40" />
            <p className="text-sm">هنوز معامله‌ای ثبت نشده</p>
            <a href="/journal" className="text-[#3cff7a] hover:underline text-sm mt-2 inline-block">
              ثبت معامله جدید
            </a>
          </div>
        ) : (
          <div className="space-y-0">
            {journal?.slice(0, 4).map((entry, idx) => (
              <div
                key={entry.id}
                className={cn(
                  'flex items-center justify-between py-3.5 px-1',
                  idx < 3 && 'border-b border-[rgba(255,255,255,0.06)]'
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-[#5c6b64]">
                    {formatDateFa(entry.date)}
                  </span>
                  <span className="font-medium text-sm text-white">{entry.symbol}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {entry.outcome === 'win' && (
                    <OutcomeBadge color="green">سود{entry.r_value ? ` ${faDigits(entry.r_value)}R` : ''}</OutcomeBadge>
                  )}
                  {entry.outcome === 'loss' && (
                    <OutcomeBadge color="red">ضرر{entry.r_value ? ` ${faDigits(entry.r_value)}R` : ''}</OutcomeBadge>
                  )}
                  {entry.outcome === 'flat' && (
                    <OutcomeBadge color="muted">سربه‌سر</OutcomeBadge>
                  )}
                  {entry.rule_adherence === true && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono font-semibold rounded-full bg-[rgba(60,255,122,0.1)] text-[#3cff7a]">
                      طبق قانون
                    </span>
                  )}
                  {entry.rule_adherence === false && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono font-semibold rounded-full bg-[rgba(217,105,95,0.12)] text-[#d9695f]">
                      خارج قانون
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ─── Reminder ─── */}
      <div className="card p-5 border-[rgba(60,255,122,0.15)] bg-[rgba(60,255,122,0.04)]">
        <h3 className="font-semibold text-white text-sm mb-2 flex items-center gap-2">
          <Target className="size-4 text-[#3cff7a]" />
          یادآوری
        </h3>
        <p className="text-xs text-[#94a39c] leading-relaxed">
          خروجی دست تو نیست؛ چیزی که دست توئه ورودی‌هاست. هر روز از تب
          «چک‌لیست روزانه» شروع کن، بعد از هر معامله در «ژورنال» ثبتش کن، و هر
          چند وقت یک‌بار سراغ «آمار و روند» برو — نه برای قضاوت نتیجه، بلکه
          برای دیدن این‌که آیا داری طبق سیستم خودت عمل می‌کنی یا نه.
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   GaugeCard — SVG circular progress ring
   ═══════════════════════════════════════════ */

function GaugeCard({
  label,
  percent,
  sub,
  color,
  icon,
  hasData = true,
}: {
  label: string;
  percent: number;
  sub: string;
  color: string;
  icon: React.ReactNode;
  hasData?: boolean;
}) {
  const radius = 38;
  const stroke = 5;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;
  const displayPercent = hasData ? faDigits(percent) : '—';

  return (
    <div className="card p-5 flex flex-col items-center text-center group">
      {/* ── SVG Ring ── */}
      <div className="relative size-[96px] mb-3">
        <svg
          className="size-full -rotate-90"
          viewBox="0 0 96 96"
          fill="none"
        >
          {/* track */}
          <circle
            cx="48"
            cy="48"
            r={radius}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={stroke}
          />
          {/* glow filter */}
          <defs>
            <filter id={`glow-${label}`} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {/* fill */}
          {hasData && (
            <circle
              cx="48"
              cy="48"
              r={radius}
              stroke={color}
              strokeWidth={stroke}
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              filter={`url(#glow-${label})`}
              style={{
                transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4,0,0.2,1)',
              }}
            />
          )}
        </svg>

        {/* center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-[22px] font-mono font-bold leading-none"
            style={{ color: hasData ? color : '#5c6b64' }}
          >
            {displayPercent}
          </span>
          {hasData && (
            <span className="text-[9px] font-bold mt-0.5" style={{ color }}>
              ٪
            </span>
          )}
        </div>
      </div>

      {/* ── Label ── */}
      <p className="text-[11px] font-semibold text-white leading-tight mb-1">{label}</p>
      <p className="text-[10px] text-[#5c6b64] leading-tight">{sub}</p>
    </div>
  );
}

function OutcomeBadge({
  color,
  children,
}: {
  color: 'green' | 'red' | 'muted';
  children: React.ReactNode;
}) {
  const styles = {
    green: 'bg-[rgba(60,255,122,0.1)] text-[#3cff7a]',
    red: 'bg-[rgba(217,105,95,0.12)] text-[#d9695f]',
    muted: 'bg-[rgba(255,255,255,0.05)] text-[#94a39c]',
  };
  return (
    <span className={cn(
      'inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono font-semibold rounded-full',
      styles[color]
    )}>
      {color === 'green' && <CheckCircle className="size-3" />}
      {color === 'red' && <XCircle className="size-3" />}
      {color === 'muted' && <MinusCircle className="size-3" />}
      {children}
    </span>
  );
}