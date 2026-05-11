// src/lib/validations/contact.ts
import { z } from 'zod';

export const contactFormSchema = z.object({
  first_name: z.string().min(1, 'First name is required').max(100),
  last_name: z.string().min(1, 'Last name is required').max(100),
  email: z.string().email('Invalid email format'),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone format'),
  status: z.enum(['lead', 'customer', 'churned']),
  company_id: z.string().uuid('Invalid company ID'),
  assigned_to: z.string().uuid('Invalid user ID'),
});

export type ContactFormSchema = z.infer<typeof contactFormSchema>;
