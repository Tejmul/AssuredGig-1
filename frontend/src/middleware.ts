import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        // Protect API routes
        if (req.nextUrl.pathname.startsWith("/api/")) {
          return !!token;
        }
        
        // Protect dashboard and settings routes
        if (req.nextUrl.pathname.startsWith("/dashboard") || 
            req.nextUrl.pathname.startsWith("/settings")) {
          return !!token;
        }
        
        return true;
      },
    },
  }
);

// Specify which routes should be protected
export const config = {
  matcher: [
    "/api/:path*",
    "/dashboard/:path*",
    "/settings/:path*",
    "/contracts/:path*",
  ],
}; 