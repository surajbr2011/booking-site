import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// Simple JWT-based middleware that protects admin routes
// by verifying the next-auth.session-token cookie we set during login.
export async function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Allow /admin/login and /admin/reset-password through without a token
    if (
        pathname === "/admin/login" ||
        pathname === "/admin/reset-password" ||
        pathname.startsWith("/api/auth/")
    ) {
        return NextResponse.next();
    }

    const isApiAdminRoute = pathname.startsWith("/api/admin");
    const isAdminRoute = pathname.startsWith("/admin");

    if (!isApiAdminRoute && !isAdminRoute) {
        return NextResponse.next();
    }

    // Verify the JWT token from the session cookie
    const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET!,
    });

    if (!token || token.role !== "admin") {
        if (isAdminRoute && !isApiAdminRoute) {
            // Redirect browser requests to the login page
            return NextResponse.redirect(new URL("/admin/login", req.url));
        }
        // Return 401 for API requests
        return new NextResponse(
            JSON.stringify({ error: "Unauthorized" }),
            { status: 401, headers: { "content-type": "application/json" } }
        );
    }

    return NextResponse.next();
}

// Apply middleware to admin pages and admin API routes
export const config = {
    matcher: ["/admin/:path*", "/api/admin/:path*"],
};
