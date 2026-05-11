'use server';

import { createClient } from '@/lib/supabase/server';
import { companyFormSchema, type CompanyFormSchema } from '@/lib/validations/company';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { ActionResponse, Company } from '@/types/database';

export async function createCompany(
  data: CompanyFormSchema
): Promise<ActionResponse<Company>> {
  try {
    const validated = companyFormSchema.parse(data);
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      redirect('/login');
    }

    const { data: company, error } = await supabase
      .from('companies')
      .insert(validated)
      .select()
      .single();

    if (error) {
      console.error('Create company error:', error);
      return { success: false, error: 'Failed to create company. Please try again.' };
    }

    revalidatePath('/companies');
    return { success: true, data: company };
  } catch (error) {
    console.error('Create company error:', error);
    return { success: false, error: 'Invalid input data. Please check your entries.' };
  }
}

export async function updateCompany(
  id: string,
  data: CompanyFormSchema
): Promise<ActionResponse<Company>> {
  try {
    const validated = companyFormSchema.parse(data);
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      redirect('/login');
    }

    const { data: company, error } = await supabase
      .from('companies')
      .update(validated)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Update company error:', error);
      return { success: false, error: 'Failed to update company. Please try again.' };
    }

    revalidatePath('/companies');
    revalidatePath(`/companies/${id}`);
    return { success: true, data: company };
  } catch (error) {
    console.error('Update company error:', error);
    return { success: false, error: 'Invalid input data. Please check your entries.' };
  }
}

export async function deleteCompany(id: string): Promise<ActionResponse> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      redirect('/login');
    }

    // Check if company still has active contacts
    const { count, error: countError } = await supabase
      .from('contacts')
      .select('id', { count: 'exact', head: true })
      .eq('company_id', id)
      .is('deleted_at', null);

    if (countError) {
      return { success: false, error: 'Failed to check company contacts.' };
    }

    if (count && count > 0) {
      return {
        success: false,
        error: `Cannot delete company: it still has ${count} active contact${count > 1 ? 's' : ''}. Please reassign or delete the contacts first.`,
      };
    }

    // Soft delete
    const { error } = await supabase
      .from('companies')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      console.error('Delete company error:', error);
      return { success: false, error: 'Failed to delete company. Please try again.' };
    }

    revalidatePath('/companies');
    return { success: true };
  } catch (error) {
    console.error('Delete company error:', error);
    return { success: false, error: 'Failed to delete company. Please try again.' };
  }
}
