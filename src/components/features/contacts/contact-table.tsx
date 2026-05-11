// src/components/features/contacts/contact-table.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Edit } from 'lucide-react';
import type { ContactWithCompany } from '@/types/database';
import ContactTableActions from './contact-table-actions';
import ContactTablePagination from './contact-table-pagination';

interface ContactTableProps {
  contacts: ContactWithCompany[];
  currentPage: number;
  totalPages: number;
}

export default function ContactTable({
  contacts,
  currentPage,
  totalPages,
}: ContactTableProps) {
  if (contacts.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground">
        No contacts found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>First Name</TableHead>
              <TableHead>Last Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contacts.map((contact) => (
              <TableRow key={contact.id}>
                <TableCell className="font-medium">{contact.first_name}</TableCell>
                <TableCell>{contact.last_name}</TableCell>
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
                <TableCell>
                  <Link
                    href={`/companies/${contact.company_id}`}
                    className="text-primary hover:underline"
                  >
                    {contact.company.name}
                  </Link>
                </TableCell>
                <TableCell>
                  <div className="flex justify-center gap-2">
                    <Link href={`/contacts/${contact.id}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        aria-label={`Edit ${contact.first_name} ${contact.last_name}`}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <ContactTableActions
                      contactId={contact.id}
                      contactName={`${contact.first_name} ${contact.last_name}`}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <ContactTablePagination currentPage={currentPage} totalPages={totalPages} />
      )}
    </div>
  );
}
