import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { gerarPlanoSemPdf } from "@/lib/gemini"
import { distribuirAulas, validarFormatoData } from "@/lib/distribuidor"
import { verificarLimite, incrementarUso } from "@/lib/limites"
import { FuncionalidadeTipo } from "@prisma/client"
import type { AulaItem } from "@/lib/distribuidor"
import { aulaToAulaItem } from "@/lib/aula-serializer"

export const maxDuration = 300

export async function GET(req: Request) {
  const session = await auth()
  if (!session?.user) {
    return Response.json({ erro: "Não autorizado" }, { status: 401 })
  }

  const userId = (session.user as any).id as string
  const { searchParams } = new URL(req.url)
  const mes = searchParams.get("mes")
  const ano = searchParams.get("ano")

  const mesReferencia = mes && ano ? `${String(mes).padStart(2, "0")}/${ano}` : undefined

  // Buscar planos mensais e quinzenais pelo mesReferencia com aulas via join
  const planosMensais = mesReferencia
    ? await prisma.planoCalendario.findMany({
        where: { userId, mesReferencia, tipo: { in: ["MENSAL", "QUINZENAL"] } },
        include: { aulas: { orderBy: { ordem: "asc" } } },
      })
    : []

  // Buscar planos AULA_UNICA filtrando pelo campo data das aulas via SQL
  const planosAulaUnica =
    mes && ano
      ? await prisma.planoCalendario.findMany({
          where: {
            userId,
            tipo: "AULA_UNICA",
            aulas: { some: { data: { contains: `/${mes}/${ano}` } } },
          },
          include: { aulas: { orderBy: { ordem: "asc" } } },
        })
      : await prisma.planoCalendario.findMany({
          where: { userId, tipo: "AULA_UNICA" },
          include: { aulas: { orderBy: { ordem: "asc" } } },
        })

  const todos = [...planosMensais, ...planosAulaUnica]

  const planos = todos.map((p) => ({
    id: p.id,
    serie: p.serie,
    materia: p.materia,
    tipo: p.tipo,
    mesReferencia: p.mesReferencia,
    aulas: p.aulas.map(aulaToAulaItem),
  }))

  return Response.json({ planos })
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user) {
    return Response.json({ erro: "Não autorizado" }, { status: 401 })
  }

  const userId = (session.user as any).id as string

  // Verificar limite de uso
  const limite = await verificarLimite(userId, FuncionalidadeTipo.GERAR_PLANO)
  if (!limite.permitido) {
    const status = limite.erro === "LIMITE_DIARIO" ? 429 : 403
    return Response.json(
      { erro: limite.erro, liberaEm: (limite as any).liberaEm },
      { status }
    )
  }

  const body = await req.json()
  const {
    serie,
    materia,
    tipo,
    tema,
    codigoBncc,
    descricaoBncc,
    codigosBncc,
    descricoesBncc,
    duracao,
    mesReferencia,
    dataAula,
    bnccHabilidadeId,
  } = body

  // Validar campos obrigatórios
  if (!serie || !materia || !tipo || !tema || !codigoBncc || !descricaoBncc) {
    return Response.json({ erro: "Dados incompletos" }, { status: 400 })
  }

  if (tipo === "MENSAL" && !mesReferencia) {
    return Response.json({ erro: "MES_REFERENCIA_OBRIGATORIO" }, { status: 400 })
  }

  if (tipo === "QUINZENAL" && !mesReferencia) {
    return Response.json({ erro: "MES_REFERENCIA_OBRIGATORIO" }, { status: 400 })
  }

  if (tipo === "AULA_UNICA" && !dataAula) {
    return Response.json({ erro: "DATA_AULA_OBRIGATORIA" }, { status: 400 })
  }

  // Validar data de aula única não é passada
  if (tipo === "AULA_UNICA" && dataAula) {
    if (!validarFormatoData(dataAula)) {
      return Response.json({ erro: "DATA_INVALIDA" }, { status: 400 })
    }
    const [dia, mes, ano] = dataAula.split("/").map(Number)
    const dataInformada = new Date(ano, mes - 1, dia)
    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)
    if (dataInformada < hoje) {
      return Response.json(
        {
          erro: "DATA_PASSADA",
          mensagem: "A data da aula não pode ser anterior à data de hoje",
        },
        { status: 400 }
      )
    }
  }

  const duracaoFinal: number = duracao ?? 45

  // Gerar plano via Gemini
  let planoJson
  try {
    planoJson = await gerarPlanoSemPdf({
      serie,
      materia,
      tipo: tipo as "MENSAL" | "QUINZENAL" | "AULA_UNICA",
      tema,
      codigoBncc,
      descricaoBncc,
      duracao: duracaoFinal,
      codigosBncc:    Array.isArray(codigosBncc)    ? codigosBncc    : undefined,
      descricoesBncc: Array.isArray(descricoesBncc) ? descricoesBncc : undefined,
    })
  } catch (err) {
    console.error("[calendario/planos] Erro Gemini:", err)
    const msg = String((err as Error)?.message ?? "")
    if (msg.includes("quota") || msg.includes("429")) {
      return Response.json({ erro: "QUOTA_EXCEDIDA" }, { status: 429 })
    }
    return Response.json({ erro: "FALHA_GERACAO" }, { status: 500 })
  }

  let aulas: AulaItem[] = planoJson.aulas as AulaItem[]

  // Distribuir datas conforme o tipo
  if (tipo === "MENSAL" || tipo === "QUINZENAL") {
    const [mesParte, anoParte] = mesReferencia.split("/").map(Number)
    aulas = distribuirAulas(aulas, { mes: mesParte, ano: anoParte })
  } else if (tipo === "AULA_UNICA") {
    aulas = aulas.map((a, idx) => (idx === 0 ? { ...a, data: dataAula } : a))
  }

  // Normalizar mesReferencia para MM/AAAA (com zero à esquerda)
  const mesReferenciaFinal = (tipo === "MENSAL" || tipo === "QUINZENAL") && mesReferencia
    ? (() => {
        const [mp, ap] = mesReferencia.split("/")
        return `${String(Number(mp)).padStart(2, "0")}/${ap}`
      })()
    : null

  // Salvar no banco em transação única (PlanoCalendario + Aula[])
  let planoSalvo: { id: string }
  try {
    planoSalvo = await prisma.$transaction(async (tx) => {
      const plano = await tx.planoCalendario.create({
        data: {
          userId,
          serie,
          materia,
          tipo: tipo as "MENSAL" | "QUINZENAL" | "AULA_UNICA",
          mesReferencia: mesReferenciaFinal,
          bnccHabilidadeId: bnccHabilidadeId ?? null,
        },
      })

      await tx.aula.createMany({
        data: aulas.map((aula, index) => ({
          planoCalendarioId: plano.id,
          titulo: aula.aula,
          data: aula.data,
          objetivo: aula.objetivo,
          conteudo: aula.conteudo,
          metodologia: aula.metodologia,
          recursos: aula.recursos,
          codigoBncc: aula.codigoBncc ?? null,
          video_url: aula.video_url ?? null,
          referencia_url: aula.referencia_url ?? null,
          ordem: index,
        })),
      })

      return plano
    })
  } catch (err) {
    console.error("[calendario/planos] Erro ao salvar plano/aulas:", err)
    return Response.json({ erro: "FALHA_GERACAO" }, { status: 500 })
  }

  await incrementarUso(userId, FuncionalidadeTipo.GERAR_PLANO)

  return Response.json(
    { sucesso: true, planoId: planoSalvo.id, aulas },
    { status: 201 }
  )
}
