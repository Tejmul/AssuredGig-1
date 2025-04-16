import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        return true; // Allow all requests for now, you can customize this based on your needs
      },
    },
  }
);

// Specify which routes should be protected
export const config = {
  matcher: [
    "/api/auth/:path*",
    "/dashboard/:path*",
    "/settings/:path*",
  ],
}; 