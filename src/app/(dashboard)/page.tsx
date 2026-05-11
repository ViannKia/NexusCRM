import { createClient } from '@/lib/supabase/server';
import MetricCard from '@/components/features/dashboard/metric-card';
import PipelineChart from '@/components/features/dashboard/pipeline-chart';
import RecentActivities from '@/components/features/dashboard/recent-activities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ActivityWithRelations } from '@/types/database';

async function getDashboardMetrics() {
  const supabase = await createClient();

  // Fetch all metrics in parallel
  const [dealsResult, contactsResult, companiesResult, pipelineResult, activitiesResult] =
    await Promise.all([
      supabase.from('deals').select('id', { count: 'exact', head: true }).is('deleted_at', null),
      supabase.from('contacts').select('id', { count: 'exact', head: true }).is('deleted_at', null),
      supabase.from('companies').select('id', { count: 'exact', head: true }).is('deleted_at', null),
      supabase
        .from('deals')
        .select('stage_id, pipeline_stages(name, color)')
        .is('deleted_at', null),
      supabase
        .from('activities')
        .select('*, contact:contacts(first_name, last_name), deal:deals(title)')
        .is('deleted_at', null)
        .order('created_at', { ascending: false })
        .limit(5),
    ]);

  // Process pipeline funnel - group deals by stage
  const pipelineFunnel = pipelineResult.data?.reduce((acc, deal: any) => {
    const stage = deal.pipeline_stages;
    if (!stage) return acc;

    const existing = acc.find((item) => item.stage === stage.name);
    if (existing) {
      existing.count++;
    } else {
      acc.push({ stage: stage.name, count: 1, color: stage.color });
    }
    return acc;
  }, [] as Array<{ stage: string; count: number; color: string }>);

  return {
    totalDeals: dealsResult.count || 0,
    totalContacts: contactsResult.count || 0,
    totalCompanies: companiesResult.count || 0,
    pipelineFunnel: pipelineFunnel || [],
    recentActivities: (activitiesResult.data || []) as ActivityWithRelations[],
  };
}

export default async function DashboardPage() {
  const metrics = await getDashboardMetrics();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold md:text-3xl">Dashboard</h1>

      {/* Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard title="Total Deals" value={metrics.totalDeals} />
        <MetricCard title="Total Contacts" value={metrics.totalContacts} />
        <MetricCard title="Total Companies" value={metrics.totalCompanies} />
      </div>

      {/* Pipeline Funnel */}
      <Card>
        <CardHeader>
          <CardTitle>Pipeline Funnel</CardTitle>
        </CardHeader>
        <CardContent>
          <PipelineChart data={metrics.pipelineFunnel} />
        </CardContent>
      </Card>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <RecentActivities activities={metrics.recentActivities} />
        </CardContent>
      </Card>
    </div>
  );
}
