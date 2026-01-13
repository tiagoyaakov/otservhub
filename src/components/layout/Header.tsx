"use client";

import Link from "next/link";
import { Menu, X, User, LogOut, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { signOut } from "@/lib/auth/actions";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, isLoading, isAuthenticated } = useAuth();
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
            {isLoading ? (
              <div className="w-8 h-8 animate-pulse bg-gray-700 rounded-full" />
            ) : isAuthenticated && user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  {user.user_metadata?.avatar_url ? (
                    <img
                      src={user.user_metadata.avatar_url}
                      alt="Avatar"
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
                      <User size={16} className="text-white" />
                    </div>
                  )}
                  <span className="text-white text-sm max-w-[100px] truncate">
                    {user.user_metadata?.full_name?.split(" ")[0] || "Usuário"}
                  </span>
                  <ChevronDown size={16} className="text-gray-400" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
                    <Link
                      href="/perfil"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <User size={16} />
                      Meu Perfil
                    </Link>
                    <Link
                      href="/cadastrar-servidor"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <span className="w-4 h-4 flex items-center justify-center text-xs">+</span>
                      Cadastrar Servidor
                    </Link>
                    <hr className="my-1 border-gray-100" />
                    <form action={signOut}>
                      <button
                        type="submit"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                      >
                        <LogOut size={16} />
                        Sair
                      </button>
                    </form>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link 
                  href="/entrar"
                  className="px-4 py-2 text-sm text-gray-300 hover:text-white border border-gray-600 rounded-lg transition-colors"
                >
                  Entrar
                </Link>
                <Link 
                  href="/cadastrar-servidor"
                  className="px-4 py-2 text-sm text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors font-medium"
                >
                  Cadastrar Servidor
                </Link>
              </>
            )}
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
                {isAuthenticated && user ? (
                  <>
                    <Link 
                      href="/perfil"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-white"
                    >
                      {user.user_metadata?.avatar_url ? (
                        <img
                          src={user.user_metadata.avatar_url}
                          alt="Avatar"
                          className="w-6 h-6 rounded-full"
                        />
                      ) : (
                        <User size={16} />
                      )}
                      Meu Perfil
                    </Link>
                    <form action={signOut}>
                      <button
                        type="submit"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:text-red-300"
                      >
                        <LogOut size={16} />
                        Sair
                      </button>
                    </form>
                  </>
                ) : (
                  <>
                    <Link 
                      href="/entrar"
                      className="px-4 py-2 text-sm text-gray-300 hover:text-white border border-gray-600 rounded-lg transition-colors text-center"
                    >
                      Entrar
                    </Link>
                    <Link 
                      href="/cadastrar-servidor"
                      className="px-4 py-2 text-sm text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors font-medium text-center"
                    >
                      Cadastrar Servidor
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
