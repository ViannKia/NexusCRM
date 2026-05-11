import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import CompanySearch from '@/components/features/companies/company-search';
import CompanyListHeader from '@/components/features/companies/company-list-header';
import CompanyTableActions from '@/components/features/companies/company-table-actions';
import CompanyPagination from '@/components/features/companies/company-pagination';

interface CompaniesPageProps {
  searchParams: Promise<{ q?: string; page?: string }>;
}

const PAGE_SIZE = 10;

export default async function CompaniesPage({ searchParams }: CompaniesPageProps) {
  const params = await searchParams;
  const query = params.q || '';
  const page = Math.max(1, parseInt(params.page || '1', 10));

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Fetch profiles for assign select
  const { data: users } = await supabase
    .from('profiles')
    .select('*')
    .order('full_name', { ascending: true });

  // Fetch companies with profile join
  let queryBuilder = supabase
    .from('companies')
    .select('*, profile:profiles!assigned_to(id, full_name, role, avatar_url, created_at, updated_at)', {
      count: 'exact',
    })
    .is('deleted_at', null);

  if (query) {
    queryBuilder = queryBuilder.ilike('name', `%${query}%`);
  }

  const from = (page - 1) * PAGE_SIZE;
  const { data: companies, count, error } = await queryBuilder
    .range(from, from + PAGE_SIZE - 1)
    .order('name', { ascending: true });

  const totalPages = count ? Math.ceil(count / PAGE_SIZE) : 0;

  // Fetch contact counts per company
  const companyIds = (companies || []).map((c) => c.id);
  const contactCountMap: Record<string, number> = {};
  const dealValueMap: Record<string, number> = {};

  if (companyIds.length > 0) {
    const { data: contactCounts } = await supabase
      .from('contacts')
      .select('company_id')
      .in('company_id', companyIds)
      .is('deleted_at', null);

    (contactCounts || []).forEach((c) => {
      contactCountMap[c.company_id] = (contactCountMap[c.company_id] || 0) + 1;
    });

    // Fetch deals value via contacts
    const { data: deals } = await supabase
      .from('deals')
      .select('value, contact:contacts!contact_id(company_id)')
      .is('deleted_at', null);

    (deals || []).forEach((d: any) => {
      const cid = d.contact?.company_id;
      if (cid && companyIds.includes(cid)) {
        dealValueMap[cid] = (dealValueMap[cid] || 0) + Number(d.value);
      }
    });
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold md:text-3xl">Companies</h1>
        <CompanyListHeader users={users || []} />
      </div>

      {/* Search */}
      <CompanySearch defaultValue={query} />

      {/* Table */}
      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
          Failed to load companies: {error.message}
        </div>
      ) : !companies || companies.length === 0 ? (
        <div className="rounded-lg border bg-white p-8 text-center text-gray-500">
          {query ? `No companies found for "${query}"` : 'No companies yet'}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Industry</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Contacts</TableHead>
                <TableHead>Total Deals Value</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {companies.map((company) => (
                <TableRow key={company.id}>
                  <TableCell className="font-medium">
                    <Link
                      href={`/companies/${company.id}`}
                      className="text-primary hover:underline"
                    >
                      {company.name}
                    </Link>
                  </TableCell>
                  <TableCell>{company.industry || '—'}</TableCell>
                  <TableCell>{(company.profile as any)?.full_name || '—'}</TableCell>
                  <TableCell>
                    {contactCountMap[company.id] || 0}
                  </TableCell>
                  <TableCell>
                    ${(dealValueMap[company.id] || 0).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <CompanyTableActions
                      company={company}
                      users={users || []}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <CompanyPagination currentPage={page} totalPages={totalPages} />
      )}
    </div>
  );
}
