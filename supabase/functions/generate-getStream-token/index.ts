import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { create, getNumericDate, Header } from "https://deno.land/x/djwt@v2.8/mod.ts"

serve(async (req: Request) => {
  const { userId } = await req.json()
  if (!userId) {
    return new Response(
      JSON.stringify({ error: "userId ist erforderlich" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    )
  }

  const apiKey = Deno.env.get("GETSTREAM_API_KEY")
  const apiSecret = Deno.env.get("GETSTREAM_API_SECRET")

  if (!apiKey || !apiSecret) {
    return new Response(
      JSON.stringify({ error: "API-Konfiguration fehlt" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }

  const payload = {
    user_id: userId,
    exp: getNumericDate(60 * 60), // Token läuft nach 1 Stunde ab
    iat: getNumericDate(0),
  }

  const header: Header = {
    alg: "HS256",
    typ: "JWT",
    kid: apiKey,
  }

  // Konvertiere den API-Secret-String in einen CryptoKey
  const encoder = new TextEncoder()
  const keyData = encoder.encode(apiSecret)
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  )

  const token = await create(header, payload, cryptoKey)

  return new Response(
    JSON.stringify({ token, apiKey }),
    { headers: { "Content-Type": "application/json" } }
  )
})