import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { EXPRESS_API_URL } from "./lib/env";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);
const protectedRoutes = ["/youth", "/admin", "/sk"];

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;
  const isProtectedRoute = protectedRoutes.some((r) => pathname.startsWith(r));
  const isAuthRoute = pathname.startsWith("/auth");
  const isOnboardingRoute = pathname.startsWith("/onboarding")

  if (accessToken) {
    try {
      const { payload } = await jwtVerify(accessToken, JWT_SECRET);
      if (isAuthRoute) {
        if (payload.status === "pending") {
          return NextResponse.redirect(new URL('/onboarding', req.url));
        }
        return NextResponse.redirect(new URL(`/${payload.role}/dashboard`, req.url));
      } else if (isProtectedRoute) {
        return NextResponse.next();
      } else if (isOnboardingRoute) {
        console.log("first")
        if (payload.status === "pending") {
          console.log("pending")
          return NextResponse.next();
        }
        return NextResponse.redirect(new URL(`/${payload.role}/dashboard`, req.url));
      }
    } catch (error) {
      console.log(error)
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
    
  }

  if (!accessToken && refreshToken) {
    try {
      const res = await fetch(`${EXPRESS_API_URL}/api/auth/refresh`, {
        method: 'POST',
        headers: {
          Cookie: `refreshToken=${refreshToken}`,
        },
      });

      if (res.ok) {
        const data = await res.json();

        const { payload } = await jwtVerify(data.accessToken, JWT_SECRET)

        let response
        if (isAuthRoute) {
          if (payload.status === "pending") {
            response = NextResponse.redirect(new URL('/onboarding', req.url));
          } else {
            response = NextResponse.redirect(new URL(`/${payload.role}/dashboard`, req.url));
          }
        } else if (isOnboardingRoute) {
          if (payload.status === "pending") {
            return NextResponse.next();
          }
          return NextResponse.redirect(new URL(`/${payload.role}/dashboard`, req.url));
        } else {
          response = NextResponse.next()
        } 

        response.cookies.set('accessToken', data.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 15 * 60, // seconds in Next.js, not ms
        });

        response.cookies.set('refreshToken', data.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 7 * 24 * 60 * 60,
        });

        return response;
      }

      if (isAuthRoute) {
        return NextResponse.next()
      }

      return NextResponse.redirect(new URL("/auth/login", req.url));
    } catch (err) {
      console.error(err)
    }
  }

  if (isProtectedRoute) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }
}

// Only run middleware on relevant pages
export const config = {
  matcher: [
    "/auth/:path*",
    "/youth/:path*",
    "/sk/:path*",
    "/admin/:path*",
    "/onboarding"
  ],
};
