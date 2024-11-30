import React, { createContext, useContext, useState } from 'react';

const CurrencyContext = createContext();

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState('USD');

  const convertPrice = (priceString) => {
    // Asegurarse de que tengamos un valor válido para convertir
    if (!priceString && priceString !== 0) {
      return currency === 'USD' ? '$0.00' : '€0.00';
    }

    // Extraer el valor numérico y el signo por separado
    const stringValue = String(priceString);
    const isNegative = stringValue.startsWith('-');
    
    // Obtener el valor absoluto numérico
    const absoluteValue = Math.abs(
      typeof priceString === 'number' 
        ? priceString 
        : parseFloat(stringValue.replace(/[^0-9.]/g, ''))
    );

    if (isNaN(absoluteValue)) {
      return currency === 'USD' ? '$0.00' : '€0.00';
    }

    // Tasas de conversión
    const rates = {
      USD: 1,
      EUR: 0.91
    };

    // Convertir el valor manteniendo el signo original
    const convertedValue = absoluteValue * rates[currency];
    const finalValue = isNegative ? -convertedValue : convertedValue;

    // Formatear el resultado
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    // Asegurar que el signo negativo se mantenga en el resultado final
    return isNegative ? `-${formatter.format(Math.abs(finalValue))}` : formatter.format(finalValue);
  };

  const changeCurrency = (newCurrency) => {
    setCurrency(newCurrency);
  };

  return (
    <CurrencyContext.Provider value={{ currency, changeCurrency, convertPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};