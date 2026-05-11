import { z } from 'zod';

export const companyFormSchema = z.object({
  name: z.string().min(1, 'Company name is required').max(200),
  industry: z.string().max(100).optional(),
  assigned_to: z.string().uuid('Invalid user ID'),
});

export type CompanyFormSchema = z.infer<typeof companyFormSchema>;
