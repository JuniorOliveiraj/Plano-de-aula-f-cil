import { prisma } from "@/lib/prisma"
import { PlanoTipo, FuncionalidadeTipo } from "@prisma/client"

export type LimiteResultado =
  | { permitido: true }
  | { permitido: false; erro: string; liberaEm?: string }

export type ConfigLimiteShape = {
  limiteMensal: number | null
  limiteDiario: number | null
  limiteTotal: number | null
}

// Defaults hardcoded usados quando não há registro no banco
const DEFAULTS: Record<PlanoTipo, ConfigLimiteShape> = {
  TRIAL:      { limiteTotal: 3,  limiteDiario: 5,  limiteMensal: null },
  PROFESSORA: { limiteMensal: 15, limiteDiario: 5, limiteTotal: null  },
  ESCOLA:     { limiteMensal: null, limiteDiario: null, limiteTotal: null },
}

/**
 * Retorna a configuração de limite para (planoTipo, funcionalidade).
 * Prioriza o banco; cai no default se não houver registro.
 * Nunca lança exceção.
 */
export async function buscarConfigLimite(
  planoTipo: PlanoTipo,
  funcionalidade: FuncionalidadeTipo
): Promise<ConfigLimiteShape> {
  try {
    const config = await prisma.configLimite.findUnique({
      where: { planoTipo_funcionalidade: { planoTipo, funcionalidade } },
    })

    if (config) {
      return {
        limiteMensal: config.limiteMensal,
        limiteDiario: config.limiteDiario,
        limiteTotal:  config.limiteTotal,
      }
    }
  } catch {
    // Falha silenciosa — retorna defaults
  }

  return DEFAULTS[planoTipo]
}

/**
 * Verifica todos os limites em ordem para o userId e funcionalidade.
 * Retorna { permitido: true } ou { permitido: false, erro, liberaEm? }.
 */
export async function verificarLimite(
  userId: string,
  funcionalidade: FuncionalidadeTipo
): Promise<LimiteResultado> {
  const agora = new Date()
  const mesAtual = agora.getMonth() + 1 // 1-12
  const anoAtual = agora.getFullYear()

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { escola: true },
  })

  if (!user) {
    throw new Error("Usuária não encontrada")
  }

  const usageLog = await prisma.usageLog.findUnique({
    where: {
      userId_funcionalidade_mes_ano: {
        userId,
        funcionalidade,
        mes: mesAtual,
        ano: anoAtual,
      },
    },
  })

  const totalGeral = usageLog?.totalGeral ?? 0
  const totalMes   = usageLog?.totalMes   ?? 0
  const totalDia   = usageLog?.totalDia   ?? 0

  const config = await buscarConfigLimite(user.plano, funcionalidade)

  // 0. Assinatura inativa
  if (!user.ativo) {
    return { permitido: false, erro: "ASSINATURA_INATIVA" }
  }

  // 1. TRIAL expirado
  if (user.plano === "TRIAL" && user.trialExpiraEm < agora) {
    return { permitido: false, erro: "TRIAL_EXPIRADO" }
  }

  // 2. Limite total TRIAL
  if (
    user.plano === "TRIAL" &&
    config.limiteTotal != null &&
    totalGeral >= config.limiteTotal
  ) {
    return { permitido: false, erro: "LIMITE_TRIAL" }
  }

  // 3. Limite mensal
  const limiteMensal =
    user.plano === "ESCOLA"
      ? (user.escola?.limitePlanos ?? null)
      : config.limiteMensal

  if (
    limiteMensal != null &&
    limiteMensal >= 0 &&
    totalMes >= limiteMensal
  ) {
    return { permitido: false, erro: "LIMITE_MENSAL" }
  }

  // 4. Limite diário
  if (config.limiteDiario != null && totalDia >= config.limiteDiario) {
    // Início do próximo dia em ISO 8601
    const proximoDia = new Date(agora)
    proximoDia.setDate(proximoDia.getDate() + 1)
    proximoDia.setHours(0, 0, 0, 0)

    return {
      permitido: false,
      erro: "LIMITE_DIARIO",
      liberaEm: proximoDia.toISOString(),
    }
  }

  return { permitido: true }
}

/**
 * Incrementa atomicamente os contadores de uso (totalMes, totalDia, totalGeral)
 * no UsageLog e mantém User.planosNoMes sincronizado para GERAR_PLANO.
 */
export async function incrementarUso(
  userId: string,
  funcionalidade: FuncionalidadeTipo
): Promise<void> {
  const agora = new Date()
  const mesAtual = agora.getMonth() + 1
  const anoAtual = agora.getFullYear()

  await prisma.$transaction(async (tx) => {
    const existing = await tx.usageLog.findUnique({
      where: {
        userId_funcionalidade_mes_ano: {
          userId,
          funcionalidade,
          mes: mesAtual,
          ano: anoAtual,
        },
      },
    })

    if (existing) {
      await tx.usageLog.update({
        where: { id: existing.id },
        data: {
          totalMes:   { increment: 1 },
          totalDia:   { increment: 1 },
          totalGeral: { increment: 1 },
          ultimoUso:  agora,
        },
      })
    } else {
      await tx.usageLog.create({
        data: {
          userId,
          funcionalidade,
          mes:        mesAtual,
          ano:        anoAtual,
          totalMes:   1,
          totalDia:   1,
          totalGeral: 1,
          ultimoUso:  agora,
        },
      })
    }

    // Manter planosNoMes sincronizado para compatibilidade
    if (funcionalidade === FuncionalidadeTipo.GERAR_PLANO) {
      await tx.user.update({
        where: { id: userId },
        data: { planosNoMes: { increment: 1 } },
      })
    }
  })
}
