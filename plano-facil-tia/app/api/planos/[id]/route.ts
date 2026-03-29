import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { gerarDocx } from "@/lib/docx"
import { gerarPdf } from "@/lib/pdf"
import { PlanoSchema } from "@/lib/validations"

// GET /api/planos/[id]?formato=word|pdf — baixa o plano no formato escolhido
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) {
    return Response.json({ erro: "Não autorizado" }, { status: 401 })
  }

  const userId = (session.user as any).id as string
  const { id } = await params
  const { searchParams } = new URL(req.url)
  const formato = searchParams.get("formato") ?? "word"

  const plano = await prisma.plano.findUnique({ where: { id } })
  if (!plano || plano.userId !== userId) {
    return Response.json({ erro: "Plano não encontrado" }, { status: 404 })
  }

  const planoJson = PlanoSchema.parse(plano.jsonData)
  const nomeSerie = plano.serie.replace(/\s/g, "_")

  if (formato === "pdf") {
    const pdfBuffer = await gerarPdf(planoJson)
    const filename = `plano_${nomeSerie}_${plano.materia}.pdf`
    return new Response(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type":        "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    })
  }

  // padrão: Word
  const docxBuffer = await gerarDocx(planoJson)
  const filename = `plano_${nomeSerie}_${plano.materia}.docx`
  return new Response(new Uint8Array(docxBuffer), {
    headers: {
      "Content-Type":        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  })
}

// DELETE /api/planos/[id] — exclui plano do usuário
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) {
    return Response.json({ erro: "Não autorizado" }, { status: 401 })
  }

  const userId = (session.user as any).id as string
  const { id } = await params

  const plano = await prisma.plano.findUnique({ where: { id } })
  if (!plano || plano.userId !== userId) {
    return Response.json({ erro: "Plano não encontrado" }, { status: 404 })
  }

  await prisma.plano.delete({ where: { id } })

  return Response.json({ sucesso: true })
}
