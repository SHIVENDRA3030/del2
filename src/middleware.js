import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function middleware(request) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    try {
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            {
                cookies: {
                    getAll() {
                        return request.cookies.getAll()
                    },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                        response = NextResponse.next({
                            request: {
                                headers: request.headers,
                            },
                        })
                        cookiesToSet.forEach(({ name, value, options }) =>
                            response.cookies.set(name, value, options)
                        )
                    },
                },
            }
        )

        // Refresh session if needed
        const { data: { user } } = await supabase.auth.getUser()

        // Protect dashboard routes
        if (request.nextUrl.pathname.startsWith('/dashboard') && !user) {
            return NextResponse.redirect(new URL('/login', request.url))
        }

        // Redirect to dashboard if logged in and visiting auth pages
        if ((request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/register')) && user) {
            return NextResponse.redirect(new URL('/dashboard', request.url))
        }

    } catch (e) {
        // If you are here, a supabase client could not be created!
        // This is likely because the environment variables are not set.
        return NextResponse.next({
            request: {
                headers: request.headers,
            },
        })
    }

    return response
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
}
