"use client";

import { useState, useMemo } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroBanner } from "@/components/home/HeroBanner";
import { SearchFilters, FilterState } from "@/components/home/SearchFilters";
import { Sidebar } from "@/components/home/Sidebar";
import { ServerTable } from "@/components/home/ServerTable";
import { AdBanner } from "@/components/home/AdBanner";
import { mockServers, Server } from "@/data/mockServers";
import { useHype } from "@/hooks/useHype";
import { useAuth } from "@/hooks/useAuth";

function filterServers(servers: Server[], filters: FilterState): Server[] {
  return servers.filter((server) => {
    if (filters.search && !server.name.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }

    if (filters.version !== "Todas") {
      const version = parseFloat(server.version);
      if (filters.version === "7.4-8.0" && (version < 7.4 || version >= 8.6)) {
        return false;
      }
      if (filters.version === "8.60" && version !== 8.6) {
        return false;
      }
      if (filters.version === "12+" && version < 12) {
        return false;
      }
    }

    if (filters.type !== "Todos" && server.pvpType !== filters.type) {
      return false;
    }

    if (filters.map !== "Todos" && server.mapType !== filters.map) {
      return false;
    }

    return true;
  });
}

export default function Home() {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    version: "Todas",
    type: "Todos",
    map: "Todos",
  });

  const { isAuthenticated } = useAuth();
  const serverIds = useMemo(() => mockServers.map(s => s.id), []);
  const { userHypes, serverHypeCounts, userHypeCounts } = useHype(serverIds);

  const filteredServers = useMemo(() => {
    return filterServers(mockServers, filters);
  }, [filters]);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fb]">
      <Header />
      
      <main className="flex-1">
        <div className="w-full px-4 py-6">
          <section className="mb-6">
            <HeroBanner />
          </section>

          <section className="mb-6">
            <SearchFilters filters={filters} onFilterChange={setFilters} />
          </section>

          <section className="flex gap-3">
            <div className="w-[180px] flex-shrink-0 hidden lg:block">
              <Sidebar servers={mockServers} />
            </div>
            
            <div className="flex-1 min-w-0">
              <ServerTable 
                servers={filteredServers}
                userHypes={userHypes}
                serverHypeCounts={serverHypeCounts}
                isAuthenticated={isAuthenticated}
                userHypeCounts={userHypeCounts}
              />
            </div>
            
            <div className="w-[160px] flex-shrink-0 hidden xl:block">
              <AdBanner />
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
