'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Checklist } from '@/types';
import { todayStr } from '@/lib/utils';

export function useChecklist(userId: string) {
  const [checklist, setChecklist] = useState<Checklist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const fetchChecklist = useCallback(async () => {
    const { data, error } = await supabase
      .from('checklists')
      .select('*')
      .eq('user_id', userId)
      .eq('checklist_date', todayStr())
      .single();

    if (error && error.code !== 'PGRST116') {
      setError(error.message);
    } else {
      setChecklist(data);
    }
    setLoading(false);
  }, [userId]);

  const upsertChecklist = async (checks: Record<string, boolean>, motivation: string) => {
    const { data, error } = await supabase
      .from('checklists')
      .upsert(
        {
          user_id: userId,
          checklist_date: todayStr(),
          checks,
          motivation,
        },
        { onConflict: 'user_id,checklist_date' }
      )
      .select()
      .single();

    if (error) {
      setError(error.message);
      return false;
    }
    setChecklist(data);
    return true;
  };

  useEffect(() => {
    fetchChecklist();
  }, [fetchChecklist]);

  return { checklist, loading, error, upsertChecklist, refetch: fetchChecklist };
}