import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getUserBySessionToken } from '@/lib/queries/auth';
import DashboardClient from './dashboard-client';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('session')?.value;

  if (!token) redirect('/');

  const user = await getUserBySessionToken(token);
  if (!user) redirect('/');

  return <DashboardClient user={user} />;
}
