"use client";
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { useCurrency } from '@/context/CurrencyContext';
import { translations } from '@/context/translations';
import { ShoppingCart as CartIcon, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function ShoppingCart() {
  const { 
    cartItems, 
    isCartOpen, 
    setIsCartOpen, 
    removeFromCart, 
    cartTotal 
  } = useCart();
  const router = useRouter();
  const { language } = useLanguage();
  const t = translations[language];
  const { convertPrice } = useCurrency();

  if (!isCartOpen) return null;

  return (
    <>
      {/* Overlay de fondo oscuro */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={() => setIsCartOpen(false)}
      />
      
      {/* Panel del carrito */}
      <div className="fixed right-0 top-0 h-full w-80 bg-[#2a293b] shadow-lg z-50 p-4">
        {/* Encabezado del carrito */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <CartIcon className="h-6 w-6" />
            Carrito
          </h2>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setIsCartOpen(false)}
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        {/* Lista de productos */}
        <div className="flex-1 overflow-y-auto space-y-4">
          {cartItems.length === 0 ? (
            <p className="text-center text-gray-400 py-8">El carrito está vacío</p>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="bg-[#1c1b29] p-4 rounded-lg">
                <div className="flex gap-4">
                  {/* Imagen del producto */}
                  <div className="relative w-20 h-20">
                    <Image
                      src={item.imagen}
                      alt={item.nombre}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  {/* Información del producto */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">{item.nombre}</h3>
                    <div className="flex items-center gap-2">
                      <p className="text-purple-500">
                        {convertPrice(item.precio)}
                      </p>
                      {item.descuento && (
                        <span className="text-xs bg-red-500 text-white px-2 py-1 rounded">
                          -{item.descuento}
                        </span>
                      )}
                    </div>
                  </div>
                  {/* Botón eliminar */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer del carrito */}
        <div className="border-t border-gray-700 pt-4 mt-4">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg text-white">Total:</span>
            <span className="text-xl font-bold text-purple-500">
              {convertPrice(cartTotal)}
            </span>
          </div>
          <Button 
            className="w-full bg-[#9146ff] hover:bg-[#7d3bda] text-white"
            disabled={cartItems.length === 0}
            onClick={() => router.push('/cart')}
          >
            Ir al carrito
          </Button>
        </div>
      </div>
    </>
  );
}