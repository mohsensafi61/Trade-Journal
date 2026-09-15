'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { SystemLog } from '@/types';

export function useSystemLogs(userId: string) {
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const fetchLogs = useCallback(async () => {
    const { data, error } = await supabase
      .from('system_logs')
      .select('*')
      .eq('user_id', userId)
      .order('log_date', { ascending: false })
      .limit(12);

    if (error) {
      setError(error.message);
    } else {
      setLogs(data || []);
    }
    setLoading(false);
  }, [userId]);

  const addLog = async (log: Omit<SystemLog, 'id' | 'user_id' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('system_logs')
      .insert({ ...log, user_id: userId })
      .select()
      .single();

    if (error) {
      setError(error.message);
      return null;
    }
    setLogs((prev) => [data, ...prev]);
    return data;
  };

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return { logs, loading, error, addLog, refetch: fetchLogs };
}