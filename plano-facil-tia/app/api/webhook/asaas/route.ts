import { NextRequest, NextResponse } from "next/server"
import { Prisma } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import { AssinaturaService } from "@/lib/assinatura"

export async function POST(req: NextRequest) {
  // 1. Validate asaas-access-token header
  const token = req.headers.get("asaas-access-token")
  const expectedToken = process.env.ASAAS_WEBHOOK_TOKEN

  if (!token || !expectedToken || token !== expectedToken) {
    return NextResponse.json({ erro: "Não autorizado" }, { status: 401 })
  }

  // 2. Parse JSON payload
  let payload: Record<string, unknown>
  try {
    payload = await req.json()
  } catch {
    console.error("[webhook/asaas] Payload malformado")
    return NextResponse.json({ erro: "Payload inválido" }, { status: 400 })
  }

  // 3. Extract event field
  const evento = payload.event as string | undefined
  if (!evento) {
    console.error("[webhook/asaas] Campo 'event' ausente no payload")
    return NextResponse.json({ erro: "Campo 'event' ausente" }, { status: 400 })
  }

  // 4. Persist WebhookLog BEFORE processing
  let webhookLog: { id: string }
  try {
    webhookLog = await prisma.webhookLog.create({
      data: {
        evento,
        payload: payload as Prisma.InputJsonValue,
        processado: false,
      },
      select: { id: true },
    })
  } catch (err) {
    console.error("[webhook/asaas] Falha ao persistir WebhookLog:", err)
    return NextResponse.json({ erro: "Erro interno" }, { status: 500 })
  }

  // 5. Return HTTP 200 immediately, then process asynchronously
  // Process in background (fire-and-forget) — update log after
  const service = new AssinaturaService()

  service
    .processarWebhook(evento, payload)
    .then(() => {
      return prisma.webhookLog.update({
        where: { id: webhookLog.id },
        data: { processado: true },
      })
    })
    .catch(async (err: unknown) => {
      const mensagem = err instanceof Error ? err.message : String(err)
      console.error("[webhook/asaas] Erro ao processar webhook:", mensagem)
      await prisma.webhookLog.update({
        where: { id: webhookLog.id },
        data: { erro: mensagem },
      }).catch(() => {/* ignore update failure */})
    })

  return NextResponse.json({ recebido: true }, { status: 200 })
}
