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
  X
} from "lucide-react";
import { Server, parseServerDate } from "@/data/mockServers";
import { HypeButton } from "./HypeButton";
import type { HypeType, HypeCounts } from "@/types/database.types";

function formatCountdown(dateString: string): { countdown: string; dateStr: string } {
  const date = parseServerDate(dateString);
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  
  if (diff <= 0) {
    return { countdown: "Online", dateStr: "Lançado" };
  }
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  const countdown = `${days}d ${String(hours).padStart(2, "0")}h ${String(minutes).padStart(2, "0")}m`;
  const dateStr = date.toLocaleDateString("pt-BR");
  
  return { countdown, dateStr };
}

interface SystemsModalProps {
  server: Server;
  onClose: () => void;
}

function SystemsModal({ server, onClose }: SystemsModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className="bg-white rounded-xl p-6 max-w-sm w-full mx-4 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Sistemas de {server.name}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>
        <div className="space-y-2">
          {server.systems.map((system, index) => (
            <div key={index} className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-green-500" />
              <span className="text-sm text-gray-700">{system.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface ServerRowProps {
  server: Server;
  index: number;
  userHype: HypeType | null;
  hypeCounts: HypeCounts;
  isAuthenticated: boolean;
  userHypeCounts: Record<HypeType, number>;
}

function ServerRow({ server, index, userHype, hypeCounts, isAuthenticated, userHypeCounts }: ServerRowProps) {
  const [showSystems, setShowSystems] = useState(false);
  const { countdown, dateStr } = formatCountdown(server.launchDate);
  const countryCode = index % 2 === 0 ? "BR" : "US";

  return (
    <>
      <tr className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
        <td className="py-4 px-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {server.name.charAt(0)}
                </span>
              </div>
              <span className="absolute -bottom-1 -right-1 text-[10px] bg-gray-200 rounded px-1">
                {countryCode}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-gray-900 text-sm">{server.name}</span>
                {server.isVerified && (
                  <BadgeCheck size={14} className="text-purple-600" />
                )}
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <span className="text-green-500">●</span>
                <span>{server.playersOnline}</span>
              </div>
            </div>
          </div>
        </td>

        <td className="py-4 px-4">
          <div className="text-sm font-semibold text-red-500">{countdown}</div>
          <div className="text-xs text-gray-400">{dateStr}</div>
        </td>

        <td className="py-4 px-4">
          <span className="text-sm text-gray-700">v{server.version}</span>
        </td>

        <td className="py-4 px-4">
          <span className="text-sm text-gray-700">{server.rate}</span>
        </td>

        <td className="py-4 px-4">
          <span className="text-sm text-gray-700">{server.style}</span>
        </td>

        <td className="py-4 px-4">
          <button 
            onClick={() => setShowSystems(true)}
            className="text-xs text-purple-600 hover:text-purple-700 flex items-center gap-1"
          >
            ≡ Ver
          </button>
        </td>

        <td className="py-4 px-4">
          {server.hasMobile ? (
            <CheckCircle2 size={18} className="text-green-500" />
          ) : (
            <XCircle size={18} className="text-gray-300" />
          )}
        </td>

        <td className="py-4 px-4">
          <HypeButton
            serverId={server.id}
            userHype={userHype}
            counts={hypeCounts}
            isAuthenticated={isAuthenticated}
            userHypeCounts={userHypeCounts}
          />
        </td>

        <td className="py-4 px-4">
          <div className="flex items-center gap-2">
            <button className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors">
              <MessageSquare size={16} />
            </button>
            <button className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors">
              <Smartphone size={16} />
            </button>
            <button className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors">
              <Download size={16} />
            </button>
            <button className="p-1.5 text-gray-400 hover:text-purple-600 transition-colors">
              <ExternalLink size={16} />
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

export function ServerTable({ servers, userHypes, serverHypeCounts, isAuthenticated, userHypeCounts }: ServerTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const serversPerPage = 10;
  
  const sortedServers = [...servers].sort(
    (a, b) => parseServerDate(a.launchDate).getTime() - parseServerDate(b.launchDate).getTime()
  );
  
  const totalPages = Math.ceil(sortedServers.length / serversPerPage);
  const startIndex = (currentPage - 1) * serversPerPage;
  const displayedServers = sortedServers.slice(startIndex, startIndex + serversPerPage);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-900">Próximos Lançamentos</h2>
        <p className="text-sm text-gray-500">{servers.length} servidores encontrados</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Servidor
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Lança Em
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Versão
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Rate
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Estilo
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Sistemas
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Mobile
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Hype
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Links Úteis
              </th>
            </tr>
          </thead>
          <tbody>
            {displayedServers.map((server, index) => (
              <ServerRow 
                key={server.id} 
                server={server} 
                index={index}
                userHype={userHypes[server.id] || null}
                hypeCounts={serverHypeCounts[server.id] || { going: 0, waiting: 0, maybe: 0, total: 0 }}
                isAuthenticated={isAuthenticated}
                userHypeCounts={userHypeCounts}
              />
            ))}
          </tbody>
        </table>
      </div>

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
