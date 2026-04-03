import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { validarFormatoData } from "@/lib/distribuidor"
import { aulaToAulaItem } from "@/lib/aula-serializer"

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string; aulaId: string }> }
) {
  const session = await auth()
  if (!session?.user) {
    return Response.json({ erro: "Não autorizado" }, { status: 401 })
  }

  const userId = (session.user as any).id as string
  const { id: planoId, aulaId } = await params

  // Detect legacy numeric index vs cuid
  const isLegacyIndex = /^\d+$/.test(aulaId)

  if (isLegacyIndex) {
    // Legacy path: find aula by ordem within the plan
    const aulaIndex = Number(aulaId)

    const plano = await prisma.planoCalendario.findUnique({
      where: { id: planoId },
      include: { aulas: { orderBy: { ordem: "asc" } } },
    })

    if (!plano || plano.userId !== userId) {
      return Response.json({ erro: "Plano não encontrado" }, { status: 404 })
    }

    const aulaRecord = plano.aulas[aulaIndex]
    if (!aulaRecord) {
      return Response.json({ erro: "AULA_INDEX_INVALIDO" }, { status: 400 })
    }

    const body = await req.json()
    const { titulo, data, forcar } = body

    const updateData: { titulo?: string; data?: string } = {}

    if (titulo !== undefined) {
      updateData.titulo = titulo
    }

    if (data !== undefined) {
      if (!validarFormatoData(data)) {
        return Response.json({ erro: "DATA_INVALIDA" }, { status: 400 })
      }
      const conflito = await prisma.aula.findFirst({
        where: { planoCalendarioId: planoId, data, id: { not: aulaRecord.id } },
      })
      if (conflito && forcar !== true) {
        return Response.json({ erro: "CONFLITO_DATA" }, { status: 409 })
      }
      updateData.data = data
    }

    await prisma.aula.update({ where: { id: aulaRecord.id }, data: updateData })

    const aulasAtualizadas = await prisma.aula.findMany({
      where: { planoCalendarioId: planoId },
      orderBy: { ordem: "asc" },
    })

    return Response.json({ sucesso: true, aulas: aulasAtualizadas.map(aulaToAulaItem) }, { status: 200 })
  }

  // New path: find aula by cuid
  const aula = await prisma.aula.findUnique({
    where: { id: aulaId },
    include: { planoCalendario: true },
  })

  if (!aula || aula.planoCalendario.userId !== userId) {
    return Response.json({ erro: "AULA_NAO_ENCONTRADA" }, { status: 404 })
  }

  const planoCalendarioId = aula.planoCalendarioId

  const body = await req.json()
  const { titulo, data, forcar } = body

  const updateData: { titulo?: string; data?: string } = {}

  if (titulo !== undefined) {
    updateData.titulo = titulo
  }

  if (data !== undefined) {
    if (!validarFormatoData(data)) {
      return Response.json({ erro: "DATA_INVALIDA" }, { status: 400 })
    }

    const conflito = await prisma.aula.findFirst({
      where: { planoCalendarioId, data, id: { not: aulaId } },
    })

    if (conflito && forcar !== true) {
      return Response.json({ erro: "CONFLITO_DATA" }, { status: 409 })
    }

    updateData.data = data
  }

  await prisma.aula.update({ where: { id: aulaId }, data: updateData })

  const aulas = await prisma.aula.findMany({
    where: { planoCalendarioId },
    orderBy: { ordem: "asc" },
  })

  return Response.json({ sucesso: true, aulas: aulas.map(aulaToAulaItem) }, { status: 200 })
}
