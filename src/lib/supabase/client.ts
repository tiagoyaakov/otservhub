
import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

let supabaseClient: SupabaseClient | null = null

function isValidUrl(str: string | undefined): boolean {
  if (!str) return false
  try {
    const url = new URL(str)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

export function createClient(): SupabaseClient | null {
  if (supabaseClient) return supabaseClient

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()

  if (!isValidUrl(supabaseUrl) || !supabaseAnonKey) {
    console.warn('Supabase credentials not configured')
    return null
  }

  supabaseClient = createBrowserClient(supabaseUrl!, supabaseAnonKey)
  return supabaseClient
}
