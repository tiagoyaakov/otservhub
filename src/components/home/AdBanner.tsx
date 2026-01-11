"use client";

import { Star } from "lucide-react";

export function AdBanner() {
  return (
    <aside className="hidden xl:block w-44 flex-shrink-0">
      <div className="sticky top-24">
        <div className="bg-gradient-to-b from-gray-100 to-gray-50 rounded-xl border border-gray-200 h-[600px] flex flex-col items-center justify-center p-4">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
            <Star className="text-purple-500" size={28} />
          </div>
          <p className="text-center text-gray-500 text-sm mb-2">
            Espaço Publicitário
          </p>
          <p className="text-center text-gray-700 font-bold text-lg mb-4">
            160x600
          </p>
          <p className="text-center text-gray-400 text-xs mb-4">
            Skyscraper
          </p>
          <button className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors">
            Anunciar
          </button>
        </div>
      </div>
    </aside>
  );
}
