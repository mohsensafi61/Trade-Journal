'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { JournalEntry } from '@/types';

export function useJournal(userId: string) {
  const [journal, setJournal] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const fetchJournal = useCallback(async () => {
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setJournal(data || []);
    }
    setLoading(false);
  }, [userId]);

  const addEntry = async (entry: Omit<JournalEntry, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('journal_entries')
      .insert({ ...entry, user_id: userId })
      .select()
      .single();

    if (error) {
      console.error('[useJournal] addEntry error:', error.message, error.code, error.details, error.hint);
      setError(error.message);
      return null;
    }
    setJournal((prev) => [data, ...prev]);
    return data;
  };

  const updateEntry = async (id: string, updates: Partial<JournalEntry>) => {
    const { data, error } = await supabase
      .from('journal_entries')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[useJournal] updateEntry error:', error.message, error.code, error.details, error.hint);
      setError(error.message);
      return null;
    }
    setJournal((prev) => prev.map((e) => (e.id === id ? data : e)));
    return data;
  };

  const deleteEntry = async (id: string) => {
    const { error } = await supabase
      .from('journal_entries')
      .delete()
      .eq('id', id);

    if (error) {
      setError(error.message);
      return false;
    }
    setJournal((prev) => prev.filter((e) => e.id !== id));
    return true;
  };

  useEffect(() => {
    fetchJournal();
  }, [fetchJournal]);

  return { journal, loading, error, addEntry, updateEntry, deleteEntry, refetch: fetchJournal };
}