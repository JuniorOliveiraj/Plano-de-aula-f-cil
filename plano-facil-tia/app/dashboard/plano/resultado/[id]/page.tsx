import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect, notFound } from "next/navigation"
import { PlanoSchema } from "@/lib/validations"
import ResultadoClient from "./ResultadoClient"

export default async function ResultadoPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const userId = (session.user as any).id as string
  const { id } = await params

  const plano = await prisma.plano.findUnique({ where: { id } })
  if (!plano || plano.userId !== userId) notFound()

  const planoJson = PlanoSchema.parse(plano.jsonData)

  return (
    <ResultadoClient
      planoId={plano.id}
      serie={plano.serie}
      materia={plano.materia}
      tipo={plano.tipo as "MENSAL" | "AULA_UNICA"}
      aulas={planoJson.aulas}
      createdAt={plano.createdAt.toISOString()}
      codigoBncc={planoJson.codigoBncc}
    />
  )
}
