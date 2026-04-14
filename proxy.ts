import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);
const protectedRoutes = ["/dashboard"];
const roleBasedRoute = [
  "/dashboard",
  "/programs",
  "/suggestions",
  "/announcements"
]
const isProd = process.env.NODE_ENV === 'production'

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;
  const isProtectedRoute = protectedRoutes.some((r) => pathname.startsWith(r));
  const isRoleBasedRoute = roleBasedRoute.some((r) => pathname.startsWith(r));
  const isAuthRoute = pathname.startsWith("/auth");
  const isOnboardingRoute = pathname.startsWith("/onboarding")
  const host = req.headers.get("host") || "";
  const hostname = host.split(":")[0];
  const parts = hostname.split(".");
  const subdomain = parts.length > 2 ? parts[0] : null;
  const url = req.nextUrl.clone();

  console.log(url.pathname)
  console.log(hostname)

  if (isProtectedRoute || isAuthRoute || isOnboardingRoute) {
    if (accessToken) {
      try {
        const { payload } = await jwtVerify(accessToken, JWT_SECRET);

        if (payload.status === "pending") {
          if (isOnboardingRoute) {
            return NextResponse.next();
          }
          return NextResponse.redirect(new URL('/onboarding', req.url));
        }

        if (isAuthRoute) {
          return NextResponse.redirect(new URL(`/${payload.role}/dashboard`, req.url));
        }

      } catch (error) {
        console.log(error)
        if (isAuthRoute) {
          return NextResponse.next()
        }
        return NextResponse.redirect(new URL("/auth/login", req.url));
      }
      
    } else if (refreshToken) {
      if (!isProtectedRoute && !isAuthRoute && !isOnboardingRoute) {
        return NextResponse.next();
      }

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
          if (payload.status === "pending") {
            if (isOnboardingRoute) {
              response = NextResponse.next();
            } else {
              response = NextResponse.redirect(new URL('/onboarding', req.url));
            }
            
          } else {
            response = NextResponse.next();
          }

          if (isAuthRoute) {
            response = NextResponse.redirect(new URL(`/${payload.role}/dashboard`, req.url));
          } else if (isProtectedRoute) {
            response = NextResponse.next();
          }

          response.cookies.set('accessToken', data.accessToken, {
            httpOnly: true,
            secure: isProd,
            sameSite: "lax",
            path: '/',
            maxAge: 5 * 60,
            domain: isProd ? "kabataanprofile.com" : "kabataanprofile.test"
          });

          response.cookies.set('refreshToken', data.refreshToken, {
            httpOnly: true,
            secure: isProd,
            sameSite: "lax",
            path: '/',
            maxAge: 7 * 24 * 60 * 60,
            domain: isProd ? "kabataanprofile.com" : "kabataanprofile.test"
          });

          return response;
        }

        if (isAuthRoute) {
          return NextResponse.next()
        }
        return NextResponse.redirect(new URL("/auth/login", req.url));

      } catch (error) {
        console.log(error)
        if (isAuthRoute) {
          return NextResponse.next()
        }
        return NextResponse.redirect(new URL("/auth/login", req.url));
      }
    }
  }

  if (isRoleBasedRoute) {
    if (subdomain === "admin") {
      url.pathname = `/admin${url.pathname}`
    } else if (subdomain === "sk") {
      url.pathname = `/sk${url.pathname}`
    } else {
      url.pathname = `/youth${url.pathname}`
    }

    return NextResponse.rewrite(url)
  }
  
}

// Only run middleware on relevant pages
export const config = {
  matcher: [
    "/((?!_next|api|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|ico|map)).*)",
  ],
};
