// src/components/features/pipeline/kanban-board.tsx
'use client';

import { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import StageColumn from './stage-column';
import DealCard from './deal-card';
import { updateDealStage } from '@/actions/deals';
import { useRouter } from 'next/navigation';
import type { PipelineStage, DealWithRelations } from '@/types/database';

interface KanbanBoardProps {
  stages: PipelineStage[];
  deals: DealWithRelations[];
}

export default function KanbanBoard({ stages, deals }: KanbanBoardProps) {
  const [activeDeal, setActiveDeal] = useState<DealWithRelations | null>(null);
  const router = useRouter();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const deal = deals.find((d) => d.id === event.active.id);
    setActiveDeal(deal || null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      setActiveDeal(null);
      return;
    }

    const dealId = active.id as string;
    const newStageId = over.id as string;

    // Call server action to update deal stage
    const result = await updateDealStage(dealId, newStageId);

    if (result.success) {
      router.refresh();
    } else {
      // Show error - could use toast notification here
      console.error('Failed to update deal stage:', result.error);
    }

    setActiveDeal(null);
  };

  // Group deals by stage_id
  const dealsByStage = stages.reduce((acc, stage) => {
    acc[stage.id] = deals.filter((deal) => deal.stage_id === stage.id);
    return acc;
  }, {} as Record<string, DealWithRelations[]>);

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {stages.map((stage) => (
          <StageColumn
            key={stage.id}
            stage={stage}
            deals={dealsByStage[stage.id] || []}
          />
        ))}
      </div>

      <DragOverlay>
        {activeDeal ? <DealCard deal={activeDeal} isDragging /> : null}
      </DragOverlay>
    </DndContext>
  );
}
