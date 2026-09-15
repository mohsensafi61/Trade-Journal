import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ForbiddenClient } from './ForbiddenClient';

export default async function ForbiddenPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  return <ForbiddenClient userId={user.id} />;
}