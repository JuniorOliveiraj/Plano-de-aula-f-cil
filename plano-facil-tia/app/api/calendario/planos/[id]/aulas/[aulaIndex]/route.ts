import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { validarFormatoData } from "@/lib/distribuidor"
import type { AulaItem } from "@/lib/distribuidor"

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string; aulaIndex: string }> }
) {
  const session = await auth()
  if (!session?.user) {
    return Response.json({ erro: "Não autorizado" }, { status: 401 })
  }

  const userId = (session.user as any).id as string
  const { id, aulaIndex: aulaIndexStr } = await params

  const plano = await prisma.planoCalendario.findUnique({ where: { id } })

  if (!plano) {
    return Response.json({ erro: "Plano não encontrado" }, { status: 404 })
  }

  if (plano.userId !== userId) {
    return Response.json({ erro: "Acesso negado" }, { status: 403 })
  }

  const aulas = plano.jsonData as unknown as AulaItem[]
  const aulaIndex = Number(aulaIndexStr)

  if (isNaN(aulaIndex) || aulaIndex < 0 || aulaIndex >= aulas.length) {
    return Response.json({ erro: "AULA_INDEX_INVALIDO" }, { status: 400 })
  }

  const body = await req.json()
  const { data, titulo } = body

  // Atualizar título se fornecido
  if (titulo !== undefined) {
    if (typeof titulo !== "string" || titulo.trim().length === 0) {
      return Response.json({ erro: "TITULO_INVALIDO" }, { status: 400 })
    }
    const aulasAtualizadas = aulas.map((a, idx) =>
      idx === aulaIndex ? { ...a, aula: titulo.trim() } : a
    )
    await prisma.planoCalendario.update({
      where: { id },
      data: { jsonData: aulasAtualizadas as any },
    })
    return Response.json({ sucesso: true, aulas: aulasAtualizadas }, { status: 200 })
  }

  if (!validarFormatoData(data)) {
    return Response.json({ erro: "DATA_INVALIDA" }, { status: 400 })
  }

  // Verificar conflito de data no mesmo plano
  const conflito = aulas.some((a, idx) => idx !== aulaIndex && a.data === data)
  if (conflito) {
    return Response.json(
      {
        erro: "CONFLITO_DATA",
        aviso: "Já existe uma aula nesta data para este plano",
      },
      { status: 409 }
    )
  }

  // Atualizar a data da aula
  const aulasAtualizadas = aulas.map((a, idx) =>
    idx === aulaIndex ? { ...a, data } : a
  )

  await prisma.planoCalendario.update({
    where: { id },
    data: { jsonData: aulasAtualizadas as any },
  })

  return Response.json({ sucesso: true, aulas: aulasAtualizadas }, { status: 200 })
}
