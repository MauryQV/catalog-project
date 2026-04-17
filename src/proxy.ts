import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'


export async function proxy(request: NextRequest) {
  const response = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
  const isAdminRoot = request.nextUrl.pathname === '/admin'
  const isDocsRoute = request.nextUrl.pathname.startsWith('/api-docs')
  if (isAdminRoute) {
    if (!user && !isAdminRoot) {
      // Unauthenticated users trying to access subroutes redirect to /admin
      return NextResponse.redirect(new URL('/admin', request.url))
    }

    if (user && isAdminRoot) {
      // Authenticated users trying to access login redirect to /admin/dashboard
      return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    }
  }
  if (isDocsRoute) {
    
    if (process.env.NODE_ENV === 'production' && !user) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
  }
  return response
}

export const config = {
  matcher: ['/admin/:path*',
    '/api/:path*',
    '/api-docs/:path*',
    '/api-docs'
  ],
}