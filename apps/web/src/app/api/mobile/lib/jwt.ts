function base64url(source: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(source)))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
}

function base64urlDecode(source: string): ArrayBuffer {
  const padded = source.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - source.length % 4) % 4)
  return Uint8Array.from(atob(padded), (c) => c.charCodeAt(0)).buffer as ArrayBuffer
}

function textEncode(str: string): ArrayBuffer {
  return new TextEncoder().encode(str).buffer as ArrayBuffer
}

function textDecode(buf: ArrayBuffer): string {
  return new TextDecoder().decode(buf)
}

async function getSecretKey(): Promise<CryptoKey> {
  const secret = process.env.AUTH_SECRET
  if (!secret) throw new Error("AUTH_SECRET is not set")
  const keyData = await crypto.subtle.digest("SHA-256", textEncode(secret))
  return crypto.subtle.importKey("raw", keyData, { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"])
}

export interface JwtPayload {
  sub: string
  email: string
  name: string | null
  iat: number
  exp: number
}

export async function signToken(payload: { sub: string; email: string; name: string | null }): Promise<string> {
  const header = { alg: "HS256", typ: "JWT" }
  const now = Math.floor(Date.now() / 1000)
  const tokenPayload: JwtPayload = { ...payload, iat: now, exp: now + 7 * 24 * 3600 }

  const headerB64 = base64url(textEncode(JSON.stringify(header)))
  const payloadB64 = base64url(textEncode(JSON.stringify(tokenPayload)))
  const key = await getSecretKey()
  const signature = await crypto.subtle.sign("HMAC", key, textEncode(`${headerB64}.${payloadB64}`))
  return `${headerB64}.${payloadB64}.${base64url(signature)}`
}

export async function verifyToken(token: string): Promise<JwtPayload | null> {
  const parts = token.split(".")
  if (parts.length !== 3) return null

  const [headerB64, payloadB64, signatureB64] = parts
  const key = await getSecretKey()
  const valid = await crypto.subtle.verify(
    "HMAC",
    key,
    base64urlDecode(signatureB64),
    textEncode(`${headerB64}.${payloadB64}`),
  )
  if (!valid) return null

  const payload: JwtPayload = JSON.parse(textDecode(base64urlDecode(payloadB64)))
  if (payload.exp < Math.floor(Date.now() / 1000)) return null

  return payload
}
