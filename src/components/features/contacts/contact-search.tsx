'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Search, Loader2 } from 'lucide-react';
import { useDebouncedCallback } from 'use-debounce';
import { useTransition } from 'react';

interface ContactSearchProps {
  defaultValue?: string;
}

export default function ContactSearch({ defaultValue = '' }: ContactSearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('q', term);
      params.set('page', '1');
    } else {
      params.delete('q');
    }
    startTransition(() => {
      router.push(`/contacts?${params.toString()}`);
    });
  }, 400);

  return (
    <div className="space-y-1">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search contacts by name or email..."
          defaultValue={defaultValue}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10 pr-10"
          aria-label="Search contacts by name or email"
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
