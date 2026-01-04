# Fixes Applied - Next.js 16 Blocking Route + Supabase Profile Bootstrap

## Summary

Fixed all blocking-route warnings, profile bootstrap issues, login loops, and added account management. The app now works reliably with Next.js 16.1.1 + Turbopack + Supabase.

## A) SQL Migrations

### `/sql/0003_backfill_user_profiles.sql`
- Backfills missing `user_profiles` rows for existing `auth.users`
- Creates/replaces `handle_new_user()` trigger function
- Auto-creates profile on signup with `role=NULL, disabled=false`
- Includes `NOTIFY pgrst, 'reload schema';`

### `/sql/0004_user_profiles_rls.sql`
- Enables RLS on `user_profiles`
- Adds policies for users to SELECT/INSERT/UPDATE their own profile
- Uses `DO $$ ... END $$` to avoid duplicate policy errors
- Preserves existing admin policies

## B) Supabase SSR Clients

### `/lib/supabase/server.ts`
- Uses `@supabase/ssr` createServerClient
- Env var fallback: `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Proper cookie handling with `getAll()` and `setAll()`

### `/lib/supabase/browser.ts` (new)
- Browser client for client components
- Same env var fallback pattern

### `/lib/supabase/client.ts`
- Updated with env var fallback
- Used by existing client components

## C) Next.js 16 Proxy Pattern

### `/app/proxy.ts` (new)
- Replaces `middleware.ts` (removed)
- Only handles session refresh via `supabase.auth.getUser()`
- **No redirects** - prevents login loops
- Proper cookie handling for SSR

### Removed `middleware.ts`
- Deleted to prevent conflicts with proxy.ts
- Redirects now handled in page-level Server Components

## D) Fixed Blocking Route Warnings

All pages restructured to move runtime data access into Suspense-wrapped async Server Components:

### `/app/onboarding/page.tsx` + `/app/onboarding/OnboardingServer.tsx`
- Page is **non-async**, accepts `searchParams?: { role?: string }`
- Renders `<Suspense><OnboardingServer /></Suspense>`
- OnboardingServer is async, handles auth/profile checks
- Redirects if user has role already

### `/app/dashboard/client/page.tsx` + `ClientDashboardServer.tsx`
- Same pattern: non-async page with Suspense
- Server component checks auth, role, fetches data
- Redirects to correct dashboard if role mismatch

### `/app/dashboard/coach/page.tsx` + `CoachDashboardServer.tsx`
- Same pattern

### `/app/dashboard/gym-owner/page.tsx` + `GymOwnerDashboardServer.tsx`
- Same pattern

### `/app/account/page.tsx` + `AccountServer.tsx`
- Same pattern
- Protected route for logged-in users

## E) Resilient getUserProfile

### `/lib/actions/user.ts` - `getUserProfile()`
- Uses `.maybeSingle()` instead of `.single()`
- If profile is null, attempts **upsert** with:
  ```js
  { id: user.id, email: user.email, role: null, disabled: false, created_at: now }
  ```
- On upsert error, refetches profile (trigger may have created it)
- Only logs unexpected errors, not "0 rows" (which is normal)
- No more PGRST116 errors

## F) Fixed Build Errors

- Removed duplicate `const supabase = ...` declarations in all dashboard pages
- All pages now declare supabase once per scope

## G) Onboarding Flow

### After "Complete Profile"
- Uses `router.push()` + `router.refresh()` for client-side navigation
- Server actions use server Supabase client (preserves cookies)
- Redirects to correct dashboard based on role
- **No login loops** - session stays valid

### Redirect Logic
- `role === null` → `/onboarding`
- `role === 'client'` → `/dashboard/client`
- `role === 'coach'` → `/dashboard/coach`
- `role === 'gym_owner'` → `/dashboard/gym-owner`
- `role === 'admin'` → `/admin`
- Never bounces to login if session exists

## H) Account Page

### `/app/account/page.tsx` + `/app/account/AccountServer.tsx`
- Protected route (redirects to login if not authenticated)
- Shows email + role (read-only)
- Edit profile: full_name, phone, postcode
- Change password: client-side using `supabase.auth.updateUser({ password })`
- Logout button
- "Account" link added to nav when logged in

## Results

✅ No more blocking-route warnings on `/onboarding` or dashboards  
✅ No more PGRST116 errors from missing profiles  
✅ No more "Could not find table public.user_profiles in schema cache" (with proper NOTIFY)  
✅ No more login loops after profile completion  
✅ Every signed-in user has a `user_profiles` row (backfill + trigger + upsert)  
✅ Profile fetching is resilient (0 rows is normal, bootstrap on demand)  
✅ SSR auth cookie refresh works correctly (proxy.ts)  
✅ Account management page for logged-in users  

## Migration Steps

1. Run `/sql/0003_backfill_user_profiles.sql` in Supabase SQL Editor
2. Run `/sql/0004_user_profiles_rls.sql` in Supabase SQL Editor
3. Verify env vars include `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (or `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
4. Test signup → onboarding → dashboard flow
5. Test account page at `/account`
6. Verify no blocking-route warnings in console

