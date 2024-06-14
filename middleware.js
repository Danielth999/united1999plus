import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;

    if (!token) {
      const callbackUrl = req.nextUrl.pathname; // Get the current path as the callback URL
      return NextResponse.redirect(`/api/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`);
    }

    const userRole = token.role;

    const protectedRoutes = ["/admin-dashboard", "/another-protected-route"];

    if (protectedRoutes.includes(req.nextUrl.pathname)) {
      if (userRole !== "admin") {
        return NextResponse.redirect("/not-authorized");
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      async authorized({ token }) {
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/admin-dashboard/:path*", "/another-protected-route/:path*"],
};
