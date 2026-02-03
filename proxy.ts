import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/**
 * Routes that don't require authentication
 */
const publicRoutes = ["/", "/login", "/reset", "/auth/callback"];

/**
 * Proxy for Supabase Auth SSR
 * - Refreshes auth session
 * - Protects /(app) routes
 * - Allows /(auth) routes freely
 */
export default async function proxy(request: NextRequest) {
    const { supabaseResponse, user } = await updateSession(request);

    const pathname = request.nextUrl.pathname;

    // Check if current route is public
    const isPublicRoute = publicRoutes.some((route) => {
        if (route === "/") {
            return pathname === "/";
        }
        return pathname.startsWith(route);
    });

    // Redirect unauthenticated users to login (for protected routes)
    if (!user && !isPublicRoute) {
        const url = request.nextUrl.clone();
        url.pathname = "/login";
        url.searchParams.set("redirectTo", pathname);
        return NextResponse.redirect(url);
    }

    // Redirect authenticated users away from auth pages
    if (user && (pathname === "/login" || pathname === "/reset")) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return supabaseResponse;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - Public files (svg, png, jpg, etc.)
         */
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
