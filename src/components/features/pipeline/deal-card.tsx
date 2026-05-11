// src/components/features/pipeline/deal-card.tsx
'use client';

import { useDraggable } from '@dnd-kit/core';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { DealWithRelations } from '@/types/database';

interface DealCardProps {
  deal: DealWithRelations;
  isDragging?: boolean;
}

export default function DealCard({ deal, isDragging = false }: DealCardProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: deal.id,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        'cursor-grab active:cursor-grabbing',
        isDragging && 'opacity-50'
      )}
    >
      <CardContent className="p-4">
        <h4 className="font-medium">{deal.title}</h4>
        <p className="mt-1 text-lg font-semibold text-green-600">
          ${Number(deal.value).toLocaleString()}
        </p>
        <p className="mt-2 text-sm text-gray-600">
          {deal.contact.first_name} {deal.contact.last_name}
        </p>
        {deal.expected_close_date && (
          <p className="mt-1 text-xs text-gray-500">
            Close: {new Date(deal.expected_close_date).toLocaleDateString()}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
