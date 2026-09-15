'use client';

import { useState, useEffect } from 'react';
import { useChecklist } from '@/hooks/useChecklist';
import { CHECKLIST_SECTIONS } from '@/lib/constants';
import { cn, faDigits } from '@/lib/utils';

import { ClipboardCheck, CheckCircle } from 'lucide-react';

export function ChecklistClient({ userId }: { userId: string }) {
  const { checklist, upsertChecklist, loading } = useChecklist(userId);
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [motivation, setMotivation] = useState('');

  useEffect(() => {
    if (checklist?.checks) {
      setChecks(checklist.checks);
    }
    if (checklist?.motivation) {
      setMotivation(checklist.motivation);
    }
  }, [checklist]);

  // Auto-save on change
  useEffect(() => {
    if (Object.keys(checks).length === 0 && !checklist) return;
    const timer = setTimeout(() => {
      upsertChecklist(checks, motivation);
    }, 500);
    return () => clearTimeout(timer);
  }, [checks, motivation]);

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
          <ClipboardCheck className="size-6" />
          چک‌لیست ورودی روزانه
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          قبل از هر تحلیل یا ترید، این موارد را مرور کن. وضعیت به‌صورت خودکار ذخیره می‌شود.
        </p>
      </div>

      <div className="space-y-6">
        {CHECKLIST_SECTIONS.map((section) => {
          const checkedCount = section.items.filter((it) => checks[it.id]).length;
          return (
            <div key={section.id} className="card p-5">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-foreground">{section.title}</h3>
                <span className="font-mono text-xs text-muted-foreground">
                  {faDigits(checkedCount)} / {faDigits(section.items.length)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mb-3">{section.subtitle}</p>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isChecked = !!checks[item.id];
                  return (
                    <button
                      key={item.id}
                      onClick={() => setChecks((prev) => ({ ...prev, [item.id]: !prev[item.id] }))}
                      className={cn(
                        'w-full flex items-center gap-3 px-3 py-2.5 rounded-[14px] text-right transition-all duration-200',
                        isChecked
                          ? 'bg-[rgba(60,255,122,0.08)] border border-[rgba(60,255,122,0.2)]'
                          : 'hover:bg-[rgba(255,255,255,0.04)] border border-transparent'
                      )}
                    >
                      <div
                        className={cn(
                          'size-5 rounded-[6px] flex items-center justify-center border-2 transition-all duration-200 flex-shrink-0',
                          isChecked
                            ? 'bg-[#3cff7a] border-[#3cff7a] shadow-[0_0_8px_rgba(60,255,122,0.4)]'
                            : 'border-[#5c6b64]'
                        )}
                      >
                        {isChecked && <CheckCircle className="size-3.5 text-[#06180d]" />}
                      </div>
                      <span
                        className={cn(
                          'text-sm transition-colors',
                          isChecked ? 'text-[#94a39c] line-through' : 'text-white'
                        )}
                      >
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Motivation */}
        <div className="card p-5">
          <h3 className="font-semibold text-foreground mb-2">چرا امروز می‌خوای ترید کنی؟</h3>
          <p className="text-xs text-muted-foreground mb-3">
            از سر برنامه و صبر، یا عجله و طمع؟
          </p>
          <textarea
            value={motivation}
            onChange={(e) => setMotivation(e.target.value)}
            rows={3}
            className="w-full bg-input border border-border rounded-md px-3 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-vertical"
            placeholder="بنویس..."
          />
        </div>
      </div>
    </div>
  );
}