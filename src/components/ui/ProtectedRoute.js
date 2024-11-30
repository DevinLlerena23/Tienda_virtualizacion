"use client";
import { useUser } from '@/context/UserContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProtectedRoute({ children }) {
  const { user } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);

  // Lista de rutas que SÍ requieren autenticación
  const protectedRoutes = [
    '/carrito',
    '/checkout',
    '/mis-pedidos',
    '/perfil'
  ];

  // Verifica si la ruta actual necesita protección
  const needsAuth = protectedRoutes.some(route => pathname.startsWith(route));

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      if (needsAuth && !user) {
        setIsLoading(true);
        if (mounted) {
          await router.push(`/login?returnUrl=${encodeURIComponent(pathname)}`);
          setIsLoading(false);
        }
      }
    };

    checkAuth();

    return () => {
      mounted = false;
    };
  }, [user, pathname, needsAuth]);

  // Si está cargando, mostrar el spinner
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1c1b29] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  // Si la ruta no necesita autenticación o el usuario está autenticado
  if (!needsAuth || (needsAuth && user)) {
    return children;
  }

  // Para rutas protegidas sin usuario autenticado
  return null;
}