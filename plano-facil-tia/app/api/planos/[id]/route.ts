import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { gerarDocx } from "@/lib/docx"
import { PlanoSchema } from "@/lib/validations"

// GET /api/planos/[id] — baixa o Word do plano
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) {
    return Response.json({ erro: "Não autorizado" }, { status: 401 })
  }

  const userId  = (session.user as any).id as string
  const { id }  = await params

  const plano = await prisma.plano.findUnique({ where: { id } })
  if (!plano || plano.userId !== userId) {
    return Response.json({ erro: "Plano não encontrado" }, { status: 404 })
  }

  const planoJson = PlanoSchema.parse(plano.jsonData)
  const docxBuffer = await gerarDocx(planoJson)

  const filename = `plano_${plano.serie.replace(/\s/g, "_")}_${plano.materia}.docx`

  return new Response(docxBuffer, {
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
