import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[#0f0a1e] border-t border-purple-900/30 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <img
                src="/logo.png"
                alt="OtservHub Logo"
                className="w-12 h-12 rounded-full object-cover"
              />
              <span className="text-white font-bold text-xl">OtservHub</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              O maior diretório de servidores Open Tibia em Pré-Lançamento.
              Encontre os melhores servidores, compare características e se
              prepare para começar bem sua aventura.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Links</h3>
            <nav className="flex flex-col gap-2">
              <Link href="/" className="text-gray-400 hover:text-white transition-colors text-sm">
                Início
              </Link>
              <Link href="/servidores" className="text-gray-400 hover:text-white transition-colors text-sm">
                Servidores
              </Link>
              <Link href="/cadastrar" className="text-gray-400 hover:text-white transition-colors text-sm">
                Cadastrar Servidor
              </Link>
              <Link href="/contato" className="text-gray-400 hover:text-white transition-colors text-sm">
                Contato
              </Link>
            </nav>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <nav className="flex flex-col gap-2">
              <Link href="/termos" className="text-gray-400 hover:text-white transition-colors text-sm">
                Termos de Uso
              </Link>
              <Link href="/privacidade" className="text-gray-400 hover:text-white transition-colors text-sm">
                Política de Privacidade
              </Link>
              <Link href="/publicidade" className="text-gray-400 hover:text-white transition-colors text-sm">
                Publicidade
              </Link>
            </nav>
          </div>
        </div>

        <div className="border-t border-purple-900/30 mt-8 pt-8 text-center">
          <p className="text-gray-500 text-sm">
            © 2026 OtservHub. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
