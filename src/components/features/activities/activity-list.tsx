// src/components/features/activities/activity-list.tsx
import ActivityItem from './activity-item';
import type { ActivityWithRelations } from '@/types/database';

interface ActivityListProps {
  activities: ActivityWithRelations[];
}

export default function ActivityList({ activities }: ActivityListProps) {
  if (activities.length === 0) {
    return (
      <div className="rounded-lg border bg-white p-8 text-center text-gray-500">
        No activities found
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {activities.map((activity) => (
        <ActivityItem key={activity.id} activity={activity} />
      ))}
    </div>
  );
}
