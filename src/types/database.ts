// src/types/database.ts
// Database type definitions matching Supabase schema

export interface Profile {
  id: string;
  full_name: string;
  role: 'admin' | 'manager' | 'sales';
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: string;
  name: string;
  industry: string | null;
  assigned_to: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface Contact {
  id: string;
  company_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  status: 'lead' | 'customer' | 'churned';
  assigned_to: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface PipelineStage {
  id: string;
  name: string;
  order: number;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface Deal {
  id: string;
  title: string;
  value: number;
  stage_id: string;
  contact_id: string;
  assigned_to: string;
  expected_close_date: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface Activity {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'task';
  subject: string;
  description: string | null;
  due_date: string;
  completed_at: string | null;
  contact_id: string;
  deal_id: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

// Extended types with relations
export interface ContactWithCompany extends Contact {
  company: Company;
}

export interface CompanyWithRelations extends Company {
  profile: Profile;
  contact_count: number;
  total_deals_value: number;
}

export interface DealWithRelations extends Deal {
  contact: Contact;
  stage: PipelineStage;
}

export interface ActivityWithRelations extends Activity {
  contact: Contact;
  deal: Deal | null;
}

// Form types
export interface ContactFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  status: 'lead' | 'customer' | 'churned';
  company_id: string;
  assigned_to: string;
}

export interface ActivityFormData {
  type: 'call' | 'email' | 'meeting' | 'task';
  subject: string;
  description: string;
  due_date: string;
  contact_id: string;
  deal_id?: string;
}

export interface DealFormData {
  title: string;
  value: number;
  stage_id: string;
  contact_id: string;
  assigned_to: string;
  expected_close_date?: string;
}

// Server action response types
export interface ActionResponse<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

// Dashboard metrics
export interface DashboardMetrics {
  totalDeals: number;
  totalContacts: number;
  totalCompanies: number;
  pipelineFunnel: Array<{
    stage: string;
    count: number;
    color: string;
  }>;
  recentActivities: ActivityWithRelations[];
}
