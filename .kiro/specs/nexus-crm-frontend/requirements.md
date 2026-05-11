# Requirements Document

## Introduction

NexusCRM Frontend adalah aplikasi web Customer Relationship Management (CRM) yang dibangun menggunakan Next.js 16 dengan App Router, TypeScript, Tailwind CSS, shadcn/ui, dan Supabase Client. Sistem ini menyediakan antarmuka pengguna untuk mengelola kontak, deals, pipeline penjualan, dan aktivitas dengan autentikasi berbasis Supabase Auth dan Row Level Security (RLS).

## Glossary

- **Frontend_Application**: Aplikasi web Next.js yang menyediakan antarmuka pengguna untuk NexusCRM
- **Supabase_Auth**: Layanan autentikasi Supabase yang mengelola login, logout, dan session management
- **Supabase_Client**: Library client-side untuk berkomunikasi dengan Supabase database dan auth
- **Dashboard**: Halaman utama yang menampilkan ringkasan metrik dan statistik CRM
- **Contact_List**: Halaman yang menampilkan daftar kontak dalam bentuk tabel dengan pagination
- **Pipeline_Board**: Halaman kanban board untuk mengelola deals berdasarkan stage
- **Activity_List**: Halaman yang menampilkan daftar aktivitas dengan filter
- **Sidebar**: Komponen navigasi vertikal di sisi kiri aplikasi
- **Server_Action**: Next.js server-side function untuk mutasi data
- **Protected_Route**: Route yang hanya dapat diakses oleh user yang sudah terautentikasi
- **Deal_Card**: Komponen visual yang merepresentasikan satu deal di kanban board
- **Contact_Form**: Form untuk membuat atau mengedit data kontak
- **Activity_Form**: Form untuk membuat aktivitas baru
- **Pipeline_Stage**: Tahapan dalam sales pipeline (Lead, Proposal, Won)
- **User_Session**: Session aktif dari user yang sudah login
- **Search_Query**: Input pencarian yang dimasukkan user untuk filter data
- **Pagination_Control**: Komponen untuk navigasi antar halaman data
- **Drag_Drop_Operation**: Operasi drag-and-drop deal card antar stage
- **Form_Validation**: Validasi input form menggunakan react-hook-form dan zod

## Requirements

### Requirement 1: User Authentication

**User Story:** As a user, I want to login with email and password, so that I can access the CRM system securely.

#### Acceptance Criteria

1. THE Frontend_Application SHALL provide a login page with email and password input fields
2. WHEN a user submits valid credentials, THE Supabase_Auth SHALL authenticate the user and create a User_Session
3. WHEN a user submits invalid credentials, THE Frontend_Application SHALL display an error message indicating authentication failure
4. WHEN authentication succeeds, THE Frontend_Application SHALL redirect the user to the Dashboard
5. THE Frontend_Application SHALL provide a logout button in the Sidebar
6. WHEN a user clicks the logout button, THE Supabase_Auth SHALL terminate the User_Session and redirect to the login page

### Requirement 2: Route Protection

**User Story:** As a system administrator, I want to protect dashboard routes, so that only authenticated users can access CRM data.

#### Acceptance Criteria

1. WHEN an unauthenticated user attempts to access a Protected_Route, THE Frontend_Application SHALL redirect the user to the login page
2. WHEN an authenticated user accesses a Protected_Route, THE Frontend_Application SHALL render the requested page
3. THE Frontend_Application SHALL verify User_Session status before rendering any Protected_Route
4. IF a User_Session expires during usage, THEN THE Frontend_Application SHALL redirect the user to the login page

### Requirement 3: Dashboard Metrics Display

**User Story:** As a sales manager, I want to view key CRM metrics on the dashboard, so that I can monitor business performance at a glance.

#### Acceptance Criteria

1. THE Dashboard SHALL display the total count of deals from the database
2. THE Dashboard SHALL display the total count of contacts from the database
3. THE Dashboard SHALL display the total count of companies from the database
4. THE Dashboard SHALL display a pipeline funnel chart showing the count of deals per Pipeline_Stage
5. THE Dashboard SHALL display the 5 most recent activities ordered by created_at timestamp descending
6. WHEN the Dashboard loads, THE Frontend_Application SHALL fetch all metrics data from Supabase_Client within 3 seconds

### Requirement 4: Application Layout

**User Story:** As a user, I want a consistent navigation layout, so that I can easily navigate between different sections of the CRM.

#### Acceptance Criteria

1. THE Frontend_Application SHALL display a Sidebar with navigation menu items: Dashboard, Contacts, Pipeline, Activities
2. THE Frontend_Application SHALL display a header with the current user's full name and avatar
3. THE Sidebar SHALL highlight the currently active menu item
4. WHEN a user clicks a menu item in the Sidebar, THE Frontend_Application SHALL navigate to the corresponding page
5. THE header SHALL display a logout button accessible from all Protected_Route pages

### Requirement 5: Contact List Display

**User Story:** As a sales representative, I want to view all contacts in a paginated table, so that I can browse and manage contact information efficiently.

#### Acceptance Criteria

1. THE Contact_List SHALL display contacts in a table with columns: first name, last name, email, phone, status, company name
2. THE Contact_List SHALL implement server-side pagination with 20 contacts per page
3. THE Contact_List SHALL display Pagination_Control for navigating between pages
4. WHEN a user navigates to a different page, THE Frontend_Application SHALL fetch the corresponding page data from Supabase_Client
5. THE Contact_List SHALL display a loading state while fetching data

### Requirement 6: Contact Search

**User Story:** As a sales representative, I want to search contacts by name or email, so that I can quickly find specific contacts.

#### Acceptance Criteria

1. THE Contact_List SHALL provide a search input field
2. WHEN a user enters a Search_Query, THE Frontend_Application SHALL filter contacts where first_name, last_name, or email contains the Search_Query (case-insensitive)
3. THE Contact_List SHALL update the displayed results within 500ms of the user stopping typing
4. WHEN a Search_Query returns zero results, THE Contact_List SHALL display a "No contacts found" message
5. WHEN a user clears the Search_Query, THE Contact_List SHALL display all contacts with pagination

### Requirement 7: Contact CRUD Operations

**User Story:** As a sales representative, I want to create, edit, and delete contacts, so that I can maintain accurate contact information.

#### Acceptance Criteria

1. THE Contact_List SHALL display a "Create Contact" button
2. WHEN a user clicks "Create Contact", THE Frontend_Application SHALL display a Contact_Form in a modal or separate page
3. THE Contact_Form SHALL include fields: first_name, last_name, email, phone, status, company_id, assigned_to
4. THE Contact_Form SHALL validate all fields using Form_Validation with zod schema before submission
5. WHEN Form_Validation fails, THE Contact_Form SHALL display field-specific error messages
6. WHEN a user submits a valid Contact_Form, THE Server_Action SHALL insert the contact into the database and refresh the Contact_List
7. THE Contact_List SHALL display an "Edit" button for each contact row
8. WHEN a user clicks "Edit", THE Frontend_Application SHALL display the Contact_Form pre-populated with existing contact data
9. WHEN a user submits an edited Contact_Form, THE Server_Action SHALL update the contact in the database
10. THE Contact_List SHALL display a "Delete" button for each contact row
11. WHEN a user clicks "Delete", THE Frontend_Application SHALL display a confirmation dialog
12. WHEN a user confirms deletion, THE Server_Action SHALL soft-delete the contact by setting deleted_at timestamp

### Requirement 8: Pipeline Kanban Board

**User Story:** As a sales representative, I want to view deals in a kanban board organized by pipeline stage, so that I can visualize the sales pipeline.

#### Acceptance Criteria

1. THE Pipeline_Board SHALL display three columns representing Pipeline_Stage: Lead, Proposal, Won
2. THE Pipeline_Board SHALL display Deal_Card components within each stage column
3. THE Deal_Card SHALL display: deal title, deal value formatted as currency, and associated contact name
4. THE Pipeline_Board SHALL fetch deals with their associated contact and stage data from Supabase_Client
5. WHEN the Pipeline_Board loads, THE Frontend_Application SHALL group deals by stage_id

### Requirement 9: Deal Drag and Drop

**User Story:** As a sales representative, I want to drag and drop deals between pipeline stages, so that I can update deal progress quickly.

#### Acceptance Criteria

1. THE Pipeline_Board SHALL enable Drag_Drop_Operation for Deal_Card components
2. WHEN a user drags a Deal_Card to a different Pipeline_Stage column, THE Frontend_Application SHALL visually indicate the drop target
3. WHEN a user drops a Deal_Card in a new Pipeline_Stage column, THE Server_Action SHALL update the deal's stage_id in the database
4. WHEN the stage update succeeds, THE Pipeline_Board SHALL reflect the new deal position without full page reload
5. WHEN the stage update fails, THE Frontend_Application SHALL revert the Deal_Card to its original position and display an error message

### Requirement 10: Activity List Display

**User Story:** As a sales representative, I want to view all activities in a list, so that I can track interactions and tasks.

#### Acceptance Criteria

1. THE Activity_List SHALL display activities in a list with: type, subject, description, due_date, completed_at, contact name
2. THE Activity_List SHALL order activities by due_date ascending (earliest first)
3. THE Activity_List SHALL visually distinguish completed activities (completed_at is not null) from pending activities
4. THE Activity_List SHALL fetch activities with associated contact data from Supabase_Client

### Requirement 11: Activity Filtering

**User Story:** As a sales representative, I want to filter activities by type, so that I can focus on specific activity categories.

#### Acceptance Criteria

1. THE Activity_List SHALL provide filter buttons for activity types: All, Call, Email, Meeting, Task
2. WHEN a user selects a filter, THE Activity_List SHALL display only activities matching the selected type
3. WHEN "All" filter is selected, THE Activity_List SHALL display activities of all types
4. THE Activity_List SHALL indicate the currently active filter visually

### Requirement 12: Activity Creation

**User Story:** As a sales representative, I want to create new activities, so that I can schedule follow-ups and tasks.

#### Acceptance Criteria

1. THE Activity_List SHALL display a "Create Activity" button
2. WHEN a user clicks "Create Activity", THE Frontend_Application SHALL display an Activity_Form
3. THE Activity_Form SHALL include fields: type, subject, description, due_date, contact_id, deal_id (optional)
4. THE Activity_Form SHALL validate all required fields using Form_Validation with zod schema
5. WHEN a user submits a valid Activity_Form, THE Server_Action SHALL insert the activity into the database with created_by set to the current user's ID
6. WHEN activity creation succeeds, THE Activity_List SHALL refresh to display the new activity

### Requirement 13: Supabase Client Configuration

**User Story:** As a developer, I want to configure Supabase client with SSR support, so that the application works correctly with Next.js App Router.

#### Acceptance Criteria

1. THE Frontend_Application SHALL use @supabase/ssr package for Supabase_Client initialization
2. THE Frontend_Application SHALL create separate client instances for server components and client components
3. THE Frontend_Application SHALL configure Supabase_Client with environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
4. THE Frontend_Application SHALL handle cookie-based session management for server-side rendering

### Requirement 14: Project Structure

**User Story:** As a developer, I want a well-organized folder structure, so that the codebase is maintainable and scalable.

#### Acceptance Criteria

1. THE Frontend_Application SHALL organize feature-specific code in src/features/[feature-name]/ directories
2. THE Frontend_Application SHALL place reusable UI components from shadcn in src/components/ui/ directory
3. THE Frontend_Application SHALL place Server_Action functions in src/actions/ directory
4. THE Frontend_Application SHALL place Supabase_Client configuration in src/lib/supabase/ directory
5. THE Frontend_Application SHALL use TypeScript strict mode for all source files

### Requirement 15: Form Validation

**User Story:** As a user, I want immediate feedback on form errors, so that I can correct mistakes before submission.

#### Acceptance Criteria

1. THE Contact_Form SHALL validate email format using zod email validator
2. THE Contact_Form SHALL validate phone format using zod string pattern validator
3. THE Contact_Form SHALL require all mandatory fields (first_name, last_name, email, phone, status, company_id, assigned_to)
4. THE Activity_Form SHALL validate due_date is not in the past
5. WHEN Form_Validation detects an error, THE form SHALL display the error message below the corresponding field
6. THE form SHALL disable the submit button while Form_Validation is in progress

### Requirement 16: Error Handling

**User Story:** As a user, I want clear error messages when operations fail, so that I understand what went wrong.

#### Acceptance Criteria

1. WHEN a Server_Action fails due to database error, THE Frontend_Application SHALL display a user-friendly error message
2. WHEN a Server_Action fails due to network error, THE Frontend_Application SHALL display a "Connection failed" message
3. WHEN Supabase_Client returns an authentication error, THE Frontend_Application SHALL redirect to the login page
4. THE Frontend_Application SHALL log detailed error information to the browser console for debugging

### Requirement 17: Loading States

**User Story:** As a user, I want visual feedback during data loading, so that I know the application is processing my request.

#### Acceptance Criteria

1. WHEN the Dashboard is fetching metrics data, THE Frontend_Application SHALL display loading skeletons for each metric card
2. WHEN the Contact_List is fetching data, THE Frontend_Application SHALL display a loading spinner
3. WHEN the Pipeline_Board is fetching deals, THE Frontend_Application SHALL display loading placeholders in each stage column
4. WHEN a form is submitting, THE Frontend_Application SHALL disable the submit button and display a loading indicator

### Requirement 18: Responsive Design

**User Story:** As a user, I want the application to work on different screen sizes, so that I can access the CRM from various devices.

#### Acceptance Criteria

1. THE Frontend_Application SHALL use Tailwind CSS responsive utilities for layout adaptation
2. WHEN viewed on mobile devices (width < 768px), THE Sidebar SHALL collapse into a hamburger menu
3. WHEN viewed on tablet devices (width >= 768px and < 1024px), THE Contact_List table SHALL remain scrollable horizontally if needed
4. WHEN viewed on desktop devices (width >= 1024px), THE Frontend_Application SHALL display the full Sidebar and content side-by-side

### Requirement 19: TypeScript Type Safety

**User Story:** As a developer, I want strong type definitions for all data models, so that I can catch errors at compile time.

#### Acceptance Criteria

1. THE Frontend_Application SHALL define TypeScript interfaces for all database tables: Profile, Company, Contact, PipelineStage, Deal, Activity
2. THE Frontend_Application SHALL define TypeScript types for all Server_Action parameters and return values
3. THE Frontend_Application SHALL define TypeScript types for all form schemas using zod
4. THE Frontend_Application SHALL enable TypeScript strict mode in tsconfig.json

### Requirement 20: Accessibility Compliance

**User Story:** As a user with disabilities, I want the application to be accessible, so that I can use assistive technologies effectively.

#### Acceptance Criteria

1. THE Frontend_Application SHALL use semantic HTML elements (nav, main, header, button, form)
2. THE Frontend_Application SHALL provide aria-label attributes for icon-only buttons
3. THE Contact_Form and Activity_Form SHALL associate labels with input fields using htmlFor attribute
4. THE Frontend_Application SHALL ensure keyboard navigation works for all interactive elements
5. THE Frontend_Application SHALL maintain color contrast ratio of at least 4.5:1 for text content

