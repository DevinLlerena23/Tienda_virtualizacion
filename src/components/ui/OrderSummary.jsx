export function OrderSummary({ cartItems }) {
  // Función auxiliar para calcular el precio con descuento
  const calculateItemPrice = (item) => {
    const basePrice = parseFloat(item.precio);
    const quantity = item.quantity || 1;
    
    if (item.descuento) {
      // Calculamos directamente el precio final usando el porcentaje a pagar
      const percentageToPay = 1 - (parseFloat(item.descuento) / 100);
      const finalPrice = basePrice * percentageToPay * quantity;
      return finalPrice;
    }
    
    return basePrice * quantity;
  };

  // Calcular el total sumando los precios con descuento
  const total = cartItems.reduce((sum, item) => {
    const itemTotal = calculateItemPrice(item);
    return sum + itemTotal;
  }, 0);

  return (
    <div className="bg-[#1c1b29] p-6 rounded-lg">
      <h2 className="text-xl font-bold mb-4">MI CARRITO</h2>
      <div className="grid grid-cols-3 gap-4 mb-4 text-gray-400">
        <span>PRODUCTO</span>
        <span className="text-center">CANTIDAD</span>
        <span className="text-right">SUBTOTAL</span>
      </div>
      
      {cartItems.map((item) => (
        <div key={item.id} className="grid grid-cols-3 gap-4 items-center py-2">
          <div>
            <span className="text-white">{item.nombre}</span>
            {item.plataforma && (
              <span className="text-gray-400 text-sm ml-2">
                ({item.plataforma})
              </span>
            )}
          </div>
          <div className="text-center">{item.quantity || 1}</div>
          <div className="text-right">
            ${calculateItemPrice(item).toFixed(2)}
          </div>
        </div>
      ))}

      <div className="border-t border-gray-700 mt-4 pt-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Total:</span>
          <span className="text-xl font-bold">
            ${total.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
