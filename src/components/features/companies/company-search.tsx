'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Search, Loader2 } from 'lucide-react';
import { useDebouncedCallback } from 'use-debounce';
import { useTransition } from 'react';

interface CompanySearchProps {
  defaultValue?: string;
}

export default function CompanySearch({ defaultValue = '' }: CompanySearchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleSearch = useDebouncedCallback((value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set('q', value);
    } else {
      params.delete('q');
    }
    params.delete('page');
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  }, 400);

  return (
    <div className="space-y-1">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-10 pr-10"
          placeholder="Search companies..."
          defaultValue={defaultValue}
          onChange={(e) => handleSearch(e.target.value)}
        />
        {isPending && (
          <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
        )}
      </div>
      {/* Loading bar */}
      <div className="h-0.5 w-full overflow-hidden rounded-full bg-transparent">
        {isPending && (
          <div className="h-full animate-[search-progress_1s_ease-in-out_infinite] bg-primary" />
        )}
      </div>
    </div>
  );
}
