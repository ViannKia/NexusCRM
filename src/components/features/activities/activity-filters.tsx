// src/components/features/activities/activity-filters.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';

const filters = [
  { value: 'all', label: 'All' },
  { value: 'call', label: 'Calls' },
  { value: 'email', label: 'Emails' },
  { value: 'meeting', label: 'Meetings' },
  { value: 'task', label: 'Tasks' },
];

interface ActivityFiltersProps {
  currentFilter: string;
}

export default function ActivityFilters({ currentFilter }: ActivityFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleFilterChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value === 'all') {
      params.delete('type');
    } else {
      params.set('type', value);
    }
    router.push(`/activities?${params.toString()}`);
  };

  return (
    <div className="flex gap-2" role="group" aria-label="Filter activities by type">
      {filters.map((filter) => (
        <Button
          key={filter.value}
          variant={currentFilter === filter.value ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleFilterChange(filter.value)}
          aria-label={`Filter by ${filter.label}`}
          aria-pressed={currentFilter === filter.value}
        >
          {filter.label}
        </Button>
      ))}
    </div>
  );
}
