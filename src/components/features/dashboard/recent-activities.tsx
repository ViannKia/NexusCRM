import { Phone, Mail, Calendar, CheckSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ActivityWithRelations } from '@/types/database';

const activityIcons = {
  call: Phone,
  email: Mail,
  meeting: Calendar,
  task: CheckSquare,
};

interface RecentActivitiesProps {
  activities: ActivityWithRelations[];
}

export default function RecentActivities({ activities }: RecentActivitiesProps) {
  if (activities.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No recent activities
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => {
        const Icon = activityIcons[activity.type];
        const isCompleted = !!activity.completed_at;

        return (
          <div
            key={activity.id}
            className={cn(
              'flex items-start gap-4 pb-4 border-b last:border-b-0',
              isCompleted && 'opacity-60'
            )}
          >
            <div
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-full flex-shrink-0',
                isCompleted ? 'bg-green-100' : 'bg-blue-100'
              )}
            >
              <Icon
                className={cn(
                  'h-5 w-5',
                  isCompleted ? 'text-green-600' : 'text-blue-600'
                )}
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4
                  className={cn(
                    'font-medium text-sm',
                    isCompleted && 'line-through'
                  )}
                >
                  {activity.subject}
                </h4>
                <span className="text-xs uppercase text-gray-500">
                  {activity.type}
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-600">
                {activity.contact.first_name} {activity.contact.last_name}
                {activity.deal && ` • ${activity.deal.title}`}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                {new Date(activity.due_date).toLocaleString()}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
