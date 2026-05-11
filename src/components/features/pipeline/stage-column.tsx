// src/components/features/pipeline/stage-column.tsx
'use client';

import { useDroppable } from '@dnd-kit/core';
import DealCard from './deal-card';
import { cn } from '@/lib/utils';
import type { PipelineStage, DealWithRelations } from '@/types/database';

interface StageColumnProps {
  stage: PipelineStage;
  deals: DealWithRelations[];
}

export default function StageColumn({ stage, deals }: StageColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: stage.id,
  });

  const totalValue = deals.reduce((sum, deal) => sum + Number(deal.value), 0);

  return (
    <div
      className="flex min-w-[320px] flex-col rounded-lg border bg-gray-50"
      style={{ borderTopWidth: '4px', borderTopColor: stage.color }}
    >
      <div className="border-b p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{stage.name}</h3>
          <span className="text-sm text-gray-500">{deals.length}</span>
        </div>
        <p className="mt-1 text-sm text-gray-600">
          ${totalValue.toLocaleString()}
        </p>
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          'flex-1 space-y-3 p-4',
          isOver && 'bg-blue-50'
        )}
      >
        {deals.map((deal) => (
          <DealCard key={deal.id} deal={deal} />
        ))}
        {deals.length === 0 && (
          <p className="text-center text-sm text-gray-400">No deals</p>
        )}
      </div>
    </div>
  );
}
