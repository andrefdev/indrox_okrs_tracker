import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
    const { supabaseResponse, user } = await updateSession(request);

    // Protected routes requiring authentication
    // Check if the current path is NOT /login or /auth/* or public assets
    // If we want to aggressively protect everything except login:
    const isLoginPage = request.nextUrl.pathname.startsWith("/login");
    const isAuthPage = request.nextUrl.pathname.startsWith("/auth");
    const isNextStatic = request.nextUrl.pathname.startsWith("/_next");
    const isPublicAsset = request.nextUrl.pathname === "/favicon.ico";

    if (!user && !isLoginPage && !isAuthPage && !isNextStatic && !isPublicAsset) {
        // Redirect to login if user is not authenticated and trying to access protected route
        const loginUrl = request.nextUrl.clone();
        loginUrl.pathname = "/login";
        return NextResponse.redirect(loginUrl);
    }

    if (user && isLoginPage) {
        // Redirect to dashboard if user is authenticated and trying to access login
        const dashboardUrl = request.nextUrl.clone();
        dashboardUrl.pathname = "/";
        return NextResponse.redirect(dashboardUrl);
    }

    return supabaseResponse;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
         * Feel free to modify this pattern to include more paths.
         */
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
