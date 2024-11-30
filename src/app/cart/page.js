"use client";
import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/context/translations';
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity,
    increaseQuantity,
    decreaseQuantity 
  } = useCart();
  const { language } = useLanguage();
  const t = translations[language];
  const router = useRouter();

  const calculateFinalPrice = (item) => {
    const basePrice = typeof item.precio === 'string' 
      ? parseFloat(item.precio.replace('$', ''))
      : parseFloat(item.precio);
    
    const quantity = item.quantity || 1;
    
    if (item.descuento) {
      const discount = typeof item.descuento === 'string'
        ? parseFloat(item.descuento.replace(/[-%]/g, ''))
        : parseFloat(item.descuento);
      
      return basePrice * (1 - discount / 100) * quantity;
    }
    
    return basePrice * quantity;
  };

  return (
    <div className="min-h-screen bg-[#1c1b29] text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">MI CARRITO</h1>
        
        <div className="bg-[#2a293b] rounded-lg overflow-hidden">
          <div className="grid grid-cols-4 gap-4 p-4 border-b border-gray-700 font-semibold">
            <div className="col-span-2">PRODUCTO</div>
            <div className="text-center">CANTIDAD</div>
            <div className="text-right">SUBTOTAL</div>
          </div>

          {cartItems.map((item) => (
            <div key={item.id} className="grid grid-cols-4 gap-4 p-4 border-b border-gray-700 items-center">
              <div className="col-span-2 flex gap-4">
                <div className="relative w-24 h-24">
                  <Image
                    src={item.imagen}
                    alt={item.nombre}
                    fill
                    className="object-cover rounded"
                  />
                </div>
                <div>
                  <h3 className="font-semibold">{item.nombre}</h3>
                  <p className="text-sm text-gray-400">{item.categoria}</p>
                  <p className="text-sm text-gray-400">MUNDIAL</p>
                </div>
              </div>
              <div className="text-center flex items-center justify-center gap-4">
                <button 
                  onClick={() => decreaseQuantity(item.id)}
                  className="w-8 h-8 bg-[#1c1b29] rounded-full hover:bg-purple-600"
                >
                  -
                </button>
                <span>{item.quantity || 1}</span>
                <button 
                  onClick={() => increaseQuantity(item.id)}
                  className="w-8 h-8 bg-[#1c1b29] rounded-full hover:bg-purple-600"
                >
                  +
                </button>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-right flex-1">
                  {item.descuento ? (
                    <div>
                      <p className="text-sm text-gray-400 line-through">
                        ${(parseFloat(item.precio) * (item.quantity || 1)).toFixed(2)}
                      </p>
                      <p className="font-semibold text-green-500">
                        ${calculateFinalPrice(item).toFixed(2)}
                      </p>
                      <p className="text-xs text-green-500">
                        {item.descuento} de descuento
                      </p>
                    </div>
                  ) : (
                    <p className="font-semibold">
                      ${calculateFinalPrice(item).toFixed(2)}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="ml-4 text-gray-400 hover:text-red-500"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-end gap-4">
          <Button 
            className="bg-[#9146ff] hover:bg-[#7d3bda]"
            onClick={() => router.push('/')}
          >
            Continuar Comprando
          </Button>
          <Button 
            className="bg-[#9146ff] hover:bg-[#7d3bda]"
            onClick={() => router.push('/checkout')}
          >
            Continuar al Pago
          </Button>
        </div>
      </div>
    </div>
  );
}