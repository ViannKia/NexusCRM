'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import CompanyFormDialog from './company-form-dialog';
import type { Profile } from '@/types/database';

interface CompanyListHeaderProps {
  users: Profile[];
}

export default function CompanyListHeader({ users }: CompanyListHeaderProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        Create Company
      </Button>

      <CompanyFormDialog open={open} onOpenChange={setOpen} users={users} />
    </>
  );
}
