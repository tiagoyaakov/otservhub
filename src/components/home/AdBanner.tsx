"use client";

import { Star } from "lucide-react";

export function AdBanner() {
  return (
    <div className="sticky top-24 flex flex-col gap-6">
      {/* Slot 1 */}
      <div className="flex flex-col gap-2">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider pl-1">
          Mais Aguardados
        </h3>
        <div className="bg-gradient-to-b from-gray-100 to-gray-50 rounded-xl border border-gray-200 h-64 w-full flex flex-col items-center justify-center p-3 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
            <Star className="text-purple-500" size={24} />
          </div>
          <p className="text-center text-gray-500 text-xs mb-1">
            Espaço para Banner
          </p>
          <p className="text-center text-gray-700 font-bold text-base mb-2">
            Responsivo
          </p>
          <button className="px-3 py-1.5 bg-purple-600 text-white text-xs font-medium rounded-lg hover:bg-purple-700 transition-colors">
            Anunciar Aqui
          </button>
        </div>
      </div>

      {/* Slot 2 */}
      <div className="flex flex-col gap-2">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider pl-1">
          Mais Hypados
        </h3>
        <div className="bg-gradient-to-b from-gray-100 to-gray-50 rounded-xl border border-gray-200 h-64 w-full flex flex-col items-center justify-center p-3 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
            <Star className="text-blue-500" size={24} />
          </div>
          <p className="text-center text-gray-500 text-xs mb-1">
            Espaço para Banner
          </p>
          <p className="text-center text-gray-700 font-bold text-base mb-2">
            Responsivo
          </p>
          <button className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors">
            Anunciar Aqui
          </button>
        </div>
      </div>
    </div>
  );
}
