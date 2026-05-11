// src/app/(dashboard)/pipeline/page.tsx
import { createClient } from '@/lib/supabase/server';
import KanbanBoard from '@/components/features/pipeline/kanban-board';

async function getPipelineData() {
  const supabase = await createClient();

  // Fetch stages and deals in parallel
  const [stagesResult, dealsResult] = await Promise.all([
    supabase.from('pipeline_stages').select('*').order('order', { ascending: true }),
    supabase
      .from('deals')
      .select('*, contact:contacts(first_name, last_name), stage:pipeline_stages(*)')
      .is('deleted_at', null)
      .order('created_at', { ascending: false }),
  ]);

  return {
    stages: stagesResult.data || [],
    deals: dealsResult.data || [],
  };
}

export default async function PipelinePage() {
  const { stages, deals } = await getPipelineData();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold md:text-3xl">Sales Pipeline</h1>
      <KanbanBoard stages={stages} deals={deals} />
    </div>
  );
}
