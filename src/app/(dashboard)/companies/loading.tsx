import { Skeleton } from '@/components/ui/skeleton';

export default function CompaniesLoading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-9 w-36" />
        <Skeleton className="h-9 w-40" />
      </div>

      <Skeleton className="h-10 w-full" />

      <div className="overflow-hidden rounded-lg border bg-white">
        <div className="grid grid-cols-6 gap-4 border-b bg-gray-50 px-4 py-3">
          {['w-28', 'w-24', 'w-24', 'w-16', 'w-28', 'w-16'].map((w, i) => (
            <Skeleton key={i} className={`h-4 ${w}`} />
          ))}
        </div>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
          <div key={i} className="grid grid-cols-6 items-center gap-4 border-b px-4 py-3 last:border-b-0">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="ml-auto h-4 w-6" />
            <Skeleton className="ml-auto h-4 w-20" />
            <div className="flex justify-end gap-2">
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
