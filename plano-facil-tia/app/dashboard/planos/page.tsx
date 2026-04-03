import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import PlanosClient from "./PlanosClient"

export default async function PlanosPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const userId = (session.user as any).id as string

  const [planos, planosCalendario] = await Promise.all([
    prisma.plano.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: { id: true, serie: true, materia: true, tipo: true, createdAt: true },
    }),
    prisma.planoCalendario.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: { id: true, serie: true, materia: true, tipo: true, createdAt: true },
    }),
  ])

  const serializar = (p: { id: string; serie: string; materia: string; tipo: string; createdAt: Date }, origem: "plano" | "calendario") => ({
    id: p.id,
    serie: p.serie,
    materia: p.materia,
    tipo: p.tipo as "MENSAL" | "AULA_UNICA",
    origem,
    dataCriacao: p.createdAt.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" }),
  })

  const todos = [
    ...planos.map((p) => serializar(p, "plano")),
    ...planosCalendario.map((p) => serializar(p, "calendario")),
  ].sort((a, b) => a.dataCriacao < b.dataCriacao ? 1 : -1)

  return <PlanosClient planos={todos} />
}
