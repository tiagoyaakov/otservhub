"use client";

import { useState, useMemo, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroBanner } from "@/components/home/HeroBanner";
import { SearchFilters, FilterState } from "@/components/home/SearchFilters";
import { Sidebar } from "@/components/home/Sidebar";
import { ServerTable } from "@/components/home/ServerTable";
import { AdBanner } from "@/components/home/AdBanner";
import { mockServers, Server } from "@/data/mockServers"; // We might still use types from here or create new one
import { useHype } from "@/hooks/useHype";
import { useAuth } from "@/hooks/useAuth";
import { getServers } from "@/app/actions/server";

// Helper to map DB server to UI MockServer type (temporary adapter)
const mapDbServerToUi = (dbServer: any): Server => ({
  id: dbServer.id,
  name: dbServer.name,
  ip: dbServer.ip_address,
  port: dbServer.port,
  logo: "/globe.svg",
  country: "BR", // Default to BR for now
  playersOnline: 0,
  launchDate: dbServer.launch_date,
  version: dbServer.custom_version || "8.60",
  rate: dbServer.exp_rate,
  style: dbServer.map_type,
  mapType: dbServer.map_type,
  pvpType: "PvP", // Default fallback, DB uses different enum case
  hasMobile: false, // Default
  isVerified: dbServer.is_verified,
  hypeScore: 0,
  website: dbServer.website_url,
  expRate: dbServer.exp_rate,
  tags: [dbServer.theme],
  isPremium: false,
  bannerUrl: "/server-banner-placeholder.jpg",
  category: "oldschool",
  systems: [], // Fixes the crash "reading length of undefined"
  description: dbServer.description,
  theme: dbServer.theme || "Tibia"
});

function filterServers(servers: Server[], filters: FilterState): Server[] {
  return servers.filter((server) => {
    if (filters.search && !server.name.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }

    if (filters.theme && filters.theme !== "Todos" && server.theme !== filters.theme) {
      if (filters.theme === "Outros" && ["Tibia", "Pokemon", "Naruto", "Dragonball"].includes(server.theme)) return false;
      if (filters.theme !== "Outros") return false;
    }

    if (filters.version !== "Todas") {
      const version = parseFloat(server.version);
      // Rough heuristic for demonstration
      if (filters.version === "7.4-8.0" && (version < 7.4 || version >= 8.6)) return false;
      if (filters.version === "8.60" && version !== 8.6) return false;
      if (filters.version === "12+" && version < 12) return false;
    }

    if (filters.type !== "Todos" && server.pvpType !== filters.type) return false;
    if (filters.map !== "Todos" && server.mapType !== filters.map) return false;

    return true;
  });
}

export default function Home() {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    version: "Todas",
    type: "Todos",
    map: "Todos",
    theme: "Todos",
  });

  const { isAuthenticated } = useAuth();
  const [serverList, setServerList] = useState<Server[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getServers()
      .then((data) => {
        const mapped = data.map(mapDbServerToUi);
        // Combine with mockServers if DB is empty for initial demo? No, let's show real data only or keep mix if user wants.
        // For now, replacing logic completely.
        if (mapped.length === 0) {
          // Fallback to mock if empty to show something? 
          // setServerList(mockServers); 
          setServerList([]);
        } else {
          setServerList(mapped);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  // Hype logic (needs to be adapted to real DB IDs later)
  const serverIds = useMemo(() => serverList.map(s => s.id), [serverList]);
  const { userHypes, serverHypeCounts, userHypeCounts } = useHype(serverIds);

  const filteredServers = useMemo(() => {
    // If loading, maybe return empty or skeleton
    return filterServers(serverList, filters);
  }, [serverList, filters]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <div className="flex-1 flex flex-col w-full bg-[url('/site-bg-clean.png')] bg-cover bg-fixed bg-center">
        <Header />

        <main className="flex-1 flex flex-col">
          {/* Hero Section */}
          <section className="relative w-full py-10 mb-6">
            <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px]" />
            <div className="relative z-10 w-full px-4 md:px-6">
              <HeroBanner />
            </div>
          </section>

          <div className="w-full px-4 md:px-6 pb-6">
            <section className="mb-6 w-full flex justify-center">
              <div className="w-full">
                <SearchFilters filters={filters} onFilterChange={setFilters} />
              </div>
            </section>

            <div className="w-full grid grid-cols-1 xl:grid-cols-[280px_1fr_280px] gap-6 items-start px-4 md:px-6">
              <aside className="hidden xl:block">
                <Sidebar servers={serverList} />
              </aside>

              <section className="w-full min-w-0">
                <div className="w-full">
                  {isLoading ? (
                    <div className="p-8 text-center bg-white rounded-lg border border-gray-100 shadow-sm">
                      <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-2" />
                      <p className="text-gray-500">Carregando servidores...</p>
                    </div>
                  ) : (
                    <ServerTable
                      servers={filteredServers}
                      userHypes={userHypes}
                      serverHypeCounts={serverHypeCounts}
                      isAuthenticated={isAuthenticated}
                      userHypeCounts={userHypeCounts}
                    />
                  )}
                  {!isLoading && filteredServers.length === 0 && (
                    <div className="p-8 text-center bg-white rounded-lg border border-gray-100 shadow-sm mt-4">
                      <p className="text-gray-500">Nenhum servidor encontrado.</p>
                    </div>
                  )}
                </div>
              </section>

              <aside className="hidden xl:block">
                <AdBanner />
              </aside>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
