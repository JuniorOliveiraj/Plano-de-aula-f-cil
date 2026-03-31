import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { gerarDocx } from "@/lib/docx"
import { gerarPdf } from "@/lib/pdf"
import type { AulaItem } from "@/lib/distribuidor"
import type { PlanoGerado } from "@/lib/validations"

// GET /api/calendario/planos/[id]/download?formato=word|pdf&aulaIndex=N
// aulaIndex opcional — se omitido, baixa todas as aulas do plano
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user) {
    return Response.json({ erro: "Não autorizado" }, { status: 401 })
  }

  const userId = (session.user as any).id as string
  const { id } = await params
  const { searchParams } = new URL(req.url)
  const formato = searchParams.get("formato") ?? "word"
  const aulaIndexParam = searchParams.get("aulaIndex")

  const plano = await prisma.planoCalendario.findUnique({ where: { id } })
  if (!plano || plano.userId !== userId) {
    return Response.json({ erro: "Plano não encontrado" }, { status: 404 })
  }

  const todasAulas = plano.jsonData as unknown as AulaItem[]

  // Filtrar aula específica ou usar todas
  const aulas =
    aulaIndexParam !== null
      ? [todasAulas[Number(aulaIndexParam)]].filter(Boolean)
      : todasAulas

  if (aulas.length === 0) {
    return Response.json({ erro: "Aula não encontrada" }, { status: 404 })
  }

  // Montar estrutura compatível com gerarDocx/gerarPdf
  const planoGerado: PlanoGerado = {
    serie: plano.serie,
    materia: plano.materia,
    codigoBncc: undefined,
    aulas: aulas.map((a) => ({
      aula: a.aula,
      data: a.data,
      objetivo: a.objetivo,
      conteudo: a.conteudo,
      metodologia: a.metodologia,
      recursos: a.recursos,
      video_url: a.video_url,
      referencia_url: a.referencia_url,
    })),
  }

  const nomeSerie = plano.serie.replace(/\s/g, "_")
  const sufixo = aulaIndexParam !== null ? `_aula${Number(aulaIndexParam) + 1}` : ""

  if (formato === "pdf") {
    const buffer = await gerarPdf(planoGerado)
    return new Response(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="plano_${nomeSerie}_${plano.materia}${sufixo}.pdf"`,
      },
    })
  }

  const buffer = await gerarDocx(planoGerado)
  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename="plano_${nomeSerie}_${plano.materia}${sufixo}.docx"`,
    },
  })
}
