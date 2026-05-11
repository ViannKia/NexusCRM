// src/actions/auth.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { ActionResponse } from '@/types/database';

/**
 * Login server action
 * IMPORTANT: redirect() must NOT be called inside try-catch
 */
export async function login(
  email: string,
  password: string
): Promise<ActionResponse> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Invalid email or password' };
  }

  // Revalidate and redirect OUTSIDE try-catch
  revalidatePath('/', 'layout');
  redirect('/');
}

/**
 * Logout server action
 * IMPORTANT: redirect() must NOT be called inside try-catch
 */
export async function logout() {
  const supabase = await createClient();
  
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    console.error('Logout error:', error);
  }
  
  // Revalidate and redirect OUTSIDE try-catch
  revalidatePath('/', 'layout');
  redirect('/login');
}
