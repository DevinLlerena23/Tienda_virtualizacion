import Image from 'next/image';

export function PaymentMethods({ selectedMethod, onSelectMethod }) {
  const paymentMethods = [
    {
      id: 'visa',
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png"
    },
    {
      id: 'mastercard',
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png"
    },
    {
      id: 'paypal',
      image: "https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_37x23.jpg"
    }
  ];

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Método de Pago</h3>
      <div className="grid grid-cols-3 gap-4">
        {paymentMethods.map((method) => (
          <button
            key={method.id}
            onClick={() => onSelectMethod(method.id)}
            className={`h-16 bg-white p-4 rounded-lg transition-all duration-200 
              ${selectedMethod === method.id 
                ? 'ring-2 ring-purple-500 scale-105 shadow-lg' 
                : 'hover:scale-105 hover:shadow-md'}`}
          >
            <div className="relative h-full w-full">
              <Image
                src={method.image}
                alt={method.id}
                fill
                className="object-contain"
                priority
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}