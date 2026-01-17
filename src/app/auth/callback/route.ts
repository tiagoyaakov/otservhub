import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

function getRedirectUrl(request: Request, path: string): string {
  const forwardedHost = request.headers.get('x-forwarded-host')
  const forwardedProto = request.headers.get('x-forwarded-proto') || 'https'
  
  if (forwardedHost) {
    return `${forwardedProto}://${forwardedHost}${path}`
  }
  
  const host = request.headers.get('host')
  if (host && !host.includes('0.0.0.0') && !host.includes('localhost')) {
    return `https://${host}${path}`
  }
  
  return `${new URL(request.url).origin}${path}`
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const redirectUrl = getRedirectUrl(request, next)
      return NextResponse.redirect(redirectUrl)
    }
  }

  const errorUrl = getRedirectUrl(request, '/auth/error')
  return NextResponse.redirect(errorUrl)
}
