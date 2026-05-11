// src/components/features/activities/activity-item.tsx
'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ConfirmDialog from '@/components/ui/confirm-dialog';
import { completeActivity } from '@/actions/activities';
import { useRouter } from 'next/navigation';
import { Check, Phone, Mail, Calendar, CheckSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ActivityWithRelations } from '@/types/database';

const activityIcons = {
  call: Phone,
  email: Mail,
  meeting: Calendar,
  task: CheckSquare,
};

interface ActivityItemProps {
  activity: ActivityWithRelations;
}

export default function ActivityItem({ activity }: ActivityItemProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  const Icon = activityIcons[activity.type];
  const isCompleted = !!activity.completed_at;
  const isPastDue = new Date(activity.due_date) < new Date() && !isCompleted;

  const handleConfirmComplete = async () => {
    setIsCompleting(true);
    const result = await completeActivity(activity.id);
    if (result.success) {
      setOpen(false);
      router.refresh();
    } else {
      setIsCompleting(false);
    }
  };

  return (
    <>
      <Card className={cn(isCompleted && 'opacity-60')}>
        <CardContent className="flex items-center gap-4 p-4">
          <div
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-full',
              isCompleted ? 'bg-green-100 dark:bg-green-900/30' : 'bg-primary/10'
            )}
          >
            <Icon className={cn('h-5 w-5', isCompleted ? 'text-green-600' : 'text-primary')} />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className={cn('font-medium', isCompleted && 'line-through')}>
                {activity.subject}
              </h4>
              <span className="text-xs uppercase text-muted-foreground">{activity.type}</span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {activity.contact.first_name} {activity.contact.last_name}
              {activity.deal && ` • ${activity.deal.title}`}
            </p>
            <p
              className={cn(
                'mt-1 text-xs',
                isPastDue ? 'text-destructive' : 'text-muted-foreground'
              )}
            >
              Due: {new Date(activity.due_date).toLocaleString()}
            </p>
          </div>

          {!isCompleted && (
            <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
              <Check className="mr-2 h-4 w-4" />
              Complete
            </Button>
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Complete Activity"
        description={`Mark "${activity.subject}" as completed? This cannot be undone.`}
        confirmLabel="Mark Complete"
        variant="default"
        loading={isCompleting}
        onConfirm={handleConfirmComplete}
      />
    </>
  );
}
