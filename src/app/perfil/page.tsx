"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/hooks/useAuth";
import { signOut } from "@/lib/auth/actions";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { User, Mail, Calendar, LogOut, Shield } from "lucide-react";
import { getUserServers } from "@/app/actions/server";
import Link from "next/link";

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [servers, setServers] = useState<any[]>([]); // Using any for now to avoid extensive type mapping conflicts rapidly
  const [isLoadingServers, setIsLoadingServers] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/entrar");
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (user) {
      getUserServers()
        .then(data => setServers(data))
        .catch(err => console.error("Failed to load servers", err))
        .finally(() => setIsLoadingServers(false));
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fb]">
        <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const createdAt = user.created_at ? new Date(user.created_at).toLocaleDateString("pt-BR") : "N/A";

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fb]">
      <Header />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Meu Perfil</h1>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
            <div className="bg-linear-to-r from-purple-600 to-purple-700 h-24" />

            <div className="px-6 pb-6">
              <div className="flex items-end gap-4 -mt-10 mb-6">
                {user.user_metadata?.avatar_url ? (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt="Avatar"
                    className="w-20 h-20 rounded-full border-4 border-white bg-white"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full border-4 border-white bg-purple-100 flex items-center justify-center">
                    <User size={32} className="text-purple-600" />
                  </div>
                )}
                <div className="pb-1">
                  <h2 className="text-xl font-bold text-gray-900">
                    {user.user_metadata?.full_name || user.user_metadata?.name || "Usuário"}
                  </h2>
                  <p className="text-sm text-gray-500">Membro do OtservHub</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <Mail size={20} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm font-medium text-gray-900">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <Shield size={20} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Provedor de Login</p>
                    <p className="text-sm font-medium text-gray-900 capitalize">
                      {user.app_metadata?.provider || "Email"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <Calendar size={20} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Membro desde</p>
                    <p className="text-sm font-medium text-gray-900">{createdAt}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <form action={signOut}>
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <LogOut size={18} />
                    <span>Sair da conta</span>
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Meus Servidores</h2>

            {isLoadingServers ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full" />
              </div>
            ) : servers.length > 0 ? (
              <div className="space-y-4">
                {servers.map((server) => (
                  <div key={server.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`inline-block w-2 h-2 rounded-full ${server.is_online ? "bg-green-500" : "bg-red-400"}`} />
                        <span className="font-semibold text-gray-900">{server.name}</span>
                        {server.is_verified && (
                          <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded uppercase tracking-wide">
                            Verificado
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 mt-1 flex gap-2">
                        <span>{server.ip_address}</span>
                        <span>•</span>
                        <span>v{server.version_id ? "?" : server.custom_version}</span>
                      </div>
                    </div>
                    <div>
                      {/* Future: Add edit button */}
                      <Link
                        href={`/dashboard/${server.id}`}
                        className="px-3 py-1.5 bg-gray-100 hover:bg-purple-100 text-gray-700 hover:text-purple-700 text-xs font-medium rounded-md transition-colors"
                      >
                        Gerenciar
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-xl border-dashed border-2 border-gray-200">
                <p className="text-gray-500 mb-4">Você ainda não tem servidores cadastrados.</p>
                <Link
                  href="/cadastrar-servidor"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
                >
                  Cadastrar Servidor
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
