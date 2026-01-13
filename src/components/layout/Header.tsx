"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0f0a1e] border-b border-purple-900/30">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">O</span>
              </div>
              <span className="text-white font-bold text-xl">OtservHub</span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-gray-300 hover:text-white transition-colors text-sm">
                Início
              </Link>
              <Link href="/servidores" className="text-gray-300 hover:text-white transition-colors text-sm">
                Servidores
              </Link>
              <Link href="/sobre" className="text-gray-300 hover:text-white transition-colors text-sm">
                Sobre
              </Link>
            </nav>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button className="px-4 py-2 text-sm text-gray-300 hover:text-white border border-gray-600 rounded-lg transition-colors">
              Entrar
            </button>
            <Link 
              href="/cadastrar-servidor"
              className="px-4 py-2 text-sm text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors font-medium"
            >
              Cadastrar Servidor
            </Link>
          </div>

          <button
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-purple-900/30">
            <nav className="flex flex-col gap-4">
              <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                Início
              </Link>
              <Link href="/servidores" className="text-gray-300 hover:text-white transition-colors">
                Servidores
              </Link>
              <Link href="/sobre" className="text-gray-300 hover:text-white transition-colors">
                Sobre
              </Link>
              <div className="flex flex-col gap-2 pt-4 border-t border-purple-900/30">
                <button className="px-4 py-2 text-sm text-gray-300 hover:text-white border border-gray-600 rounded-lg transition-colors">
                  Entrar
                </button>
                <Link 
                  href="/cadastrar-servidor"
                  className="px-4 py-2 text-sm text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors font-medium text-center"
                >
                  Cadastrar Servidor
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
