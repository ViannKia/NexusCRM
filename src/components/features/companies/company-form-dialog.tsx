'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { companyFormSchema, type CompanyFormSchema } from '@/lib/validations/company';
import { createCompany, updateCompany } from '@/actions/companies';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';
import type { Company, Profile } from '@/types/database';

interface CompanyFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  company?: Company;
  users: Profile[];
}

export default function CompanyFormDialog({
  open,
  onOpenChange,
  company,
  users,
}: CompanyFormDialogProps) {
  const router = useRouter();
  const [error, setError] = useState('');
  const isEdit = !!company;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<CompanyFormSchema>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      name: company?.name ?? '',
      industry: company?.industry ?? '',
      assigned_to: company?.assigned_to ?? '',
    },
  });

  // Reset form when dialog opens/closes or company changes
  useEffect(() => {
    if (open) {
      reset({
        name: company?.name ?? '',
        industry: company?.industry ?? '',
        assigned_to: company?.assigned_to ?? '',
      });
      setError('');
    }
  }, [open, company, reset]);

  const onSubmit = async (data: CompanyFormSchema) => {
    setError('');
    const result = isEdit
      ? await updateCompany(company.id, data)
      : await createCompany(data);

    if (result.success) {
      onOpenChange(false);
      router.refresh();
    } else {
      setError(result.error || 'Operation failed');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Company' : 'Create Company'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="name">Company Name *</Label>
            <Input
              id="name"
              {...register('name')}
              disabled={isSubmitting}
              placeholder="e.g. Acme Corporation"
            />
            {errors.name && (
              <p className="text-xs text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Industry */}
          <div className="space-y-1.5">
            <Label htmlFor="industry">Industry</Label>
            <Input
              id="industry"
              {...register('industry')}
              disabled={isSubmitting}
              placeholder="e.g. Technology"
            />
            {errors.industry && (
              <p className="text-xs text-red-600">{errors.industry.message}</p>
            )}
          </div>

          {/* Assigned To */}
          <div className="space-y-1.5">
            <Label htmlFor="assigned_to">Assigned To *</Label>
            <Select
              onValueChange={(value) => setValue('assigned_to', value)}
              defaultValue={watch('assigned_to')}
              disabled={isSubmitting}
            >
              <SelectTrigger id="assigned_to">
                <SelectValue placeholder="Select user" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.full_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.assigned_to && (
              <p className="text-xs text-red-600">{errors.assigned_to.message}</p>
            )}
          </div>

          {error && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Company'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
