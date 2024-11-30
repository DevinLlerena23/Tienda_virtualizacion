import Image from 'next/image';

export function PreInvoice({ isOpen, onClose, user, cartItems, paymentMethod, onConfirm }) {
  if (!isOpen) return null;

  const generateInvoiceNumber = () => `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-[#2a293b] text-white p-8 rounded-lg max-w-2xl mx-auto relative">
        <div className="border-b border-gray-700 pb-4 mb-6">
          <h2 className="text-2xl font-bold">Pre-Invoice</h2>
          <p className="text-gray-400">Invoice #{generateInvoiceNumber()}</p>
          <p className="text-gray-400">Date: {new Date().toLocaleDateString()}</p>
        </div>

        {/* Información del Cliente */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Customer Details</h3>
          <p>{user?.nombre}</p>
          <p>{user?.email}</p>
        </div>

        {/* Detalles del Pedido */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Order Details</h3>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16">
                    <Image
                      src={item.imagen}
                      alt={item.nombre}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  <div>
                    <p className="font-medium">{item.nombre}</p>
                    <p className="text-sm text-gray-400">{item.categoria}</p>
                  </div>
                </div>
                <p className="font-semibold">${item.precio}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Resumen de Pago */}
        <div className="border-t border-gray-700 pt-4">
          <div className="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>${cartItems.reduce((total, item) => total + parseFloat(item.precio), 0).toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-4">
            <span>Payment Method</span>
            <span className="capitalize">{paymentMethod}</span>
          </div>
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>${cartItems.reduce((total, item) => total + parseFloat(item.precio), 0).toFixed(2)}</span>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="mt-6 flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-[#9146ff] hover:bg-[#7d3bda] rounded"
          >
            Confirm Payment
          </button>
        </div>
      </div>
    </div>
  );
}