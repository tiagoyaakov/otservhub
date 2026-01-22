"use client";

import Link from "next/link";
import { Menu, X, User, LogOut, LogIn, ChevronDown } from "lucide-react";
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
      <div className="w-full px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Left: Branding (Logo + Name + Tagline) */}
          <div className="flex-1 flex items-center justify-start gap-4 z-20">
            <Link href="/" className="flex items-center gap-3 group">
              <img
                src="/logo.png"
                alt="OtservHub Logo"
                className="w-14 h-14 rounded-full object-cover shadow-lg shadow-purple-900/20 group-hover:scale-105 transition-transform"
              />
              <div className="flex flex-col">
                <span className="text-white font-bold text-xl leading-none tracking-tight">OtservHub</span>
                <span className="text-xs text-gray-400 font-medium tracking-wide">A plataforma nº 1 em listagem de OtServers em Pré-Lançamento.</span>
              </div>
            </Link>
          </div>

          {/* Center: Navigation - Flex Centered */}
          <nav className="flex-1 hidden lg:flex items-center justify-center gap-8">
            <Link href="/" className="text-gray-300 hover:text-white transition-colors text-sm font-medium hover:bg-white/5 px-3 py-1.5 rounded-lg">
              Início
            </Link>
            <Link href="/servidores" className="text-gray-300 hover:text-white transition-colors text-sm font-medium hover:bg-white/5 px-3 py-1.5 rounded-lg">
              Servidores
            </Link>
            <Link href="/sobre" className="text-gray-300 hover:text-white transition-colors text-sm font-medium hover:bg-white/5 px-3 py-1.5 rounded-lg">
              Sobre
            </Link>
          </nav>

          {/* Right: Auth & Actions */}
          <div className="flex-1 flex items-center justify-end gap-3 z-20">
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
                        className="w-8 h-8 rounded-full ring-2 ring-purple-500/50"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center ring-2 ring-purple-500/50">
                        <User size={16} className="text-white" />
                      </div>
                    )}
                    <span className="text-white text-sm max-w-[100px] truncate font-medium">
                      {user.user_metadata?.full_name?.split(" ")[0] || "Usuário"}
                    </span>
                    <ChevronDown size={16} className="text-gray-400" />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-[#1a1d24] rounded-lg shadow-xl border border-white/10 py-1 z-50">
                      <Link
                        href="/perfil"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <User size={16} />
                        Meu Perfil
                      </Link>
                      <Link
                        href="/cadastrar-servidor"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <span className="w-4 h-4 flex items-center justify-center text-xs font-bold">+</span>
                        Cadastrar Servidor
                      </Link>
                      <hr className="my-1 border-white/10" />
                      <form action={signOut}>
                        <button
                          type="submit"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 w-full text-left transition-colors"
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
                    className="flex items-center gap-2 px-5 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all font-medium"
                  >
                    <LogIn size={16} />
                    Entrar
                  </Link>
                  <Link
                    href="/cadastrar-servidor"
                    className="px-5 py-2 text-sm text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-all font-bold shadow-lg shadow-purple-900/20"
                  >
                    Cadastrar Servidor
                  </Link>
                </>
              )}
            </div>

            <button
              className="lg:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-purple-900/30">
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
