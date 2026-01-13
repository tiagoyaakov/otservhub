import { NextRequest, NextResponse } from "next/server";

const PRIVATE_IPV4_RANGES = [
  /^127\./,
  /^10\./,
  /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
  /^192\.168\./,
  /^169\.254\./,
  /^0\./,
  /^100\.(6[4-9]|[7-9][0-9]|1[0-1][0-9]|12[0-7])\./,
];

const PRIVATE_IPV6_PATTERNS = [
  /^::1$/i,
  /^fc00:/i,
  /^fd00:/i,
  /^fe80:/i,
  /^ff00:/i,
  /^::$/,
  /^::ffff:127\./i,
  /^::ffff:10\./i,
  /^::ffff:172\.(1[6-9]|2[0-9]|3[0-1])\./i,
  /^::ffff:192\.168\./i,
  /^::ffff:169\.254\./i,
  /^::ffff:0\./i,
];

const BLOCKED_HOSTNAMES = [
  "localhost",
  "127.0.0.1",
  "0.0.0.0",
  "::1",
  "[::1]",
  "[::]",
];

function normalizeHostname(hostname: string): string {
  let normalized = hostname.toLowerCase().trim();
  
  if (normalized.startsWith("[") && normalized.endsWith("]")) {
    normalized = normalized.slice(1, -1);
  }
  
  return normalized;
}

function isPrivateOrBlockedHost(hostname: string): boolean {
  const normalized = normalizeHostname(hostname);
  
  if (BLOCKED_HOSTNAMES.some(blocked => normalizeHostname(blocked) === normalized)) {
    return true;
  }
  
  for (const pattern of PRIVATE_IPV4_RANGES) {
    if (pattern.test(normalized)) {
      return true;
    }
  }
  
  for (const pattern of PRIVATE_IPV6_PATTERNS) {
    if (pattern.test(normalized)) {
      return true;
    }
  }
  
  if (normalized.endsWith(".local") || 
      normalized.endsWith(".internal") ||
      normalized.endsWith(".localhost") ||
      normalized === "localhost") {
    return true;
  }
  
  if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(normalized)) {
    const parts = normalized.split(".").map(Number);
    if (parts.some(p => p > 255 || p < 0)) {
      return true;
    }
  }
  
  return false;
}

function extractMetaContent(html: string, metaName: string): string | null {
  const lowerMetaName = metaName.toLowerCase();
  
  const metaTagRegex = /<meta\s+[^>]*>/gi;
  const metaTags = html.match(metaTagRegex) || [];
  
  for (const tag of metaTags) {
    const lowerTag = tag.toLowerCase();
    
    const nameMatch = lowerTag.match(/name\s*=\s*["']([^"']+)["']/i);
    if (!nameMatch || nameMatch[1].toLowerCase() !== lowerMetaName) {
      continue;
    }
    
    const contentMatch = tag.match(/content\s*=\s*["']([^"']+)["']/i);
    if (contentMatch) {
      return contentMatch[1];
    }
  }
  
  return null;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { website, token } = body;

    if (!website || !token) {
      return NextResponse.json(
        { success: false, error: "Website e token são obrigatórios" },
        { status: 400 }
      );
    }

    if (typeof website !== "string" || typeof token !== "string") {
      return NextResponse.json(
        { success: false, error: "Parâmetros inválidos" },
        { status: 400 }
      );
    }

    let targetUrl: URL;
    try {
      let urlString = website.trim();
      if (!urlString.startsWith("http://") && !urlString.startsWith("https://")) {
        urlString = `https://${urlString}`;
      }
      targetUrl = new URL(urlString);
    } catch {
      return NextResponse.json(
        { success: false, error: "URL do website inválida" },
        { status: 400 }
      );
    }

    if (targetUrl.protocol !== "https:" && targetUrl.protocol !== "http:") {
      return NextResponse.json(
        { success: false, error: "Apenas URLs HTTP/HTTPS são permitidas" },
        { status: 400 }
      );
    }

    if (isPrivateOrBlockedHost(targetUrl.hostname)) {
      return NextResponse.json(
        { success: false, error: "URL não permitida" },
        { status: 400 }
      );
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(targetUrl.toString(), {
        signal: controller.signal,
        headers: {
          "User-Agent": "OtservHub-Verification-Bot/1.0",
          "Accept": "text/html",
        },
        redirect: "follow",
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        return NextResponse.json(
          { 
            success: false, 
            error: `Não foi possível acessar o site (HTTP ${response.status})` 
          },
          { status: 200 }
        );
      }

      const contentType = response.headers.get("content-type") || "";
      if (!contentType.includes("text/html") && !contentType.includes("application/xhtml")) {
        return NextResponse.json(
          { success: false, error: "O site não retornou uma página HTML válida" },
          { status: 200 }
        );
      }

      const html = await response.text();
      
      const foundContent = extractMetaContent(html, "otservhub-verification");

      if (foundContent === token) {
        return NextResponse.json({ success: true });
      } else if (foundContent) {
        return NextResponse.json(
          { 
            success: false, 
            error: "Token de verificação não confere. Verifique se copiou corretamente." 
          },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          { 
            success: false, 
            error: "Meta-tag de verificação não encontrada no site" 
          },
          { status: 200 }
        );
      }
    } catch (fetchError) {
      if (fetchError instanceof Error && fetchError.name === "AbortError") {
        return NextResponse.json(
          { success: false, error: "Timeout: o site demorou muito para responder (máx 10s)" },
          { status: 200 }
        );
      }
      
      return NextResponse.json(
        { 
          success: false, 
          error: "Não foi possível acessar o site. Verifique se a URL está correta e acessível." 
        },
        { status: 200 }
      );
    }
  } catch {
    return NextResponse.json(
      { success: false, error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
