'use client';

import { useState } from 'react';
import { useForbidden } from '@/hooks/useForbidden';
import { SEED_FORBIDDEN } from '@/lib/constants';
import { Ban, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export function ForbiddenClient({ userId }: { userId: string }) {
  const { forbidden, addItem, deleteItem, loading } = useForbidden(userId);
  const [input, setInput] = useState('');
  const [adding, setAdding] = useState(false);

  const handleAdd = async () => {
    if (!input.trim()) return;
    setAdding(true);
    const result = await addItem(input.trim());
    if (result) {
      setInput('');
      toast('افزوده شد');
    } else {
      toast.error('خطا در افزودن');
    }
    setAdding(false);
  };

  const handleDelete = async (id: string) => {
    const ok = await deleteItem(id);
    if (ok) toast('حذف شد');
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
          <Ban className="size-6" />
          کارهای ممنوع
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          لیست کارهایی که خودت تصمیم گرفتی هیچ‌وقت انجامشون ندی — مستقل از
          این‌که در لحظه چه حسی داری.
        </p>
      </div>

      <div className="card p-5">
        {/* Add form */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="مثلا: جابه‌جا کردن استاپ‌لاس بعد از ورود"
            className="flex-1 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-[14px] px-4 py-2.5 text-white placeholder:text-[#5c6b64] focus:outline-none focus:border-[rgba(60,255,122,0.4)] focus:shadow-[0_0_0_3px_rgba(60,255,122,0.1)] text-sm transition-all"
            disabled={adding}
          />
          <button
            onClick={handleAdd}
            disabled={adding || !input.trim()}
            className="px-4 py-2.5 bg-[#3cff7a] text-[#06180d] font-bold rounded-[14px] hover:shadow-[0_0_16px_rgba(60,255,122,0.4)] disabled:opacity-40 flex items-center gap-2 text-sm transition-all duration-200"
          >
            <Plus className="size-4" />
            افزودن
          </button>
        </div>

        {/* Seed items */}
        {forbidden.length === 0 && (
          <div className="mb-4">
            <p className="text-xs text-muted-foreground mb-2">افزودن سریع (اختیاری):</p>
            <div className="flex flex-wrap gap-2">
              {SEED_FORBIDDEN.map((text) => (
                <button
                  key={text}
                  onClick={() => setInput(text)}
                  className="px-3 py-1.5 text-xs text-[#5c6b64] bg-transparent border border-dashed border-[rgba(255,255,255,0.1)] rounded-[999px] hover:text-[#94a39c] hover:border-[rgba(60,255,122,0.3)] transition-all duration-200"
                >
                  + {text}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* List */}
        {forbidden.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            <Ban className="size-12 mx-auto mb-2 opacity-50" />
            هنوز چیزی اضافه نکردی.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {forbidden.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 py-3 px-1"
              >
                <span className="text-red font-mono text-sm">✕</span>
                <span className="flex-1 text-sm text-foreground">{item.text}</span>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-red transition-colors"
                  title="حذف"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}