// src/actions/activities.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { activityFormSchema, type ActivityFormSchema } from '@/lib/validations/activity';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { ActionResponse, Activity } from '@/types/database';

export async function createActivity(
  data: ActivityFormSchema
): Promise<ActionResponse<Activity>> {
  try {
    const validated = activityFormSchema.parse(data);
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('Authentication error in createActivity:', authError);
      redirect('/login');
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: activity, error } = await (supabase as any)
      .from('activities')
      .insert({
        type: validated.type,
        subject: validated.subject,
        description: validated.description ?? null,
        due_date: validated.due_date,
        contact_id: validated.contact_id,
        deal_id: validated.deal_id ?? null,
        created_by: user.id,
      })
      .select()
      .single();

    if (error) {
      console.error('Create activity error:', error);
      return { success: false, error: 'Failed to create activity. Please try again.' };
    }

    revalidatePath('/activities');

    return { success: true, data: activity as Activity };
  } catch (error) {
    console.error('Create activity error:', error);
    return { success: false, error: 'Invalid input data. Please check your entries.' };
  }
}

export async function completeActivity(id: string): Promise<ActionResponse> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('Authentication error in completeActivity:', authError);
      redirect('/login');
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('activities')
      .update({ completed_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      console.error('Complete activity error:', error);
      return { success: false, error: 'Failed to complete activity. Please try again.' };
    }

    revalidatePath('/activities');

    return { success: true };
  } catch (error) {
    console.error('Complete activity error:', error);
    return { success: false, error: 'Failed to complete activity. Please try again.' };
  }
}
