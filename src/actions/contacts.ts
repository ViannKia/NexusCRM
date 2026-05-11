// src/actions/contacts.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { contactFormSchema, type ContactFormSchema } from '@/lib/validations/contact';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { ActionResponse, Contact } from '@/types/database';

export async function createContact(
  data: ContactFormSchema
): Promise<ActionResponse<Contact>> {
  try {
    // Validate input
    const validated = contactFormSchema.parse(data);

    // Get authenticated user
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('Authentication error in createContact:', authError);
      redirect('/login');
    }

    // Insert contact
    const { data: contact, error } = await supabase
      .from('contacts')
      .insert(validated)
      .select()
      .single();

    if (error) {
      console.error('Create contact error:', error);
      return { success: false, error: 'Failed to create contact. Please try again.' };
    }

    // Revalidate contacts page
    revalidatePath('/contacts');

    return { success: true, data: contact };
  } catch (error) {
    console.error('Create contact error:', error);
    return { success: false, error: 'Invalid input data. Please check your entries.' };
  }
}

export async function updateContact(
  id: string,
  data: ContactFormSchema
): Promise<ActionResponse<Contact>> {
  try {
    const validated = contactFormSchema.parse(data);
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('Authentication error in updateContact:', authError);
      redirect('/login');
    }

    const { data: contact, error } = await supabase
      .from('contacts')
      .update(validated)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Update contact error:', error);
      return { success: false, error: 'Failed to update contact. Please try again.' };
    }

    revalidatePath('/contacts');
    revalidatePath(`/contacts/${id}`);

    return { success: true, data: contact };
  } catch (error) {
    console.error('Update contact error:', error);
    return { success: false, error: 'Invalid input data. Please check your entries.' };
  }
}

export async function deleteContact(id: string): Promise<ActionResponse> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('Authentication error in deleteContact:', authError);
      redirect('/login');
    }

    // Soft delete by setting deleted_at
    const { error } = await supabase
      .from('contacts')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      console.error('Delete contact error:', error);
      return { success: false, error: 'Failed to delete contact. Please try again.' };
    }

    revalidatePath('/contacts');

    return { success: true };
  } catch (error) {
    console.error('Delete contact error:', error);
    return { success: false, error: 'Failed to delete contact. Please try again.' };
  }
}

export async function searchContacts(query: string, page: number = 1) {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('Authentication error in searchContacts:', authError);
      redirect('/login');
    }

    const pageSize = 20;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await supabase
      .from('contacts')
      .select('*, company:companies(*)', { count: 'exact' })
      .is('deleted_at', null)
      .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,email.ilike.%${query}%`)
      .range(from, to)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Search contacts error:', error);
      return { data: [], count: 0, error: 'Failed to search contacts. Please try again.' };
    }

    return { data, count, error: null };
  } catch (error) {
    console.error('Search contacts error:', error);
    return { data: [], count: 0, error: 'Failed to search contacts. Please try again.' };
  }
}
