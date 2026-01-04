-- Backfill missing user_profiles and ensure trigger is in place
-- Run this in Supabase SQL Editor

-- Step 1: Backfill missing profiles for existing auth.users
INSERT INTO public.user_profiles (id, email, role, disabled, created_at)
SELECT 
  u.id, 
  u.email, 
  NULL as role,
  false as disabled,
  COALESCE(u.created_at, NOW()) as created_at
FROM auth.users u
LEFT JOIN public.user_profiles p ON p.id = u.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- Step 2: Create/replace trigger function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, role, disabled, created_at)
  VALUES (NEW.id, NEW.email, NULL, false, NOW())
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Step 3: Drop and recreate trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Step 4: Reload PostgREST schema cache
NOTIFY pgrst, 'reload schema';

