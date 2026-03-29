import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import PlanosClient from "./PlanosClient"

export default async function PlanosPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const userId = (session.user as any).id as string

  const planos = await prisma.plano.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: { id: true, serie: true, materia: true, tipo: true, createdAt: true },
  })

  const serialized = planos.map((p) => ({
    ...p,
    tipo: p.tipo as "MENSAL" | "AULA_UNICA",
    dataCriacao: p.createdAt.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" }),
  }))

  return <PlanosClient planos={serialized} />
}
