import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Sidebar from "@/components/shared/Sidebar"
import TopBar from "@/components/shared/TopBar"

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
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: "#fff8f5" }}>
      {/* Sidebar fixa */}
      <Sidebar userName={user.name} userPlan={user.plano} />

      {/* Área principal */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar userName={user.name} userImage={user.image} />

        <main
          className="flex-1 overflow-y-auto"
          style={{ backgroundColor: "#fff8f5", padding: "2rem 2.5rem" }}
        >
          {children}
        </main>
      </div>
    </div>
  )
}
