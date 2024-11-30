"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCurrency } from '@/context/CurrencyContext';

function Page() {

  const [products, setProducts] = useState([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [comingSoon, setComingSoon] = useState([]);
  const [carouselGames, setCarouselGames] = useState([]);
  const router = useRouter();
  const { convertPrice } = useCurrency();

  useEffect(() => {
    // Obtener los productos desde la API (juegos disponibles)
    axios.get("http://localhost:8080/productos")
      .then(response => {
        const data = response.data;
        // Filtrar juegos de Nintendo
        const bestSellers = data.filter(game => 
          game.estado === true && game.categoria === "NINTENDO"
        ).map(game => ({...game, type: 'bestSeller'}));
        
        const comingSoonGames = data.filter(game => 
          game.estado === false && game.categoria === "NINTENDO"
        ).map(game => ({...game, type: 'comingSoon'}));
        
        setProducts(bestSellers);
        setComingSoon(comingSoonGames);
        // Combinar ambos para el carrusel
        setCarouselGames([...bestSellers, ...comingSoonGames]);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const nextGame = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === carouselGames.length - 1 ? 0 : prevIndex + 1
      );
      setIsTransitioning(false);
    }, 250);
  };

  const prevGame = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === 0 ? carouselGames.length - 1 : prevIndex - 1
      );
      setIsTransitioning(false);
    }, 250);
  };
  
  const handleGameClick = (game) => {
    router.push(`/detallejuegos/${game.id}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#1c1b29]">
     

      <main className="flex-grow container mx-auto px-4 py-8">
        
        <section className="mb-12">
          <div className="relative bg-[#2a293b] rounded-lg p-8 text-white overflow-hidden" style={{ height: '500px' }}>
            {carouselGames.length > 0 && (
              <>
                
                <div className="absolute top-0 left-0 w-full h-full opacity-20 transition-opacity duration-500 ease-in-out">
                  <Image
                    src={carouselGames[currentIndex].imagen}
                    alt="Background"
                    fill
                    style={{ objectFit: 'cover' }}
                    className="blur-[8px] transition-all duration-500 ease-in-out"
                    priority
                  />
                </div>
                <div className={`relative z-10 flex items-center gap-8 h-full ${isTransitioning ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500 ease-in-out`}>
                  <div className="flex-1">
                    <span className={`inline-block mb-2 px-3 py-1 rounded-full text-sm font-semibold ${
                      carouselGames[currentIndex].type === 'comingSoon' ? 'bg-purple-600' : 'bg-green-600'
                    }`}>
                      {carouselGames[currentIndex].type === 'comingSoon' ? 'Coming Soon' : 'Best Seller'}
                    </span>
                    <h2 className="text-4xl font-bold mb-4">
                      {carouselGames[currentIndex].nombre}
                    </h2>
                    <p className="text-xl mb-6">
                      Precio: {convertPrice(carouselGames[currentIndex].precio)}
                    </p>
                    {carouselGames[currentIndex].descuento && (
                      <p className="text-xl mb-6">
                        Descuento: {carouselGames[currentIndex].descuento}
                      </p>
                    )}
                    <Button 
                      className="bg-[#9146ff] hover:bg-[#7d3bda] text-white"
                      onClick={() => handleGameClick(carouselGames[currentIndex])}
                    >
                      {carouselGames[currentIndex].type === 'comingSoon' ? 'Pre-order' : 'Ver Detalles'}
                    </Button>
                  </div>
                  <div 
                    className="w-[400px] h-[400px] relative group cursor-pointer"
                    onClick={() => handleGameClick(carouselGames[currentIndex])}
                  >
                    <div className="w-full h-full transition-transform duration-300 transform group-hover:scale-105">
                      <div className="absolute inset-0" 
                        style={{
                          transform: 'translateY(-20px)'
                        }}>
                            <Image
                              src={carouselGames[currentIndex].imagen}
                              alt={carouselGames[currentIndex].nombre}
                              fill
                              style={{ 
                                objectFit: 'contain'
                              }}
                              className="transition-all duration-500 ease-in-out"
                              priority
                            />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-4 right-4 flex space-x-2">
                  <Button 
                    size="icon" 
                    variant="secondary"
                    onClick={prevGame}
                    className="transition-all duration-300 hover:scale-110"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="secondary"
                    onClick={nextGame}
                    className="transition-all duration-300 hover:scale-110"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </>
            )}
          </div>
        </section>
        
        <section className="mb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {carouselGames.map((game) => (
              <Card 
                key={game.id} 
                className="bg-[#2a293b] border-none hover:scale-105 transition-transform duration-300 cursor-pointer"
                onClick={() => handleGameClick(game)}
              >
                <CardContent className="p-4 relative">
                  <div className="relative aspect-[3/4] mb-4">
                    <Image 
                      src={game.imagen} 
                      alt={game.nombre} 
                      fill
                      className="object-cover rounded-lg"
                    />
                    {game.descuento && (
                      <span className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                        {game.descuento}
                      </span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <span className="text-xs text-purple-400 uppercase font-semibold">GLOBAL</span>
                    <h3 className="text-sm font-semibold text-white leading-tight">{game.nombre}</h3>
                    <div className="text-white">
                      <span className="text-sm">Desde</span>
                      <div className="text-xl font-bold">{convertPrice(game.precio)}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
        
      </main>
      
    </div>
  );
}

export default Page;

