-- 1on1 MVP Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Invites table (for invite-only signup)
CREATE TABLE IF NOT EXISTS invites (
  code TEXT PRIMARY KEY,
  assigned_role TEXT NOT NULL CHECK (assigned_role IN ('client', 'coach', 'gym_owner', 'admin')),
  assigned_email TEXT,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User profiles
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('client', 'coach', 'gym_owner', 'admin')),
  full_name TEXT,
  phone TEXT,
  email TEXT,
  location_text TEXT,
  postcode TEXT,
  profile_photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Coach profiles
CREATE TABLE IF NOT EXISTS coach_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES user_profiles(id) ON DELETE CASCADE,
  bio TEXT,
  specialties TEXT[],
  experience_years INT,
  qualifications TEXT[],
  tokens_per_hour INT,
  travel_radius_miles INT,
  languages TEXT[],
  verification_status TEXT CHECK (verification_status IN ('pending', 'verified', 'rejected')) DEFAULT 'pending',
  background_check_status TEXT CHECK (background_check_status IN ('pending', 'passed', 'failed')) DEFAULT 'pending',
  insurance_status TEXT CHECK (insurance_status IN ('pending', 'valid', 'invalid')) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Gym profiles
CREATE TABLE IF NOT EXISTS gym_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT,
  postcode TEXT,
  geo_lat DOUBLE PRECISION,
  geo_lng DOUBLE PRECISION,
  bio TEXT,
  facilities_text TEXT,
  amenities TEXT[],
  cctv_available BOOLEAN DEFAULT FALSE,
  rules TEXT,
  eligibility_require_verified BOOLEAN DEFAULT FALSE,
  eligibility_require_background_passed BOOLEAN DEFAULT FALSE,
  eligibility_required_qualifications TEXT[] DEFAULT '{}',
  photos TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Gym spaces
CREATE TABLE IF NOT EXISTS gym_spaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gym_id UUID REFERENCES gym_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  capacity INT,
  suitable_for TEXT[],
  tokens_per_hour INT DEFAULT 0,
  photos TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Availability rules (recurring)
CREATE TABLE IF NOT EXISTS availability_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_type TEXT NOT NULL CHECK (owner_type IN ('gym_space', 'coach')),
  owner_id UUID NOT NULL,
  day_of_week INT CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME,
  end_time TIME,
  recurring BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Availability overrides (one-time)
CREATE TABLE IF NOT EXISTS availability_overrides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_type TEXT NOT NULL CHECK (owner_type IN ('gym_space', 'coach')),
  owner_id UUID NOT NULL,
  date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Gym booking requests (coach requests gym space)
CREATE TABLE IF NOT EXISTS gym_booking_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  space_id UUID REFERENCES gym_spaces(id) ON DELETE CASCADE,
  trainer_user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  date DATE,
  start_time TIME,
  end_time TIME,
  status TEXT CHECK (status IN ('requested', 'approved', 'declined', 'cancelled', 'completed')) DEFAULT 'requested',
  tokens_quoted INT,
  entry_code_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Entry codes (for gym access)
CREATE TABLE IF NOT EXISTS entry_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  space_id UUID REFERENCES gym_spaces(id) ON DELETE CASCADE,
  code TEXT,
  valid_from TIMESTAMPTZ,
  valid_to TIMESTAMPTZ,
  status TEXT CHECK (status IN ('active', 'expired')) DEFAULT 'active',
  reset_after_use BOOLEAN DEFAULT TRUE,
  last_rotated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Coach session requests (client requests coach)
CREATE TABLE IF NOT EXISTS coach_session_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  client_user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  date_time_preferred TIMESTAMPTZ,
  duration_mins INT,
  status TEXT CHECK (status IN ('requested', 'accepted', 'declined', 'cancelled', 'completed')) DEFAULT 'requested',
  location_type TEXT CHECK (location_type IN ('in_gym', 'remote', 'outdoor')) DEFAULT 'remote',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID NOT NULL,
  from_user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  to_user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  body TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewer_user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  target_type TEXT CHECK (target_type IN ('coach', 'gym')),
  target_id UUID NOT NULL,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Verification checks
CREATE TABLE IF NOT EXISTS verification_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('identity', 'qualification', 'background')),
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add foreign key for entry_code_id in gym_booking_requests
ALTER TABLE gym_booking_requests 
  ADD CONSTRAINT fk_entry_code FOREIGN KEY (entry_code_id) REFERENCES entry_codes(id);

-- Enable Row Level Security on all tables
ALTER TABLE invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE coach_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE gym_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE gym_spaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability_overrides ENABLE ROW LEVEL SECURITY;
ALTER TABLE gym_booking_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE entry_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE coach_session_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_checks ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Invites: Only admins can read/write (for MVP, allow authenticated users to check validity during signup)
CREATE POLICY "Invites can be checked during signup" ON invites
  FOR SELECT USING (true);

-- User profiles: Users can read their own, public can read basic info
CREATE POLICY "Users can read own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Public can read basic profile info" ON user_profiles
  FOR SELECT USING (true);

-- Coach profiles: Public read, coaches can manage their own
CREATE POLICY "Public can read coach profiles" ON coach_profiles
  FOR SELECT USING (true);

CREATE POLICY "Coaches can manage own profile" ON coach_profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = coach_profiles.user_id 
      AND user_profiles.id = auth.uid()
      AND user_profiles.role = 'coach'
    )
  );

-- Gym profiles: Public read, owners can manage their own
CREATE POLICY "Public can read gym profiles" ON gym_profiles
  FOR SELECT USING (true);

CREATE POLICY "Gym owners can manage own gyms" ON gym_profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = gym_profiles.owner_user_id 
      AND user_profiles.id = auth.uid()
      AND user_profiles.role = 'gym_owner'
    )
  );

-- Gym spaces: Public read, owners can manage through gym ownership
CREATE POLICY "Public can read gym spaces" ON gym_spaces
  FOR SELECT USING (true);

CREATE POLICY "Gym owners can manage spaces" ON gym_spaces
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM gym_profiles 
      WHERE gym_profiles.id = gym_spaces.gym_id 
      AND gym_profiles.owner_user_id = auth.uid()
    )
  );

-- Availability rules: Public read, owners can manage
CREATE POLICY "Public can read availability rules" ON availability_rules
  FOR SELECT USING (true);

CREATE POLICY "Coaches can manage own availability" ON availability_rules
  FOR ALL USING (
    owner_type = 'coach' AND
    EXISTS (
      SELECT 1 FROM coach_profiles 
      WHERE coach_profiles.id = availability_rules.owner_id 
      AND coach_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Gym owners can manage space availability" ON availability_rules
  FOR ALL USING (
    owner_type = 'gym_space' AND
    EXISTS (
      SELECT 1 FROM gym_spaces 
      JOIN gym_profiles ON gym_spaces.gym_id = gym_profiles.id
      WHERE gym_spaces.id = availability_rules.owner_id 
      AND gym_profiles.owner_user_id = auth.uid()
    )
  );

-- Availability overrides: Same as rules
CREATE POLICY "Public can read availability overrides" ON availability_overrides
  FOR SELECT USING (true);

CREATE POLICY "Coaches can manage own availability overrides" ON availability_overrides
  FOR ALL USING (
    owner_type = 'coach' AND
    EXISTS (
      SELECT 1 FROM coach_profiles 
      WHERE coach_profiles.id = availability_overrides.owner_id 
      AND coach_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Gym owners can manage space availability overrides" ON availability_overrides
  FOR ALL USING (
    owner_type = 'gym_space' AND
    EXISTS (
      SELECT 1 FROM gym_spaces 
      JOIN gym_profiles ON gym_spaces.gym_id = gym_profiles.id
      WHERE gym_spaces.id = availability_overrides.owner_id 
      AND gym_profiles.owner_user_id = auth.uid()
    )
  );

-- Gym booking requests: Trainers can create/read their own, gym owners can read/manage for their spaces
CREATE POLICY "Trainers can manage own booking requests" ON gym_booking_requests
  FOR ALL USING (trainer_user_id = auth.uid());

CREATE POLICY "Gym owners can manage booking requests for their spaces" ON gym_booking_requests
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM gym_spaces 
      JOIN gym_profiles ON gym_spaces.gym_id = gym_profiles.id
      WHERE gym_spaces.id = gym_booking_requests.space_id 
      AND gym_profiles.owner_user_id = auth.uid()
    )
  );

-- Entry codes: Gym owners can manage for their spaces
CREATE POLICY "Gym owners can manage entry codes" ON entry_codes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM gym_spaces 
      JOIN gym_profiles ON gym_spaces.gym_id = gym_profiles.id
      WHERE gym_spaces.id = entry_codes.space_id 
      AND gym_profiles.owner_user_id = auth.uid()
    )
  );

-- Coach session requests: Clients and coaches can manage their own
CREATE POLICY "Users can manage session requests they're involved in" ON coach_session_requests
  FOR ALL USING (
    client_user_id = auth.uid() OR coach_user_id = auth.uid()
  );

-- Messages: Users can read/write their own messages
CREATE POLICY "Users can manage own messages" ON messages
  FOR ALL USING (
    from_user_id = auth.uid() OR to_user_id = auth.uid()
  );

-- Reviews: Public can read, users can create their own
CREATE POLICY "Public can read reviews" ON reviews
  FOR SELECT USING (true);

CREATE POLICY "Users can create own reviews" ON reviews
  FOR INSERT WITH CHECK (reviewer_user_id = auth.uid());

-- Verification checks: Users can read their own, admins can manage all
CREATE POLICY "Users can read own verification checks" ON verification_checks
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all verification checks" ON verification_checks
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role = 'admin'
    )
  );

-- Function to automatically create user_profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user_profile on auth.users insert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

