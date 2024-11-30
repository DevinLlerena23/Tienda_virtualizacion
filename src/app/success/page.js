"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';

export default function SuccessPage() {
  const router = useRouter();
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
    
    const timeout = setTimeout(() => {
      router.push('/');
    }, 5000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="min-h-screen bg-[#1c1b29] text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">¡Pago exitoso!</h1>
        <p className="text-gray-400 mb-8">Gracias por tu compra</p>
        <button
          onClick={() => router.push('/')}
          className="bg-[#9146ff] hover:bg-[#7d3bda] px-6 py-2 rounded"
        >
          Volver a la página principal
        </button>
      </div>
    </div>
  );
}