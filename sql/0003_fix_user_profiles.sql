-- Fix user_profiles creation and backfill
-- Run this in Supabase SQL Editor AFTER the main schema (0001_init.sql)

-- Ensure user_profiles table exists with correct structure
DO $$
BEGIN
  -- Create table if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_profiles') THEN
    CREATE TABLE public.user_profiles (
      id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
      role TEXT CHECK (role IN ('client', 'coach', 'gym_owner', 'admin')),
      full_name TEXT,
      phone TEXT,
      email TEXT,
      location_text TEXT,
      postcode TEXT,
      profile_photo_url TEXT,
      disabled BOOLEAN NOT NULL DEFAULT false,
      disabled_reason TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  END IF;

  -- Add missing columns if they don't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'user_profiles' 
    AND column_name = 'role'
  ) THEN
    ALTER TABLE public.user_profiles ADD COLUMN role TEXT CHECK (role IN ('client', 'coach', 'gym_owner', 'admin'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'user_profiles' 
    AND column_name = 'full_name'
  ) THEN
    ALTER TABLE public.user_profiles ADD COLUMN full_name TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'user_profiles' 
    AND column_name = 'phone'
  ) THEN
    ALTER TABLE public.user_profiles ADD COLUMN phone TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'user_profiles' 
    AND column_name = 'postcode'
  ) THEN
    ALTER TABLE public.user_profiles ADD COLUMN postcode TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'user_profiles' 
    AND column_name = 'created_at'
  ) THEN
    ALTER TABLE public.user_profiles ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'user_profiles' 
    AND column_name = 'disabled'
  ) THEN
    ALTER TABLE public.user_profiles ADD COLUMN disabled BOOLEAN NOT NULL DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'user_profiles' 
    AND column_name = 'disabled_reason'
  ) THEN
    ALTER TABLE public.user_profiles ADD COLUMN disabled_reason TEXT;
  END IF;
END $$;

-- Create/replace trigger function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, role, created_at)
  VALUES (NEW.id, NEW.email, NULL, NOW())
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger if it doesn't exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Backfill: Insert missing profile rows for existing auth.users
INSERT INTO public.user_profiles (id, email, role, created_at)
SELECT 
  au.id,
  au.email,
  NULL as role,
  COALESCE(au.created_at, NOW()) as created_at
FROM auth.users au
LEFT JOIN public.user_profiles up ON au.id = up.id
WHERE up.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- Notify PostgREST to reload schema
NOTIFY pgrst, 'reload schema';

