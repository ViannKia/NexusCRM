-- ============================================================================
-- FIX: Infinite Recursion in RLS Policies
-- ============================================================================
-- Problem: Policies on profiles, contacts, companies, deals, activities
-- all use subquery "SELECT 1 FROM profiles WHERE id = auth.uid()"
-- which triggers the profiles RLS policy again → infinite recursion.
--
-- Solution: Create a SECURITY DEFINER function that bypasses RLS
-- to safely check the current user's role.
--
-- Run this in Supabase SQL Editor
-- ============================================================================

-- Step 1: Create a helper function that checks user role WITHOUT triggering RLS
-- SECURITY DEFINER means it runs as the function owner (postgres), bypassing RLS
CREATE OR REPLACE FUNCTION get_current_user_role()
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$;

-- Step 2: Drop the recursive policy on profiles and replace it
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (get_current_user_role() = 'admin');

-- Also add INSERT/UPDATE policies for profiles so users can manage their own profile
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Step 3: Fix companies policies
DROP POLICY IF EXISTS "Admins can view all companies" ON companies;
CREATE POLICY "Admins can view all companies"
  ON companies FOR SELECT
  USING (get_current_user_role() = 'admin');

DROP POLICY IF EXISTS "Admins can insert companies" ON companies;
CREATE POLICY "Admins can insert companies"
  ON companies FOR INSERT
  WITH CHECK (get_current_user_role() IN ('admin', 'manager', 'sales'));

DROP POLICY IF EXISTS "Users can insert companies" ON companies;
CREATE POLICY "Users can insert companies"
  ON companies FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Admins can update companies" ON companies;
CREATE POLICY "Admins can update companies"
  ON companies FOR UPDATE
  USING (get_current_user_role() = 'admin' OR assigned_to = auth.uid());

DROP POLICY IF EXISTS "Admins can delete companies" ON companies;
CREATE POLICY "Admins can delete companies"
  ON companies FOR DELETE
  USING (get_current_user_role() = 'admin' OR assigned_to = auth.uid());

-- Step 4: Fix contacts policies
DROP POLICY IF EXISTS "Admins can view all contacts" ON contacts;
CREATE POLICY "Admins can view all contacts"
  ON contacts FOR SELECT
  USING (get_current_user_role() = 'admin');

DROP POLICY IF EXISTS "Users can insert contacts" ON contacts;
CREATE POLICY "Users can insert contacts"
  ON contacts FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Admins can update contacts" ON contacts;
CREATE POLICY "Admins can update contacts"
  ON contacts FOR UPDATE
  USING (get_current_user_role() = 'admin' OR assigned_to = auth.uid());

DROP POLICY IF EXISTS "Admins can delete contacts" ON contacts;
CREATE POLICY "Admins can delete contacts"
  ON contacts FOR DELETE
  USING (get_current_user_role() = 'admin' OR assigned_to = auth.uid());

-- Step 5: Fix deals policies
DROP POLICY IF EXISTS "Admins can view all deals" ON deals;
CREATE POLICY "Admins can view all deals"
  ON deals FOR SELECT
  USING (get_current_user_role() = 'admin');

DROP POLICY IF EXISTS "Users can insert deals" ON deals;
CREATE POLICY "Users can insert deals"
  ON deals FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Admins can update deals" ON deals;
CREATE POLICY "Admins can update deals"
  ON deals FOR UPDATE
  USING (get_current_user_role() = 'admin' OR assigned_to = auth.uid());

DROP POLICY IF EXISTS "Admins can delete deals" ON deals;
CREATE POLICY "Admins can delete deals"
  ON deals FOR DELETE
  USING (get_current_user_role() = 'admin' OR assigned_to = auth.uid());

-- Step 6: Fix activities policies
DROP POLICY IF EXISTS "Admins can view all activities" ON activities;
CREATE POLICY "Admins can view all activities"
  ON activities FOR SELECT
  USING (get_current_user_role() = 'admin');

DROP POLICY IF EXISTS "Users can insert activities" ON activities;
CREATE POLICY "Users can insert activities"
  ON activities FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Admins can update activities" ON activities;
CREATE POLICY "Admins can update activities"
  ON activities FOR UPDATE
  USING (get_current_user_role() = 'admin' OR created_by = auth.uid());

DROP POLICY IF EXISTS "Admins can delete activities" ON activities;
CREATE POLICY "Admins can delete activities"
  ON activities FOR DELETE
  USING (get_current_user_role() = 'admin' OR created_by = auth.uid());

-- ============================================================================
-- DONE
-- ============================================================================
