import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Create response to pass to supabase client
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: Record<string, unknown>) {
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: Record<string, unknown>) {
          response.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const pathname = request.nextUrl.pathname;

  // Protected routes - redirect to login if no session
  const protectedPaths = [
    "/dashboard",
    "/account",
    "/messages",
    "/onboarding",
    "/gyms/new",
  ];
  const isProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );

  if (isProtectedPath && !session) {
    const redirectUrl = new URL("/auth/login", request.url);
    redirectUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Admin routes - check for admin role
  if (pathname.startsWith("/admin")) {
    if (!session) {
      const redirectUrl = new URL("/auth/login", request.url);
      redirectUrl.searchParams.set("redirectTo", pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // Check admin role from user_profiles table
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("role")
      .eq("id", session.user.id)
      .single();

    if (profile?.role !== "admin") {
      // Redirect non-admins to their dashboard or home
      const dashboardRole = profile?.role?.replace("_", "-") || "client";
      return NextResponse.redirect(
        new URL(`/dashboard/${dashboardRole}`, request.url)
      );
    }
  }

  // Redirect logged-in users away from auth pages (except confirm and error)
  const authPaths = ["/auth/login", "/auth/sign-up"];
  const isAuthPath = authPaths.some((path) => pathname === path);

  if (isAuthPath && session) {
    // Check if user has a role, if not redirect to onboarding
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("role")
      .eq("id", session.user.id)
      .single();

    if (!profile?.role) {
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }

    const dashboardRole = profile.role.replace("_", "-");
    return NextResponse.redirect(
      new URL(`/dashboard/${dashboardRole}`, request.url)
    );
  }

  return response;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/account/:path*",
    "/messages/:path*",
    "/onboarding/:path*",
    "/admin/:path*",
    "/gyms/new",
    "/auth/login",
    "/auth/sign-up",
  ],
};
