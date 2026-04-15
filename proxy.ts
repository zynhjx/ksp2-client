import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);
const protectedRoutes = [
  "/home",
  "/dashboard",
  "/programs",
  "/suggestions",
  "/announcements",
  "/onboarding"
];
const roleBasedRoute = [
  "/home",
  "/dashboard",
  "/programs",
  "/suggestions",
  "/announcements",
  "/"
]

type PayloadType = { 
  payload: 
    { 
      id: number, 
      email: string, 
      role: "youth" | "sk" | "admin", 
      status: "pending" | "active", 
      type: "access"
    }
}

const isProd = process.env.NODE_ENV === 'production'

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;
  const isProtectedRoute = protectedRoutes.some((r) => pathname.startsWith(r));
  const isRoleBasedRoute = roleBasedRoute.some((route) => pathname === route);
  const isAuthRoute = pathname.startsWith("/auth");
  const isOnboardingRoute = pathname.startsWith("/onboarding")
  const requiresAuth = isProtectedRoute || isAuthRoute;
  const host =
    req.headers.get("x-forwarded-host") ||
    req.headers.get("host") ||
    "";
  const hostname = host.split(":")[0];
  const parts = hostname.split(".");
  const subdomain = parts.length > 2 ? parts[0] : null;
  const url = req.nextUrl.clone();
  const blockedPaths = ["/youth", "/sk", "/admin"];
  const roleRedirectMap: Record<string, string> = {
    admin: "/dashboard",
    sk: "/dashboard",
    youth: "/home", // or "/"
  };


  if (blockedPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.rewrite(new URL("/404", req.url));
  }

  if (requiresAuth) {
    
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
          const redirectPath = roleRedirectMap[payload.role] || "/";
          response = NextResponse.redirect(new URL(redirectPath, req.url));
        }
      } catch (error) {
        
        console.log(error)
        if (isAuthRoute) {
          return NextResponse.next()
        }
        return NextResponse.redirect(new URL("/auth", req.url));
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

          if (!data?.accessToken || !data?.refreshToken) {
            throw new Error("Invalid refresh response");
          }

          const { payload }: PayloadType = await jwtVerify(data.accessToken, JWT_SECRET)

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
            const redirectPath = roleRedirectMap[payload.role] || "/";
            response = NextResponse.redirect(new URL(redirectPath, req.url));

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
        return NextResponse.redirect(new URL("/auth", req.url));

      } catch (error) {
        console.log(error)
        if (isAuthRoute) {
          return NextResponse.next()
        }
        return NextResponse.redirect(new URL("/auth", req.url));
      }
    } else {
      if (isAuthRoute) {
        return NextResponse.next()
      }
      return NextResponse.redirect(new URL("/auth", req.url));
    }
  }

  if (isRoleBasedRoute) {
    if (subdomain === "admin") {
      url.pathname = `/admin${url.pathname}`;
    } else if (subdomain === "sk") {
      url.pathname = `/sk${url.pathname}`;
    } else if (!subdomain) {
      url.pathname = `/youth${url.pathname}`;
    } else {
      return NextResponse.rewrite(new URL("/404", req.url));
    }

    return NextResponse.rewrite(url)
  }
  return NextResponse.next();
  
}

// Only run middleware on relevant pages
export const config = {
  matcher: [
    "/((?!_next|api|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|ico|map)).*)",
  ],
};
