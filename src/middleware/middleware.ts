import { NextRequest,NextResponse } from 'next/server'

export { default } from "next-auth/middleware"
import { getToken } from "next-auth/jwt"


// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {

    // get token 
    const token = await getToken({req: request})
    // get url 
    const url = request.nextUrl

    if(token && (
        url.pathname.startsWith('/sign-in') || url.pathname.startsWith('/sign-up') || url.pathname.startsWith('/verify-email-code') || url.pathname.startsWith('/') //TODO: for future impement 
     )){
        NextResponse.redirect(new URL('/dashboard', request.url))
    }

    if(!token && url.pathname.startsWith('/dashboard')){
        NextResponse.redirect(new URL('/sign-in', request.url)) 
    }
  return NextResponse.redirect(new URL('/home', request.url))
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/sign-in',

  ],
}