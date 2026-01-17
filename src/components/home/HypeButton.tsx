"use client";

import { useState, useTransition, useEffect } from "react";
import { Flame, Clock, HelpCircle } from "lucide-react";
import { toggleHype } from "@/lib/hype/actions";
import type { HypeType, HypeCounts } from "@/types/database.types";

interface HypeButtonProps {
  serverId: string;
  userHype: HypeType | null;
  counts: HypeCounts;
  isAuthenticated: boolean;
  userHypeCounts: Record<HypeType, number>;
}

const HYPE_CONFIG: Record<HypeType, { 
  icon: typeof Flame; 
  label: string; 
  activeColor: string;
  hoverColor: string;
  limit: number;
}> = {
  GOING: { 
    icon: Flame, 
    label: "GOING", 
    activeColor: "bg-green-500 text-white border-green-500",
    hoverColor: "hover:border-green-400 hover:text-green-500",
    limit: 3
  },
  WAITING: { 
    icon: Clock, 
    label: "WAITING", 
    activeColor: "bg-yellow-500 text-white border-yellow-500",
    hoverColor: "hover:border-yellow-400 hover:text-yellow-500",
    limit: 5
  },
  MAYBE: { 
    icon: HelpCircle, 
    label: "MAYBE", 
    activeColor: "bg-gray-500 text-white border-gray-500",
    hoverColor: "hover:border-gray-400 hover:text-gray-500",
    limit: Infinity
  },
};

export function HypeButton({ 
  serverId, 
  userHype, 
  counts, 
  isAuthenticated,
  userHypeCounts 
}: HypeButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [localUserHype, setLocalUserHype] = useState<HypeType | null>(userHype);
  const [localCounts, setLocalCounts] = useState<HypeCounts>(counts);

  useEffect(() => {
    setLocalUserHype(userHype);
  }, [userHype]);

  useEffect(() => {
    setLocalCounts(counts);
  }, [counts]);

  const handleHype = (hypeType: HypeType) => {
    if (!isAuthenticated) {
      setError("Faça login para dar Hype");
      setTimeout(() => setError(null), 3000);
      return;
    }

    const isRemoving = localUserHype === hypeType;
    const previousHype = localUserHype;
    const previousCounts = { ...localCounts };

    if (isRemoving) {
      setLocalUserHype(null);
      setLocalCounts(prev => ({
        ...prev,
        [hypeType.toLowerCase()]: Math.max(0, prev[hypeType.toLowerCase() as keyof HypeCounts] as number - 1),
        total: prev.total - 1
      }));
    } else {
      if (hypeType !== "MAYBE" && userHypeCounts[hypeType] >= HYPE_CONFIG[hypeType].limit) {
        setError(`Limite de ${HYPE_CONFIG[hypeType].limit} ${hypeType} atingido`);
        setTimeout(() => setError(null), 3000);
        return;
      }

      if (previousHype) {
        setLocalCounts(prev => ({
          ...prev,
          [previousHype.toLowerCase()]: Math.max(0, prev[previousHype.toLowerCase() as keyof HypeCounts] as number - 1),
        }));
      }
      setLocalUserHype(hypeType);
      setLocalCounts(prev => ({
        ...prev,
        [hypeType.toLowerCase()]: (prev[hypeType.toLowerCase() as keyof HypeCounts] as number) + 1,
        total: previousHype ? prev.total : prev.total + 1
      }));
    }

    startTransition(async () => {
      const result = await toggleHype(serverId, hypeType);
      if (!result.success) {
        setLocalUserHype(previousHype);
        setLocalCounts(previousCounts);
        setError(result.error || "Erro ao processar");
        setTimeout(() => setError(null), 3000);
      }
    });
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex gap-1">
        {(Object.keys(HYPE_CONFIG) as HypeType[]).map((type) => {
          const config = HYPE_CONFIG[type];
          const Icon = config.icon;
          const isActive = localUserHype === type;
          const count = localCounts[type.toLowerCase() as keyof HypeCounts] as number;

          return (
            <button
              key={type}
              onClick={() => handleHype(type)}
              disabled={isPending}
              className={`
                flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md border transition-all
                ${isActive 
                  ? config.activeColor 
                  : `border-gray-200 text-gray-500 ${config.hoverColor}`
                }
                ${isPending ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
              `}
              title={`${config.label} (${type === "MAYBE" ? "ilimitado" : `max ${config.limit}`})`}
            >
              <Icon className="w-3 h-3" />
              <span>{count}</span>
            </button>
          );
        })}
      </div>
      {error && (
        <span className="text-xs text-red-500">{error}</span>
      )}
    </div>
  );
}
