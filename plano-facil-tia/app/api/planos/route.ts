import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET /api/planos — lista planos do usuário logado
// Query params: serie, materia, limit (default 50)
export async function GET(req: Request) {
  const session = await auth()
  if (!session?.user) {
    return Response.json({ erro: "Não autorizado" }, { status: 401 })
  }

  const userId = (session.user as any).id as string
  const { searchParams } = new URL(req.url)
  const serie   = searchParams.get("serie")   ?? undefined
  const materia = searchParams.get("materia") ?? undefined
  const limit   = Math.min(Number(searchParams.get("limit") ?? "50"), 100)

  const planos = await prisma.plano.findMany({
    where: {
      userId,
      ...(serie   ? { serie }   : {}),
      ...(materia ? { materia } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      id:        true,
      serie:     true,
      materia:   true,
      tipo:      true,
      createdAt: true,
    },
  })

  return Response.json({ planos })
}
