"use client";

import { useState } from "react";
import { 
  CheckCircle2, 
  XCircle, 
  ExternalLink, 
  MessageSquare, 
  Download, 
  Smartphone,
  ChevronLeft,
  ChevronRight,
  BadgeCheck,
  X,
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

interface SystemsModalProps {
  server: Server;
  onClose: () => void;
}

function SystemsModal({ server, onClose }: SystemsModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-bold text-lg text-gray-900">Sistemas do Servidor</h3>
            <p className="text-sm text-gray-500">{server.name}</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {server.systems.map((system, index) => (
            <div 
              key={index} 
              className="flex items-center gap-2 p-3 bg-gradient-to-r from-purple-50 to-transparent rounded-xl border border-purple-100"
            >
              <CheckCircle2 size={18} className="text-purple-600 flex-shrink-0" />
              <span className="text-sm font-medium text-gray-700">{system.name}</span>
            </div>
          ))}
        </div>
        {server.systems.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-4">Nenhum sistema cadastrado</p>
        )}
      </div>
    </div>
  );
}

interface ServerRowProps {
  server: Server;
  userHype: HypeType | null;
  hypeCounts: HypeCounts;
  isAuthenticated: boolean;
  userHypeCounts: Record<HypeType, number>;
}

function ServerRow({ server, userHype, hypeCounts, isAuthenticated, userHypeCounts }: ServerRowProps) {
  const [showSystems, setShowSystems] = useState(false);
  const { countdown, dateStr, isLaunched } = formatCountdown(server.launchDate);

  return (
    <>
      <tr className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
        <td className="py-2.5 px-2">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-xs">
                {server.name.charAt(0)}
              </span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-xs" title={server.country}>{COUNTRY_FLAGS[server.country]}</span>
                <span className="font-semibold text-gray-900 text-xs whitespace-nowrap">{server.name}</span>
                {server.isVerified && (
                  <BadgeCheck size={12} className="text-purple-600 flex-shrink-0" />
                )}
              </div>
              <div className="flex items-center gap-1 text-[10px] text-gray-500">
                <span className="text-green-500">●</span>
                <span>{server.playersOnline}</span>
              </div>
            </div>
          </div>
        </td>

        <td className="py-2.5 px-2 text-center">
          <div className={`text-xs font-semibold ${isLaunched ? 'text-green-500' : 'text-red-500'}`}>{countdown}</div>
          <div className="text-[10px] text-gray-400">{dateStr}</div>
        </td>

        <td className="py-2.5 px-2 text-center">
          <span className="text-xs text-gray-700">v{server.version}</span>
        </td>

        <td className="py-2.5 px-2 text-center">
          <span className="text-xs text-gray-700">{server.rate}</span>
        </td>

        <td className="py-2.5 px-2 text-center">
          <span className="text-xs text-gray-700">{server.style}</span>
        </td>

        <td className="py-2.5 px-2 text-center">
          <button 
            onClick={() => setShowSystems(true)}
            className="inline-flex items-center gap-0.5 text-[10px] text-purple-600 hover:text-purple-700 hover:bg-purple-50 px-1.5 py-0.5 rounded transition-colors"
          >
            <Eye size={12} />
            Ver
          </button>
        </td>

        <td className="py-2.5 px-2">
          <div className="flex justify-center">
            {server.hasMobile ? (
              <CheckCircle2 size={20} className="text-green-500" />
            ) : (
              <XCircle size={20} className="text-gray-300" />
            )}
          </div>
        </td>

        <td className="py-2.5 px-2">
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

        <td className="py-2.5 px-2">
          <div className="flex items-center justify-center gap-0.5">
            <button className="p-1 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors" title="Discord">
              <MessageSquare size={14} />
            </button>
            <button className="p-1 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors" title="App">
              <Smartphone size={14} />
            </button>
            <button className="p-1 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors" title="Download">
              <Download size={14} />
            </button>
            <button className="p-1 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors" title="Website">
              <ExternalLink size={14} />
            </button>
          </div>
        </td>
      </tr>
      {showSystems && <SystemsModal server={server} onClose={() => setShowSystems(false)} />}
    </>
  );
}

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
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === "upcoming"
                  ? "bg-white text-purple-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Próximos Lançamentos
            </button>
            <button
              onClick={() => handleTabChange("online")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === "online"
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

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left py-2.5 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Servidor
              </th>
              <th className="text-center py-2.5 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                {activeTab === "upcoming" ? "Lança Em" : "Status"}
              </th>
              <th className="text-center py-2.5 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Versão
              </th>
              <th className="text-center py-2.5 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Rate
              </th>
              <th className="text-center py-2.5 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Estilo
              </th>
              <th className="text-center py-2.5 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Sistemas
              </th>
              <th className="text-center py-2.5 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Mobile
              </th>
              <th className="text-center py-2.5 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Hype
              </th>
              <th className="text-center py-2.5 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
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
              className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                currentPage === page
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
