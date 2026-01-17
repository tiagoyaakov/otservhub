"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { HypeType, HypeCounts } from "@/types/database.types";

const HYPE_LIMITS: Record<HypeType, number> = {
  GOING: 3,
  WAITING: 5,
  MAYBE: Infinity,
};

export async function getUserHypeForServer(serverId: string): Promise<HypeType | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;

  const { data } = await supabase
    .from("user_hypes")
    .select("hype_type")
    .eq("user_id", user.id)
    .eq("server_id", serverId)
    .single();

  return data?.hype_type as HypeType | null;
}

export async function getUserHypeCounts(): Promise<Record<HypeType, number>> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { GOING: 0, WAITING: 0, MAYBE: 0 };
  }

  const { data } = await supabase
    .from("user_hypes")
    .select("hype_type")
    .eq("user_id", user.id);

  const counts: Record<HypeType, number> = { GOING: 0, WAITING: 0, MAYBE: 0 };
  
  data?.forEach((hype) => {
    const type = hype.hype_type as HypeType;
    counts[type] = (counts[type] || 0) + 1;
  });

  return counts;
}

export async function getServerHypeCounts(serverId: string): Promise<HypeCounts> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("user_hypes")
    .select("hype_type")
    .eq("server_id", serverId);

  const counts: HypeCounts = { going: 0, waiting: 0, maybe: 0, total: 0 };
  
  data?.forEach((hype) => {
    const type = hype.hype_type as HypeType;
    if (type === "GOING") counts.going++;
    else if (type === "WAITING") counts.waiting++;
    else if (type === "MAYBE") counts.maybe++;
    counts.total++;
  });

  return counts;
}

export async function toggleHype(serverId: string, hypeType: HypeType): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { success: false, error: "Você precisa estar logado para dar Hype" };
  }

  const { data: existingHype } = await supabase
    .from("user_hypes")
    .select("id, hype_type")
    .eq("user_id", user.id)
    .eq("server_id", serverId)
    .single();

  if (existingHype) {
    if (existingHype.hype_type === hypeType) {
      const { error } = await supabase
        .from("user_hypes")
        .delete()
        .eq("id", existingHype.id);

      if (error) {
        return { success: false, error: "Erro ao remover Hype" };
      }
    } else {
      if (hypeType !== "MAYBE") {
        const userCounts = await getUserHypeCounts();
        if (userCounts[hypeType] >= HYPE_LIMITS[hypeType]) {
          return { 
            success: false, 
            error: `Você já atingiu o limite de ${HYPE_LIMITS[hypeType]} ${hypeType}` 
          };
        }
      }

      const { error } = await supabase
        .from("user_hypes")
        .update({ hype_type: hypeType })
        .eq("id", existingHype.id);

      if (error) {
        return { success: false, error: "Erro ao atualizar Hype" };
      }
    }
  } else {
    if (hypeType !== "MAYBE") {
      const userCounts = await getUserHypeCounts();
      if (userCounts[hypeType] >= HYPE_LIMITS[hypeType]) {
        return { 
          success: false, 
          error: `Você já atingiu o limite de ${HYPE_LIMITS[hypeType]} ${hypeType}` 
        };
      }
    }

    const { error } = await supabase
      .from("user_hypes")
      .insert({
        user_id: user.id,
        server_id: serverId,
        hype_type: hypeType,
      });

    if (error) {
      return { success: false, error: "Erro ao adicionar Hype" };
    }
  }

  revalidatePath("/");
  return { success: true };
}

export async function getAllUserHypes(): Promise<Record<string, HypeType>> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return {};

  const { data } = await supabase
    .from("user_hypes")
    .select("server_id, hype_type")
    .eq("user_id", user.id);

  const hypes: Record<string, HypeType> = {};
  data?.forEach((hype) => {
    hypes[hype.server_id] = hype.hype_type as HypeType;
  });

  return hypes;
}
