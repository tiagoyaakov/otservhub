"use client";

import { ChevronLeft, ChevronRight, Flame, Swords, Shield, Star } from "lucide-react";
import { useState } from "react";
import { Server, parseServerDate } from "@/data/mockServers";

interface CategorySection {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
  servers: Server[];
}

function formatLeauchDate(dateString: string): string {
  if (dateString === "Ja Disponivel") return "Online";
  const date = parseServerDate(dateString);
  const now = new Date();
  if (date < now) return "Online";

  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
}

interface SidebarProps {
  servers: Server[];
}

export function Sidebar({ servers }: SidebarProps) {
  // State to track current slide index for EACH category
  const [carouselStates, setCarouselStates] = useState<Record<string, number>>({
    oldschool: 0,
    baiak: 0,
    war: 0,
  });

  const categories: CategorySection[] = [
    {
      id: "oldschool",
      name: "OLDSCHOOL",
      icon: <Shield size={14} />,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
      servers: servers.filter((s) => s.category === "oldschool").slice(0, 3), // Get top 3
    },
    {
      id: "baiak",
      name: "BAIAK",
      icon: <Flame size={14} />,
      color: "text-orange-400",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/20",
      servers: servers.filter((s) => s.category === "baiak").slice(0, 3),
    },
    {
      id: "war",
      name: "WAR",
      icon: <Swords size={14} />,
      color: "text-red-400",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/20",
      servers: servers.filter((s) => s.category === "war").slice(0, 3),
    },
  ];

  const nextSlide = (categoryId: string, maxLength: number) => {
    setCarouselStates(prev => ({
      ...prev,
      [categoryId]: (prev[categoryId] + 1) % maxLength
    }));
  };

  const prevSlide = (categoryId: string, maxLength: number) => {
    setCarouselStates(prev => ({
      ...prev,
      [categoryId]: (prev[categoryId] - 1 + maxLength) % maxLength
    }));
  };

  return (
    <aside className="w-full flex flex-col gap-4">
      {categories.map((category) => {
        const currentIndex = carouselStates[category.id] || 0;
        const currentServer = category.servers[currentIndex];

        if (!currentServer) return null; // Safety check

        return (
          <div key={category.id} className="relative group/card">
            {/* Header / Category Label */}
            <div className={`flex items-center gap-2 mb-2 px-1 ${category.color} font-bold text-xs tracking-wider uppercase`}>
              <span className={`p-1 rounded ${category.bgColor} border ${category.borderColor}`}>
                {category.icon}
              </span>
              {category.name}
            </div>

            {/* Carousel Card */}
            <div className="relative w-full h-[140px] rounded-lg overflow-hidden bg-[#0f1922] shadow-lg border border-white/5 transition-transform hover:-translate-y-1 duration-300 group-hover/card:shadow-purple-500/10">

              {/* Background with Gradient (Simulating Image) */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900/20 to-black p-3 flex flex-col justify-end">
                {/* Placeholder for Server Bg/Screenshot */}
                <div className="absolute inset-0 opacity-40 bg-[url('https://tibiamaps.io/panorama/thais-city-center.jpg')] bg-cover bg-center mix-blend-overlay" />
              </div>

              {/* Navigation overlays */}
              {category.servers.length > 1 && (
                <>
                  <button
                    onClick={(e) => { e.preventDefault(); prevSlide(category.id, category.servers.length); }}
                    className="absolute left-0 top-0 bottom-0 w-8 flex items-center justify-center text-white/50 hover:text-white hover:bg-black/20 z-20 opacity-0 group-hover/card:opacity-100 transition-opacity"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={(e) => { e.preventDefault(); nextSlide(category.id, category.servers.length); }}
                    className="absolute right-0 top-0 bottom-0 w-8 flex items-center justify-center text-white/50 hover:text-white hover:bg-black/20 z-20 opacity-0 group-hover/card:opacity-100 transition-opacity"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}

              {/* Card Content Layer */}
              <div className="absolute inset-0 p-3 flex flex-col justify-between z-10 pointer-events-none">
                {/* Top Status */}
                <div className="flex justify-between items-start">
                  <span className="flex items-center gap-1 bg-black/60 backdrop-blur-sm border border-white/10 px-2 py-0.5 rounded text-[10px] text-white font-medium">
                    <Star size={8} className="text-yellow-400 fill-yellow-400" />
                    {currentServer.hypeScore}
                  </span>
                  <span className="bg-purple-600/90 text-[10px] text-white font-bold px-2 py-0.5 rounded shadow-sm">
                    {formatLeauchDate(currentServer.launchDate)}
                  </span>
                </div>

                {/* Bottom Info */}
                <div>
                  <h3 className="text-white font-bold text-sm tracking-tight drop-shadow-md truncate">
                    {currentServer.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-gray-300 bg-white/10 px-1.5 rounded">{currentServer.version}</span>
                    <span className="text-[10px] text-gray-300 bg-white/10 px-1.5 rounded">{currentServer.rate}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-1 mt-1.5">
              {category.servers.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1 rounded-full transition-all ${idx === currentIndex ? `w-4 ${category.bgColor.replace('/10', '')}` : 'w-1 bg-gray-700'}`}
                />
              ))}
            </div>

          </div>
        );
      })}
    </aside>
  );
}
