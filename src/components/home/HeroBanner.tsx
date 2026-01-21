"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { sponsoredServers } from "@/data/mockServers";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [hoveredScreenshot, setHoveredScreenshot] = useState<string | null>(null);

  const handleSlideChange = useCallback((newIndex: number | ((prev: number) => number)) => {
    setHoveredScreenshot(null);
    setCurrentSlide(newIndex);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      // Auto-advance logic
      handleSlideChange((prev) => (prev + 1) % sponsoredServers.length);
    }, 7000); // Slower interval for better reading
    return () => clearInterval(timer);
  }, [handleSlideChange]);

  const nextSlide = () => {
    handleSlideChange((prev) => (prev + 1) % sponsoredServers.length);
  };

  const prevSlide = () => {
    handleSlideChange((prev) => (prev - 1 + sponsoredServers.length) % sponsoredServers.length);
  };

  const currentServer = sponsoredServers[currentSlide];

  // Helper to format date
  const getLaunchDateDisplay = (dateStr: string) => {
    if (dateStr === "Ja Disponivel") return "Já Disponível";
    try {
      const date = new Date(dateStr);
      return `Lançamento: ${format(date, "d 'de' MMM", { locale: ptBR })}`;
    } catch {
      return dateStr;
    }
  };

  // Determine which background to show on the main card
  // If a screenshot is hovered, preserve its gradient class (assuming we use gradient classes as placeholders)
  // Otherwise use the main server gradient
  const activeBackground = hoveredScreenshot || currentServer.gradient;

  return (
    <div className="w-full relative group">
      {/* Main Container - Responsive Width with Header */}
      <div className="w-[95%] md:w-[70%] mx-auto relative">
        <h2 className="text-sm font-bold text-slate-700 uppercase tracking-widest mb-3">
          Destaques e Recomendados
        </h2>

        {/* Navigation Buttons - Outside the Card */}
        <button
          onClick={prevSlide}
          className="absolute -left-16 top-1/2 -translate-y-1/2 w-12 h-24 rounded bg-gradient-to-r from-slate-900/80 to-slate-900/40 hover:bg-slate-800 flex items-center justify-center text-white z-20 transition-all opacity-0 group-hover:opacity-100 hover:scale-105"
        >
          <ChevronLeft size={40} />
        </button>

        <button
          onClick={nextSlide}
          className="absolute -right-16 top-1/2 -translate-y-1/2 w-12 h-24 rounded bg-gradient-to-l from-slate-900/80 to-slate-900/40 hover:bg-slate-800 flex items-center justify-center text-white z-20 transition-all opacity-0 group-hover:opacity-100 hover:scale-105"
        >
          <ChevronRight size={40} />
        </button>

        <div className="relative group/card transition-transform duration-300 hover:-translate-y-1">
          {/* Shadow/Depth Effect Provider */}
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg blur opacity-25 group-hover/card:opacity-40 transition duration-1000 group-hover/card:duration-200" />

          <div className="relative bg-[#0f1922] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.6)] flex flex-col md:flex-row overflow-hidden rounded-md border border-white/5 ring-1 ring-white/10">
            {/* Left Side: Main Visual - Aspect Video (16:9) */}
            <div className={`relative flex-1 aspect-video transition-all duration-500 ease-in-out bg-gradient-to-br ${activeBackground}`}>
              {/* Overlay Pattern */}
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30" />

              {/* Shadow Overlay for Text Readability */}
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent" />
            </div>

            {/* Right Side: Details & Screenshots - Wider w-[360px] */}
            <div className="w-full md:w-[360px] bg-[#0a1016] p-6 flex flex-col justify-between relative z-10 box-border border-l border-white/5">

              {/* Header Info */}
              <div>
                <h2 className="text-2xl font-bold text-white leading-tight mb-3">
                  {currentServer.name}
                </h2>
                {/* Removed Sponsored Badge as requested */}

                {/* Description */}
                <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed">
                  {currentServer.description}
                </p>
              </div>

              {/* Screenshots Grid - Naturally larger due to wider container */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Preview</p>
                  <div className="flex gap-1">
                    {/* Micro indicators if needed */}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  {currentServer.screenshots?.map((shot, idx) => (
                    <div
                      key={idx}
                      className={`aspect-video rounded bg-gray-800 cursor-pointer overflow-hidden relative transition-all duration-200 border-2 ${hoveredScreenshot === shot ? "border-white scale-105 z-10 shadow-lg" : "border-transparent opacity-60 hover:opacity-100 hover:border-white/30"
                        }`}
                      onMouseEnter={() => setHoveredScreenshot(shot)}
                      onMouseLeave={() => setHoveredScreenshot(null)}
                    >
                      <div className={`w-full h-full bg-gradient-to-br ${shot}`} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer / Launch Date */}
              <div className="mt-5 pt-4 border-t border-white/10">
                <div className="flex flex-col">
                  {currentServer.launchDate === "Ja Disponivel" ? (
                    <span className="text-base font-bold text-emerald-400 shadow-emerald-500/20 drop-shadow-sm">
                      Já Disponível
                    </span>
                  ) : (
                    <span className="text-base font-medium text-white">
                      {getLaunchDateDisplay(currentServer.launchDate!)}
                    </span>
                  )}
                  <div className="flex gap-2 mt-2">
                    <span className="bg-white/5 border border-white/10 px-2.5 py-1 rounded text-[11px] font-medium text-gray-300">RPG</span>
                    <span className="bg-white/5 border border-white/10 px-2.5 py-1 rounded text-[11px] font-medium text-gray-300">PvP</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center gap-2 mt-4">
        {sponsoredServers.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-1 rounded-full transition-all duration-300 ${index === currentSlide ? "bg-white w-6" : "bg-white/20 hover:bg-white/40"
              }`}
          />
        ))}
      </div>
    </div>
  );
}
