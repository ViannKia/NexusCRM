// src/app/(dashboard)/activities/new/page.tsx
import { createClient } from '@/lib/supabase/server';
import ActivityForm from '@/components/features/activities/activity-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function NewActivityPage() {
  const supabase = await createClient();

  // Fetch contacts and deals for select options
  const [contactsResult, dealsResult] = await Promise.all([
    supabase
      .from('contacts')
      .select('*')
      .is('deleted_at', null)
      .order('first_name', { ascending: true }),
    supabase
      .from('deals')
      .select('*')
      .is('deleted_at', null)
      .order('title', { ascending: true }),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Create Activity</h1>

      <Card>
        <CardHeader>
          <CardTitle>Activity Details</CardTitle>
        </CardHeader>
        <CardContent>
          <ActivityForm
            contacts={contactsResult.data || []}
            deals={dealsResult.data || []}
          />
        </CardContent>
      </Card>
    </div>
  );
}
