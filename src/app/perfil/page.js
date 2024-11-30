"use client";
import { useUser } from '@/context/UserContext';
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useRouter } from 'next/navigation';
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

export default function Perfil() {
  const { user, setUser } = useUser();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Información General');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    telefono: '',
    direccion: ''
  });
  const [error, setError] = useState('');
  const [pedidos, setPedidos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mover la lógica dentro del useEffect
  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre || '',
        correo: user.correo || '',
        telefono: user.telefono || '',
        direccion: user.direccion || ''
      });
    }
  }, [user]);

  // Si no hay usuario, mostrar pantalla de no autenticado
  if (!user) {
    return (
      <div className="min-h-screen bg-[#1c1b29] flex items-center justify-center p-4">
        <div className="bg-[#201f2f] p-8 rounded-lg text-center max-w-md w-full">
          <h2 className="text-2xl font-bold text-white mb-4">
            ¡Bienvenido a tu Perfil!
          </h2>
          <p className="text-gray-300 mb-6">
            Inicia sesión para acceder a tu perfil
          </p>
          <div className="space-y-4">
            <Button
              onClick={() => router.push(`/login?returnUrl=${encodeURIComponent(window.location.pathname)}`)}
              className="w-full bg-[#9146ff] hover:bg-[#7b2fef] text-white"
            >
              Iniciar Sesión
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const tabs = ['Información General', 'Mis Pedidos', 'Métodos de Pago'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveChanges = async () => {
    try {
      if (!user?.id || !user?.token) {
        throw new Error('Usuario no autenticado');
      }

      // Asegurarse de que el token incluya 'Bearer'
      const token = user.token.startsWith('Bearer ') ? user.token : `Bearer ${user.token}`;

      const response = await fetch(`http://localhost:8080/usuarios/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify({
          id: user.id,
          nombre: formData.nombre,
          correo: formData.correo,
          telefono: formData.telefono,
          direccion: formData.direccion
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar los datos');
      }

      const data = await response.json();
      
      if (data.usuario) {
        // Actualizar el contexto del usuario con los nuevos datos
        setUser({
          ...user,
          ...data.usuario
        });
        setIsEditing(false);
        setError('');
        // Mostrar mensaje de éxito
        alert('Datos actualizados correctamente');
      }
    } catch (error) {
      console.error('Error al actualizar:', error);
      setError(error.message || 'Error al actualizar los datos. Por favor, intenta de nuevo.');
    }
  };

  // useEffect(() => {
  //   const fetchPedidos = async () => {
  //     if (!user?.id || !user?.token) {
  //       setIsLoading(false);
  //       return;
  //     }

  //     try {
  //       const response = await fetch(`http://localhost:8080/pedidos/usuario/${user.id}`, {
  //         headers: {
  //           'Authorization': user.token,
  //           'Content-Type': 'application/json'
  //         }
  //       });

  //       if (!response.ok) {
  //         throw new Error('Error al obtener los pedidos');
  //       }

  //       const data = await response.json();
  //       setPedidos(data.pedidos || []);
  //     } catch (error) {
  //       console.error('Error:', error);
  //       setError('No se pudieron cargar los pedidos');
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchPedidos();
  // }, [user]);

  // // Mostrar estado de carga
  // if (isLoading) {
  //   return (
  //     <div className="min-h-screen bg-[#1c1b29] flex items-center justify-center">
  //       <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
  //     </div>
  //   );
  // }

  // Mostrar mensaje de error si existe
  if (error) {
    return (
      <div className="min-h-screen bg-[#1c1b29] flex items-center justify-center">
        <div className="bg-[#201f2f] p-8 rounded-lg text-center">
          <p className="text-red-500">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="mt-4 bg-[#9146ff] hover:bg-[#7b2fef]"
          >
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'Pendiente':
        return 'bg-yellow-500 text-black';
      case 'En proceso':
        return 'bg-blue-500 text-white';
      case 'Entregado':
        return 'bg-green-500 text-white';
      case 'Cancelado':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const convertPrice = (price) => {
    return `$${price.toFixed(2)}`;
  };

  return (
    <div className="min-h-screen bg-[#1c1b29] text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Mi Perfil</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Panel izquierdo - Información del usuario */}
        <div className="bg-[#201f2f] p-6 rounded-lg text-center">
          <div className="w-32 h-32 bg-[#2a293b] rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-4xl font-bold">
              {user.nombre ? user.nombre[0].toUpperCase() : 'U'}
            </span>
          </div>
          <h2 className="text-xl font-bold">{user.nombre}</h2>
          <p className="text-gray-400">{user.correo}</p>
        </div>

        {/* Panel derecho - Contenido principal */}
        <div className="md:col-span-3">
          <div className="bg-[#201f2f] rounded-lg">
            {/* Tabs de navegación */}
            <div className="flex space-x-4 p-4 border-b border-gray-700">
              {tabs.map(tab => (
                <button
                  key={tab}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    activeTab === tab ? 'bg-[#2a293b] text-white' : 'text-gray-400 hover:text-white'
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Contenido */}
            <div className="p-6">
              {activeTab === 'Información General' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold">Información Personal</h3>
                    <Button
                      onClick={() => setIsEditing(!isEditing)}
                      className="bg-[#9146ff] hover:bg-[#7b2fef]"
                    >
                      {isEditing ? 'Cancelar' : 'Editar Perfil'}
                    </Button>
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Nombre</label>
                      <Input
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="bg-[#2a293b] border-gray-700"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Correo</label>
                      <Input
                        name="correo"
                        value={formData.correo}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="bg-[#2a293b] border-gray-700"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Teléfono</label>
                      <Input
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="bg-[#2a293b] border-gray-700"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Dirección</label>
                      <Input
                        name="direccion"
                        value={formData.direccion}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="bg-[#2a293b] border-gray-700"
                      />
                    </div>

                    {isEditing && (
                      <Button
                        onClick={handleSaveChanges}
                        className="w-full bg-[#9146ff] hover:bg-[#7b2fef]"
                      >
                        Guardar Cambios
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'Mis Pedidos' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold mb-4">Historial de Pedidos</h3>
                  <div className="space-y-6">
                    {pedidos.length === 0 ? (
                      <div className="bg-[#201f2f] p-8 rounded-lg text-center">
                        <h2 className="text-xl mb-4">No tienes pedidos aún</h2>
                        <Button
                          onClick={() => router.push('/')}
                          className="bg-[#9146ff] hover:bg-[#7b2fef]"
                        >
                          Explorar Productos
                        </Button>
                      </div>
                    ) : (
                      pedidos.map((pedido) => (
                        <div key={pedido.id} className="bg-[#201f2f] rounded-lg overflow-hidden">
                          <div className="bg-[#2a293b] p-4 flex justify-between items-center">
                            <div>
                              <p className="text-sm text-gray-400">Pedido #{pedido.id}</p>
                              <p className="text-sm text-gray-400">
                                {new Date(pedido.fecha).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge className={getEstadoColor(pedido.estado)}>
                              {pedido.estado}
                            </Badge>
                          </div>
                          
                          <div className="p-4">
                            {pedido.detalles?.map((detalle) => (
                              <div key={detalle.id} className="flex items-center gap-4 py-4 border-b border-gray-700 last:border-0">
                                <div className="relative w-20 h-20">
                                  <Image
                                    src={detalle.imagen}
                                    alt={detalle.nombre}
                                    fill
                                    className="object-cover rounded"
                                  />
                                </div>
                                <div className="flex-1">
                                  <h3 className="font-semibold">{detalle.nombre}</h3>
                                  <p className="text-sm text-gray-400">Cantidad: {detalle.cantidad}</p>
                                </div>
                                <div className="text-right">
                                  <p className="font-semibold">${detalle.precio.toFixed(2)}</p>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="bg-[#2a293b] p-4 flex justify-between items-center">
                            <div>
                              <p className="text-sm text-gray-400">Total del pedido:</p>
                              <p className="text-xl font-bold">${pedido.total.toFixed(2)}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'Métodos de Pago' && (
                <div>
                  <h3 className="text-xl font-bold mb-4">Métodos de Pago</h3>
                  {/* Contenido de métodos de pago */}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}