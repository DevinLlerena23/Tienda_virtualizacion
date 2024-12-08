"use client"
import React, { useState } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";

const AddGame = () => {
  const [gameData, setGameData] = useState({
    nombre: '',
    descripcion: '',
    precio: 0,
    descuento: 0,
    estado: true,
    categoria: '',
    imagen: '',
    imagenes: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGameData({ ...gameData, [name]: value });
  };

  const handleImageChange = (e) => {
    const urls = e.target.value.split(',').map(url => url.trim());
    setGameData({ ...gameData, imagenes: urls });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/productos/save', gameData);
      console.log('Juego agregado:', response.data);
    } catch (error) {
      console.error('Error al agregar el juego:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#1c1b29] text-white flex items-center justify-center">
      <div className="max-w-md w-full bg-[#2a293b] p-6 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-6 text-center">Agregar Juego</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="text" 
            name="nombre" 
            placeholder="Nombre" 
            onChange={handleChange} 
            required 
            className="w-full p-3 bg-[#3a394b] border border-gray-600 rounded-md text-white placeholder-gray-400"
          />
          <textarea 
            name="descripcion" 
            placeholder="Descripción" 
            onChange={handleChange} 
            required 
            className="w-full p-3 bg-[#3a394b] border border-gray-600 rounded-md text-white placeholder-gray-400"
          />
          <input 
            type="number" 
            name="precio" 
            placeholder="Precio" 
            onChange={handleChange} 
            required 
            className="w-full p-3 bg-[#3a394b] border border-gray-600 rounded-md text-white placeholder-gray-400"
          />
          <input 
            type="number" 
            name="descuento" 
            placeholder="Descuento" 
            onChange={handleChange} 
            className="w-full p-3 bg-[#3a394b] border border-gray-600 rounded-md text-white placeholder-gray-400"
          />
          <input 
            type="text" 
            name="categoria" 
            placeholder="Categoría" 
            onChange={handleChange} 
            required 
            className="w-full p-3 bg-[#3a394b] border border-gray-600 rounded-md text-white placeholder-gray-400"
          />
          <input 
            type="text" 
            name="imagen" 
            placeholder="URL de la imagen principal" 
            onChange={handleChange} 
            required 
            className="w-full p-3 bg-[#3a394b] border border-gray-600 rounded-md text-white placeholder-gray-400"
          />
          <input 
            type="text" 
            name="imagenes" 
            placeholder="URLs de imágenes secundarias (separadas por comas)" 
            onChange={handleImageChange} 
            required 
            className="w-full p-3 bg-[#3a394b] border border-gray-600 rounded-md text-white placeholder-gray-400"
          />
          <Button 
            type="submit" 
            className="w-full bg-[#9146ff] hover:bg-[#7d3bda] text-white py-4 text-lg"
          >
            Agregar Juego
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AddGame;
