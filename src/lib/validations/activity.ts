// src/lib/validations/activity.ts
import { z } from 'zod';

export const activityFormSchema = z.object({
  type: z.enum(['call', 'email', 'meeting', 'task']),
  subject: z.string().min(1, 'Subject is required').max(200),
  description: z.string().max(1000).optional(),
  due_date: z.string().refine((date) => new Date(date) >= new Date(), {
    message: 'Due date cannot be in the past',
  }),
  contact_id: z.string().uuid('Invalid contact ID'),
  deal_id: z.string().uuid('Invalid deal ID').optional(),
});

export type ActivityFormSchema = z.infer<typeof activityFormSchema>;
