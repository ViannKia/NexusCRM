# Requirements Document

## Introduction

This document specifies the requirements for a PostgreSQL database schema for a Supabase-based CRM system. The schema includes 6 core tables to support essential CRM features: user profiles, company management, contact management, sales pipeline stages, deal tracking, and activity logging.

## Glossary

- **Database_Schema**: The PostgreSQL database structure including tables, columns, constraints, indexes, triggers, and Row Level Security policies
- **Profile**: A user record extending Supabase auth.users with CRM-specific attributes
- **Company**: An organization or business entity tracked in the CRM
- **Contact**: An individual person associated with a company
- **Pipeline_Stage**: A stage in the sales pipeline (e.g., Lead, Proposal, Won)
- **Deal**: A sales opportunity associated with a contact and pipeline stage
- **Activity**: A logged interaction or task related to contacts and deals
- **RLS_Policy**: Row Level Security policy controlling data access based on user role
- **Soft_Delete**: Marking records as deleted using deleted_at timestamp without physical deletion
- **Supabase_SQL_Editor**: The SQL execution interface in Supabase dashboard

## Requirements

### Requirement 1: User Profile Management

**User Story:** As a CRM administrator, I want to extend Supabase authentication with CRM-specific profile data, so that users have role-based access and identity information.

#### Acceptance Criteria

1. THE Database_Schema SHALL create a profiles table with id as UUID primary key referencing auth.users(id)
2. THE profiles table SHALL include full_name as text, role as text, avatar_url as nullable text, created_at as timestamptz, and updated_at as timestamptz
3. THE profiles table SHALL constrain role values to admin, manager, or sales
4. THE profiles table SHALL generate id using the referenced auth.users id
5. THE profiles table SHALL automatically populate created_at with current timestamp on insert
6. THE profiles table SHALL automatically update updated_at with current timestamp on modification

### Requirement 2: Company Management

**User Story:** As a sales user, I want to track companies with industry classification and ownership assignment, so that I can manage organizational relationships.

#### Acceptance Criteria

1. THE Database_Schema SHALL create a companies table with id as UUID primary key using gen_random_uuid()
2. THE companies table SHALL include name as text, industry as nullable text, assigned_to as UUID referencing profiles(id), created_at as timestamptz, updated_at as timestamptz, and deleted_at as nullable timestamptz
3. THE companies table SHALL enforce ON DELETE RESTRICT on the assigned_to foreign key
4. THE Database_Schema SHALL create an index on companies(assigned_to)
5. THE companies table SHALL support soft deletion via deleted_at timestamp
6. THE companies table SHALL automatically populate created_at with current timestamp on insert
7. THE companies table SHALL automatically update updated_at with current timestamp on modification

### Requirement 3: Contact Management

**User Story:** As a sales user, I want to track individual contacts with their company affiliation and status, so that I can manage customer relationships.

#### Acceptance Criteria

1. THE Database_Schema SHALL create a contacts table with id as UUID primary key using gen_random_uuid()
2. THE contacts table SHALL include company_id as UUID referencing companies(id), first_name as text, last_name as text, email as text, phone as text, status as text, assigned_to as UUID referencing profiles(id), created_at as timestamptz, updated_at as timestamptz, and deleted_at as nullable timestamptz
3. THE contacts table SHALL constrain status values to lead, customer, or churned
4. THE contacts table SHALL enforce ON DELETE RESTRICT on company_id and assigned_to foreign keys
5. THE Database_Schema SHALL create indexes on contacts(assigned_to) and contacts(status)
6. THE contacts table SHALL support soft deletion via deleted_at timestamp
7. THE contacts table SHALL automatically populate created_at with current timestamp on insert
8. THE contacts table SHALL automatically update updated_at with current timestamp on modification

### Requirement 4: Sales Pipeline Stage Definition

**User Story:** As a CRM administrator, I want to define ordered pipeline stages with visual indicators, so that sales processes follow a consistent workflow.

#### Acceptance Criteria

1. THE Database_Schema SHALL create a pipeline_stages table with id as UUID primary key using gen_random_uuid()
2. THE pipeline_stages table SHALL include name as text, order as integer, color as text, created_at as timestamptz, and updated_at as timestamptz
3. THE pipeline_stages table SHALL enforce unique values for the order column
4. THE pipeline_stages table SHALL automatically populate created_at with current timestamp on insert
5. THE pipeline_stages table SHALL automatically update updated_at with current timestamp on modification

### Requirement 5: Deal Tracking

**User Story:** As a sales user, I want to track deals with monetary value and pipeline position, so that I can manage sales opportunities.

#### Acceptance Criteria

1. THE Database_Schema SHALL create a deals table with id as UUID primary key using gen_random_uuid()
2. THE deals table SHALL include title as text, value as numeric, stage_id as UUID referencing pipeline_stages(id), contact_id as UUID referencing contacts(id), assigned_to as UUID referencing profiles(id), expected_close_date as date, created_at as timestamptz, updated_at as timestamptz, and deleted_at as nullable timestamptz
3. THE deals table SHALL enforce ON DELETE RESTRICT on stage_id, contact_id, and assigned_to foreign keys
4. THE Database_Schema SHALL create indexes on deals(assigned_to), deals(stage_id), and deals(contact_id)
5. THE deals table SHALL support soft deletion via deleted_at timestamp
6. THE deals table SHALL automatically populate created_at with current timestamp on insert
7. THE deals table SHALL automatically update updated_at with current timestamp on modification

### Requirement 6: Activity Logging

**User Story:** As a sales user, I want to log activities with due dates and completion tracking, so that I can manage tasks and record interactions.

#### Acceptance Criteria

1. THE Database_Schema SHALL create an activities table with id as UUID primary key using gen_random_uuid()
2. THE activities table SHALL include type as text, subject as text, description as nullable text, due_date as timestamptz, completed_at as nullable timestamptz, contact_id as UUID referencing contacts(id), deal_id as nullable UUID referencing deals(id), created_by as UUID referencing profiles(id), created_at as timestamptz, updated_at as timestamptz, and deleted_at as nullable timestamptz
3. THE activities table SHALL constrain type values to call, email, meeting, or task
4. THE activities table SHALL enforce ON DELETE RESTRICT on contact_id, deal_id, and created_by foreign keys
5. THE Database_Schema SHALL create an index on activities(contact_id)
6. THE activities table SHALL support soft deletion via deleted_at timestamp
7. THE activities table SHALL automatically populate created_at with current timestamp on insert
8. THE activities table SHALL automatically update updated_at with current timestamp on modification

### Requirement 7: Automatic Timestamp Management

**User Story:** As a database administrator, I want automatic timestamp updates on record modification, so that audit trails are maintained without manual intervention.

#### Acceptance Criteria

1. THE Database_Schema SHALL create a trigger function that sets updated_at to current timestamp
2. WHEN a record in profiles, companies, contacts, pipeline_stages, deals, or activities is updated, THE Database_Schema SHALL execute the trigger function to update the updated_at column

### Requirement 8: Row Level Security Policies

**User Story:** As a CRM administrator, I want role-based data access controls, so that users only access authorized data.

#### Acceptance Criteria

1. THE Database_Schema SHALL enable Row Level Security on profiles, companies, contacts, pipeline_stages, deals, and activities tables
2. WHEN a user with admin role queries any table, THE RLS_Policy SHALL permit access to all records
3. WHEN a user with manager or sales role queries companies, contacts, deals, or activities tables, THE RLS_Policy SHALL permit access only to records where assigned_to or created_by matches the user id
4. THE RLS_Policy SHALL permit all users to read pipeline_stages records
5. THE RLS_Policy SHALL permit all authenticated users to read their own profile record

### Requirement 9: Seed Data Initialization

**User Story:** As a developer, I want initial test data in the database, so that I can verify functionality immediately after deployment.

#### Acceptance Criteria

1. THE Database_Schema SHALL insert 1 admin profile, 2 sales profiles with valid UUIDs
2. THE Database_Schema SHALL insert 3 company records with assigned_to references to the created profiles
3. THE Database_Schema SHALL insert 5 contact records with company_id and assigned_to references
4. THE Database_Schema SHALL insert 3 pipeline_stage records with names Lead, Proposal, and Won with order values 1, 2, and 3
5. THE Database_Schema SHALL insert 3 deal records with valid stage_id, contact_id, and assigned_to references
6. THE Database_Schema SHALL insert 5 activity records with valid contact_id, deal_id, and created_by references

### Requirement 10: SQL Script Execution Compatibility

**User Story:** As a developer, I want a single executable SQL script, so that I can deploy the complete schema in Supabase SQL Editor without modification.

#### Acceptance Criteria

1. THE Database_Schema SHALL generate SQL statements compatible with PostgreSQL 14 or higher
2. THE Database_Schema SHALL order SQL statements to satisfy dependency requirements
3. THE Database_Schema SHALL execute successfully in Supabase_SQL_Editor without errors
4. THE Database_Schema SHALL include CREATE TABLE, CREATE INDEX, CREATE FUNCTION, CREATE TRIGGER, ALTER TABLE ENABLE ROW LEVEL SECURITY, CREATE POLICY, and INSERT statements
