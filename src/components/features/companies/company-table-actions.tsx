'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import ConfirmDialog from '@/components/ui/confirm-dialog';
import CompanyFormDialog from './company-form-dialog';
import { Edit, Trash } from 'lucide-react';
import { deleteCompany } from '@/actions/companies';
import type { Company, Profile } from '@/types/database';

interface CompanyTableActionsProps {
  company: Company;
  users: Profile[];
}

export default function CompanyTableActions({ company, users }: CompanyTableActionsProps) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    setDeleteError('');
    const result = await deleteCompany(company.id);

    if (result.success) {
      setDeleteOpen(false);
      router.refresh();
    } else {
      setDeleteError(result.error || 'Failed to delete company');
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setEditOpen(true)}
          aria-label={`Edit ${company.name}`}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => { setDeleteError(''); setDeleteOpen(true); }}
          aria-label={`Delete ${company.name}`}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>

      <CompanyFormDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        company={company}
        users={users}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={(open) => { setDeleteOpen(open); if (!open) setDeleteError(''); }}
        title="Delete Company"
        description={
          deleteError
            ? deleteError
            : `Are you sure you want to delete "${company.name}"? This action cannot be undone.`
        }
        confirmLabel={deleteError ? 'Close' : 'Delete'}
        variant={deleteError ? 'default' : 'destructive'}
        loading={isDeleting}
        onConfirm={deleteError ? () => setDeleteOpen(false) : handleConfirmDelete}
      />
    </>
  );
}
