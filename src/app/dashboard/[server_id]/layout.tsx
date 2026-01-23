"use client";

import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    Settings,
    Image as ImageIcon,
    Tags,
    ArrowLeft
} from "lucide-react";
import { useEffect, useState, use } from "react";
import { createClient } from "@/lib/supabase/client";

export default function DashboardLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ server_id: string }>;
}) {
    const { server_id: serverId } = use(params);
    const pathname = usePathname();
    const { user, isLoading: authLoading } = useAuth();
    const [isOwner, setIsOwner] = useState<boolean | null>(null);
    const router = useRouter();

    useEffect(() => {
        async function checkOwnership() {
            if (!user) return;

            const supabase = createClient();
            if (!supabase) return;

            const { data, error } = await supabase
                .from("servers")
                .select("owner_id")
                .eq("id", serverId)
                .single();

            if (error || !data) {
                // Server not found or error
                router.push("/perfil");
                return;
            }

            if (data.owner_id !== user.id) {
                // Not the owner
                router.push("/perfil");
                return;
            }

            setIsOwner(true);
        }

        if (!authLoading && user) {
            checkOwnership();
        } else if (!authLoading && !user) {
            router.push("/entrar");
        }
    }, [user, authLoading, serverId, router]);

    if (authLoading || isOwner === null) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f8f9fb]">
                <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full" />
            </div>
        );
    }

    const menuItems = [
        { icon: LayoutDashboard, label: "Visão Geral", href: `/dashboard/${serverId}` },
        { icon: Settings, label: "Editar Informações", href: `/dashboard/${serverId}/editar` },
        { icon: ImageIcon, label: "Banner & Mídia", href: `/dashboard/${serverId}/midia` },
        { icon: Tags, label: "Sistemas", href: `/dashboard/${serverId}/sistemas` },
        // { icon: BarChart3, label: "Analytics", href: `/dashboard/${serverId}/analytics` }, // Future
    ];

    return (
        <div className="min-h-screen flex bg-[#f8f9fb]">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed h-full z-10">
                <div className="p-6 border-b border-gray-100">
                    <Link href="/" className="flex items-center gap-2 font-bold text-gray-900 text-lg">
                        <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-white">
                            OT
                        </div>
                        <span>Hub Panel</span>
                    </Link>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive
                                    ? "bg-purple-50 text-purple-700"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                    }`}
                            >
                                <item.icon size={20} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <Link
                        href="/perfil"
                        className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors"
                    >
                        <ArrowLeft size={20} />
                        Voltar ao Perfil
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
