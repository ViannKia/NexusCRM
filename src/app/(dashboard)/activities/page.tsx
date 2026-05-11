// src/app/(dashboard)/activities/page.tsx
import { createClient } from '@/lib/supabase/server';
import ActivityList from '@/components/features/activities/activity-list';
import ActivityFilters from '@/components/features/activities/activity-filters';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus } from 'lucide-react';

interface ActivitiesPageProps {
  searchParams: Promise<{ type?: string }>;
}

export default async function ActivitiesPage({ searchParams }: ActivitiesPageProps) {
  const params = await searchParams;
  const typeFilter = params.type;

  const supabase = await createClient();

  // Build query
  let queryBuilder = supabase
    .from('activities')
    .select('*, contact:contacts(first_name, last_name), deal:deals(title)')
    .is('deleted_at', null);

  // Apply type filter
  if (typeFilter && typeFilter !== 'all') {
    const validTypes = ['call', 'email', 'meeting', 'task'] as const;
    if (validTypes.includes(typeFilter as any)) {
      queryBuilder = queryBuilder.eq('type', typeFilter as 'call' | 'email' | 'meeting' | 'task');
    }
  }

  const { data: activities, error } = await queryBuilder
    .order('due_date', { ascending: true });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold md:text-3xl">Activities</h1>
        <Link href="/activities/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Activity
          </Button>
        </Link>
      </div>

      <ActivityFilters currentFilter={typeFilter || 'all'} />

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
          Failed to load activities: {error.message}
        </div>
      ) : (
        <ActivityList activities={activities as any || []} />
      )}
    </div>
  );
}
