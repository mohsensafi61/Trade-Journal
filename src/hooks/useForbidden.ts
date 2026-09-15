'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { ForbiddenItem } from '@/types';

export function useForbidden(userId: string) {
  const [forbidden, setForbidden] = useState<ForbiddenItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const fetchForbidden = useCallback(async () => {
    const { data, error } = await supabase
      .from('forbidden_items')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setForbidden(data || []);
    }
    setLoading(false);
  }, [userId]);

  const addItem = async (text: string) => {
    const { data, error } = await supabase
      .from('forbidden_items')
      .insert({ user_id: userId, text })
      .select()
      .single();

    if (error) {
      setError(error.message);
      return null;
    }
    setForbidden((prev) => [data, ...prev]);
    return data;
  };

  const deleteItem = async (id: string) => {
    const { error } = await supabase
      .from('forbidden_items')
      .delete()
      .eq('id', id);

    if (error) {
      setError(error.message);
      return false;
    }
    setForbidden((prev) => prev.filter((item) => item.id !== id));
    return true;
  };

  useEffect(() => {
    fetchForbidden();
  }, [fetchForbidden]);

  return { forbidden, loading, error, addItem, deleteItem, refetch: fetchForbidden };
}