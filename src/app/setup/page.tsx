import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import SetupPage from '@/components/SetupPage';

export default async function Setup() {
  const session = await getSession();
  
  if (!session) {
    redirect('/login');
  }

  return <SetupPage />;
}
