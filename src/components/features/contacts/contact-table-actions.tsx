// src/components/features/contacts/contact-table-actions.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import ConfirmDialog from '@/components/ui/confirm-dialog';
import { Trash } from 'lucide-react';
import { deleteContact } from '@/actions/contacts';

interface ContactTableActionsProps {
  contactId: string;
  contactName: string;
}

export default function ContactTableActions({
  contactId,
  contactName,
}: ContactTableActionsProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    const result = await deleteContact(contactId);

    if (result.success) {
      setOpen(false);
      router.refresh();
    } else {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        aria-label={`Delete ${contactName}`}
      >
        <Trash className="h-4 w-4" />
      </Button>

      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Delete Contact"
        description={`Are you sure you want to delete ${contactName}? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        loading={isDeleting}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
