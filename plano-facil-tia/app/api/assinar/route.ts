import { auth } from "@/lib/auth"
import { AssinaturaService } from "@/lib/assinatura"

// In-memory rate limiter (no Redis available)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT_MAX = 5
const RATE_LIMIT_WINDOW_MS = 60 * 1000 // 60 seconds

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)

  if (!entry || now > entry.resetAt) {
    // New window
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return true
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return false
  }

  entry.count++
  return true
}

// Clean up expired entries periodically
function cleanupRateLimitMap() {
  const now = Date.now()
  for (const [key, entry] of rateLimitMap.entries()) {
    if (now > entry.resetAt) {
      rateLimitMap.delete(key)
    }
  }
}

export async function POST(req: Request) {
  // 1. Authenticate session
  const session = await auth()
  if (!session?.user) {
    return Response.json({ erro: "Não autorizado" }, { status: 401 })
  }

  const userId = (session.user as any).id as string

  // 2. Rate limiting by IP
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"

  cleanupRateLimitMap()

  if (!checkRateLimit(ip)) {
    return Response.json(
      { erro: "Muitas requisições. Tente novamente em alguns instantes." },
      { status: 429 }
    )
  }

  // 3. Extract ONLY allowed fields — discard everything else
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return Response.json({ erro: "Body inválido" }, { status: 400 })
  }

  const { cpfCnpj, billingType, cardToken } = body as {
    cpfCnpj?: string
    billingType?: string
    cardToken?: string
  }

  if (!cpfCnpj || !billingType) {
    return Response.json({ erro: "Dados obrigatórios ausentes: cpfCnpj, billingType" }, { status: 400 })
  }

  if (billingType !== "CREDIT_CARD" && billingType !== "PIX") {
    return Response.json({ erro: "billingType inválido. Use CREDIT_CARD ou PIX" }, { status: 400 })
  }

  // 4. Call AssinaturaService with server-side constants only
  const service = new AssinaturaService()
  const result = await service.iniciarAssinatura({
    userId,
    cpfCnpj,
    billingType,
    cardToken,
  })

  // 5. Return safe response — never include asaasCustomerId, asaasSubscriptionId, ASAAS_API_KEY
  const response: {
    sucesso: boolean
    metodoPagamento: "CREDIT_CARD" | "PIX"
    pixQrCodeUrl?: string
    pixCopiaECola?: string
    erro?: string
  } = {
    sucesso: result.sucesso,
    metodoPagamento: result.metodoPagamento,
  }

  if (result.pixQrCodeUrl) response.pixQrCodeUrl = result.pixQrCodeUrl
  if (result.pixCopiaECola) response.pixCopiaECola = result.pixCopiaECola
  if (result.erro) response.erro = result.erro

  return Response.json(response, { status: result.sucesso ? 200 : 500 })
}
