"use client";
import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
        
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await fetch('http://localhost:8080/usuarios/verify', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const userData = await response.json();
          setUser({
            ...userData,
            token: `Bearer ${token}`
          });
        } else {
          // Si el token no es válido, lo eliminamos
          document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
          setUser(null);
        }
      } catch (error) {
        console.error('Error al verificar autenticación:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (userData) => {
    if (!userData || !userData.token) {
      console.error('Datos de usuario inválidos en login');
      return;
    }
    const token = userData.token.startsWith('Bearer ') ? userData.token : `Bearer ${userData.token}`;
    setUser({
      ...userData,
      token
    });
    document.cookie = `token=${userData.token.replace('Bearer ', '')}; path=/`;
  };

  const logout = () => {
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    setUser(null);
  };

  const updateUser = (newUserData) => {
    if (user) {
      setUser({
        ...user,
        ...newUserData,
        token: user.token
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1c1b29] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <UserContext.Provider value={{ 
      user, 
      login, 
      logout,
      updateUser,
      setUser 
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser debe ser usado dentro de un UserProvider');
  }
  return context;
}