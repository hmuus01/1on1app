-- Admin User Management Migration
-- Run this in Supabase SQL Editor AFTER the main schema (0001_init.sql)
-- This safely adds admin user management columns and policies

-- Add disabled columns to user_profiles if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'user_profiles' 
    AND column_name = 'disabled'
  ) THEN
    ALTER TABLE public.user_profiles 
    ADD COLUMN disabled BOOLEAN NOT NULL DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'user_profiles' 
    AND column_name = 'disabled_reason'
  ) THEN
    ALTER TABLE public.user_profiles 
    ADD COLUMN disabled_reason TEXT NULL;
  END IF;
END $$;

-- Drop existing policies that we need to replace
DROP POLICY IF EXISTS "Users can read own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Public can read basic profile info" ON user_profiles;

-- New RLS Policies for user_profiles

-- Users can SELECT their own profile only when disabled=false
CREATE POLICY "Users can read own active profile" ON user_profiles
  FOR SELECT 
  USING (
    auth.uid() = id 
    AND disabled = false
  );

-- Admins can SELECT any user profile (including disabled)
CREATE POLICY "Admins can read all profiles" ON user_profiles
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Users can UPDATE their own profile only when disabled=false
-- Non-admins cannot update role or disabled fields
CREATE POLICY "Users can update own active profile" ON user_profiles
  FOR UPDATE 
  USING (
    auth.uid() = id 
    AND disabled = false
  )
  WITH CHECK (
    auth.uid() = id 
    AND disabled = false
    AND (
      -- Non-admins cannot change role or disabled fields
      NOT EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() 
        AND role = 'admin'
      )
      OR role = (SELECT role FROM user_profiles WHERE id = auth.uid())
      OR disabled = (SELECT disabled FROM user_profiles WHERE id = auth.uid())
    )
  );

-- Admins can UPDATE any user profile
CREATE POLICY "Admins can update all profiles" ON user_profiles
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Keep existing insert policy
-- (Users can insert own profile - already exists, but ensure it's there)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'user_profiles' 
    AND policyname = 'Users can insert own profile'
  ) THEN
    CREATE POLICY "Users can insert own profile" ON user_profiles
      FOR INSERT WITH CHECK (auth.uid() = id);
  END IF;
END $$;

-- Keep public read for basic info (for browsing coaches/gyms)
-- But exclude disabled users
CREATE POLICY "Public can read basic active profile info" ON user_profiles
  FOR SELECT 
  USING (disabled = false);

-- Notify PostgREST to reload schema
NOTIFY pgrst, 'reload schema';

