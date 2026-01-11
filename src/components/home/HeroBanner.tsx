"use client";

import { ChevronLeft, ChevronRight, Sparkles, Sword, Shield, Flame } from "lucide-react";
import { useState, useEffect } from "react";
import { sponsoredServers } from "@/data/mockServers";

export function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sponsoredServers.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sponsoredServers.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + sponsoredServers.length) % sponsoredServers.length);
  };

  const currentServer = sponsoredServers[currentSlide];

  return (
    <div className="relative w-full h-[280px] md:h-[350px] rounded-2xl overflow-hidden group">
      <div className={`absolute inset-0 bg-gradient-to-br ${currentServer.gradient} transition-all duration-500`}>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" />
        <div className="absolute right-10 top-1/2 -translate-y-1/2 opacity-10">
          {currentSlide === 0 && <Sword size={300} strokeWidth={0.5} />}
          {currentSlide === 1 && <Shield size={300} strokeWidth={0.5} />}
          {currentSlide === 2 && <Flame size={300} strokeWidth={0.5} />}
        </div>
      </div>

      <div className="relative h-full flex flex-col justify-end p-6 md:p-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-600/90 rounded-full text-xs font-medium text-white">
            <Sparkles size={12} />
            Patrocinado
          </span>
        </div>
        
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
          {currentServer.name}
        </h2>
        <p className="text-gray-300 text-lg">
          {currentServer.tagline}
        </p>
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ChevronLeft size={24} />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ChevronRight size={24} />
      </button>

      <div className="absolute bottom-4 right-6 flex gap-2">
        {sponsoredServers.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentSlide ? "bg-white" : "bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
