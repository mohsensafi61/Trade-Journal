'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Profile } from '@/types';

export function useProfile(userId: string) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const fetchProfile = useCallback(async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      setError(error.message);
    } else {
      setProfile(data);
    }
    setLoading(false);
  }, [userId, supabase]);

  const updateProfile = async (updates: Partial<Profile>) => {
    const { data, error } = await supabase
      .from('profiles')
      .upsert({ ...updates, id: userId })
      .select()
      .single();

    if (error) {
      setError(error.message);
      return false;
    }
    setProfile(data);
    return true;
  };

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { profile, loading, error, updateProfile, refetch: fetchProfile };
}