# Implementation Plan: NexusCRM Frontend

## Overview

This implementation plan breaks down the NexusCRM Frontend feature into discrete, actionable coding tasks. The application is a Next.js 16 App Router application with TypeScript, Tailwind CSS, shadcn/ui components, and Supabase integration. The implementation follows a server-first architecture with progressive enhancement.

The tasks are organized to build incrementally: starting with project setup and configuration, then implementing core authentication and layout, followed by feature-specific pages (dashboard, contacts, pipeline, activities), and finally adding polish with error handling and loading states.

## Tasks

- [x] 1. Project setup and dependencies installation
  - Install required npm packages: @supabase/ssr, @supabase/supabase-js, react-hook-form, @hookform/resolvers, zod, @dnd-kit/core, lucide-react, use-debounce
  - Install shadcn/ui CLI and initialize with default configuration
  - Configure environment variables in .env.local (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)
  - Verify Next.js 16.2.6, React 19, TypeScript 5, and Tailwind CSS 4 are properly configured
  - _Requirements: 13, 14, 19_

- [x] 2. Supabase client configuration
  - [x] 2.1 Create Supabase client utilities
    - Create src/lib/supabase/client.ts for browser client using createBrowserClient
    - Create src/lib/supabase/server.ts for server component client using createServerClient with cookies
    - Create src/lib/supabase/middleware.ts for middleware client with session refresh logic
    - _Requirements: 13_
  
  - [x] 2.2 Create middleware for route protection
    - Create src/middleware.ts with authentication check logic
    - Implement redirect to /login for unauthenticated users accessing protected routes
    - Implement redirect to / for authenticated users accessing /login
    - Configure matcher to exclude static assets and Next.js internal routes
    - _Requirements: 2, 4_

- [x] 3. TypeScript types and validation schemas
  - [x] 3.1 Create database type definitions
    - Create src/types/database.ts with interfaces for Profile, Company, Contact, PipelineStage, Deal, Activity
    - Create extended types: ContactWithCompany, DealWithRelations, ActivityWithRelations
    - Create form types: ContactFormData, ActivityFormData, DealFormData
    - Create ActionResponse<T> type for server action responses
    - Create DashboardMetrics type
    - _Requirements: 19_
  
  - [x] 3.2 Create Zod validation schemas
    - Create src/lib/validations/contact.ts with contactFormSchema
    - Create src/lib/validations/activity.ts with activityFormSchema
    - Create src/lib/validations/deal.ts with dealFormSchema
    - Export TypeScript types inferred from Zod schemas
    - _Requirements: 15, 19_
  
  - [x] 3.3 Create utility functions
    - Create src/lib/utils.ts with cn() function for className merging
    - Add any additional utility functions needed for formatting (currency, dates)
    - _Requirements: 14_

- [x] 4. Install and configure shadcn/ui components
  - Install shadcn/ui components: button, input, label, card, dialog, form, table, select, skeleton, avatar, textarea
  - Verify components are created in src/components/ui/ directory
  - Ensure Tailwind CSS configuration includes shadcn/ui theme settings
  - _Requirements: 14, 18_

- [x] 5. Authentication implementation
  - [x] 5.1 Create authentication server actions
    - Create src/actions/auth.ts with login() and logout() server actions
    - Implement login with email/password using Supabase signInWithPassword
    - Implement logout with session termination and redirect
    - Add proper error handling and return ActionResponse types
    - _Requirements: 1, 16_
  
  - [x] 5.2 Create login page
    - Create src/app/(auth)/layout.tsx for centered auth layout without sidebar
    - Create src/app/(auth)/login/page.tsx as client component
    - Implement form with email and password inputs using shadcn/ui components
    - Add form submission handler calling login server action
    - Display error messages for authentication failures
    - Add loading state during authentication
    - _Requirements: 1, 15, 17_

- [x] 6. Dashboard layout components
  - [x] 6.1 Create sidebar navigation
    - Create src/components/layout/sidebar.tsx as client component
    - Add navigation items: Dashboard (/), Contacts (/contacts), Pipeline (/pipeline), Activities (/activities)
    - Implement active route highlighting using usePathname
    - Add icons from lucide-react for each menu item
    - Style with Tailwind CSS for fixed width and vertical layout
    - _Requirements: 4, 18_
  
  - [x] 6.2 Create header component
    - Create src/components/layout/header.tsx as client component
    - Display user avatar using shadcn/ui Avatar component
    - Display user full name and role from Profile
    - Add logout button with form action calling logout server action
    - Style with Tailwind CSS for horizontal layout
    - _Requirements: 4, 5_
  
  - [x] 6.3 Create dashboard layout
    - Create src/app/(dashboard)/layout.tsx as server component
    - Fetch authenticated user and profile data from Supabase
    - Redirect to /login if user is not authenticated
    - Render Sidebar and Header components
    - Render children in main content area with proper spacing
    - _Requirements: 2, 4_

- [x] 7. Dashboard page implementation
  - [x] 7.1 Create dashboard metric components
    - Create src/components/features/dashboard/metric-card.tsx for displaying single metric
    - Create src/components/features/dashboard/pipeline-chart.tsx for pipeline funnel visualization
    - Create src/components/features/dashboard/recent-activities.tsx for activity list
    - _Requirements: 3_
  
  - [x] 7.2 Implement dashboard page
    - Create src/app/(dashboard)/page.tsx as server component
    - Fetch dashboard metrics: total deals, contacts, companies counts
    - Fetch pipeline funnel data grouped by stage
    - Fetch 5 most recent activities with relations
    - Use Promise.all for parallel data fetching
    - Render MetricCard components in grid layout
    - Render PipelineChart and RecentActivities components
    - Add loading skeletons using Suspense boundaries
    - _Requirements: 3, 6, 17_

- [x] 8. Contact management - list and search
  - [x] 8.1 Create contact server actions
    - Create src/actions/contacts.ts with createContact, updateContact, deleteContact, searchContacts server actions
    - Implement authentication checks in all actions
    - Implement Zod validation for create and update actions
    - Implement soft delete by setting deleted_at timestamp
    - Add revalidatePath calls after mutations
    - Return ActionResponse types with proper error handling
    - _Requirements: 7, 16_
  
  - [x] 8.2 Create contact search component
    - Create src/components/features/contacts/contact-search.tsx as client component
    - Implement search input with debounced onChange handler (500ms)
    - Update URL search params with query string
    - Reset to page 1 when search query changes
    - Add search icon from lucide-react
    - _Requirements: 6_
  
  - [x] 8.3 Create contact table component
    - Create src/components/features/contacts/contact-table.tsx as server component
    - Display contacts in table with columns: first name, last name, email, phone, status, company name
    - Add Edit and Delete buttons for each row
    - Implement pagination controls with page numbers
    - Display "No contacts found" message when empty
    - _Requirements: 5, 7_
  
  - [x] 8.4 Create contacts list page
    - Create src/app/(dashboard)/contacts/page.tsx as server component
    - Extract search query and page number from searchParams
    - Fetch contacts from Supabase with search filter and pagination (20 per page)
    - Calculate total pages from count
    - Render ContactSearch and ContactTable components
    - Add "Create Contact" button linking to /contacts/new
    - Add loading.tsx with skeleton placeholders
    - _Requirements: 5, 6, 17_

- [x] 9. Contact management - CRUD forms
  - [x] 9.1 Create contact form component
    - Create src/components/features/contacts/contact-form.tsx as client component
    - Implement react-hook-form with zodResolver for contactFormSchema
    - Add input fields: first_name, last_name, email, phone
    - Add select fields: status, company_id, assigned_to
    - Display field-specific validation errors below inputs
    - Disable form during submission with loading state
    - Call createContact or updateContact server action on submit
    - Redirect to /contacts on success with router.refresh()
    - _Requirements: 7, 15, 17_
  
  - [x] 9.2 Create contact create page
    - Create src/app/(dashboard)/contacts/new/page.tsx as server component
    - Fetch companies and users (profiles) for select options
    - Render ContactForm component without initial contact data
    - _Requirements: 7_
  
  - [x] 9.3 Create contact edit page
    - Create src/app/(dashboard)/contacts/[id]/page.tsx as server component
    - Fetch contact by ID with company relation
    - Fetch companies and users for select options
    - Render ContactForm component with pre-populated contact data
    - _Requirements: 7_
  
  - [x] 9.4 Add delete confirmation dialog
    - Add confirmation dialog to contact table Delete button
    - Use shadcn/ui Dialog component for confirmation
    - Call deleteContact server action on confirmation
    - Refresh contact list after successful deletion
    - _Requirements: 7_

- [x] 10. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 11. Pipeline kanban board implementation
  - [x] 11.1 Create deal server actions
    - Create src/actions/deals.ts with updateDealStage and createDeal server actions
    - Implement authentication checks in all actions
    - Implement Zod validation for createDeal
    - Add revalidatePath('/pipeline') after mutations
    - Return ActionResponse types with proper error handling
    - _Requirements: 9, 16_
  
  - [x] 11.2 Create deal card component
    - Create src/components/features/pipeline/deal-card.tsx as client component
    - Implement useDraggable hook from @dnd-kit/core
    - Display deal title, value (formatted as currency), contact name, expected close date
    - Apply transform styles during drag operation
    - Add cursor-grab and active:cursor-grabbing styles
    - _Requirements: 8, 9_
  
  - [x] 11.3 Create stage column component
    - Create src/components/features/pipeline/stage-column.tsx as client component
    - Implement useDroppable hook from @dnd-kit/core with stage.id
    - Display stage name, deal count, and total value
    - Apply border-top color from stage.color
    - Render DealCard components for deals in this stage
    - Highlight drop zone with bg-blue-50 when isOver is true
    - _Requirements: 8, 9_
  
  - [x] 11.4 Create kanban board component
    - Create src/components/features/pipeline/kanban-board.tsx as client component
    - Implement DndContext with PointerSensor (activationConstraint: distance 8)
    - Implement onDragStart to set activeDeal state
    - Implement onDragEnd to call updateDealStage server action
    - Group deals by stage_id into dealsByStage object
    - Render StageColumn components for each stage
    - Render DragOverlay with activeDeal
    - Call router.refresh() on successful stage update
    - _Requirements: 8, 9_
  
  - [x] 11.5 Create pipeline page
    - Create src/app/(dashboard)/pipeline/page.tsx as server component
    - Fetch pipeline stages ordered by order ascending
    - Fetch deals with contact and stage relations, filtered by deleted_at is null
    - Use Promise.all for parallel fetching
    - Render KanbanBoard component with stages and deals
    - Add loading.tsx with skeleton placeholders
    - _Requirements: 8, 9, 17_

- [x] 12. Activity management implementation
  - [x] 12.1 Create activity server actions
    - Create src/actions/activities.ts with createActivity and completeActivity server actions
    - Implement authentication checks in all actions
    - Set created_by to current user ID in createActivity
    - Set completed_at to current timestamp in completeActivity
    - Add revalidatePath('/activities') after mutations
    - Return ActionResponse types with proper error handling
    - _Requirements: 12, 16_
  
  - [x] 12.2 Create activity filters component
    - Create src/components/features/activities/activity-filters.tsx as client component
    - Render filter buttons: All, Calls, Emails, Meetings, Tasks
    - Update URL search params with selected type filter
    - Highlight active filter with variant="default"
    - _Requirements: 11_
  
  - [x] 12.3 Create activity item component
    - Create src/components/features/activities/activity-item.tsx as client component
    - Display activity icon based on type (Phone, Mail, Calendar, CheckSquare from lucide-react)
    - Display subject, contact name, deal title (if exists), due date
    - Apply line-through style and opacity for completed activities
    - Highlight past due activities with red text color
    - Add "Complete" button calling completeActivity server action
    - Hide "Complete" button for already completed activities
    - _Requirements: 10, 12_
  
  - [x] 12.4 Create activity list component
    - Create src/components/features/activities/activity-list.tsx as server component
    - Render ActivityItem components for each activity
    - Display "No activities found" message when empty
    - _Requirements: 10_
  
  - [x] 12.5 Create activity form component
    - Create src/components/features/activities/activity-form.tsx as client component
    - Implement react-hook-form with zodResolver for activityFormSchema
    - Add select field for type (call, email, meeting, task)
    - Add input fields: subject, due_date (datetime-local)
    - Add textarea for description
    - Add select fields: contact_id, deal_id (optional)
    - Display field-specific validation errors
    - Disable form during submission with loading state
    - Call createActivity server action on submit
    - Redirect to /activities on success
    - _Requirements: 12, 15, 17_
  
  - [x] 12.6 Create activities page
    - Create src/app/(dashboard)/activities/page.tsx as server component
    - Extract type filter from searchParams
    - Fetch activities with contact and deal relations, filtered by deleted_at is null
    - Apply type filter if not "all"
    - Order activities by due_date ascending
    - Render ActivityFilters and ActivityList components
    - Add "Create Activity" button linking to /activities/new
    - Add loading.tsx with skeleton placeholders
    - _Requirements: 10, 11, 17_
  
  - [x] 12.7 Create activity create page
    - Create src/app/(dashboard)/activities/new/page.tsx as server component
    - Fetch contacts and deals for select options
    - Render ActivityForm component
    - _Requirements: 12_

- [x] 13. Error handling and loading states
  - [x] 13.1 Add error boundaries
    - Create src/app/error.tsx for global error boundary
    - Display user-friendly error messages with retry button
    - Log detailed error information to console
    - _Requirements: 16_
  
  - [x] 13.2 Add loading states to all pages
    - Verify loading.tsx exists for /contacts, /pipeline, /activities
    - Use shadcn/ui Skeleton components for loading placeholders
    - Match skeleton layout to actual page layout
    - _Requirements: 17_
  
  - [x] 13.3 Add error handling to server actions
    - Verify all server actions have try-catch blocks
    - Return user-friendly error messages in ActionResponse
    - Log detailed errors to console for debugging
    - Handle Supabase authentication errors with redirect to /login
    - _Requirements: 16_

- [x] 14. Responsive design implementation
  - [x] 14.1 Add mobile navigation
    - Create src/components/layout/mobile-nav.tsx with hamburger menu
    - Show mobile nav on screens < 768px width
    - Hide desktop sidebar on mobile screens
    - _Requirements: 18_
  
  - [x] 14.2 Add responsive utilities
    - Apply Tailwind responsive classes to all layouts (md:, lg: breakpoints)
    - Ensure tables are horizontally scrollable on mobile
    - Test grid layouts collapse properly on mobile
    - Ensure forms stack vertically on mobile
    - _Requirements: 18_

- [x] 15. Accessibility improvements
  - [x] 15.1 Add ARIA labels
    - Add aria-label to icon-only buttons (logout, edit, delete)
    - Add aria-label to search input
    - Ensure all interactive elements have accessible names
    - _Requirements: 20_
  
  - [x] 15.2 Verify semantic HTML
    - Verify nav, main, header, button, form elements are used correctly
    - Ensure form labels use htmlFor attribute
    - Test keyboard navigation for all interactive elements
    - _Requirements: 20_
  
  - [x] 15.3 Verify color contrast
    - Check text color contrast ratios meet WCAG AA standard (4.5:1)
    - Verify button and link colors have sufficient contrast
    - Test with browser accessibility tools
    - _Requirements: 20_

- [x] 16. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- All tasks reference specific requirements for traceability
- No property-based tests are included since this is a UI/CRUD application without universal correctness properties
- Each task builds incrementally on previous tasks
- Server components are used for data fetching, client components for interactivity
- All forms use react-hook-form with Zod validation for type safety
- All mutations use Next.js Server Actions with revalidatePath for cache invalidation
- Checkpoints ensure validation at reasonable breaks
