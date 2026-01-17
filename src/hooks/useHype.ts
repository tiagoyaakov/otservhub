"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { HypeType, HypeCounts } from "@/types/database.types";

interface UseHypeResult {
  userHypes: Record<string, HypeType>;
  serverHypeCounts: Record<string, HypeCounts>;
  userHypeCounts: Record<HypeType, number>;
  isLoading: boolean;
  refreshHypes: () => Promise<void>;
}

export function useHype(serverIds: string[]): UseHypeResult {
  const [userHypes, setUserHypes] = useState<Record<string, HypeType>>({});
  const [serverHypeCounts, setServerHypeCounts] = useState<Record<string, HypeCounts>>({});
  const [userHypeCounts, setUserHypeCounts] = useState<Record<HypeType, number>>({ GOING: 0, WAITING: 0, MAYBE: 0 });
  const [isLoading, setIsLoading] = useState(true);

  const fetchHypes = useCallback(async () => {
    const supabase = createClient();
    if (!supabase) {
      setIsLoading(false);
      return;
    }

    try {
      const { data: serverHypes } = await supabase
        .from("user_hypes")
        .select("server_id, hype_type")
        .in("server_id", serverIds);

      const counts: Record<string, HypeCounts> = {};
      serverIds.forEach(id => {
        counts[id] = { going: 0, waiting: 0, maybe: 0, total: 0 };
      });

      serverHypes?.forEach((hype) => {
        const serverId = hype.server_id;
        if (counts[serverId]) {
          const type = hype.hype_type as HypeType;
          if (type === "GOING") counts[serverId].going++;
          else if (type === "WAITING") counts[serverId].waiting++;
          else if (type === "MAYBE") counts[serverId].maybe++;
          counts[serverId].total++;
        }
      });

      setServerHypeCounts(counts);

      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: userHypeData } = await supabase
          .from("user_hypes")
          .select("server_id, hype_type")
          .eq("user_id", user.id);

        const hypes: Record<string, HypeType> = {};
        const userCounts: Record<HypeType, number> = { GOING: 0, WAITING: 0, MAYBE: 0 };
        
        userHypeData?.forEach((hype) => {
          hypes[hype.server_id] = hype.hype_type as HypeType;
          const type = hype.hype_type as HypeType;
          userCounts[type]++;
        });

        setUserHypes(hypes);
        setUserHypeCounts(userCounts);
      }
    } catch (error) {
      console.error("Error fetching hypes:", error);
    } finally {
      setIsLoading(false);
    }
  }, [serverIds]);

  useEffect(() => {
    fetchHypes();
  }, [fetchHypes]);

  return {
    userHypes,
    serverHypeCounts,
    userHypeCounts,
    isLoading,
    refreshHypes: fetchHypes
  };
}
