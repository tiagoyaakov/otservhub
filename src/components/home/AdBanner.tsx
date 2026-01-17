"use client";

import { Star } from "lucide-react";

export function AdBanner() {
  return (
    <div className="sticky top-24">
      <div className="bg-gradient-to-b from-gray-100 to-gray-50 rounded-xl border border-gray-200 h-[600px] w-full flex flex-col items-center justify-center p-3">
        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
          <Star className="text-purple-500" size={24} />
        </div>
        <p className="text-center text-gray-500 text-xs mb-1">
          Espaço Publicitário
        </p>
        <p className="text-center text-gray-700 font-bold text-base mb-2">
          160x600
        </p>
        <p className="text-center text-gray-400 text-[10px] mb-3">
          Skyscraper
        </p>
        <button className="px-3 py-1.5 bg-purple-600 text-white text-xs font-medium rounded-lg hover:bg-purple-700 transition-colors">
          Anunciar
        </button>
      </div>
    </div>
  );
}
