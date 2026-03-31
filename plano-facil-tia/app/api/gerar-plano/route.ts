import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { gerarPlanoComGemini, gerarPlanoSemPdf } from "@/lib/gemini"
import { gerarDocx } from "@/lib/docx"
import { verificarLimite, incrementarUso } from "@/lib/limites"
import { FuncionalidadeTipo } from "@prisma/client"

// Aumenta o timeout máximo da rota para 3 minutos (PDFs grandes + planos mensais)
export const maxDuration = 180

const LIMITE_PDF_BYTES = 20 * 1024 * 1024 // 20 MB

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

  const resultado = await verificarLimite(userId, FuncionalidadeTipo.GERAR_PLANO)
  if (!resultado.permitido) {
    return Response.json(
      { erro: resultado.erro, liberaEm: resultado.liberaEm },
      { status: resultado.erro === "LIMITE_DIARIO" ? 429 : 403 }
    )
  }

  // 3. Detecta fluxo pelo Content-Type
  const contentType = req.headers.get("content-type") ?? ""
  const isSemPdf = contentType.includes("application/json")

  if (isSemPdf) {
    // ── Fluxo SEM_PDF ──────────────────────────────────────────────────────────

    // 3a. Lê body JSON
    const body = await req.json()
    const {
      serie,
      materia,
      tipo,
      tema,
      codigoBncc,
      descricaoBncc,
      duracao,
    } = body

    // 3b. Valida campos obrigatórios
    if (!serie || !materia || !tipo || !tema || !codigoBncc || !descricaoBncc) {
      return Response.json({ erro: "Dados incompletos" }, { status: 400 })
    }

    // 3c. duracao opcional, default 45
    const duracaoFinal: number = duracao ?? 45

    // 4a. Chama Gemini sem PDF
    let planoJson
    try {
      planoJson = await gerarPlanoSemPdf({
        serie,
        materia,
        tipo: tipo as "MENSAL" | "AULA_UNICA",
        tema,
        codigoBncc,
        descricaoBncc,
        duracao: duracaoFinal,
      })
    } catch (err) {
      console.error("[gerar-plano/sem-pdf] Erro Gemini:", err)
      return Response.json({ erro: "FALHA_GERACAO" }, { status: 500 })
    }

    // 5a. Salva no banco e incrementa contador (transação)
    // Injeta codigoBncc no jsonData
    const planoJsonFinal = { ...planoJson, codigoBncc }

    const [planoSalvo] = await prisma.$transaction([
      prisma.plano.create({
        data: {
          userId,
          serie,
          materia,
          tipo:     tipo as "MENSAL" | "AULA_UNICA",
          jsonData: planoJsonFinal as any,
        },
      }),
    ])

    await incrementarUso(userId, FuncionalidadeTipo.GERAR_PLANO)

    // 6a. Gera Word
    const docxBuffer = await gerarDocx(planoJsonFinal)
    const docxBase64 = docxBuffer.toString("base64")

    return Response.json({
      sucesso:  true,
      planoId:  planoSalvo.id,
      preview:  planoJsonFinal,
      docx:     docxBase64,
    })
  }

  // ── Fluxo COM_PDF (comportamento original, sem alterações) ──────────────────

  // 3. Lê FormData
  const formData = await req.formData()
  const pdfFile      = formData.get("pdf")          as File | null
  const serie        = formData.get("serie")        as string | null
  const materia      = formData.get("materia")      as string | null
  const tipo         = formData.get("tipo")         as string | null
  const pagDe        = formData.get("pagDe")        as string | null
  const pagAte       = formData.get("pagAte")       as string | null
  const codigoBncc   = formData.get("codigoBncc")   as string | null
  const descricaoBncc = formData.get("descricaoBncc") as string | null

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
  // Injeta codigoBncc no jsonData se foi fornecido
  const planoJsonFinal = codigoBncc
    ? { ...planoJson, codigoBncc }
    : planoJson

  const [planoSalvo] = await prisma.$transaction([
    prisma.plano.create({
      data: {
        userId,
        serie,
        materia,
        tipo:     tipo as "MENSAL" | "AULA_UNICA",
        jsonData: planoJsonFinal as any,
      },
    }),
  ])

  await incrementarUso(userId, FuncionalidadeTipo.GERAR_PLANO)

  // 8. Gera Word
  const docxBuffer = await gerarDocx(planoJsonFinal)
  const docxBase64 = docxBuffer.toString("base64")

  return Response.json({
    sucesso:  true,
    planoId:  planoSalvo.id,
    preview:  planoJsonFinal,
    docx:     docxBase64,
  })
}
