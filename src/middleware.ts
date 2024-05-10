// // src/middleware.ts
// import { NextRequest, NextResponse } from "next/server";
// import { updateSession } from "./lib/session";

// export async function middleware(request: NextRequest) {
//   return NextResponse.next();
// }
// import { NextRequest } from "next/server";
// import { updateSession } from "./lib/session";

// export async function middleware(request: NextRequest) {
//   return await updateSession(request);
  
// }



import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { decrypt } from './lib/session'
import { updateSession } from "./lib/session";
 
// 1. Specify protected and public routes
const protectedRoutes = ['/' , '/profile']
const publicRoutes = ['/auth/signin', '/auth/signup']
 
export default async function middleware(req: NextRequest) {
  // 2. Check if the current route is protected or public
  const path = req.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.includes(path)
  const isPublicRoute = publicRoutes.includes(path)
 
  // 3. Decrypt the session from the cookie
  const cookie = cookies().get('session')?.value
  const session = await decrypt(cookie)

  if (session?.userId) {
    await updateSession(req)
  }

 
  // 5. Redirect to /login if the user is not authenticated
  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL('/auth/signin', req.nextUrl))
  }
 
  // 6. Redirect to /dashboard if the user is authenticated
  if (
    isPublicRoute &&
    session?.userId &&
    !req.nextUrl.pathname.startsWith('/')
  ) {
    return NextResponse.redirect(new URL('/', req.nextUrl))
    
  }
 
  return NextResponse.next()
}
 
// Routes Middleware should not run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}