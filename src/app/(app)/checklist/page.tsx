import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ChecklistClient } from './ChecklistClient';

export default async function ChecklistPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  return <ChecklistClient userId={user.id} />;
}