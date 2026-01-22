"use client";

import Link from "next/link";
import {
    CheckCircle2,
    XCircle,
    ExternalLink,
    Flame,
    Eye
} from "lucide-react";
import { Server, parseServerDate } from "@/data/mockServers";
import { HypeButton } from "./HypeButton";
import type { HypeType, HypeCounts } from "@/types/database.types";

const COUNTRY_FLAGS: Record<string, string> = {
    BR: "🇧🇷",
    US: "🇺🇸",
    EU: "🇪🇺",
};

interface ServerCardProps {
    server: Server;
    userHype: HypeType | null;
    hypeCounts: HypeCounts;
    isAuthenticated: boolean;
    userHypeCounts: Record<HypeType, number>;
}

function formatCountdown(dateString: string): { countdown: string; dateStr: string; isLaunched: boolean } {
    const date = parseServerDate(dateString);
    const now = new Date();
    const diff = date.getTime() - now.getTime();

    if (diff <= 0) {
        return { countdown: "Online", dateStr: "Lançado", isLaunched: true };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    const countdown = `${days}d ${String(hours).padStart(2, "0")}h ${String(minutes).padStart(2, "0")}m`;
    const dateStr = date.toLocaleDateString("pt-BR");

    return { countdown, dateStr, isLaunched: false };
}

export function ServerCard({ server, userHype, hypeCounts, isAuthenticated, userHypeCounts }: ServerCardProps) {
    const { countdown, isLaunched } = formatCountdown(server.launchDate);

    return (
        <div className="bg-white rounded-xl border border-gray-100 p-4 mb-3 shadow-sm relative overflow-hidden">
            {/* Top Section: Logo + Title + Status */}
            <div className="flex items-start gap-3 mb-3">
                <div className="w-12 h-12 bg-gray-50 rounded-lg p-1.5 border border-gray-100 shrink-0">
                    <img src={server.logo} alt={server.name} className="w-full h-full object-contain opacity-90" />
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-sm border border-gray-100 rounded px-1" title={server.country}>{COUNTRY_FLAGS[server.country]}</span>
                            <Link href={`/server/${server.id}`} className="font-bold text-gray-900 truncate hover:text-purple-600 transition-colors">
                                {server.name}
                            </Link>
                        </div>
                        <div className={`text-xs font-bold ${isLaunched ? 'text-green-500' : 'text-red-500'} bg-gray-50 px-2 py-0.5 rounded-full`}>
                            {isLaunched ? "Online" : countdown}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1 px-1.5 py-0.5 bg-orange-50 text-orange-600 border border-orange-100 rounded-md text-[10px] font-bold">
                            <Flame size={10} className="fill-orange-500 text-orange-600" />
                            {server.hypeScore}
                        </div>
                        <span className="text-xs text-gray-500 truncate">{server.description}</span>
                    </div>
                </div>
            </div>

            {/* Grid Specs */}
            <div className="grid grid-cols-4 gap-2 mb-3 bg-gray-50/50 p-2 rounded-lg border border-gray-100/50">
                <div className="flex flex-col items-center justify-center border-r border-gray-200/50 last:border-0">
                    <span className="text-[10px] text-gray-400 uppercase font-bold">Ver</span>
                    <span className="text-xs font-medium text-gray-700">v{server.version}</span>
                </div>
                <div className="flex flex-col items-center justify-center border-r border-gray-200/50 last:border-0">
                    <span className="text-[10px] text-gray-400 uppercase font-bold">Rate</span>
                    <span className="text-xs font-medium text-gray-700">{server.rate}</span>
                </div>
                <div className="flex flex-col items-center justify-center border-r border-gray-200/50 last:border-0">
                    <span className="text-[10px] text-gray-400 uppercase font-bold">PVP</span>
                    <span className="text-xs font-medium text-gray-700">{server.pvpType}</span>
                </div>
                <div className="flex flex-col items-center justify-center">
                    <span className="text-[10px] text-gray-400 uppercase font-bold">Mob</span>
                    {server.hasMobile ? <CheckCircle2 size={14} className="text-green-500" /> : <XCircle size={14} className="text-red-300" />}
                </div>
            </div>

            {/* Actions Footer */}
            <div className="flex items-center justify-between gap-3">
                {/* Hype Button - Prominent */}
                <div className="flex-1">
                    <HypeButton
                        serverId={server.id}
                        userHype={userHype}
                        counts={hypeCounts}
                        isAuthenticated={isAuthenticated}
                        userHypeCounts={userHypeCounts}
                    />
                </div>

                {/* Action Icons */}
                <div className="flex items-center gap-1">
                    <Link href={`/server/${server.id}`} className="p-2 text-gray-500 bg-gray-50 rounded-lg hover:bg-purple-100 hover:text-purple-600 transition-colors">
                        <Eye size={18} />
                    </Link>
                    <button className="p-2 text-gray-500 bg-gray-50 rounded-lg hover:bg-purple-100 hover:text-purple-600 transition-colors">
                        <ExternalLink size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}
