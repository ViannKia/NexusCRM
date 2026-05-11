// src/components/features/activities/activity-form.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { activityFormSchema, type ActivityFormSchema } from '@/lib/validations/activity';
import { createActivity } from '@/actions/activities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Contact, Deal } from '@/types/database';

interface ActivityFormProps {
  contacts: Contact[];
  deals: Deal[];
}

export default function ActivityForm({ contacts, deals }: ActivityFormProps) {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ActivityFormSchema>({
    resolver: zodResolver(activityFormSchema),
  });

  const onSubmit = async (data: ActivityFormSchema) => {
    setError('');
    setLoading(true);

    const result = await createActivity(data);

    if (result.success) {
      router.push('/activities');
      router.refresh();
    } else {
      setError(result.error || 'Failed to create activity');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="type">Type *</Label>
          <Select
            onValueChange={(value) => setValue('type', value as any)}
            defaultValue={watch('type')}
            disabled={loading}
          >
            <SelectTrigger id="type">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="call">Call</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="meeting">Meeting</SelectItem>
              <SelectItem value="task">Task</SelectItem>
            </SelectContent>
          </Select>
          {errors.type && <p className="text-sm text-red-600">{errors.type.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="subject">Subject *</Label>
          <Input id="subject" {...register('subject')} disabled={loading} />
          {errors.subject && (
            <p className="text-sm text-red-600">{errors.subject.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="due_date">Due Date *</Label>
          <Input
            id="due_date"
            type="datetime-local"
            {...register('due_date')}
            disabled={loading}
          />
          {errors.due_date && (
            <p className="text-sm text-red-600">{errors.due_date.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact_id">Contact *</Label>
          <Select
            onValueChange={(value) => setValue('contact_id', value)}
            defaultValue={watch('contact_id')}
            disabled={loading}
          >
            <SelectTrigger id="contact_id">
              <SelectValue placeholder="Select contact" />
            </SelectTrigger>
            <SelectContent>
              {contacts.map((contact) => (
                <SelectItem key={contact.id} value={contact.id}>
                  {contact.first_name} {contact.last_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.contact_id && (
            <p className="text-sm text-red-600">{errors.contact_id.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="deal_id">Deal (Optional)</Label>
          <Select
            onValueChange={(value) => setValue('deal_id', value === 'none' ? undefined : value)}
            defaultValue={watch('deal_id') ?? 'none'}
            disabled={loading}
          >
            <SelectTrigger id="deal_id">
              <SelectValue placeholder="Select deal (optional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {deals.map((deal) => (
                <SelectItem key={deal.id} value={deal.id}>
                  {deal.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.deal_id && (
            <p className="text-sm text-red-600">{errors.deal_id.message}</p>
          )}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            {...register('description')}
            disabled={loading}
            rows={4}
          />
          {errors.description && (
            <p className="text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Activity'}
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
