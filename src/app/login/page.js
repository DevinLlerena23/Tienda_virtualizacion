"use client"
import React from 'react'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useUser } from '@/context/UserContext';
import { useRouter, useSearchParams } from 'next/navigation';

function Page() {
  const { login, user } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl');
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (user) {
      const returnUrl = searchParams.get('returnUrl');
      if (returnUrl) {
        router.push(returnUrl);
      } else {
        router.push('/');
      }
    }
  }, [user, router, searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isLogin) {  // Registro
      if (!passwordsMatch) {
        setError('Las contraseñas no coinciden');
        return;
      }

      try {
        // Crear objeto de usuario según la estructura exacta del backend
        const usuarioData = {
          id: null,
          nombre: name,
          correo: email,
          contrasena: password,
          telefono: telefono,
          direccion: direccion
        };

        const response = await fetch('http://localhost:8080/usuarios/save', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(usuarioData)
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Error al registrar usuario');
        }

        // Si el registro es exitoso, hacer login automático
        const loginResponse = await fetch('http://localhost:8080/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            correo: email,
            contraseña: password
          })
        });

        const loginData = await loginResponse.json();

        if (!loginResponse.ok) {
          throw new Error(loginData.error || 'Error al iniciar sesión');
        }

        if (loginData.token) {
          localStorage.setItem('token', loginData.token);
          login({
            id: loginData.id,
            nombre: loginData.nombre,
            correo: loginData.correo,
            contrasena: password,
            telefono: loginData.telefono,
            direccion: loginData.direccion,
            token: loginData.token,
            isAdmin: loginData.isAdmin
          });
          if (returnUrl) {
            router.push(returnUrl);
          } else {
            router.back();
          }
        }
      } catch (error) {
        console.error('Error completo:', error);
        setError(error.message);
      }
    } else {  // Login
      try {
        const loginResponse = await fetch('http://localhost:8080/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            correo: email,
            contraseña: password
          })
        });

        const data = await loginResponse.json();

        if (!loginResponse.ok) {
          throw new Error(data.error || 'Credenciales inválidas');
        }

        if (data.token) {
          localStorage.setItem('token', data.token);
          login({
            id: data.id,
            nombre: data.nombre,
            correo: data.correo,
            contrasena: password,
            telefono: data.telefono || null,
            direccion: data.direccion || null,
            token: data.token,
            isAdmin: data.isAdmin
          });
          if (returnUrl) {
            router.push(returnUrl);
          } else {
            router.back();
          }
        }
      } catch (error) {
        console.error('Error al iniciar sesión:', error);
        setError(error.message);
      }
    }
  };

  useEffect(() => {
    if (confirmPassword) {
      setPasswordsMatch(password === confirmPassword)
    } else {
      setPasswordsMatch(true)
    }
  }, [password, confirmPassword])

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      return 'La contraseña debe tener al menos 8 caracteres';
    }
    if (!hasUpperCase || !hasLowerCase) {
      return 'La contraseña debe incluir mayúsculas y minúsculas';
    }
    if (!hasNumbers) {
      return 'La contraseña debe incluir al menos un número';
    }
    if (!hasSpecialChar) {
      return 'La contraseña debe incluir al menos un carácter especial';
    }
    return '';
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordError(validatePassword(newPassword));
  };

  const handleLogin = async (credentials) => {
    try {
      const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error en el inicio de sesión');
      }

      if (data.token) {
        // Guardar token en cookies en lugar de localStorage
        document.cookie = `token=${data.token}; path=/`;
        
        // Login en el contexto
        login({
          id: data.id,
          nombre: data.nombre,
          correo: data.correo,
          telefono: data.telefono,
          direccion: data.direccion,
          token: data.token
        });

        // Redirigir según returnUrl
        const returnUrl = searchParams.get('returnUrl');
        if (returnUrl) {
          router.push(returnUrl);
        } else {
          router.back();
        }
      }
    } catch (error) {
      console.error('Error en login:', error);
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#1c1b29] p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mb-4">
            <svg
              className="w-16 h-16 mx-auto text-[#9146ff]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Bienvenido!</h1>
          <p className="text-gray-400">Por favor inicia sesión o crea una cuenta.</p>
        </div>

        <Card className="bg-[#2a293b] border-none">
          <CardHeader>
            <CardTitle className="text-center text-white">
              {isLogin ? 'Login' : 'Register'}
            </CardTitle>
            <CardDescription className="text-gray-400">
              {isLogin 
                ? 'Ingrese sus credenciales para acceder.'
                : 'Cree una cuenta para iniciar.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full" onValueChange={(value) => setIsLogin(value === 'login')}>
              <TabsList className="grid w-full grid-cols-2 bg-[#201f2f]">
                <TabsTrigger 
                  value="login" 
                  className="bg-[#201f2f] text-gray-400 hover:bg-[#2a293b] data-[state=active]:bg-[#9146ff] data-[state=active]:text-white border-none"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger 
                  value="register" 
                  className="bg-[#201f2f] text-gray-400 hover:bg-[#2a293b] data-[state=active]:bg-[#9146ff] data-[state=active]:text-white border-none"
                >
                  Register
                </TabsTrigger>
              </TabsList>

              <AnimatePresence mode="wait">
                <motion.div
                  key={isLogin ? 'login' : 'register'}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={{
                    hidden: { opacity: 0, y: -20 },
                    visible: { opacity: 1, y: 0 },
                    exit: { opacity: 0, y: 20 }
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {isLogin ? (
                    <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
                      <div className="space-y-2">
                        <Label>Correo</Label>
                        <Input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="bg-[#201f2f] border-gray-700 text-white"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Contraseña</Label>
                        <Input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="bg-[#201f2f] border-gray-700 text-white"
                          required
                        />
                      </div>

                      {error && (
                        <Alert variant="destructive">
                          <AlertDescription>{error}</AlertDescription>
                        </Alert>
                      )}

                      <Button type="submit" className="w-full bg-[#9146ff] hover:bg-[#7b2fef] text-white">
                        Iniciar Sesión
                      </Button>
                    </form>
                  ) : (
                    <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
                      <div className="space-y-2">
                        <Label>Nombre</Label>
                        <Input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="bg-[#201f2f] border-gray-700 text-white"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Correo</Label>
                        <Input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="bg-[#201f2f] border-gray-700 text-white"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Contraseña</Label>
                        <Input
                          type="password"
                          value={password}
                          onChange={handlePasswordChange}
                          className="bg-[#201f2f] border-gray-700 text-white"
                          required
                        />
                        {passwordError && (
                          <p className="text-sm text-red-500">
                            {passwordError}
                          </p>
                        )}
                        <div className="text-xs text-gray-400">
                          La contraseña debe contener:
                          <ul className="list-disc list-inside mt-1">
                            <li>Al menos 8 caracteres</li>
                            <li>Mayúsculas y minúsculas</li>
                            <li>Al menos un número</li>
                            <li>Al menos un carácter especial</li>
                          </ul>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Confirmar contraseña</Label>
                        <Input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="bg-[#201f2f] border-gray-700 text-white"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Teléfono</Label>
                        <Input
                          type="tel"
                          value={telefono}
                          onChange={(e) => setTelefono(e.target.value)}
                          className="bg-[#201f2f] border-gray-700 text-white"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Dirección</Label>
                        <Input
                          type="text"
                          value={direccion}
                          onChange={(e) => setDireccion(e.target.value)}
                          className="bg-[#201f2f] border-gray-700 text-white"
                          required
                        />
                      </div>

                      {error && (
                        <Alert variant="destructive">
                          <AlertDescription>{error}</AlertDescription>
                        </Alert>
                      )}

                      {!passwordsMatch && (
                        <Alert variant="destructive">
                          <AlertDescription>
                            Las contraseñas no coinciden.
                          </AlertDescription>
                        </Alert>
                      )}

                      <Button 
                        type="submit" 
                        className="w-full bg-[#9146ff] hover:bg-[#7b2fef] text-white"
                        disabled={!passwordsMatch || passwordError}
                      >
                        Crear usuario
                      </Button>
                    </form>
                  )}
                </motion.div>
              </AnimatePresence>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Page;