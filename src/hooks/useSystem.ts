'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { TradingSystem } from '@/types';

export function useSystem(userId: string) {
  const [system, setSystem] = useState<TradingSystem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const fetchSystem = useCallback(async () => {
    const { data, error } = await supabase
      .from('trading_systems')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      setError(error.message);
    } else {
      setSystem(data);
    }
    setLoading(false);
  }, [userId]);

  const upsertSystem = async (updates: Partial<TradingSystem>) => {
    const { data, error } = await supabase
      .from('trading_systems')
      .upsert(
        { ...updates, user_id: userId },
        { onConflict: 'user_id' }
      )
      .select()
      .single();

    if (error) {
      setError(error.message);
      return false;
    }
    setSystem(data);
    return true;
  };

  useEffect(() => {
    fetchSystem();
  }, [fetchSystem]);

  return { system, loading, error, upsertSystem, refetch: fetchSystem };
}