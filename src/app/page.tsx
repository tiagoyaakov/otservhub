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
    <div className="min-h-screen flex flex-col bg-slate-50">
      <div className="flex-1 flex flex-col w-full bg-[url('/site-bg-clean.png')] bg-cover bg-fixed bg-center">
        <Header />

        <main className="flex-1 flex flex-col">
          {/* Hero Section - Background removed to let site background show */}
          <section className="relative w-full py-10 mb-6">
            <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px]" />
            <div className="relative z-10 w-full px-4 md:px-6">
              <HeroBanner />
            </div>
          </section>

          <div className="w-full px-4 md:px-6 pb-6">
            {/* Search Filters - Full Width & Centered Content */}
            <section className="mb-6 w-full flex justify-center">
              <div className="w-full">
                <SearchFilters filters={filters} onFilterChange={setFilters} />
              </div>
            </section>

            {/* Main Content Area - Grid Layout - Full Fluid */}
            <div className="w-full grid grid-cols-1 xl:grid-cols-[280px_1fr_280px] gap-6 items-start px-4 md:px-6">

              {/* Left Sidebar - Sponsors */}
              <aside className="hidden xl:block">
                <Sidebar servers={mockServers} />
              </aside>

              {/* Center - Server List */}
              <section className="w-full min-w-0">
                <div className="w-full">
                  <ServerTable
                    servers={filteredServers}
                    userHypes={userHypes}
                    serverHypeCounts={serverHypeCounts}
                    isAuthenticated={isAuthenticated}
                    userHypeCounts={userHypeCounts}
                  />
                </div>
              </section>

              {/* Right Sidebar - Ads */}
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
