import { prisma } from "@/lib/prisma"
import crypto from "crypto"

// Valida assinatura HMAC do Pagar.me
function validarAssinatura(payload: string, assinatura: string): boolean {
  const secret = process.env.PAGARME_WEBHOOK_SECRET
  if (!secret) return false
  const hmac = crypto.createHmac("sha256", secret).update(payload).digest("hex")
  return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(assinatura))
}

export async function POST(req: Request) {
  const rawBody    = await req.text()
  const assinatura = req.headers.get("x-hub-signature") ?? ""

  if (!validarAssinatura(rawBody, assinatura)) {
    return Response.json({ erro: "Assinatura inválida" }, { status: 401 })
  }

  const evento = JSON.parse(rawBody)
  const tipo   = evento?.type as string
  const email  = evento?.data?.customer?.email as string | undefined

  if (!email) {
    return Response.json({ ok: true }) // ignora eventos sem e-mail
  }

  switch (tipo) {
    // Assinatura criada/ativada → ativa plano PROFESSORA
    case "subscription.created":
    case "subscription.activated":
      await prisma.user.updateMany({
        where: { email },
        data:  { plano: "PROFESSORA", planosNoMes: 0 },
      })
      break

    // Renovação mensal → reseta contador
    case "subscription.renewed":
    case "charge.paid":
      await prisma.user.updateMany({
        where: { email },
        data:  { planosNoMes: 0 },
      })
      break

    // Cancelamento → volta para TRIAL bloqueado (trial já expirado)
    case "subscription.canceled":
    case "subscription.deactivated":
      await prisma.user.updateMany({
        where: { email },
        data:  { plano: "TRIAL" },
      })
      break

    default:
      // Evento não tratado — retorna 200 para o Pagar.me não retentar
      break
  }

  return Response.json({ ok: true })
}
