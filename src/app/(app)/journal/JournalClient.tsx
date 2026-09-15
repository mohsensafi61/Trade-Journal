'use client';

import { useState } from 'react';
import { useJournal } from '@/hooks/useJournal';
import { useForbidden } from '@/hooks/useForbidden';
import {
  EXEC_CHECKS,
  FEAR_OPTIONS,
  LEARNING_TYPES,
} from '@/lib/constants';
import { todayStr, cn, formatDateFa, faDigits } from '@/lib/utils';
import {
  BookOpen,
  Save,
  X,
  Trash2,
  Pencil,
  CheckCircle,
  XCircle,
  MinusCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import type { JournalEntry, Outcome, DecisionQuality, ConfidenceType, LearningType } from '@/types';

export function JournalClient({ userId }: { userId: string }) {
  const { journal, addEntry, updateEntry, deleteEntry, loading } = useJournal(userId);
  const { forbidden } = useForbidden(userId);

  // Form state
  const [date, setDate] = useState(todayStr());
  const [symbol, setSymbol] = useState('');
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [rValue, setRValue] = useState('');
  const [ruleAdherence, setRuleAdherence] = useState<boolean | null>(null);
  const [decisionQuality, setDecisionQuality] = useState<DecisionQuality | null>(null);
  const [execChecks, setExecChecks] = useState<Record<string, boolean>>({});
  const [stress, setStress] = useState(3);
  const [satisfaction, setSatisfaction] = useState(3);
  const [fatigue, setFatigue] = useState(3);
  const [confidenceType, setConfidenceType] = useState<ConfidenceType | null>(null);
  const [greed, setGreed] = useState<boolean | null>(null);
  const [fears, setFears] = useState<Record<string, boolean>>({});
  const [forbiddenViolated, setForbiddenViolated] = useState<Record<string, boolean>>({});
  const [learningType, setLearningType] = useState<LearningType | ''>('');
  const [learningNote, setLearningNote] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function resetForm() {
    setDate(todayStr());
    setSymbol('');
    setOutcome(null);
    setRValue('');
    setRuleAdherence(null);
    setDecisionQuality(null);
    setExecChecks({});
    setStress(3);
    setSatisfaction(3);
    setFatigue(3);
    setConfidenceType(null);
    setGreed(null);
    setFears({});
    setForbiddenViolated({});
    setLearningType('');
    setLearningNote('');
    setEditingId(null);
  }

  function loadEntry(entry: JournalEntry) {
    setEditingId(entry.id);
    setDate(entry.date);
    setSymbol(entry.symbol);
    setOutcome(entry.outcome);
    setRValue(entry.r_value?.toString() || '');
    setRuleAdherence(entry.rule_adherence);
    setDecisionQuality(entry.decision_quality);
    setExecChecks(entry.execution || {});
    setStress(entry.stress || 3);
    setSatisfaction(entry.satisfaction || 3);
    setFatigue(entry.fatigue || 3);
    setConfidenceType(entry.confidence_type);
    setGreed(entry.greed);
    const fearMap: Record<string, boolean> = {};
    (entry.fears || []).forEach((f) => { fearMap[f] = true; });
    setFears(fearMap);
    const violMap: Record<string, boolean> = {};
    (entry.forbidden_violated || []).forEach((id) => { violMap[id] = true; });
    setForbiddenViolated(violMap);
    setLearningType(entry.learning_type || '');
    setLearningNote(entry.learning_note || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleSave() {
    if (!symbol.trim()) {
      toast.error('نماد رو وارد کن');
      return;
    }
    if (!outcome) {
      toast.error('نتیجه مالی رو مشخص کن');
      return;
    }

    setSaving(true);
    const data = {
      date,
      symbol: symbol.trim(),
      outcome,
      r_value: rValue ? parseFloat(rValue) : null,
      rule_adherence: ruleAdherence,
      decision_quality: decisionQuality,
      execution: execChecks,
      stress,
      satisfaction,
      fatigue,
      confidence_type: confidenceType,
      greed,
      fears: Object.keys(fears).filter((k) => fears[k]),
      forbidden_violated: Object.keys(forbiddenViolated).filter((k) => forbiddenViolated[k]),
      learning_type: learningType || null,
      learning_note: learningNote || null,
    };

    if (editingId) {
      const result = await updateEntry(editingId, data);
      if (result) {
        toast('معامله به‌روزرسانی شد');
      } else {
        toast.error('خطا در به‌روزرسانی — لاگ سرور رو چک کن');
      }
    } else {
      const result = await addEntry(data);
      if (result) {
        toast('معامله ثبت شد');
      } else {
        toast.error('خطا در ثبت — لاگ سرور رو چک کن');
      }
    }
    setSaving(false);
    resetForm();
  }

  async function handleDelete(id: string) {
    const ok = await deleteEntry(id);
    if (ok) toast('حذف شد');
  }

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
          <BookOpen className="size-6" />
          ژورنال معاملات
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          خروجی مالی فقط یک بخش از ماجراست؛ خروجی روانی و اطلاعاتی هر معامله
          را هم ثبت کن.
        </p>
      </div>

      {/* Form Card */}
      <div className="card p-6 space-y-5">
        <h3 className="font-semibold text-foreground">
          {editingId ? 'ویرایش معامله' : 'ثبت معامله جدید'}
        </h3>

        {/* Date + Symbol */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-muted-foreground mb-1.5">تاریخ</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-input border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-1.5">نماد / جفت‌ارز</label>
            <input
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              placeholder="مثلا XAUUSD"
              className="w-full bg-input border border-border rounded-md px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        {/* Outcome */}
        <div>
          <label className="block text-sm text-muted-foreground mb-1.5">نتیجه مالی</label>
          <div className="flex gap-2 flex-wrap">
            {[
              { value: 'win' as Outcome, label: 'سود', color: 'green' },
              { value: 'loss' as Outcome, label: 'ضرر', color: 'red' },
              { value: 'flat' as Outcome, label: 'سربه‌سر', color: 'default' },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setOutcome(outcome === opt.value ? null : opt.value)}
                className={cn(
                  'px-4 py-2 rounded-[14px] border text-sm font-medium transition-all duration-200',
                  outcome === opt.value
                    ? opt.color === 'green'
                      ? 'border-[#3cff7a] text-[#3cff7a] bg-[rgba(60,255,122,0.12)] shadow-[0_0_12px_rgba(60,255,122,0.25)]'
                      : opt.color === 'red'
                      ? 'border-[#d9695f] text-[#d9695f] bg-[rgba(217,105,95,0.12)]'
                      : 'border-[#94a39c] text-[#94a39c] bg-[rgba(255,255,255,0.05)]'
                    : 'border-[rgba(255,255,255,0.08)] text-[#5c6b64] bg-transparent hover:text-[#94a39c] hover:border-[rgba(255,255,255,0.12)]'
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* R-value + Adherence */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-muted-foreground mb-1.5">به ازای R (اختیاری)</label>
            <input
              type="number"
              step="0.1"
              value={rValue}
              onChange={(e) => setRValue(e.target.value)}
              placeholder="مثلا 2.5 یا -1"
              className="w-full bg-input border border-border rounded-md px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-1.5">پایبندی به قوانین؟</label>
            <div className="flex gap-2">
              <button
                onClick={() => setRuleAdherence(ruleAdherence === true ? null : true)}
                className={cn(
                  'flex-1 py-2 rounded-[14px] border text-sm font-medium transition-all duration-200',
                  ruleAdherence === true
                    ? 'border-[#3cff7a] text-[#3cff7a] bg-[rgba(60,255,122,0.12)] shadow-[0_0_10px_rgba(60,255,122,0.2)]'
                    : 'border-[rgba(255,255,255,0.08)] text-[#5c6b64] hover:text-[#94a39c]'
                )}
              >
                بله
              </button>
              <button
                onClick={() => setRuleAdherence(ruleAdherence === false ? null : false)}
                className={cn(
                  'flex-1 py-2 rounded-[14px] border text-sm font-medium transition-all duration-200',
                  ruleAdherence === false
                    ? 'border-[#d9695f] text-[#d9695f] bg-[rgba(217,105,95,0.12)]'
                    : 'border-[rgba(255,255,255,0.08)] text-[#5c6b64] hover:text-[#94a39c]'
                )}
              >
                خیر
              </button>
            </div>
          </div>
        </div>

        {/* Decision Quality */}
        <div>
          <label className="block text-sm text-muted-foreground mb-1.5">
            کیفیت تصمیم — مستقل از نتیجه
          </label>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setDecisionQuality(decisionQuality === 'good' ? null : 'good')}
              className={cn(
                'px-4 py-2 rounded-[14px] border text-sm font-medium transition-all duration-200',
                decisionQuality === 'good'
                  ? 'border-[#3cff7a] text-[#3cff7a] bg-[rgba(60,255,122,0.12)] shadow-[0_0_10px_rgba(60,255,122,0.2)]'
                  : 'border-[rgba(255,255,255,0.08)] text-[#5c6b64] hover:text-[#94a39c]'
              )}
            >
              تصمیم خوب
            </button>
            <button
              onClick={() => setDecisionQuality(decisionQuality === 'bad' ? null : 'bad')}
              className={cn(
                'px-4 py-2 rounded-[14px] border text-sm font-medium transition-all duration-200',
                decisionQuality === 'bad'
                  ? 'border-[#d9695f] text-[#d9695f] bg-[rgba(217,105,95,0.12)]'
                  : 'border-[rgba(255,255,255,0.08)] text-[#5c6b64] hover:text-[#94a39c]'
              )}
            >
              تصمیم بد
            </button>
          </div>
        </div>

        <hr className="border-border" />

        {/* Execution Checks */}
        <div>
          <h4 className="font-semibold text-foreground mb-3">اجرا (زمان معامله)</h4>
          <div className="space-y-2">
            {EXEC_CHECKS.map((item) => {
              const isChecked = !!execChecks[item.id];
              return (
                <button
                  key={item.id}
                  onClick={() => setExecChecks((prev) => ({ ...prev, [item.id]: !prev[item.id] }))}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-right transition-colors',
                    isChecked ? 'bg-gold/5' : 'hover:bg-accent'
                  )}
                >
                  <div
                    className={cn(
                      'size-5 rounded flex items-center justify-center border-2 transition-all flex-shrink-0',
                      isChecked ? 'bg-primary border-primary' : 'border-muted-foreground'
                    )}
                  >
                    {isChecked && <CheckCircle className="size-3.5 text-primary-foreground" />}
                  </div>
                  <span className="text-sm text-foreground">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <hr className="border-border" />

        {/* Emotional Output */}
        <div>
          <h4 className="font-semibold text-foreground mb-3">خروجی روانی و احساسی</h4>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <SliderField
              label="استرس هنگام معامله"
              value={stress}
              onChange={setStress}
            />
            <SliderField
              label="رضایت از عملکرد"
              value={satisfaction}
              onChange={setSatisfaction}
            />
            <SliderField
              label="خستگی ذهنی"
              value={fatigue}
              onChange={setFatigue}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* Confidence */}
            <div>
              <label className="block text-sm text-muted-foreground mb-1.5">اعتماد به نفس</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setConfidenceType(confidenceType === 'real' ? null : 'real')}
                  className={cn(
                    'flex-1 py-2 rounded-[14px] border text-xs font-medium transition-all duration-200',
                    confidenceType === 'real'
                      ? 'border-[#3cff7a] text-[#3cff7a] bg-[rgba(60,255,122,0.12)] shadow-[0_0_10px_rgba(60,255,122,0.2)]'
                      : 'border-[rgba(255,255,255,0.08)] text-[#5c6b64] hover:text-[#94a39c]'
                  )}
                >
                  واقعی (سیستم)
                </button>
                <button
                  onClick={() => setConfidenceType(confidenceType === 'false' ? null : 'false')}
                  className={cn(
                    'flex-1 py-2 rounded-[14px] border text-xs font-medium transition-all duration-200',
                    confidenceType === 'false'
                      ? 'border-[#d9695f] text-[#d9695f] bg-[rgba(217,105,95,0.12)]'
                      : 'border-[rgba(255,255,255,0.08)] text-[#5c6b64] hover:text-[#94a39c]'
                  )}
                >
                  کاذب
                </button>
              </div>
            </div>

            {/* Greed */}
            <div>
              <label className="block text-sm text-muted-foreground mb-1.5">TP رو جابه‌جا کردی؟</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setGreed(greed === true ? null : true)}
                  className={cn(
                    'flex-1 py-2 rounded-[14px] border text-xs font-medium transition-all duration-200',
                    greed === true
                      ? 'border-[#d9695f] text-[#d9695f] bg-[rgba(217,105,95,0.12)]'
                      : 'border-[rgba(255,255,255,0.08)] text-[#5c6b64] hover:text-[#94a39c]'
                  )}
                >
                  بله
                </button>
                <button
                  onClick={() => setGreed(greed === false ? null : false)}
                  className={cn(
                    'flex-1 py-2 rounded-[14px] border text-xs font-medium transition-all duration-200',
                    greed === false
                      ? 'border-[#3cff7a] text-[#3cff7a] bg-[rgba(60,255,122,0.12)] shadow-[0_0_10px_rgba(60,255,122,0.2)]'
                      : 'border-[rgba(255,255,255,0.08)] text-[#5c6b64] hover:text-[#94a39c]'
                  )}
                >
                  نه
                </button>
              </div>
            </div>
          </div>

          {/* Fears */}
          <div className="mb-4">
            <label className="block text-sm text-muted-foreground mb-1.5">ترس</label>
            <div className="flex flex-wrap gap-2">
              {FEAR_OPTIONS.map((label) => (
                <button
                  key={label}
                  onClick={() => setFears((prev) => ({ ...prev, [label]: !prev[label] }))}
                  className={cn(
                    'px-3 py-1.5 rounded-[999px] border text-xs font-medium transition-all duration-200',
                    fears[label]
                      ? 'border-[#d3a24a] text-[#d3a24a] bg-[rgba(211,162,74,0.12)] shadow-[0_0_8px_rgba(211,162,74,0.2)]'
                      : 'border-[rgba(255,255,255,0.08)] text-[#5c6b64] hover:text-[#94a39c]'
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Forbidden Violated */}
          <div>
            <label className="block text-sm text-muted-foreground mb-1.5">
              این معامله کدوم ممنوعیت رو نقض کرد؟
            </label>
            {forbidden.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                اول یک لیست ممنوعیت در تب «ممنوعیت‌ها» بسازید
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {forbidden.map((item) => (
                  <button
                    key={item.id}
                    onClick={() =>
                      setForbiddenViolated((prev) => ({
                        ...prev,
                        [item.id]: !prev[item.id],
                      }))
                    }
                    className={cn(
                      'px-3 py-1.5 rounded-[999px] border text-xs font-medium transition-all duration-200',
                      forbiddenViolated[item.id]
                        ? 'border-[#d9695f] text-[#d9695f] bg-[rgba(217,105,95,0.12)] shadow-[0_0_8px_rgba(217,105,95,0.2)]'
                        : 'border-[rgba(255,255,255,0.08)] text-[#5c6b64] hover:text-[#94a39c]'
                    )}
                  >
                    {item.text}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <hr className="border-border" />

        {/* Learning */}
        <div>
          <h4 className="font-semibold text-foreground mb-3">یادگیری</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-muted-foreground mb-1.5">نوع یادگیری</label>
              <select
                value={learningType}
                onChange={(e) => setLearningType(e.target.value as LearningType | '')}
                className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-[14px] px-3 py-2.5 text-white focus:outline-none focus:border-[rgba(60,255,122,0.4)] focus:shadow-[0_0_0_3px_rgba(60,255,122,0.1)]"
              >
                <option value="">—</option>
                {LEARNING_TYPES.map((lt) => (
                  <option key={lt.value} value={lt.value}>
                    {lt.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1.5">یادداشت</label>
              <input
                type="text"
                value={learningNote}
                onChange={(e) => setLearningNote(e.target.value)}
                placeholder="چی یاد گرفتی؟"
                className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-[14px] px-3 py-2.5 text-white placeholder:text-[#5c6b64] focus:outline-none focus:border-[rgba(60,255,122,0.4)] focus:shadow-[0_0_0_3px_rgba(60,255,122,0.1)]"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-3 bg-[#3cff7a] text-[#06180d] font-bold rounded-[14px] hover:shadow-[0_0_20px_rgba(60,255,122,0.4)] focus:outline-none focus:ring-2 focus:ring-[#3cff7a] focus:ring-offset-2 focus:ring-offset-background disabled:opacity-40 flex items-center justify-center gap-2 text-sm transition-all duration-200"
          >
            <Save className="size-5" />
            {saving ? 'در حال ذخیره...' : editingId ? 'به‌روزرسانی معامله' : 'ثبت معامله'}
          </button>
          {editingId && (
            <button
              onClick={resetForm}
              className="px-4 py-3 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-[#94a39c] font-medium rounded-[14px] hover:text-white hover:border-[rgba(255,255,255,0.12)] flex items-center gap-2 text-sm transition-all duration-200"
            >
              <X className="size-5" />
              لغو
            </button>
          )}
        </div>
      </div>

      {/* Journal List */}
      <div>
        <h3 className="font-semibold text-foreground mb-3">معاملات ثبت‌شده</h3>
        {journal.length === 0 ? (
          <div className="card p-8 text-center text-muted-foreground text-sm">
            <BookOpen className="size-12 mx-auto mb-2 opacity-50" />
            هنوز معامله‌ای ثبت نشده
          </div>
        ) : (
          <div className="space-y-3">
            {journal.map((entry) => (
              <div key={entry.id} className="card p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-mono text-sm text-muted-foreground">
                      {formatDateFa(entry.date)}
                    </span>
                    <span className="font-semibold text-foreground">{entry.symbol}</span>
                    {entry.outcome === 'win' && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-mono font-medium rounded-full bg-green-dim text-green">
                        <CheckCircle className="size-3" />
                        سود{entry.r_value ? ` ${faDigits(entry.r_value)}R` : ''}
                      </span>
                    )}
                    {entry.outcome === 'loss' && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-mono font-medium rounded-full bg-red-dim text-red">
                        <XCircle className="size-3" />
                        ضرر{entry.r_value ? ` ${faDigits(entry.r_value)}R` : ''}
                      </span>
                    )}
                    {entry.outcome === 'flat' && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-mono font-medium rounded-full bg-muted text-muted-foreground">
                        <MinusCircle className="size-3" />
                        سربه‌سر
                      </span>
                    )}
                    {entry.rule_adherence === true && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-mono font-medium rounded-full bg-gold-dim/50 text-gold">
                        طبق قوانین
                      </span>
                    )}
                    {entry.rule_adherence === false && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-mono font-medium rounded-full bg-red-dim text-red">
                        خارج از قوانین
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => loadEntry(entry)}
                      className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                      title="ویرایش"
                    >
                      <Pencil className="size-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(entry.id)}
                      className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-red transition-colors"
                      title="حذف"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
                {entry.learning_note && (
                  <p className="text-sm text-muted-foreground mt-1">
                    یادگیری: {entry.learning_note}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SliderField({
  label,
  value,
  onChange,
  min = 1,
  max = 5,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div>
      <label className="block text-sm text-muted-foreground mb-1">{label}</label>
      <div className="flex items-center gap-3">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1 accent-primary"
        />
        <span className="font-mono text-sm text-gold w-4 text-center">{faDigits(value)}</span>
      </div>
    </div>
  );
}