import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { gerarPlanoComGemini } from "@/lib/gemini"
import { gerarDocx } from "@/lib/docx"

const LIMITE_PDF_BYTES = 20 * 1024 * 1024 // 20 MB
const LIMITE_DIARIO    = 5
const LIMITE_TRIAL     = 3
const LIMITE_MENSAL    = 15

export async function POST(req: Request) {
  // 1. Autenticação
  const session = await auth()
  if (!session?.user) {
    return Response.json({ erro: "Não autorizado" }, { status: 401 })
  }

  const userId = (session.user as any).id as string

  // 2. Busca usuária e verifica limites
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user || !user.ativo) {
    return Response.json({ erro: "Usuária não encontrada" }, { status: 404 })
  }

  // Trial expirado
  if (user.plano === "TRIAL" && user.trialExpiraEm < new Date()) {
    return Response.json({ erro: "TRIAL_EXPIRADO" }, { status: 403 })
  }

  // Limite trial (3 planos total)
  if (user.plano === "TRIAL" && user.planosNoMes >= LIMITE_TRIAL) {
    return Response.json({ erro: "LIMITE_TRIAL" }, { status: 403 })
  }

  // Limite mensal professora (15/mês)
  if (user.plano === "PROFESSORA" && user.planosNoMes >= LIMITE_MENSAL) {
    return Response.json({ erro: "LIMITE_MENSAL" }, { status: 403 })
  }

  // Limite diário (5/dia) — conta planos criados hoje
  const inicioDia = new Date()
  inicioDia.setHours(0, 0, 0, 0)
  const planosHoje = await prisma.plano.count({
    where: { userId, createdAt: { gte: inicioDia } },
  })
  if (planosHoje >= LIMITE_DIARIO) {
    const amanha = new Date(inicioDia)
    amanha.setDate(amanha.getDate() + 1)
    return Response.json(
      { erro: "LIMITE_DIARIO", liberaEm: amanha.toISOString() },
      { status: 429 }
    )
  }

  // 3. Lê FormData
  const formData = await req.formData()
  const pdfFile  = formData.get("pdf")    as File | null
  const serie    = formData.get("serie")  as string | null
  const materia  = formData.get("materia") as string | null
  const tipo     = formData.get("tipo")   as string | null
  const pagDe    = formData.get("pagDe")  as string | null
  const pagAte   = formData.get("pagAte") as string | null

  if (!pdfFile || !serie || !materia || !tipo) {
    return Response.json({ erro: "Dados incompletos" }, { status: 400 })
  }

  // 4. Valida PDF
  if (pdfFile.type !== "application/pdf") {
    return Response.json({ erro: "PDF_INVALIDO" }, { status: 400 })
  }
  if (pdfFile.size > LIMITE_PDF_BYTES) {
    return Response.json({ erro: "PDF_MUITO_GRANDE" }, { status: 400 })
  }

  // 5. Converte PDF para base64
  const buffer    = Buffer.from(await pdfFile.arrayBuffer())
  const pdfBase64 = buffer.toString("base64")

  // 6. Chama Gemini
  let planoJson
  try {
    planoJson = await gerarPlanoComGemini({
      pdfBase64,
      serie,
      materia,
      tipo: tipo as "MENSAL" | "AULA_UNICA",
      pagDe:  pagDe  ?? undefined,
      pagAte: pagAte ?? undefined,
    })
  } catch (err) {
    console.error("[gerar-plano] Erro Gemini:", err)
    return Response.json({ erro: "FALHA_GERACAO" }, { status: 500 })
  }

  // 7. Salva no banco e incrementa contador (transação)
  const [planoSalvo] = await prisma.$transaction([
    prisma.plano.create({
      data: {
        userId,
        serie,
        materia,
        tipo:     tipo as "MENSAL" | "AULA_UNICA",
        jsonData: planoJson as any,
      },
    }),
    prisma.user.update({
      where: { id: userId },
      data:  { planosNoMes: { increment: 1 } },
    }),
  ])

  // 8. Gera Word
  const docxBuffer = await gerarDocx(planoJson)
  const docxBase64 = docxBuffer.toString("base64")

  return Response.json({
    sucesso:  true,
    planoId:  planoSalvo.id,
    preview:  planoJson,
    docx:     docxBase64,
  })
}
