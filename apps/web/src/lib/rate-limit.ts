import { headers } from "next/headers"

const ipMap = new Map<string, { count: number; resetAt: number }>()

export interface RateLimitConfig {
  maxRequests: number
  windowMs: number
}

export async function checkRateLimit(
  key: string,
  config: RateLimitConfig = { maxRequests: 10, windowMs: 60_000 },
): Promise<{ limited: boolean; remaining: number }> {
  const now = Date.now()
  const entry = ipMap.get(key)

  if (!entry || now > entry.resetAt) {
    ipMap.set(key, { count: 1, resetAt: now + config.windowMs })
    return { limited: false, remaining: config.maxRequests - 1 }
  }

  if (entry.count >= config.maxRequests) {
    return { limited: true, remaining: 0 }
  }

  entry.count++
  return { limited: false, remaining: config.maxRequests - entry.count }
}

export function resetRateLimit(): void {
  ipMap.clear()
}

export async function getActionIp(): Promise<string> {
  try {
    const h = await headers()
    const forwarded = h.get("x-forwarded-for")
    if (forwarded) return forwarded.split(",")[0].trim()
    return h.get("x-real-ip") ?? "127.0.0.1"
  } catch {
    return "127.0.0.1"
  }
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")
  if (forwarded) return forwarded.split(",")[0].trim()
  return request.headers.get("x-real-ip") ?? "127.0.0.1"
}
