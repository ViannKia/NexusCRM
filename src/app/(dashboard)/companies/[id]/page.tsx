import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ArrowLeft, Building2, User, Briefcase } from 'lucide-react';

interface CompanyDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function CompanyDetailPage({ params }: CompanyDetailPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Fetch company with profile
  const { data: company, error } = await supabase
    .from('companies')
    .select('*, profile:profiles!assigned_to(full_name)')
    .eq('id', id)
    .is('deleted_at', null)
    .single();

  if (error || !company) notFound();

  // Fetch contacts in this company
  const { data: contacts } = await supabase
    .from('contacts')
    .select('*')
    .eq('company_id', id)
    .is('deleted_at', null)
    .order('first_name', { ascending: true });

  // Fetch total deals value via contacts in this company
  const contactIds = (contacts || []).map((c) => c.id);
  let totalDealsValue = 0;

  if (contactIds.length > 0) {
    const { data: deals } = await supabase
      .from('deals')
      .select('value')
      .in('contact_id', contactIds)
      .is('deleted_at', null);

    totalDealsValue = (deals || []).reduce((sum, d) => sum + Number(d.value), 0);
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Link href="/companies">
        <Button variant="outline" size="sm">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Companies
        </Button>
      </Link>

      {/* Company info */}
      <div className="mt-4 flex flex-col gap-1">
        <h1 className="text-2xl font-bold md:text-3xl">{company.name}</h1>
        {company.industry && (
          <p className="text-gray-500">{company.industry}</p>
        )}
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <Building2 className="h-4 w-4 text-gray-500" />
            <CardTitle className="text-sm font-medium text-gray-500">Industry</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">{company.industry || '—'}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <User className="h-4 w-4 text-gray-500" />
            <CardTitle className="text-sm font-medium text-gray-500">Assigned To</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">{(company.profile as any)?.full_name || '—'}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <Briefcase className="h-4 w-4 text-gray-500" />
            <CardTitle className="text-sm font-medium text-gray-500">Total Deals Value</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-green-600">
              ${totalDealsValue.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Contacts table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Contacts
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({contacts?.length || 0})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {!contacts || contacts.length === 0 ? (
            <p className="p-6 text-center text-gray-500">No contacts in this company</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contacts.map((contact) => (
                    <TableRow key={contact.id}>
                      <TableCell className="font-medium">
                        <Link
                          href={`/contacts/${contact.id}`}
                          className="text-primary hover:underline"
                        >
                          {contact.first_name} {contact.last_name}
                        </Link>
                      </TableCell>
                      <TableCell>{contact.email}</TableCell>
                      <TableCell>{contact.phone}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                            contact.status === 'lead'
                              ? 'bg-blue-100 text-blue-800'
                              : contact.status === 'customer'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
