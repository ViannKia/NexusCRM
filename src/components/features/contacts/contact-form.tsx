'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactFormSchema, type ContactFormSchema } from '@/lib/validations/contact';
import { createContact, updateContact } from '@/actions/contacts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Contact, Company, Profile } from '@/types/database';

interface ContactFormProps {
  contact?: Contact;
  companies: Company[];
  users: Profile[];
}

export default function ContactForm({ contact, companies, users }: ContactFormProps) {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ContactFormSchema>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: contact || {
      status: 'lead',
    },
  });

  const onSubmit = async (data: ContactFormSchema) => {
    setError('');
    setLoading(true);

    const result = contact
      ? await updateContact(contact.id, data)
      : await createContact(data);

    if (result.success) {
      router.push('/contacts');
      router.refresh();
    } else {
      setError(result.error || 'Operation failed');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="first_name">First Name *</Label>
          <Input id="first_name" {...register('first_name')} disabled={loading} />
          {errors.first_name && (
            <p className="text-sm text-red-600">{errors.first_name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="last_name">Last Name *</Label>
          <Input id="last_name" {...register('last_name')} disabled={loading} />
          {errors.last_name && (
            <p className="text-sm text-red-600">{errors.last_name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input id="email" type="email" {...register('email')} disabled={loading} />
          {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone *</Label>
          <Input id="phone" {...register('phone')} disabled={loading} />
          {errors.phone && <p className="text-sm text-red-600">{errors.phone.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status *</Label>
          <Select
            onValueChange={(value) => setValue('status', value as any)}
            defaultValue={watch('status')}
            disabled={loading}
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lead">Lead</SelectItem>
              <SelectItem value="customer">Customer</SelectItem>
              <SelectItem value="churned">Churned</SelectItem>
            </SelectContent>
          </Select>
          {errors.status && <p className="text-sm text-red-600">{errors.status.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="company_id">Company *</Label>
          <Select
            onValueChange={(value) => setValue('company_id', value)}
            defaultValue={watch('company_id')}
            disabled={loading}
          >
            <SelectTrigger id="company_id">
              <SelectValue placeholder="Select company" />
            </SelectTrigger>
            <SelectContent>
              {companies.map((company) => (
                <SelectItem key={company.id} value={company.id}>
                  {company.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.company_id && (
            <p className="text-sm text-red-600">{errors.company_id.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="assigned_to">Assigned To *</Label>
          <Select
            onValueChange={(value) => setValue('assigned_to', value)}
            defaultValue={watch('assigned_to')}
            disabled={loading}
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
            <p className="text-sm text-red-600">{errors.assigned_to.message}</p>
          )}
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : contact ? 'Update Contact' : 'Create Contact'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
