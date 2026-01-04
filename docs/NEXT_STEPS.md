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

3. **Run admin user management migration:**
   - Copy and paste the contents of `/sql/0002_admin_users.sql`
   - Execute the SQL
   - This adds disabled columns and admin RLS policies
   - **Important:** After running any SQL migration, if you see schema cache errors, run: `NOTIFY pgrst, 'reload schema';`

4. **Run user profiles backfill migration:**
   - Copy and paste the contents of `/sql/0003_backfill_user_profiles.sql`
   - Execute the SQL
   - This backfills missing profiles for existing auth.users and ensures the trigger is in place
   - **Why:** Prevents PGRST116 errors and ensures every auth user has a profile row
   - The trigger auto-creates profiles on signup with role=NULL

5. **Run user profiles RLS migration:**
   - Copy and paste the contents of `/sql/0004_user_profiles_rls.sql`
   - Execute the SQL
   - This adds RLS policies for users to manage their own profiles
   - Keeps existing admin policies intact

6. **Sign up:**
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
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

**Important:** `SUPABASE_SERVICE_ROLE_KEY` is server-only and should NEVER be exposed to the client. It's used only in admin API routes for privileged operations.

## Admin User Management

### Setting Up Your Admin Account

To set your own account to admin, run this SQL in Supabase SQL Editor:

```sql
-- Replace 'your-email@example.com' with your actual email
UPDATE user_profiles 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
```

### Admin Features

- **User Management** (`/admin/users`):
  - View all users with search and filters
  - Change user roles (client, coach, gym_owner, admin)
  - Enable/disable user accounts with optional reason
  - Delete users (cascades to related records)
  - Prevents self-modification (cannot change/delete your own admin account)

- **API Endpoints** (admin-only):
  - `GET /api/admin/users` - List users with filters
  - `POST /api/admin/users/[id]/role` - Change user role
  - `POST /api/admin/users/[id]/disable` - Enable/disable user
  - `DELETE /api/admin/users/[id]` - Delete user

### Security

- All admin routes verify the user has `role='admin'` in `user_profiles`
- Service role key is only used server-side in API routes
- RLS policies prevent non-admins from accessing disabled users or modifying roles
- Self-protection: Admins cannot disable/delete their own account from the UI

## SEO & Landing Pages

The platform includes optimized landing pages for SEO and conversions:

- **Homepage** (`/`): Hero, How It Works, Benefits, Categories, FAQ, CTAs
- **Find Coaches** (`/coaches`): Browse trainers with SEO-rich intro
- **Browse Gyms** (`/gyms`): Find spaces with SEO-rich intro
- **Gym Owners** (`/gym-owners`): Marketing page for listing gyms
- **How It Works** (`/how-it-works`): Explains platform for all roles
- **Pricing** (`/pricing`): Token system and pricing transparency

### SEO Features
- Metadata with OpenGraph on all pages
- JSON-LD structured data (Organization, WebSite, FAQPage)
- Sitemap at `/sitemap.xml`
- Robots.txt at `/robots.txt`
- UK-focused copy and keywords
- Semantic HTML with proper heading hierarchy

See `/docs/SEO_UPGRADE.md` for full details.

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

## Troubleshooting

### Schema Cache Errors

If you encounter errors like **"Could not find the table 'public.user_profiles' in the schema cache"** after running SQL migrations:

1. **Run the reload command in Supabase SQL Editor:**
   ```sql
   NOTIFY pgrst, 'reload schema';
   ```

2. **Wait a few seconds** for the schema cache to refresh

3. **Try your operation again**

The application will show a friendly error message if it detects a schema cache error, instructing you to run the reload command.

### Table Name Verification

All code references use the correct table name: `user_profiles` (plural). If you see errors about table names, verify:
- The table exists in Supabase: `public.user_profiles`
- RLS is enabled on the table
- The schema cache has been reloaded after migrations

### Onboarding/Profile Save Flow

The onboarding form uses server actions (`lib/actions/user.ts`) which:
- Use the server-side Supabase client (anon key, not service role)
- Only query `public.user_profiles` and role-specific tables (`coach_profiles`, `gym_profiles`)
- Include error handling for schema cache issues
- Bootstrap missing profiles with upsert (role=null, disabled=false)
- Show user-friendly error messages if schema cache needs reloading
- After successful onboarding, redirects use client-side `router.push()` which preserves session cookies

### Next.js 16 + Supabase SSR

- **proxy.ts:** Session refresh handler in `/app/proxy.ts` (Next.js 16 pattern)
- **No middleware.ts:** Removed to prevent conflicts and login loops
- **Server client:** `lib/supabase/server.ts` uses `@supabase/ssr` createServerClient
- **Browser client:** `lib/supabase/browser.ts` and `lib/supabase/client.ts` use createBrowserClient
- **Env var fallback:** Both clients try NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY then NEXT_PUBLIC_SUPABASE_ANON_KEY

### Blocking Route Warnings Fixed

All pages with runtime data access (cookies, searchParams, auth) now use the pattern:
- Top-level page.tsx is **non-async** and renders `<Suspense>`
- Runtime data access moved to async Server Component child (e.g., `OnboardingServer.tsx`)
- Applied to: `/onboarding`, `/dashboard/client`, `/dashboard/coach`, `/dashboard/gym-owner`, `/account`

### Account Page

- **Location:** `/app/account/page.tsx` (with `/app/account/AccountServer.tsx`)
- **Access:** Protected route - requires authentication
- **Features:**
  - View email and role (read-only)
  - Update profile information (full_name, phone, postcode)
  - Change password (client-side using Supabase auth.updateUser)
  - Logout button
- **Navigation:** Link appears in nav when logged in
- **Pattern:** Non-async page with Suspense wrapping AccountServer

## Support

For issues or questions, check:
- Supabase documentation: https://supabase.com/docs
- Next.js App Router docs: https://nextjs.org/docs/app
- Project structure follows Next.js 15 App Router conventions

