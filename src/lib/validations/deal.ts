// src/lib/validations/deal.ts
import { z } from 'zod';

export const dealFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  value: z.number().positive('Value must be positive'),
  stage_id: z.string().uuid('Invalid stage ID'),
  contact_id: z.string().uuid('Invalid contact ID'),
  assigned_to: z.string().uuid('Invalid user ID'),
  expected_close_date: z.string().optional(),
});

export type DealFormSchema = z.infer<typeof dealFormSchema>;
