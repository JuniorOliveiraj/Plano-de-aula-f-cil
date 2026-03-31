import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { PRECO_ASSINATURA } from "@/lib/asaas"
import AssinarForm from "./AssinarForm"

export default async function AssinarPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const userId = (session.user as any).id as string

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, plano: true, ativo: true },
  })

  if (user?.plano === "PROFESSORA" && user?.ativo === true) {
    redirect("/dashboard")
  }

  return <AssinarForm preco={PRECO_ASSINATURA} userName={user?.name || ""} />
}
