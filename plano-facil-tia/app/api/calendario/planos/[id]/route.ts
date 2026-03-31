import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user) {
    return Response.json({ erro: "Não autorizado" }, { status: 401 })
  }

  const userId = (session.user as any).id as string
  const { id } = await params

  const plano = await prisma.planoCalendario.findUnique({ where: { id } })

  if (!plano) {
    return Response.json({ erro: "Plano não encontrado" }, { status: 404 })
  }

  if (plano.userId !== userId) {
    return Response.json({ erro: "Acesso negado" }, { status: 403 })
  }

  await prisma.planoCalendario.delete({ where: { id } })

  return Response.json({ sucesso: true }, { status: 200 })
}
