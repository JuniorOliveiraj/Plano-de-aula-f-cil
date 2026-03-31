import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const maxDuration = 60

function proximoMesReset(dataAtual: Date): Date {
  const d = new Date(dataAtual)
  d.setMonth(d.getMonth() + 1)
  d.setDate(1)
  d.setHours(0, 0, 0, 0)
  return d
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization")
  const cronSecret = process.env.CRON_SECRET

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const now = new Date()

  // Buscar usuários distintos com UsageLog cujo planoResetEm <= now
  const usuarios = await prisma.user.findMany({
    where: {
      planoResetEm: { lte: now },
      usageLogs: { some: {} },
    },
    select: { id: true, planoResetEm: true },
  })

  let processados = 0
  let erros = 0

  for (const usuario of usuarios) {
    try {
      await prisma.$transaction([
        // Zerar totalMes e totalDia, preservar totalGeral
        prisma.usageLog.updateMany({
          where: { userId: usuario.id },
          data: { totalMes: 0, totalDia: 0 },
        }),
        // Avançar planoResetEm para o próximo mês
        prisma.user.update({
          where: { id: usuario.id },
          data: { planoResetEm: proximoMesReset(usuario.planoResetEm) },
        }),
      ])
      processados++
    } catch (err) {
      console.error(`Erro ao resetar usuário ${usuario.id}:`, err)
      erros++
    }
  }

  return NextResponse.json({ processados, erros })
}
