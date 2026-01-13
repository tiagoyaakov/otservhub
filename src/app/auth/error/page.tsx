"use client";

import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default function AuthError() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9fb]">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-md w-full mx-4 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="text-red-600" size={32} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Erro na Autenticação</h1>
        <p className="text-gray-600 mb-6">
          Ocorreu um erro durante o processo de login. Por favor, tente novamente.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-2.5 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
        >
          Voltar para o Início
        </Link>
      </div>
    </div>
  );
}
