import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import DashboardShell from "@/components/shared/DashboardShell"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const user = {
    name:  session.user.name  ?? "Professora",
    image: session.user.image ?? null,
    plano: (session.user as Record<string, unknown>).plano as string ?? "TRIAL",
  }

  return (
    <DashboardShell
      userName={user.name}
      userImage={user.image}
      userPlan={user.plano}
    >
      {children}
    </DashboardShell>
  )
}
