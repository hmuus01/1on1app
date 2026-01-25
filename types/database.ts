// Database types for Supabase tables

export type UserRole = "client" | "coach" | "gym_owner" | "admin";

export type VerificationStatus = "pending" | "verified" | "rejected";
export type BackgroundCheckStatus = "pending" | "passed" | "failed";
export type InsuranceStatus = "pending" | "valid" | "invalid";

export type SessionRequestStatus = "requested" | "accepted" | "declined" | "cancelled" | "completed";
export type BookingRequestStatus = "requested" | "approved" | "declined" | "cancelled" | "completed";
export type LocationType = "in_gym" | "remote" | "outdoor";

// Base user profile
export interface UserProfile {
  id: string;
  role: UserRole | null;
  full_name: string | null;
  phone: string | null;
  email: string | null;
  location_text: string | null;
  postcode: string | null;
  profile_photo_url: string | null;
  disabled?: boolean;
  disabled_reason?: string | null;
  created_at: string;
}

// Coach profile
export interface CoachProfile {
  id: string;
  user_id: string;
  bio: string | null;
  specialties: string[] | null;
  experience_years: number | null;
  qualifications: string[] | null;
  tokens_per_hour: number | null;
  travel_radius_miles: number | null;
  languages: string[] | null;
  verification_status: VerificationStatus;
  background_check_status: BackgroundCheckStatus;
  insurance_status: InsuranceStatus;
  created_at: string;
}

// Coach profile with user relation
export interface CoachProfileWithUser extends CoachProfile {
  user: Pick<UserProfile, "id" | "full_name" | "email" | "postcode" | "location_text"> | null;
}

// Gym profile
export interface GymProfile {
  id: string;
  owner_user_id: string;
  name: string;
  address: string | null;
  postcode: string | null;
  geo_lat: number | null;
  geo_lng: number | null;
  bio: string | null;
  facilities_text: string | null;
  amenities: string[] | null;
  cctv_available: boolean;
  rules: string | null;
  eligibility_require_verified: boolean;
  eligibility_require_background_passed: boolean;
  eligibility_required_qualifications: string[];
  photos: string[];
  created_at: string;
}

// Gym profile with spaces
export interface GymProfileWithSpaces extends GymProfile {
  spaces: GymSpace[];
}

// Gym space
export interface GymSpace {
  id: string;
  gym_id: string;
  name: string;
  description: string | null;
  capacity: number | null;
  suitable_for: string[] | null;
  tokens_per_hour: number;
  photos: string[];
  created_at: string;
}

// Gym space with gym relation
export interface GymSpaceWithGym extends GymSpace {
  gym: Pick<GymProfile, "id" | "name"> | null;
}

// Availability rule
export interface AvailabilityRule {
  id: string;
  owner_type: "gym_space" | "coach";
  owner_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  recurring: boolean;
  created_at: string;
}

// Coach session request
export interface CoachSessionRequest {
  id: string;
  coach_user_id: string;
  client_user_id: string;
  date_time_preferred: string | null;
  duration_mins: number | null;
  status: SessionRequestStatus;
  location_type: LocationType;
  notes: string | null;
  created_at: string;
}

// Coach session request with client relation
export interface CoachSessionRequestWithClient extends CoachSessionRequest {
  client: Pick<UserProfile, "id" | "full_name" | "email"> | null;
}

// Coach session request with coach relation
export interface CoachSessionRequestWithCoach extends CoachSessionRequest {
  coach: Pick<UserProfile, "id" | "full_name" | "email"> | null;
}

// Gym booking request
export interface GymBookingRequest {
  id: string;
  space_id: string;
  trainer_user_id: string;
  date: string | null;
  start_time: string | null;
  end_time: string | null;
  status: BookingRequestStatus;
  tokens_quoted: number | null;
  entry_code_id: string | null;
  created_at: string;
}

// Gym booking request with space relation
export interface GymBookingRequestWithSpace extends GymBookingRequest {
  space: GymSpaceWithGym | null;
}

// Gym booking request with trainer relation
export interface GymBookingRequestWithTrainer extends GymBookingRequest {
  trainer: Pick<UserProfile, "id" | "full_name" | "email"> | null;
}

// Gym booking request with both relations
export interface GymBookingRequestWithRelations extends GymBookingRequest {
  space: Pick<GymSpace, "id" | "name" | "gym_id"> | null;
  trainer: Pick<UserProfile, "id" | "full_name" | "email"> | null;
}

// Message
export interface Message {
  id: string;
  thread_id: string;
  from_user_id: string;
  to_user_id: string;
  body: string | null;
  created_at: string;
}

// Message with user relations
export interface MessageWithUsers extends Message {
  from_user: Pick<UserProfile, "id" | "full_name" | "email"> | null;
  to_user: Pick<UserProfile, "id" | "full_name" | "email"> | null;
}

// Message thread (grouped messages)
export interface MessageThread {
  thread_id: string;
  messages: MessageWithUsers[];
  other_user: Pick<UserProfile, "id" | "full_name" | "email"> | null;
}

// Review
export interface Review {
  id: string;
  reviewer_user_id: string;
  target_type: "coach" | "gym";
  target_id: string;
  rating: number;
  text: string | null;
  created_at: string;
}

// Verification check
export interface VerificationCheck {
  id: string;
  user_id: string;
  type: "identity" | "qualification" | "background";
  status: "pending" | "approved" | "rejected";
  notes: string | null;
  created_at: string;
}

// Admin user (for admin table)
export interface AdminUser {
  id: string;
  email: string;
  created_at: string;
  role: UserRole | null;
  disabled: boolean;
  disabled_reason: string | null;
}
