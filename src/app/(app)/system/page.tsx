import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { SystemClient } from './SystemClient';

export default async function SystemPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  return <SystemClient userId={user.id} />;
}