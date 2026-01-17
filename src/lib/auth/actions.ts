"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

function getBaseUrl(headersList: Headers): string {
  const origin = headersList.get("origin");
  if (origin) {
    try {
      const url = new URL(origin);
      return url.origin;
    } catch {}
  }

  const host = headersList.get("x-forwarded-host") || headersList.get("host");
  const protocol = headersList.get("x-forwarded-proto") || "https";
  
  if (host) {
    return `${protocol}://${host}`;
  }

  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:5000";
}

export async function signInWithGoogle() {
  const supabase = await createClient();
  const headersList = await headers();
  const baseUrl = getBaseUrl(headersList);
  const redirectTo = `${baseUrl}/auth/callback`;

  console.log("[Auth] Google signIn - baseUrl:", baseUrl);
  console.log("[Auth] Google signIn - redirectTo:", redirectTo);

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo,
    },
  });

  console.log("[Auth] Google signIn - data:", JSON.stringify(data, null, 2));

  if (error) {
    console.error("[Auth] Google sign in error:", error);
    redirect("/auth/error");
  }

  if (data.url) {
    console.log("[Auth] Redirecting to:", data.url);
    redirect(data.url);
  }
}

export async function signInWithDiscord() {
  const supabase = await createClient();
  const headersList = await headers();
  const baseUrl = getBaseUrl(headersList);
  const redirectTo = `${baseUrl}/auth/callback`;

  console.log("[Auth] Discord signIn - baseUrl:", baseUrl);
  console.log("[Auth] Discord signIn - redirectTo:", redirectTo);

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "discord",
    options: {
      redirectTo,
    },
  });

  console.log("[Auth] Discord signIn - data:", JSON.stringify(data, null, 2));

  if (error) {
    console.error("[Auth] Discord sign in error:", error);
    redirect("/auth/error");
  }

  if (data.url) {
    console.log("[Auth] Redirecting to:", data.url);
    redirect(data.url);
  }
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function getUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}
