-- Copy of seed_demo.sql for migrations folder
-- This creates demo data that can be browsed without requiring real auth users

-- Demo user profiles (using fixed UUIDs that won't conflict)
INSERT INTO user_profiles (id, role, full_name, email, postcode, location_text) VALUES
  ('00000000-0000-0000-0000-000000000001', 'coach', 'John Smith', 'john.smith@demo.com', 'SW1A 1AA', 'London'),
  ('00000000-0000-0000-0000-000000000002', 'coach', 'Sarah Johnson', 'sarah.j@demo.com', 'E1 6AN', 'London'),
  ('00000000-0000-0000-0000-000000000003', 'coach', 'Mike Williams', 'mike.w@demo.com', 'NW1 6XE', 'London'),
  ('00000000-0000-0000-0000-000000000004', 'coach', 'Emma Brown', 'emma.b@demo.com', 'SE1 9RT', 'London'),
  ('00000000-0000-0000-0000-000000000005', 'coach', 'David Lee', 'david.l@demo.com', 'W1K 6TN', 'London'),
  ('00000000-0000-0000-0000-000000000006', 'coach', 'Lisa Chen', 'lisa.c@demo.com', 'N1 9GU', 'London'),
  ('00000000-0000-0000-0000-000000000010', 'gym_owner', 'Gym Owner 1', 'owner1@demo.com', 'SW1A 1AA', 'London'),
  ('00000000-0000-0000-0000-000000000011', 'gym_owner', 'Gym Owner 2', 'owner2@demo.com', 'E1 6AN', 'London'),
  ('00000000-0000-0000-0000-000000000012', 'gym_owner', 'Gym Owner 3', 'owner3@demo.com', 'NW1 6XE', 'London')
ON CONFLICT (id) DO NOTHING;

-- Coach profiles
INSERT INTO coach_profiles (user_id, bio, specialties, experience_years, qualifications, tokens_per_hour, travel_radius_miles, verification_status, background_check_status, insurance_status) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Experienced boxing coach with 10+ years training athletes of all levels.', ARRAY['boxing', 'strength'], 10, ARRAY['Level 3 Boxing Coach'], 15, 15, 'verified', 'passed', 'valid'),
  ('00000000-0000-0000-0000-000000000002', 'Yoga and mindfulness instructor specializing in vinyasa and restorative yoga.', ARRAY['yoga', 'pilates'], 8, ARRAY['200hr Yoga Teacher Training'], 12, 20, 'verified', 'passed', 'valid'),
  ('00000000-0000-0000-0000-000000000003', 'Personal trainer focused on strength and conditioning.', ARRAY['strength', 'cardio'], 6, ARRAY['Level 3 Personal Trainer'], 10, 10, 'pending', 'pending', 'pending'),
  ('00000000-0000-0000-0000-000000000004', 'Martial arts instructor teaching kickboxing and self-defense.', ARRAY['martial_arts', 'boxing'], 12, ARRAY['Black Belt Kickboxing'], 18, 12, 'verified', 'passed', 'valid'),
  ('00000000-0000-0000-0000-000000000005', 'Cardio and HIIT specialist helping clients achieve their fitness goals.', ARRAY['cardio', 'personal_training'], 5, ARRAY['Level 2 Fitness Instructor'], 8, 25, 'pending', 'pending', 'pending'),
  ('00000000-0000-0000-0000-000000000006', 'Pilates instructor with expertise in rehabilitation and core strength.', ARRAY['pilates', 'yoga'], 7, ARRAY['Pilates Mat Certification'], 11, 15, 'verified', 'passed', 'valid')
ON CONFLICT DO NOTHING;

-- Gym profiles
INSERT INTO gym_profiles (owner_user_id, name, address, postcode, bio, facilities_text, amenities, cctv_available, rules) VALUES
  ('00000000-0000-0000-0000-000000000010', 'Central London Boxing Gym', '123 Main Street', 'SW1A 1AA', 'Premier boxing facility in the heart of London with professional-grade equipment.', 'Full boxing ring, heavy bags, speed bags, weight training area, changing rooms', ARRAY['parking', 'showers', 'changing_rooms', 'lockers', 'wifi'], true, 'Please respect equipment and other members. Clean up after use.'),
  ('00000000-0000-0000-0000-000000000011', 'Zen Yoga Studio', '456 High Street', 'E1 6AN', 'Peaceful yoga studio offering various classes and private sessions.', 'Large studio space, props, meditation area, reception', ARRAY['showers', 'changing_rooms', 'wifi', 'cafe'], false, 'Please arrive 10 minutes early. Remove shoes at entrance.'),
  ('00000000-0000-0000-0000-000000000012', 'Elite Fitness Center', '789 Park Avenue', 'NW1 6XE', 'Modern fitness center with state-of-the-art equipment.', 'Cardio machines, free weights, functional training area, group class studio', ARRAY['parking', 'showers', 'changing_rooms', 'lockers', 'wifi', 'cafe', 'equipment_rental'], true, 'Members must bring their own towels. Equipment must be wiped down after use.')
ON CONFLICT DO NOTHING;

-- Create demo invites
INSERT INTO invites (code, assigned_role, assigned_email) VALUES
  ('DEMO-CLIENT-001', 'client', NULL),
  ('DEMO-COACH-001', 'coach', NULL),
  ('DEMO-GYM-001', 'gym_owner', NULL),
  ('DEMO-ADMIN-001', 'admin', NULL)
ON CONFLICT (code) DO NOTHING;

