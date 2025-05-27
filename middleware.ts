import { updateSession } from '@/utils/supabase/middleware';
import { NextResponse, type NextRequest } from 'next/server';

// Rutas que REQUIEREN autenticación
const protectedRoutes = [
  '/dashboard',
  '/settings',
  '/billing',
  '/api/user',
  '/api/billing'
];

// Rutas que NO pueden acceder usuarios autenticados
const authRoutes = [
  '/auth/login',
  '/auth/register',
  '/auth/reset-password'
];

// Rutas públicas (acceso libre)
const publicRoutes = [
  '/',
  '/pricing',
  '/about',
  '/auth/callback'
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 1. SIEMPRE refrescar sesión primero
  const supabaseResponse = await updateSession(request);
  
  // 2. Obtener user del response actualizado
  const user = await getUserFromRequest(supabaseResponse);
  
  // 3. Lógica de redirección
  if (isProtectedRoute(pathname) && !user) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  if (isAuthRoute(pathname) && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  return supabaseResponse;
}

// Helper functions
function isProtectedRoute(pathname: string): boolean {
  return protectedRoutes.some(route => pathname.startsWith(route));
}

function isAuthRoute(pathname: string): boolean {
  return authRoutes.includes(pathname);
}

async function getUserFromRequest(response: NextResponse) {
  // Extraer cookies del response
  const cookies = response.cookies.getAll();
  const accessToken = cookies.find(c => c.name.includes('access_token'))?.value;
  
  if (!accessToken) return null;
  
  try {
    // Validar token sin hacer request adicional
    const payload = JSON.parse(atob(accessToken.split('.')[1]));
    return payload.exp > Date.now() / 1000 ? payload : null;
  } catch {
    return null;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};