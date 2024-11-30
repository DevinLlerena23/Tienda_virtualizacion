"use client";
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/navigation';
import { PaymentMethods } from '@/components/ui/PaymentMethods';
import { OrderSummary } from '@/components/ui/OrderSummary';
import { PreInvoice } from '@/components/ui/PreInvoice';

export default function CheckoutPage() {
  const { cartItems } = useCart();
  const { user } = useUser();
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState('');
  const [showInvoice, setShowInvoice] = useState(false);

  const handlePayNow = () => {
    if (paymentMethod) {
      setShowInvoice(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#1c1b29] text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-[#2a293b] rounded-lg border border-gray-700 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <PaymentMethods
              selectedMethod={paymentMethod}
              onSelectMethod={setPaymentMethod}
            />
            <OrderSummary cartItems={cartItems} />
          </div>
          <button
            className={`w-full mt-6 p-2 rounded transition-colors duration-200
              ${paymentMethod 
                ? 'bg-[#9146ff] hover:bg-[#7d3bda] cursor-pointer' 
                : 'bg-gray-600 cursor-not-allowed'}`}
            disabled={!paymentMethod}
            onClick={handlePayNow}
          >
            {paymentMethod ? 'Pay Now' : 'Select Payment Method'}
          </button>
        </div>
      </div>

      <PreInvoice
        isOpen={showInvoice}
        onClose={() => setShowInvoice(false)}
        user={user}
        cartItems={cartItems}
        paymentMethod={paymentMethod}
        onConfirm={() => router.push('/success')}
      />
    </div>
  );
}