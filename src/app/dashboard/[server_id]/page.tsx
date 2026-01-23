"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState, use } from "react";
import {
    Activity,
    Users,
    MousePointer2,
    AlertTriangle,
    CheckCircle2,
    ExternalLink
} from "lucide-react";
import Link from "next/link";



interface Server {
    id: string;
    name: string;
    slug: string;
    is_online: boolean;
    is_verified: boolean;
    banner_url: string | null;
}

export default function DashboardOverview({ params }: { params: Promise<{ server_id: string }> }) {
    const { server_id: serverId } = use(params);
    const [server, setServer] = useState<Server | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchServer() {
            const supabase = createClient();
            if (!supabase) return;

            const { data } = await supabase
                .from("servers")
                .select("*")
                .eq("id", serverId)
                .single();

            if (data) {
                setServer(data);
            }
            setLoading(false);
        }
        fetchServer();
    }, [serverId]);

    if (loading) {
        return <div className="animate-pulse space-y-4">
            <div className="h-32 bg-gray-200 rounded-xl"></div>
            <div className="grid grid-cols-3 gap-4">
                <div className="h-24 bg-gray-200 rounded-xl"></div>
                <div className="h-24 bg-gray-200 rounded-xl"></div>
                <div className="h-24 bg-gray-200 rounded-xl"></div>
            </div>
        </div>;
    }

    if (!server) return <div>Servidor não encontrado</div>;

    return (
        <div className="space-y-6">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{server.name}</h1>
                    <p className="text-gray-500 text-sm">Painel de Gestão</p>
                </div>
                <a
                    href={`/server/${server.slug}`} // Assuming this route exists or will exist, or just link to generic view for now
                    target="_blank"
                    className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700 font-medium"
                >
                    Ver página pública <ExternalLink size={16} />
                </a>
            </header>

            {/* Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Status do Servidor</p>
                        <div className="flex items-center gap-2 mt-1">
                            <span className={`w-3 h-3 rounded-full ${server.is_online ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                            <span className={`text-xl font-bold ${server.is_online ? 'text-green-600' : 'text-gray-700'}`}>
                                {server.is_online ? 'Online' : 'Offline'}
                            </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                            {server.is_online ? 'Servidor acessível.' : 'Não conseguimos conectar.'}
                        </p>
                    </div>
                    <div className={`p-3 rounded-full ${server.is_online ? 'bg-green-50' : 'bg-red-50'}`}>
                        <Activity className={server.is_online ? 'text-green-500' : 'text-red-500'} size={24} />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Total de Hypes</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">0</p>
                        <p className="text-xs text-purple-600 mt-1 flex items-center gap-1">
                            <Users size={12} /> A cada 12h
                        </p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-full">
                        <Users className="text-purple-600" size={24} />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Engajamento Total</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">0</p>
                        <p className="text-xs text-blue-600 mt-1">Cliques em links</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-full">
                        <MousePointer2 className="text-blue-600" size={24} />
                    </div>
                </div>
            </div>

            {/* Analytics Breakdown */}
            <h2 className="text-lg font-bold text-gray-900 pt-4">Métricas de Cliques (Últimos 30 dias)</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-gray-100">
                    <p className="text-xs text-gray-500 font-medium">Website</p>
                    <div className="flex items-end justify-between mt-2">
                        <p className="text-lg font-bold text-gray-900">0</p>
                        <div className="w-8 h-1 bg-green-500 rounded-full"></div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-100">
                    <p className="text-xs text-gray-500 font-medium">Discord</p>
                    <div className="flex items-end justify-between mt-2">
                        <p className="text-lg font-bold text-gray-900">0</p>
                        <div className="w-8 h-1 bg-indigo-500 rounded-full"></div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-100">
                    <p className="text-xs text-gray-500 font-medium">WhatsApp</p>
                    <div className="flex items-end justify-between mt-2">
                        <p className="text-lg font-bold text-gray-900">0</p>
                        <div className="w-8 h-1 bg-green-400 rounded-full"></div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-100">
                    <p className="text-xs text-gray-500 font-medium">Download</p>
                    <div className="flex items-end justify-between mt-2">
                        <p className="text-lg font-bold text-gray-900">0</p>
                        <div className="w-8 h-1 bg-orange-500 rounded-full"></div>
                    </div>
                </div>
            </div>

            {/* Verification Status Banner */}
            {!server.is_verified && (
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-start gap-3">
                    <AlertTriangle className="text-orange-600 mt-0.5" size={20} />
                    <div>
                        <h3 className="font-semibold text-orange-900">Servidor não verificado</h3>
                        <p className="text-sm text-orange-800 mt-1">
                            Seu servidor ainda não possui o selo de verificação. Isso afeta a visibilidade na lista.
                        </p>
                        <Link href={`/dashboard/${serverId}/editar`} className="text-sm font-medium text-orange-700 hover:text-orange-900 mt-2 block">
                            Configurar verificação &rarr;
                        </Link>
                    </div>
                </div>
            )}

            {/* Quick Actions / Checklist */}
            <h2 className="text-lg font-bold text-gray-900 pt-4">Sugestões de melhoria</h2>
            <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-100">
                <div className="p-4 flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${server.banner_url ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                        <CheckCircle2 size={14} />
                    </div>
                    <div className="flex-1">
                        <p className={`text-sm font-medium ${server.banner_url ? 'text-gray-900 line-through opacity-50' : 'text-gray-900'}`}>Adicionar um Banner personalizado</p>
                        {!server.banner_url && <p className="text-xs text-gray-500">Aumente seus cliques com uma imagem chamativa.</p>}
                    </div>
                    {!server.banner_url && (
                        <Link href={`/dashboard/${serverId}/midia`} className="text-sm font-medium text-purple-600 hover:text-purple-700">Adicionar</Link>
                    )}
                </div>
                {/* More checklist items could go here */}
            </div>

        </div>
    );
}
