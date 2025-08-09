'use server';

import { login } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function loginAction(email: string, password: string) {
  const result = await login(email, password);
  
  if (result.success) {
    return { success: true };
  }
  
  return { success: false, error: result.error };
}

export async function loginAndRedirect(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  
  const result = await login(email, password);
  
  if (result.success) {
    redirect('/dashboard');
  }
  
  return result;
}
