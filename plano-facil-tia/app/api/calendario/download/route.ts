import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { gerarDocx } from "@/lib/docx"
import { gerarPdf } from "@/lib/pdf"
import { aulaToAulaItem } from "@/lib/aula-serializer"
import type { PlanoGerado } from "@/lib/validations"

// GET /api/calendario/download?formato=word|pdf&datas=DD/MM/AAAA,DD/MM/AAAA,...
// Baixa todas as aulas do período informado, agrupadas por plano
export async function GET(req: Request) {
  const session = await auth()
  if (!session?.user) {
    return Response.json({ erro: "Não autorizado" }, { status: 401 })
  }

  const userId = (session.user as any).id as string
  const { searchParams } = new URL(req.url)
  const formato = searchParams.get("formato") ?? "word"
  const datasParam = searchParams.get("datas") ?? ""
  const titulo = searchParams.get("titulo") ?? "Período"

  const datasSet = new Set(datasParam.split(",").filter(Boolean))
  if (datasSet.size === 0) {
    return Response.json({ erro: "Nenhuma data informada" }, { status: 400 })
  }

  // Buscar planos do usuário que tenham aulas nas datas solicitadas via join
  const planosCalendario = await prisma.planoCalendario.findMany({
    where: {
      userId,
      aulas: { some: { data: { in: [...datasSet] } } },
    },
    include: {
      aulas: {
        where: { data: { in: [...datasSet] } },
        orderBy: { ordem: "asc" },
      },
    },
  })

  // Coletar aulas do período, agrupadas por plano
  const aulasPorPlano: { serie: string; materia: string; aulas: ReturnType<typeof aulaToAulaItem>[] }[] = []

  for (const plano of planosCalendario) {
    const aulasPeriodo = plano.aulas.map(aulaToAulaItem)
    if (aulasPeriodo.length > 0) {
      aulasPorPlano.push({ serie: plano.serie, materia: plano.materia, aulas: aulasPeriodo })
    }
  }

  if (aulasPorPlano.length === 0) {
    return Response.json({ erro: "Nenhuma aula encontrada para este período" }, { status: 404 })
  }

  // Montar um único PlanoGerado com todas as aulas do período
  // Ordenar por data antes de gerar
  const todasAulas = aulasPorPlano.flatMap(({ serie, materia, aulas }) =>
    aulas.map((a) => ({ ...a, _serie: serie, _materia: materia }))
  )
  todasAulas.sort((a, b) => {
    const [da, ma, aa] = a.data.split("/").map(Number)
    const [db, mb, ab] = b.data.split("/").map(Number)
    return new Date(aa, ma - 1, da).getTime() - new Date(ab, mb - 1, db).getTime()
  })

  // Usar série/matéria do primeiro plano como cabeçalho; conteúdo inclui todos
  const planoGerado: PlanoGerado = {
    serie: aulasPorPlano.map((p) => p.serie).join(", "),
    materia: aulasPorPlano.map((p) => p.materia).join(", "),
    aulas: todasAulas.map((a) => ({
      aula: a.aula,
      data: a.data,
      objetivo: a.objetivo,
      conteudo: a.conteudo,
      metodologia: a.metodologia,
      recursos: a.recursos,
      codigoBncc: a.codigoBncc ?? null,
      video_url: a.video_url,
      referencia_url: a.referencia_url,
    })),
  }

  const nomeArquivo = titulo.replace(/\s+/g, "_").replace(/\//g, "-")

  if (formato === "pdf") {
    const buffer = await gerarPdf(planoGerado)
    return new Response(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="calendario_${nomeArquivo}.pdf"`,
      },
    })
  }

  const buffer = await gerarDocx(planoGerado)
  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename="calendario_${nomeArquivo}.docx"`,
    },
  })
}
