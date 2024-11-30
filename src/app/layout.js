"use client";
import localFont from "next/font/local";
import "./globals.css";
import { Input } from "@/components/ui/input";
import { Search, ShoppingCart as CartIcon, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useCallback } from "react";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { LanguageProvider, useLanguage } from '@/context/LanguageContext';
import { translations } from '@/context/translations';
import { CurrencyProvider, useCurrency } from '@/context/CurrencyContext';
import { UserProvider, useUser } from '@/context/UserContext';
import { CartProvider, useCart } from '@/context/CartContext';
import ProtectedRoute from '@/components/ui/ProtectedRoute';
import ShoppingCart from '@/components/ui/ShoppingCart';



function Navbar() {
  const { user, logout } = useUser();
  const { clearCart, setIsCartOpen, isCartOpen } = useCart();
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleLogout = () => {
    clearCart();
    logout();
    setShowUserMenu(false);
    router.refresh();
  };

  const handleUserClick = () => {
    if (user) {
      setShowUserMenu(!showUserMenu);
    } else {
      router.push(`/login?returnUrl=${encodeURIComponent(currentPath)}`);
    }
  };

  const handleSearchChange = useCallback(async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim().length > 0) {
      setIsSearching(true);
      try {
        const response = await fetch(`http://localhost:8080/productos`);
        if (!response.ok) {
          throw new Error('Error en la búsqueda');
        }
        const data = await response.json();
        
        const filteredResults = data.filter(product => 
          product.nombre.toLowerCase().includes(query.toLowerCase())
        );
        
        setSearchResults(filteredResults);
        setShowResults(true);
      } catch (error) {
        console.error('Error al buscar productos:', error);
        setSearchResults([]);
        setShowResults(false);
      } finally {
        setIsSearching(false);
      }
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  }, []);

  return (
    <nav className="bg-[#201f2f] text-white p-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link href="/" className="text-2xl font-bold">CDKeys</Link>
          
          <div className="hidden md:flex space-x-6">
            <Link 
              href="/pc" 
              className="text-gray-300 hover:text-white transition-colors"
            >
              PC
            </Link>
            <Link 
              href="/psn" 
              className="text-gray-300 hover:text-white transition-colors"
            >
              PlayStation
            </Link>
            <Link 
              href="/xbox" 
              className="text-gray-300 hover:text-white transition-colors"
            >
              Xbox
            </Link>
            <Link 
              href="/nintendo" 
              className="text-gray-300 hover:text-white transition-colors"
            >
              Nintendo
            </Link>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <form className="hidden md:flex items-center w-[400px]" onSubmit={(e) => e.preventDefault()}>
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Buscar juegos..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full bg-[#2a293b] border-none text-white placeholder:text-gray-400 focus:ring-[#9146ff] pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              
              {showResults && searchResults.length > 0 && (
                <div className="absolute z-50 w-full mt-2 bg-[#2a293b] rounded-md shadow-lg max-h-96 overflow-y-auto">
                  {searchResults.map((game) => (
                    <Link
                      key={game.id}
                      href={`/detallejuegos/${game.id}`}
                      className="p-3 hover:bg-[#3a394b] cursor-pointer flex items-center gap-3 border-b border-gray-700"
                      onClick={() => {
                        setShowResults(false);
                        setSearchQuery('');
                      }}
                    >
                      <div className="flex-shrink-0 w-16 h-16 relative">
                        <Image
                          src={game.imagen}
                          alt={game.nombre}
                          fill
                          className="object-cover rounded"
                          sizes="(max-width: 64px) 100vw, 64px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm truncate">{game.nombre}</p>
                        <p className="text-sm text-gray-400">${game.precio}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </form>

          <div className="relative">
            <Button 
              onClick={handleUserClick}
              variant="ghost" 
              className="flex items-center gap-2 hover:bg-[#2a293b]"
            >
              {user ? (
                <>
                  <User className="h-5 w-5" />
                  <span className="text-sm font-medium">{user.nombre}</span>
                </>
              ) : (
                <>
                  <User className="h-6 w-6" />
                  <span className="text-sm">Iniciar sesión</span>
                </>
              )}
            </Button>

            {user && showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-[#2a293b] rounded-lg shadow-lg overflow-hidden z-50">
                <div className="p-3 border-b border-gray-700">
                  <p className="text-sm font-medium text-white">{user.nombre}</p>
                  <p className="text-xs text-gray-400">{user.correo}</p>
                </div>
                <div className="py-1">
                  <Link 
                    href="/perfil" 
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-[#363549] hover:text-white"
                    onClick={() => setShowUserMenu(false)}
                  >
                    Mi Perfil
                  </Link>
                  <Link 
                    href="/mis-pedidos" 
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-[#363549] hover:text-white"
                    onClick={() => setShowUserMenu(false)}
                  >
                    Mis Pedidos
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-[#363549] hover:text-red-300"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            )}
          </div>

          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => {
              setIsCartOpen(true);
            }}
          >
            <CartIcon className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </nav>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <UserProvider>
          <LanguageProvider>
            <CurrencyProvider>
              <CartProvider>
                <MainLayout>{children}</MainLayout>
              </CartProvider>
            </CurrencyProvider>
          </LanguageProvider>
        </UserProvider>
      </body>
    </html>
  );
}

// Crear un nuevo componente para el layout principal
function MainLayout({ children }) {
  const { isCartOpen, setIsCartOpen, cartItems } = useCart();

  return (
    <div className="flex flex-col min-h-screen bg-[#1c1b29]">
      <Navbar />
      {children}
      <Footer />
      <ShoppingCart />
    </div>
  );
}

function Footer() {
  const { language, changeLanguage } = useLanguage();
  const { currency, changeCurrency } = useCurrency();
  const t = translations[language];

  return (
    <footer className="bg-[#201f2f] text-white p-8">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-bold mb-4">{t.about}</h3>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:text-[#9146ff]">
                {t.about}
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#9146ff]">
                {t.terms}
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#9146ff]">
                {t.privacy}
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-4">{t.myAccount}</h3>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:text-[#9146ff]">
                {t.myOrders}
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#9146ff]">
                {t.myWishlist}
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#9146ff]">
                {t.myAccount}
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-4">{t.customerService}</h3>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:text-[#9146ff]">
                {t.support}
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#9146ff]">
                {t.contact}
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#9146ff]">
                {t.knowledge}
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-4">{t.currency}</h3>
          <select 
            className="bg-[#2a293b] text-white p-2 rounded mb-2 w-full"
            value={currency}
            onChange={(e) => changeCurrency(e.target.value)}
          >
            <option value="USD">USD (US Dollar)</option>
            <option value="EUR">EUR (Euro)</option>
          </select>
          <select 
            className="bg-[#2a293b] text-white p-2 rounded w-full"
            value={language}
            onChange={(e) => changeLanguage(e.target.value)}
          >
            <option value="es">Español</option>
            <option value="en">English</option>
          </select>
        </div>
      </div>
    </footer>
  );
}
