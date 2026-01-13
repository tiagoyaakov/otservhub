"use client";

import { createClient } from "@/lib/supabase/client";
import type { User, AuthChangeEvent, Session, Subscription } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    if (!supabase) {
      setIsLoading(false);
      return;
    }

    let subscription: Subscription | null = null;

    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      } catch (error) {
        console.error("Error getting user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getUser();

    const { data } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );
    subscription = data.subscription;

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  };
}
