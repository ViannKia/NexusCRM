// src/actions/deals.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { dealFormSchema, type DealFormSchema } from '@/lib/validations/deal';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { ActionResponse, Deal } from '@/types/database';

export async function updateDealStage(
  dealId: string,
  stageId: string
): Promise<ActionResponse> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('Authentication error in updateDealStage:', authError);
      redirect('/login');
    }

    const { error } = await supabase
      .from('deals')
      .update({ stage_id: stageId })
      .eq('id', dealId);

    if (error) {
      console.error('Update deal stage error:', error);
      return { success: false, error: 'Failed to update deal stage. Please try again.' };
    }

    revalidatePath('/pipeline');

    return { success: true };
  } catch (error) {
    console.error('Update deal stage error:', error);
    return { success: false, error: 'Failed to update deal stage. Please try again.' };
  }
}

export async function createDeal(
  data: DealFormSchema
): Promise<ActionResponse<Deal>> {
  try {
    const validated = dealFormSchema.parse(data);
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('Authentication error in createDeal:', authError);
      redirect('/login');
    }

    const { data: deal, error } = await supabase
      .from('deals')
      .insert(validated)
      .select()
      .single();

    if (error) {
      console.error('Create deal error:', error);
      return { success: false, error: 'Failed to create deal. Please try again.' };
    }

    revalidatePath('/pipeline');

    return { success: true, data: deal };
  } catch (error) {
    console.error('Create deal error:', error);
    return { success: false, error: 'Invalid input data. Please check your entries.' };
  }
}
