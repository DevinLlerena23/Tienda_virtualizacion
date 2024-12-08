"use client";
import React from "react";
import {

  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { useRouter } from 'next/navigation';
import { useCurrency } from '@/context/CurrencyContext';

export default function GameShop() {
  const router = useRouter();
  const { convertPrice } = useCurrency();
  const gamesContainerRef = useRef(null);

  const SectionHeader = ({ title }) => (
    <div className="flex items-center mb-6">
      <h2 className="text-2xl font-bold px-6 py-2 bg-[#2a293b] text-white relative rounded-md
        before:content-[''] before:absolute before:inset-0 before:rounded-md
        before:shadow-[0_0_10px_rgba(255,255,255,0.3)] before:animate-pulse">
        {title}
      </h2>
      <div className="h-px bg-gradient-to-r from-[#2a293b] to-transparent flex-grow ml-4" />
    </div>
  )

  const [products, setProducts] = useState([]);
  const [comingSoon, setComingSoon] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [carouselGames, setCarouselGames] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10; // Número de juegos por página

  useEffect(() => {
    axios.get("http://localhost:8080/productos")
      .then(response => {
        const data = response.data;
      
        
        const bestSellers = data.filter(game => game.estado === true)
          .map(game => ({...game, type: 'bestSeller'}));
       
        
        const comingSoonGames = data.filter(game => game.estado === false)
          .map(game => ({...game, type: 'comingSoon'}));
        
        
        setProducts(bestSellers);
        setComingSoon(comingSoonGames);
        setCarouselGames([...bestSellers, ...comingSoonGames]);
        
      })
      .catch(error => {
       
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

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const paginatedProducts = products.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

    return (
      <div className="flex justify-center mt-4">
        <Button onClick={() => onPageChange(0)} disabled={currentPage === 0} className="bg-[#9146ff] text-white hover:bg-[#7d3bda]">«</Button>
        {pages.map((page) => (
          <Button
            key={page}
            onClick={() => onPageChange(page - 1)}
            className={`mx-1 ${currentPage === page - 1 ? 'bg-red-500 text-white' : 'bg-[#2a293b] text-white hover:bg-[#3a3a4a]'}`}
          >
            {page}
          </Button>
        ))}
        <Button onClick={() => onPageChange(totalPages - 1)} disabled={currentPage === totalPages - 1} className="bg-[#9146ff] text-white hover:bg-[#7d3bda]">»</Button>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#1c1b29]">
      <main className="flex-grow container mx-auto px-4 py-8" ref={gamesContainerRef}>
        
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
          <SectionHeader title="BEST SELLERS" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {paginatedProducts.map((game) => (
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
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={setCurrentPage} 
          />
        </section>

        <section>
          <SectionHeader title="COMING SOON" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {comingSoon.map((game) => (
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
