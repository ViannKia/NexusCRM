import { createClient } from '@/lib/supabase/server';
import ContactTable from '@/components/features/contacts/contact-table';
import ContactSearch from '@/components/features/contacts/contact-search';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus } from 'lucide-react';

interface ContactsPageProps {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export default async function ContactsPage({ searchParams }: ContactsPageProps) {
  const params = await searchParams;
  const query = params.q || '';
  const page = parseInt(params.page || '1', 10);
  const pageSize = 20;

  const supabase = await createClient();

  // Build query
  let queryBuilder = supabase
    .from('contacts')
    .select('*, company:companies(*)', { count: 'exact' })
    .is('deleted_at', null);

  // Apply search filter
  if (query) {
    queryBuilder = queryBuilder.or(
      `first_name.ilike.%${query}%,last_name.ilike.%${query}%,email.ilike.%${query}%`
    );
  }

  // Apply pagination
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data: contacts, count, error } = await queryBuilder
    .range(from, to)
    .order('created_at', { ascending: false });

  const totalPages = count ? Math.ceil(count / pageSize) : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold md:text-3xl">Contacts</h1>
        <Link href="/contacts/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Contact
          </Button>
        </Link>
      </div>

      <ContactSearch defaultValue={query} />

      {error ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-destructive">
          Failed to load contacts: {error.message}
        </div>
      ) : (
        <ContactTable
          contacts={contacts || []}
          currentPage={page}
          totalPages={totalPages}
        />
      )}
    </div>
  );
}
