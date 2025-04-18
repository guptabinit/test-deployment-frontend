import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Add super-admin protected paths
  const isSuperAdminProtectedPath = path.startsWith("/super-admin") && !path.startsWith("/super-admin/login")
  const isManagerProtectedPath = path.startsWith("/manager") && !path.startsWith("/manager/login")
  const isOwnerProtectedPath = path.startsWith("/owner") && !path.startsWith("/owner/login") && !path.startsWith("/owner/set-password")

  // Get the token from the cookies
  const token = request.cookies.get("token")?.value

  // if (isManagerProtectedPath || isOwnerProtectedPath || isSuperAdminProtectedPath) {
  //   // If there's no token, redirect to the appropriate login page
  //   if (!token) {
  //     if (isManagerProtectedPath) {
  //       return NextResponse.redirect(new URL("/manager/login", request.url))
  //     } else if (isOwnerProtectedPath) {
  //       return NextResponse.redirect(new URL("/owner/login", request.url))
  //     } else {
  //       return NextResponse.redirect(new URL("/super-admin/login", request.url
  //       ))
  //     }
  //   }

  //   // If there's a token, validate it
  //   return validateToken(token, request, isManagerProtectedPath ? "manager" : isOwnerProtectedPath ? "owner" : "quickgick")
  // }

  // For non-protected routes, continue as normal
  return NextResponse.next()
}

async function validateToken(token: string, request: NextRequest, role: "manager" | "owner" | "quickgick") {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/${role}/validate-user`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (response.ok) {
      // Token is valid, continue to the protected route
      return NextResponse.next()
    } else {
      // Token is invalid, redirect to login
      if (role === "quickgick") {
        return NextResponse.redirect(new URL("/super-admin/login", request.url))
      }
      return NextResponse.redirect(new URL(`/${role}/login`, request.url))
    }
  } catch (error) {
    // In case of an error, redirect to login
    if (role === "quickgick") {
      return NextResponse.redirect(new URL("/super-admin/login", request.url))
    }
    return NextResponse.redirect(new URL(`/${role}/login`, request.url))
  }
}

export const config = {
  matcher: ["/manager/:path*", "/owner/:path*", "/super-admin/:path*"],
}

