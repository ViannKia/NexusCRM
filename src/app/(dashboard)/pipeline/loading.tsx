import { Skeleton } from '@/components/ui/skeleton';

export default function PipelineLoading() {
  // Simulate 3 stages with varying number of deal cards
  const stages = [3, 2, 4];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Skeleton className="h-9 w-32" />

      {/* Kanban columns */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {stages.map((cardCount, i) => (
          <div
            key={i}
            className="flex min-w-[280px] flex-col rounded-lg border bg-gray-50"
          >
            {/* Column header */}
            <div className="border-b p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-3 w-3 rounded-full" />
                  <Skeleton className="h-5 w-24" />
                </div>
                <Skeleton className="h-5 w-6 rounded-full" />
              </div>
              <Skeleton className="mt-2 h-4 w-20" />
            </div>

            {/* Deal cards */}
            <div className="flex-1 space-y-3 p-3">
              {Array.from({ length: cardCount }).map((_, j) => (
                <div key={j} className="rounded-lg border bg-white p-4 space-y-2">
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-3.5 w-28" />
                  <Skeleton className="h-3 w-32" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
