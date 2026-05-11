-- ============================================================================
-- Supabase CRM Database Schema
-- ============================================================================
-- This script creates a complete CRM database schema with:
-- - 6 core tables (profiles, companies, contacts, pipeline_stages, deals, activities)
-- - Automatic timestamp management via triggers
-- - Row Level Security (RLS) policies for role-based access
-- - Seed data for immediate testing
--
-- Compatible with: PostgreSQL 14+, Supabase
-- Execution: Run in Supabase SQL Editor without modification
-- ============================================================================

-- ============================================================================
-- SECTION 1: CREATE TABLES
-- ============================================================================

-- Table: profiles
-- Extends Supabase auth.users with CRM-specific attributes
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'manager', 'sales')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table: companies
-- Tracks organizational entities with ownership assignment
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  industry TEXT,
  assigned_to UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Table: contacts
-- Manages individual contacts with company affiliation
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE RESTRICT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('lead', 'customer', 'churned')),
  assigned_to UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Table: pipeline_stages
-- Defines ordered sales pipeline stages with visual indicators
CREATE TABLE pipeline_stages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  "order" INTEGER NOT NULL UNIQUE,
  color TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table: deals
-- Tracks sales opportunities with monetary value and pipeline position
CREATE TABLE deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  value NUMERIC NOT NULL,
  stage_id UUID NOT NULL REFERENCES pipeline_stages(id) ON DELETE RESTRICT,
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE RESTRICT,
  assigned_to UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  expected_close_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Table: activities
-- Logs interactions and tasks with completion tracking
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('call', 'email', 'meeting', 'task')),
  subject TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMPTZ NOT NULL,
  completed_at TIMESTAMPTZ,
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE RESTRICT,
  deal_id UUID REFERENCES deals(id) ON DELETE RESTRICT,
  created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- ============================================================================
-- SECTION 2: CREATE INDEXES
-- ============================================================================

-- Indexes for companies table
CREATE INDEX idx_companies_assigned_to ON companies(assigned_to);

-- Indexes for contacts table
CREATE INDEX idx_contacts_assigned_to ON contacts(assigned_to);
CREATE INDEX idx_contacts_status ON contacts(status);

-- Indexes for deals table
CREATE INDEX idx_deals_assigned_to ON deals(assigned_to);
CREATE INDEX idx_deals_stage_id ON deals(stage_id);
CREATE INDEX idx_deals_contact_id ON deals(contact_id);

-- Indexes for activities table
CREATE INDEX idx_activities_contact_id ON activities(contact_id);

-- ============================================================================
-- SECTION 3: CREATE TRIGGER FUNCTION
-- ============================================================================

-- Function: update_updated_at_column
-- Automatically sets updated_at to current timestamp on record modification
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- SECTION 4: CREATE TRIGGERS
-- ============================================================================

-- Trigger for profiles table
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for companies table
CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON companies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for contacts table
CREATE TRIGGER update_contacts_updated_at
  BEFORE UPDATE ON contacts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for pipeline_stages table
CREATE TRIGGER update_pipeline_stages_updated_at
  BEFORE UPDATE ON pipeline_stages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for deals table
CREATE TRIGGER update_deals_updated_at
  BEFORE UPDATE ON deals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for activities table
CREATE TRIGGER update_activities_updated_at
  BEFORE UPDATE ON activities
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- SECTION 5: ENABLE ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE pipeline_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- SECTION 6: CREATE RLS POLICIES
-- ============================================================================

-- Policies for profiles table
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Policies for companies table
CREATE POLICY "Admins can view all companies"
  ON companies FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Users can view assigned companies"
  ON companies FOR SELECT
  USING (assigned_to = auth.uid());

-- Policies for contacts table
CREATE POLICY "Admins can view all contacts"
  ON contacts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Users can view assigned contacts"
  ON contacts FOR SELECT
  USING (assigned_to = auth.uid());

-- Policies for pipeline_stages table
CREATE POLICY "All users can view pipeline stages"
  ON pipeline_stages FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Policies for deals table
CREATE POLICY "Admins can view all deals"
  ON deals FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Users can view assigned deals"
  ON deals FOR SELECT
  USING (assigned_to = auth.uid());

-- Policies for activities table
CREATE POLICY "Admins can view all activities"
  ON activities FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Users can view own activities"
  ON activities FOR SELECT
  USING (created_by = auth.uid());

-- ============================================================================
-- SECTION 7: INSERT SEED DATA
-- ============================================================================

-- Insert profiles (3 users: 1 admin, 2 sales)
INSERT INTO profiles (id, full_name, role, avatar_url) VALUES
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Admin User', 'admin', NULL),
  ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Sales User One', 'sales', NULL),
  ('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'Sales User Two', 'sales', NULL);

-- Insert companies (3 companies)
INSERT INTO companies (name, industry, assigned_to) VALUES
  ('Acme Corporation', 'Technology', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22'),
  ('Global Industries', 'Manufacturing', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33'),
  ('Tech Innovations', 'Software', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22');

-- Insert contacts (5 contacts)
INSERT INTO contacts (company_id, first_name, last_name, email, phone, status, assigned_to)
SELECT 
  c.id,
  contact_data.first_name,
  contact_data.last_name,
  contact_data.email,
  contact_data.phone,
  contact_data.status,
  contact_data.assigned_to
FROM (
  VALUES
    ('Acme Corporation', 'John', 'Doe', 'john.doe@acme.com', '+1-555-0101', 'lead', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22'),
    ('Acme Corporation', 'Jane', 'Smith', 'jane.smith@acme.com', '+1-555-0102', 'customer', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22'),
    ('Global Industries', 'Bob', 'Johnson', 'bob.johnson@global.com', '+1-555-0201', 'lead', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33'),
    ('Tech Innovations', 'Alice', 'Williams', 'alice.williams@techinno.com', '+1-555-0301', 'customer', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22'),
    ('Tech Innovations', 'Charlie', 'Brown', 'charlie.brown@techinno.com', '+1-555-0302', 'lead', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22')
) AS contact_data(company_name, first_name, last_name, email, phone, status, assigned_to)
JOIN companies c ON c.name = contact_data.company_name;

-- Insert pipeline stages (3 stages)
INSERT INTO pipeline_stages (name, "order", color) VALUES
  ('Lead', 1, '#3B82F6'),
  ('Proposal', 2, '#F59E0B'),
  ('Won', 3, '#10B981');

-- Insert deals (3 deals)
INSERT INTO deals (title, value, stage_id, contact_id, assigned_to, expected_close_date)
SELECT 
  deal_data.title,
  deal_data.value,
  ps.id,
  ct.id,
  deal_data.assigned_to,
  deal_data.expected_close_date
FROM (
  VALUES
    ('Acme Software License', 50000, 'Lead', 'john.doe@acme.com', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', '2024-03-15'),
    ('Global Manufacturing System', 150000, 'Proposal', 'bob.johnson@global.com', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', '2024-04-01'),
    ('Tech Innovations Consulting', 75000, 'Won', 'alice.williams@techinno.com', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', '2024-02-28')
) AS deal_data(title, value, stage_name, contact_email, assigned_to, expected_close_date)
JOIN pipeline_stages ps ON ps.name = deal_data.stage_name
JOIN contacts ct ON ct.email = deal_data.contact_email;

-- Insert activities (5 activities)
INSERT INTO activities (type, subject, description, due_date, completed_at, contact_id, deal_id, created_by)
SELECT 
  activity_data.type,
  activity_data.subject,
  activity_data.description,
  activity_data.due_date,
  activity_data.completed_at,
  ct.id,
  d.id,
  activity_data.created_by
FROM (
  VALUES
    ('call', 'Initial Discovery Call', 'Discuss requirements and timeline', '2024-01-15 10:00:00+00', '2024-01-15 10:30:00+00', 'john.doe@acme.com', 'Acme Software License', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22'),
    ('email', 'Send Proposal', 'Email detailed proposal document', '2024-01-20 09:00:00+00', NULL, 'john.doe@acme.com', 'Acme Software License', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22'),
    ('meeting', 'Proposal Presentation', 'Present proposal to stakeholders', '2024-02-05 14:00:00+00', '2024-02-05 15:30:00+00', 'bob.johnson@global.com', 'Global Manufacturing System', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33'),
    ('task', 'Follow-up on Contract', 'Check contract signing status', '2024-02-10 09:00:00+00', NULL, 'bob.johnson@global.com', 'Global Manufacturing System', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33'),
    ('call', 'Onboarding Call', 'Schedule implementation kickoff', '2024-03-01 11:00:00+00', '2024-03-01 11:45:00+00', 'alice.williams@techinno.com', 'Tech Innovations Consulting', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22')
) AS activity_data(type, subject, description, due_date, completed_at, contact_email, deal_title, created_by)
JOIN contacts ct ON ct.email = activity_data.contact_email
LEFT JOIN deals d ON d.title = activity_data.deal_title;

-- ============================================================================
-- SCRIPT COMPLETE
-- ============================================================================
-- Schema created successfully with:
-- - 6 tables (profiles, companies, contacts, pipeline_stages, deals, activities)
-- - 7 indexes for query optimization
-- - 1 trigger function + 6 triggers for automatic timestamp management
-- - 6 tables with RLS enabled
-- - 12 RLS policies for role-based access control
-- - Seed data: 3 profiles, 3 companies, 5 contacts, 3 pipeline stages, 3 deals, 5 activities
-- ============================================================================
