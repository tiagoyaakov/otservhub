"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  XCircle,
  ExternalLink,
  MessageSquare,
  Download,
  Smartphone,
  ChevronLeft,
  ChevronRight,
  Eye,
  Flame
} from "lucide-react";
import { Server, parseServerDate } from "@/data/mockServers";
import { HypeButton } from "./HypeButton";
import type { HypeType, HypeCounts } from "@/types/database.types";

const COUNTRY_FLAGS: Record<string, string> = {
  BR: "🇧🇷",
  US: "🇺🇸",
  EU: "🇪🇺",
};

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



interface ServerRowProps {
  server: Server;
  userHype: HypeType | null;
  hypeCounts: HypeCounts;
  isAuthenticated: boolean;
  userHypeCounts: Record<HypeType, number>;
}

function ServerRow({ server, userHype, hypeCounts, isAuthenticated, userHypeCounts }: ServerRowProps) {
  const { countdown, dateStr, isLaunched } = formatCountdown(server.launchDate);

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
      <td className="py-3 px-4 w-auto md:w-[40%]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-50 rounded-lg p-1.5 border border-gray-100 flex-shrink-0">
            <img src={server.logo} alt={server.name} className="w-full h-full object-contain opacity-80" />
          </div>

          <div className="flex flex-col gap-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm border border-gray-100 rounded px-1" title={server.country}>{COUNTRY_FLAGS[server.country]}</span>
              <Link href={`/server/${server.id}`} className="font-bold text-gray-900 text-sm hover:text-purple-600 transition-colors">
                {server.name}
              </Link>

              <div className="flex items-center gap-1 px-1.5 py-0.5 bg-orange-50 text-orange-600 border border-orange-100 rounded-md text-[10px] font-bold shadow-sm">
                <Flame size={10} className="fill-orange-500 text-orange-600" />
                {server.hypeScore}
              </div>
            </div>
            <p className="text-xs text-gray-500 line-clamp-1">
              {server.description}
            </p>
          </div>
        </div>
      </td>

      <td className="py-2.5 px-2 text-center w-[120px]">
        <div className={`text-xs font-semibold ${isLaunched ? 'text-green-500' : 'text-red-500'}`}>{countdown}</div>
        <div className="text-[10px] text-gray-400">{dateStr}</div>
      </td>

      <td className="py-2.5 px-2 text-center w-[80px]">
        <span className="text-xs text-gray-700">v{server.version}</span>
      </td>

      <td className="py-2.5 px-2 text-center w-[80px]">
        <span className="text-xs text-gray-700">{server.rate}</span>
      </td>

      <td className="py-2.5 px-2 text-center w-[100px]">
        <span className="text-xs text-gray-700 font-medium">{server.pvpType}</span>
      </td>

      <td className="py-2.5 px-2 text-center w-[80px]">
        <div className="relative group flex justify-center">
          <button
            className="inline-flex items-center gap-0.5 text-[10px] text-purple-600 hover:text-purple-700 hover:bg-purple-50 px-1.5 py-0.5 rounded transition-colors"
          >
            <Eye size={12} />
            Ver
          </button>

          {/* Hover Modal */}
          <div className="absolute right-full mr-2 top-1/2 -translate-y-1/2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 p-3 opacity-0 group-hover:opacity-100 transition-all z-50 pointer-events-none group-hover:pointer-events-auto transform translate-x-2 group-hover:translate-x-0">
            <div className="font-bold text-gray-900 text-xs mb-2 text-left pb-2 border-b border-gray-50">Sistemas Ativos</div>
            <div className="space-y-1.5">
              {server.systems.length > 0 ? server.systems.filter(s => s.enabled).map((sys, idx) => (
                <div key={idx} className="flex items-center gap-2 text-[10px] text-gray-600">
                  <CheckCircle2 size={10} className="text-green-500 flex-shrink-0" />
                  <span className="truncate">{sys.name}</span>
                </div>
              )) : (
                <div className="text-[10px] text-gray-400 italic">Nenhum sistema cadastrado</div>
              )}
            </div>
            {/* Arrow pointing to right (button) */}
            <div className="absolute top-1/2 -right-[5px] -translate-y-1/2 border-t-8 border-t-transparent border-l-8 border-l-white border-b-8 border-b-transparent drop-shadow-sm" />
          </div>
        </div>
      </td>

      <td className="py-2.5 px-2 w-[60px]">
        <div className="flex justify-center">
          {server.hasMobile ? (
            <CheckCircle2 size={18} className="text-green-500" />
          ) : (
            <XCircle size={18} className="text-red-500" />
          )}
        </div>
      </td>

      <td className="py-2.5 px-2 w-[80px]">
        <div className="flex justify-center">
          <HypeButton
            serverId={server.id}
            userHype={userHype}
            counts={hypeCounts}
            isAuthenticated={isAuthenticated}
            userHypeCounts={userHypeCounts}
          />
        </div>
      </td>

      <td className="py-2.5 px-2 w-[120px]">
        <div className="flex items-center justify-center gap-1">
          <button className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors" title="Discord">
            <MessageSquare size={14} />
          </button>
          <button className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors" title="App">
            <Smartphone size={14} />
          </button>
          <button className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors" title="Download">
            <Download size={14} />
          </button>
          <button className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors" title="Website">
            <ExternalLink size={14} />
          </button>
        </div>
      </td>
    </tr>
  );
}

import { ServerCard } from "./ServerCard";

interface ServerTableProps {
  servers: Server[];
  userHypes: Record<string, HypeType>;
  serverHypeCounts: Record<string, HypeCounts>;
  isAuthenticated: boolean;
  userHypeCounts: Record<HypeType, number>;
}

type TabType = "upcoming" | "online";

export function ServerTable({ servers, userHypes, serverHypeCounts, isAuthenticated, userHypeCounts }: ServerTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<TabType>("upcoming");
  const serversPerPage = 10;

  const upcomingServers = servers.filter(s => {
    const { isLaunched } = formatCountdown(s.launchDate);
    return !isLaunched;
  }).sort((a, b) => parseServerDate(a.launchDate).getTime() - parseServerDate(b.launchDate).getTime());

  const onlineServers = servers.filter(s => {
    const { isLaunched } = formatCountdown(s.launchDate);
    return isLaunched;
  }).sort((a, b) => b.playersOnline - a.playersOnline);

  const displayServers = activeTab === "upcoming" ? upcomingServers : onlineServers;

  const totalPages = Math.ceil(displayServers.length / serversPerPage);
  const startIndex = (currentPage - 1) * serversPerPage;
  const paginatedServers = displayServers.slice(startIndex, startIndex + serversPerPage);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
            <button
              onClick={() => handleTabChange("upcoming")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === "upcoming"
                ? "bg-white text-purple-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
                }`}
            >
              Próximos Lançamentos
            </button>
            <button
              onClick={() => handleTabChange("online")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === "online"
                ? "bg-white text-purple-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
                }`}
            >
              Servidores Online
            </button>
          </div>
          <p className="text-sm text-gray-500">{displayServers.length} servidores</p>
        </div>
      </div>

      {/* Desktop View: Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-auto md:w-[40%]">
                Servidor
              </th>
              <th className="text-center py-2.5 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap w-[120px]">
                {activeTab === "upcoming" ? "Lança Em" : "Status"}
              </th>
              <th className="text-center py-2.5 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[80px]">
                Versão
              </th>
              <th className="text-center py-2.5 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[80px]">
                Rate
              </th>
              <th className="text-center py-2.5 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[100px]">
                Estilo
              </th>
              <th className="text-center py-2.5 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[80px]">
                Sistemas
              </th>
              <th className="text-center py-2.5 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[60px]">
                Mobile
              </th>
              <th className="text-center py-2.5 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[80px]">
                Hype
              </th>
              <th className="text-center py-2.5 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap w-[120px]">
                Links
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedServers.map((server) => (
              <ServerRow
                key={server.id}
                server={server}
                userHype={userHypes[server.id] || null}
                hypeCounts={serverHypeCounts[server.id] || { going: 0, waiting: 0, maybe: 0, total: 0 }}
                isAuthenticated={isAuthenticated}
                userHypeCounts={userHypeCounts}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View: Cards */}
      <div className="block md:hidden p-4 bg-gray-50/30">
        {paginatedServers.map((server) => (
          <ServerCard
            key={server.id}
            server={server}
            userHype={userHypes[server.id] || null}
            hypeCounts={serverHypeCounts[server.id] || { going: 0, waiting: 0, maybe: 0, total: 0 }}
            isAuthenticated={isAuthenticated}
            userHypeCounts={userHypeCounts}
          />
        ))}
      </div>

      {displayServers.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          {activeTab === "upcoming"
            ? "Nenhum servidor com lançamento agendado"
            : "Nenhum servidor online no momento"
          }
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 p-4 border-t border-gray-100">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={18} />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${currentPage === page
                ? "bg-purple-600 text-white"
                : "hover:bg-gray-100 text-gray-600"
                }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
