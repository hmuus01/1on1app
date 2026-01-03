# 1on1 MVP - Next Steps

## Quick Start

### 1. Run Locally

```bash
# Install dependencies
npm install

# Set up environment variables
# Create a .env.local file with:
# NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
# NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_key

# Run development server
npm run dev
```

Visit `http://localhost:3000`

### 2. Database Setup

1. **Run the main migration:**
   - Go to your Supabase project SQL Editor
   - Copy and paste the contents of `/sql/0001_init.sql` or `/supabase/migrations/0001_init.sql`
   - Execute the SQL

2. **Run the demo seed (optional):**
   - Copy and paste the contents of `/sql/seed_demo.sql`
   - Execute the SQL
   - This creates demo data (3 gyms, 6 coaches, 6 spaces) that can be browsed without login

3. **Sign up:**
   - Users can sign up directly without invite codes
   - After signup/login, users will be redirected to onboarding to choose their role

## Project Structure

### SQL Migrations
- **Location:** `/supabase/migrations/0001_init.sql` and `/sql/0001_init.sql`
- **Purpose:** Main database schema with all tables and RLS policies
- **Demo Seed:** `/sql/seed_demo.sql` and `/supabase/migrations/0002_demo_seed.sql`

### Authentication & Roles
- **Signup:** `/app/auth/sign-up/page.tsx` - Requires invite code
- **Onboarding:** `/app/onboarding/page.tsx` - Role selection and profile setup
- **Role routing:** Implemented in dashboard pages and navigation component

### Role-Based Navigation
- **Location:** `/components/navigation.tsx`
- **Implementation:** Shows different links based on user role (client, coach, gym_owner, admin)
- **Root Layout:** `/app/layout.tsx` - Includes navigation and footer

### Filters & Token Logic
- **Coach Filters:** `/components/coaches-filters.tsx`
  - Filters by: specialty, tokens/hr range, verification status, postcode
- **Gym Filters:** `/components/gyms-filters.tsx`
  - Filters by: amenities, CCTV, tokens/hr range
- **Token Logic:** 
  - Coaches: `tokens_per_hour` in `coach_profiles` table
  - Gym Spaces: `tokens_per_hour` in `gym_spaces` table
  - Filtering happens in `/app/coaches/page.tsx` and `/app/gyms/page.tsx`

### Role Routing
- **Onboarding Check:** `/app/onboarding/page.tsx` - Redirects if role exists
- **Dashboard Routes:**
  - `/app/dashboard/client/page.tsx` - Client dashboard
  - `/app/dashboard/coach/page.tsx` - Coach dashboard
  - `/app/dashboard/gym-owner/page.tsx` - Gym owner dashboard
- **Middleware:** `/middleware.ts` - Handles session updates

### Stripe Integration (Stubbed)
- **Location:** Stripe package is installed in `package.json` but not yet implemented
- **Future:** Payment processing will be added for:
  - Coach session payments
  - Gym space booking payments
  - Token-based transactions
- **Current:** All bookings are request-based with no payment processing

## Key Features Implemented

### ✅ Completed
- [x] Invite-only signup with role assignment
- [x] Role-based onboarding flow
- [x] User profiles with role management
- [x] Coach profiles with verification status
- [x] Gym profiles and spaces
- [x] Availability rules and overrides
- [x] Session requests (client → coach)
- [x] Gym booking requests (coach → gym)
- [x] Browse pages with filters
- [x] Detail pages for coaches and gyms
- [x] Basic messaging system
- [x] Admin verification management
- [x] Row Level Security (RLS) policies
- [x] Demo seed data

### 🔄 Future Enhancements
- [ ] Payment processing with Stripe
- [ ] Google Places integration for address autocomplete
- [ ] Real-time messaging with Supabase Realtime
- [ ] Email notifications
- [ ] Calendar integration
- [ ] Review system UI
- [ ] Photo uploads for profiles and gyms
- [ ] Advanced availability management
- [ ] Entry code generation and management

## Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```

## Testing the MVP

1. **Browse without login:**
   - Visit `/coaches` - See demo coaches
   - Visit `/gyms` - See demo gyms
   - Click on any coach or gym to see details

2. **Sign up:**
   - Go to `/auth/sign-up`
   - Use an invite code (create one in Supabase first)
   - Complete onboarding

3. **Test roles:**
   - Sign up as a client → Request sessions from coaches
   - Sign up as a coach → Request gym bookings, manage sessions
   - Sign up as a gym owner → Manage gyms and spaces, approve bookings
   - Sign up as admin → Manage verifications

## Known Issues & Notes

- Demo data uses placeholder UUIDs that won't conflict with real users
- RLS policies allow public read access to coach/gym profiles for browsing
- Messaging is basic - no real-time updates yet
- No payment processing - all bookings are request-based
- Address/postcode stored as text (no geocoding yet)

## Support

For issues or questions, check:
- Supabase documentation: https://supabase.com/docs
- Next.js App Router docs: https://nextjs.org/docs/app
- Project structure follows Next.js 15 App Router conventions

