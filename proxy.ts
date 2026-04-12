import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);
const protectedRoutes = ["/youth", "/admin", "/sk"];
const isProd = process.env.NODE_ENV === 'production'

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
        if (payload.status === "pending") {
          return NextResponse.redirect(new URL('/onboarding', req.url));
        }

        const rolePathMap: Record<string, string> = {
          admin: "/admin",
          sk: "/sk",
          youth: "/youth",
        };

        const expectedBasePath = rolePathMap[payload.role as string];

        if (!pathname.startsWith(expectedBasePath)) {
          return NextResponse.redirect(
            new URL(`${expectedBasePath}/dashboard`, req.url)
          );
        }

        return NextResponse.next();
      } else if (isOnboardingRoute) {
        if (payload.status === "pending") {
          return NextResponse.next();
        }
        return NextResponse.redirect(new URL(`/${payload.role}/dashboard`, req.url));
      } else {
        return NextResponse.next();
      }
    } catch (error) {
      console.log(error)
      if (isAuthRoute) {
        return NextResponse.next()
      }
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
    
  } else if (!accessToken && refreshToken) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_EXPRESS_API_URL}/api/auth/refresh`, {
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
          secure: isProd,
          sameSite: "lax",
          path: '/',
          maxAge: 5 * 60,
          ...(isProd && { domain: ".kabataanprofile.com" })
        });

        response.cookies.set('refreshToken', data.refreshToken, {
          httpOnly: true,
          secure: isProd,
          sameSite: "lax",
          path: '/',
          maxAge: 7 * 24 * 60 * 60,
          ...(isProd && { domain: ".kabataanprofile.com" })
        });

        return response;
      }

      if (isAuthRoute) {
        return NextResponse.next()
      }

      return NextResponse.redirect(new URL("/auth/login", req.url));
    } catch (err) {
      console.error(err);
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
  }

  if (isProtectedRoute || isOnboardingRoute) {
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
