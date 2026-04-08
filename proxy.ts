import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { EXPRESS_API_URL } from "./lib/env";
import { data } from "framer-motion/client";

const protectedPages = ["/youth", "/admin", "/sk"];

// Secret for signing JWT
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);
const protectedRoutes = ["/dashboard", "/admin", "/sk"];

export default async function proxy(req: NextRequest) {
  console.log("PROXY RUNN")
  const { pathname } = req.nextUrl;
  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;
  const isProtectedRoute = protectedRoutes.some((r) => pathname.startsWith(r));
  const isAuthRoute = pathname.startsWith("/auth");

  if (accessToken) {
    console.log("Access token")
    try {
      const { payload } = await jwtVerify(accessToken, JWT_SECRET);
      if (isAuthRoute) {
        return NextResponse.redirect(new URL(`/${payload.role}/dashboard`, req.url));
      } else if (isProtectedRoute) {
        return NextResponse.next();
      }
    } catch (error) {
      console.log(error)
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
    
  }

  if (!accessToken && refreshToken) {
    console.log("refreshtoken onle")
    try {
      const res = await fetch(`${EXPRESS_API_URL}/api/auth/refresh`, {
        method: 'POST',
        headers: {
          Cookie: `refreshToken=${refreshToken}`,
        },
      });

      if (res.ok) {
        console.log("hi")
        const data = await res.json();

        let response
        if (isAuthRoute) {
          const { payload } = await jwtVerify(data.accessToken, JWT_SECRET)
          response = NextResponse.redirect(new URL(`/${payload.role}/dashboard`));
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

      const data = await res.json()
      console.log(data)
      if (isAuthRoute) {
        return NextResponse.next()
      }

      return NextResponse.redirect(new URL("/auth/login", req.url));
    } catch (err) {
      console.error(err)
    }
  }
}

// Only run middleware on relevant pages
export const config = {
  matcher: [
    "/auth/:path*",
    "/youth/:path*",
    "/sk/:path*",
    "/admin/:path*"
  ],
};
