import { Skeleton } from '@/components/ui/skeleton';

export default function ContactsLoading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-9 w-36" />
      </div>

      {/* Search bar */}
      <Skeleton className="h-10 w-full" />

      {/* Table */}
      <div className="overflow-hidden rounded-lg border bg-white">
        {/* Table header */}
        <div className="grid grid-cols-7 gap-4 border-b bg-gray-50 px-4 py-3">
          {['w-20', 'w-20', 'w-32', 'w-24', 'w-16', 'w-28', 'w-16'].map((w, i) => (
            <Skeleton key={i} className={`h-4 ${w}`} />
          ))}
        </div>

        {/* Table rows */}
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div
            key={i}
            className="grid grid-cols-7 items-center gap-4 border-b px-4 py-3 last:border-b-0"
          >
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-4 w-28" />
            <div className="flex justify-end gap-2">
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2">
        <Skeleton className="h-9 w-20 rounded-md" />
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-9 w-9 rounded-md" />
        ))}
        <Skeleton className="h-9 w-20 rounded-md" />
      </div>
    </div>
  );
}
