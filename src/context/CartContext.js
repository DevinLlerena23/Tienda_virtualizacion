import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      const userId = localStorage.getItem('userId');
      const savedCart = localStorage.getItem(`cart_${userId}`);
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  }, []);

  useEffect(() => {
    try {
      const userId = localStorage.getItem('userId');
      if (cartItems.length > 0 && userId) {
        localStorage.setItem(`cart_${userId}`, JSON.stringify(cartItems));
      } else {
        localStorage.removeItem(`cart_${userId}`);
      }
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  }, [cartItems]);

  const addToCart = (game) => {
    try {
      setCartItems(prev => {
        const existingItem = prev.find(item => item.id === game.id);
        if (existingItem) {
          // Si el item ya existe, incrementar la cantidad
          return prev.map(item =>
            item.id === game.id
              ? { ...item, quantity: (item.quantity || 1) + 1 }
              : item
          );
        }
        // Si el item no existe, agregarlo con cantidad 1
        return [...prev, { ...game, quantity: 1 }];
      });
      setIsCartOpen(true);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const removeFromCart = (gameId) => {
    try {
      setCartItems(prev => prev.filter(item => item.id !== gameId));
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const updateQuantity = (gameId, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(prev =>
      prev.map(item =>
        item.id === gameId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const increaseQuantity = (gameId) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === gameId
          ? { ...item, quantity: (item.quantity || 1) + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (gameId) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === gameId && (item.quantity || 1) > 1
          ? { ...item, quantity: (item.quantity || 1) - 1 }
          : item
      )
    );
  };

  const processPrice = (priceString) => {
    return parseFloat(priceString.replace('$', '')) || 0;
  };

  const processDiscount = (discountString) => {
    if (!discountString) return 0;
    return parseFloat(discountString.replace(/[-%]/g, ''));
  };

  const cartTotal = cartItems.reduce((total, item) => {
    const price = processPrice(item.precio);
    const discount = processDiscount(item.descuento);
    const finalPrice = price * (1 - discount / 100);
    return total + (finalPrice * (item.quantity || 1));
  }, 0);

  const clearCart = () => {
    setCartItems([]);
    const userId = localStorage.getItem('userId');
    localStorage.removeItem(`cart_${userId}`);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        cartTotal,
        clearCart,
        updateQuantity,
        increaseQuantity,
        decreaseQuantity
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};