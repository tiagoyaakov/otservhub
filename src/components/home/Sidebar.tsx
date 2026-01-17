"use client";

import { ChevronDown, Flame, Swords, Shield } from "lucide-react";
import { useState } from "react";
import { Server, parseServerDate } from "@/data/mockServers";

interface CategorySection {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  servers: Server[];
}

function formatCountdown(dateString: string): string {
  const date = parseServerDate(dateString);
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  
  if (diff <= 0) return "Lançado";
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${days}d ${String(hours).padStart(2, "0")}h ${String(minutes).padStart(2, "0")}m`;
}

interface SidebarProps {
  servers: Server[];
}

export function Sidebar({ servers }: SidebarProps) {
  const [expandedCategory, setExpandedCategory] = useState<string>("oldschool");

  const categories: CategorySection[] = [
    {
      id: "oldschool",
      name: "OLDSCHOOL",
      icon: <Shield size={16} />,
      color: "text-emerald-500",
      servers: servers.filter((s) => s.category === "oldschool").slice(0, 3),
    },
    {
      id: "baiak",
      name: "BAIAK",
      icon: <Flame size={16} />,
      color: "text-orange-500",
      servers: servers.filter((s) => s.category === "baiak").slice(0, 3),
    },
    {
      id: "war",
      name: "WAR",
      icon: <Swords size={16} />,
      color: "text-red-500",
      servers: servers.filter((s) => s.category === "war").slice(0, 3),
    },
  ];

  return (
    <aside className="w-full">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {categories.map((category) => (
          <div key={category.id} className="border-b border-gray-100 last:border-b-0">
            <button
              onClick={() => setExpandedCategory(expandedCategory === category.id ? "" : category.id)}
              className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className={category.color}>{category.icon}</span>
                <span className="text-xs font-bold text-gray-700">{category.name}</span>
              </div>
              <ChevronDown
                size={16}
                className={`text-gray-400 transition-transform ${
                  expandedCategory === category.id ? "rotate-180" : ""
                }`}
              />
            </button>

            {expandedCategory === category.id && (
              <div className="px-3 pb-3 space-y-2">
                {category.servers.map((server) => (
                  <div
                    key={server.id}
                    className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                          {server.name.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-800 truncate">
                          {server.name}
                        </p>
                        <p className="text-[10px] text-gray-500">
                          v{server.version} • {server.rate}
                        </p>
                      </div>
                    </div>
                    <div className="text-[10px] text-purple-600 font-medium">
                      {formatCountdown(server.launchDate)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}
