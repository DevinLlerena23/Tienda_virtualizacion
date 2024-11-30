import { NextResponse } from 'next/server';

// SOLO estas rutas serán protegidas
export const config = {
  matcher: [
    '/carrito',
    '/checkout',
    '/mis-pedidos',
    '/perfil'
  ]
};

export function middleware(request) {
  // Obtener el token
  const token = request.cookies.get('token')?.value;

  // Si no hay token, redirigir al login SOLO para rutas protegidas
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Si hay token, permitir el acceso
  return NextResponse.next();
}