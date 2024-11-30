"use client";
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Globe, Shield, Zap, Gift, CreditCard, ShoppingCart } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/context/translations';
import { useCurrency } from '@/context/CurrencyContext';
import { useUser } from '@/context/UserContext';
import { useCart } from '@/context/CartContext';

export default function GameDetail() {
  const router = useRouter();
  const { id } = useParams();
  const { user } = useUser();
  const [game, setGame] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isAutoPlaying] = useState(true);
  const { language } = useLanguage();
  const t = translations[language];
  const { convertPrice } = useCurrency();
  const { 
    cartItems, 
    isCartOpen, 
    setIsCartOpen, 
    addToCart, 
    removeFromCart, 
    cartTotal 
  } = useCart();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search');

  // Imágenes de muestra (puedes agregar más a tu base de datos)
  const sampleImages = [
    game?.imagen,
    ...(game?.imagenes || [])
  ].filter(Boolean);

  useEffect(() => {
    if (searchQuery) {
      setIsLoading(true);
      axios.get(`http://localhost:8080/productos/buscar?q=${encodeURIComponent(searchQuery)}`)
        .then(response => {
          setGame(response.data);
        })
        .catch(error => {
          console.error('Error al buscar:', error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      axios.get(`http://localhost:8080/productos/${id}`)
        .then(response => {
          setGame(response.data);
        })
        .catch(error => {
          console.error('Error:', error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [id, searchQuery]);

  useEffect(() => {
    let interval;
    
    if (isAutoPlaying && sampleImages.length > 1) {
      interval = setInterval(() => {
        setIsTransitioning(true);
        setTimeout(() => {
          setSelectedImage((current) => 
            current === sampleImages.length - 1 ? 0 : current + 1
          );
          setIsTransitioning(false);
        }, 300);
      }, 7000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isAutoPlaying, sampleImages.length]);

  const handleImageClick = (index) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedImage(index);
      setIsTransitioning(false);
    }, 300);
  };

  const handleAddToCart = () => {
    if (!user) {
      router.push(`/login?returnUrl=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    addToCart(game);
    setIsCartOpen(true);
  };

  // Función helper para procesar el precio
  const processPrice = (priceString) => {
    const priceWithoutSymbol = priceString.replace('$', '');
    const numericPrice = parseFloat(priceWithoutSymbol);
    return numericPrice || 0;
  };

  // Función helper para procesar el descuento
  const processDiscount = (discountString) => {
    if (!discountString) return 0;
    const discountWithoutSymbols = discountString.replace(/[-%]/g, '');
    const numericDiscount = parseFloat(discountWithoutSymbols);
    return numericDiscount;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1c1b29] text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-[#1c1b29] text-white flex items-center justify-center">
        <div className="text-xl">Juego no encontrado</div>
      </div>
    );
  }

  
  const precioNumerico = processPrice(game.precio);
 
  const descuentoProcesado = processDiscount(game.descuento);
 
  const precioConDescuento = precioNumerico * (1 - descuentoProcesado / 100);
 

  return (
    <div className="min-h-screen bg-[#1c1b29] text-white relative">
      <main className="container mx-auto px-4 py-8">
        <Button 
          onClick={() => router.back()}
          className="mb-8 bg-[#2a293b] hover:bg-[#3a394b] flex items-center gap-2"
        >
          ← {t.back}
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Columna Izquierda - Imágenes */}
          <div className="space-y-6">
            {/* Imagen Principal */}
            <div className="relative aspect-video rounded-lg overflow-hidden cursor-pointer group">
              <Image
                src={sampleImages[selectedImage]}
                alt={game.nombre}
                fill
                className={`object-contain transition-all duration-700 ease-in-out
                  ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}
                  group-hover:scale-105`}
                priority
              />
              
              {/* Indicadores de navegación */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {sampleImages.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300
                      ${selectedImage === index 
                        ? 'bg-purple-500 w-4' 
                        : 'bg-gray-400 hover:bg-gray-300'}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleImageClick(index);
                    }}
                  />
                ))}
              </div>

              {/* Flechas de navegación */}
              <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const prevIndex = selectedImage === 0 ? sampleImages.length - 1 : selectedImage - 1;
                    handleImageClick(prevIndex);
                  }}
                  className="bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-all"
                >
                  ←
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const nextIndex = selectedImage === sampleImages.length - 1 ? 0 : selectedImage + 1;
                    handleImageClick(nextIndex);
                  }}
                  className="bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-all"
                >
                  →
                </button>
              </div>
            </div>
            
            {/* Galería de miniaturas */}
            <div className="flex justify-center gap-4 mt-4">
              {sampleImages.map((img, index) => (
                <div 
                  key={index}
                  className={`relative w-32 aspect-video cursor-pointer rounded-lg overflow-hidden 
                    transition-all duration-300 transform hover:scale-105
                    ${selectedImage === index 
                      ? 'ring-2 ring-purple-500 scale-95' 
                      : 'hover:ring-2 hover:ring-purple-300'}`}
                  onClick={() => handleImageClick(index)}
                >
                  <Image
                    src={img}
                    alt={`${game.nombre} screenshot ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-300"
                  />
                </div>
              ))}
            </div>

            {/* Requisitos del Sistema */}
            <div className="mt-8">
              <h3 className="text-xl font-bold mb-4">{t.systemRequirements}</h3>
              <div className="bg-[#2a293b] rounded-lg overflow-hidden">
                <div className="grid grid-cols-2">
                  {/* Encabezado */}
                  <div className="p-4 font-semibold bg-[#1f1e2e] border-r border-gray-700">
                    {t.minimumRequirements}
                  </div>
                  <div className="p-4 font-semibold bg-[#1f1e2e]">
                    {t.recommendedRequirements}
                  </div>

                  {/* SO */}
                  <div className="p-4 border-t border-r border-gray-700">
                    <div className="text-gray-400 text-sm mb-1">{t.os}</div>
                    <div>Windows 10 64-bit</div>
                  </div>
                  <div className="p-4 border-t border-gray-700">
                    <div className="text-gray-400 text-sm mb-1">{t.os}</div>
                    <div>Windows 10 64-bit</div>
                  </div>

                  {/* Procesador */}
                  <div className="p-4 border-t border-r border-gray-700">
                    <div className="text-gray-400 text-sm mb-1">{t.processor}</div>
                    <div>Intel i5-4670k or AMD Ryzen 3 1200</div>
                  </div>
                  <div className="p-4 border-t border-gray-700">
                    <div className="text-gray-400 text-sm mb-1">{t.processor}</div>
                    <div>Intel i5-8600 or AMD Ryzen 5 3600</div>
                  </div>

                  {/* Memoria */}
                  <div className="p-4 border-t border-r border-gray-700">
                    <div className="text-gray-400 text-sm mb-1">{t.memory}</div>
                    <div>8 GB RAM</div>
                  </div>
                  <div className="p-4 border-t border-gray-700">
                    <div className="text-gray-400 text-sm mb-1">{t.memory}</div>
                    <div>16 GB RAM</div>
                  </div>

                  {/* Gráficos */}
                  <div className="p-4 border-t border-r border-gray-700">
                    <div className="text-gray-400 text-sm mb-1">{t.graphics}</div>
                    <div>NVIDIA GTX 1060 (6GB) or AMD RX 5500 XT (8GB) or Intel Arc A750</div>
                  </div>
                  <div className="p-4 border-t border-gray-700">
                    <div className="text-gray-400 text-sm mb-1">{t.graphics}</div>
                    <div>NVIDIA RTX 2060 Super or AMD RX 5700 or Intel Arc A770</div>
                  </div>

                  {/* Almacenamiento */}
                  <div className="p-4 border-t border-r border-gray-700">
                    <div className="text-gray-400 text-sm mb-1">{t.storage}</div>
                    <div>190 GB available space</div>
                  </div>
                  <div className="p-4 border-t border-gray-700">
                    <div className="text-gray-400 text-sm mb-1">{t.storage}</div>
                    <div>190 GB available space</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Columna Derecha - Información */}
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <Badge className={game.estado ? 'bg-green-500' : 'bg-purple-500'}>
                  {game.estado ? t.availableNow : t.comingSoon}
                </Badge>
                <Badge className="bg-blue-500">{game.categoria}</Badge>
              </div>

              <h1 className="text-4xl font-bold mb-4">{game.nombre}</h1>

              <div className="flex items-center gap-4 mb-6">
                {game?.descuento ? (
                  <div className="flex items-center gap-2">
                    {/* Precio con descuento */}
                    <div className="text-3xl font-bold text-white">
                      ${precioConDescuento.toFixed(2)}
                    </div>
                    {/* Precio original tachado */}
                    <div className="text-xl text-gray-400 line-through">
                      ${precioNumerico.toFixed(2)}
                    </div>
                    {/* Badge del descuento */}
                    <Badge className="bg-red-500 text-white">
                      {game.descuento}
                    </Badge>
                  </div>
                ) : (
                  <div className="text-3xl font-bold">
                    ${precioNumerico.toFixed(2)}
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <Button 
                  className="bg-[#9146ff] hover:bg-[#7d3bda] text-white flex-1 py-6 text-lg"
                  onClick={handleAddToCart}
                >
                  {game.estado ? t.addToCart : t.preOrder}
                </Button>
                <Button variant="outline" className="bg-transparent border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white">
                  ♥
                </Button>
              </div>
            </div>

            {/* Características del Producto */}
            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                <Globe className="text-purple-500" />
                <div>
                  <h3 className="font-semibold">{t.region}</h3>
                  <p className="text-gray-400">{t.global}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="text-purple-500" />
                <div>
                  <h3 className="font-semibold">{t.platform}</h3>
                  <p className="text-gray-400">{game.categoria}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Zap className="text-purple-500" />
                <div>
                  <h3 className="font-semibold">{t.delivery}</h3>
                  <p className="text-gray-400">{t.immediate}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Gift className="text-purple-500" />
                <div>
                  <h3 className="font-semibold">{t.stock}</h3>
                  <p className="text-gray-400">{t.available}</p>
                </div>
              </div>
            </div>

            {/* Métodos de Pago */}
            <div>
              <h3 className="text-xl font-bold mb-4">{t.paymentMethods}</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="h-16 flex items-center justify-center bg-white p-4 rounded-lg">
                  <Image 
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png"
                    alt="Visa" 
                    width={80}
                    height={40}
                    className="object-contain w-auto h-full"
                  />
                </div>
                <div className="h-16 flex items-center justify-center bg-white p-4 rounded-lg">
                  <Image 
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png"
                    alt="Mastercard" 
                    width={80}
                    height={40}
                    className="object-contain w-auto h-full"
                  />
                </div>
                <div className="h-16 flex items-center justify-center bg-white p-4 rounded-lg">
                  <Image 
                    src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_37x23.jpg"
                    alt="PayPal" 
                    width={80}
                    height={40}
                    className="object-contain w-auto h-full"
                  />
                </div>
              </div>
            </div>

            {/* Descripción del Producto */}
            <div>
              <h3 className="text-xl font-bold mb-4">{t.productDescription}</h3>
              <p className="text-gray-400 leading-relaxed">
                {game.descripcion || t.noDescription}
              </p>
            </div>

            {/* Instrucciones de Activación */}
            <div>
              <h3 className="text-xl font-bold mb-4">{t.activationInstructions}</h3>
              <div className="bg-[#2a293b] p-6 rounded-lg space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                    1
                  </div>
                  <p>{t.activationStep1}</p>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                    2
                  </div>
                  <p>{t.activationStep2}</p>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                    3
                  </div>
                  <p>{t.activationStep3}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}