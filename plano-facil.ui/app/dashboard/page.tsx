import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import LogoutButton from "./logout-button"

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-[#fff8f5] px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-semibold text-[#2f1402] mb-2">
          Olá, {session.user.name} 💛
        </h1>

        <p className="text-sm text-[#564334] mb-8">
          Seu plano atual: <span className="text-[#7c4a2d] font-medium">{(session.user as any).plano}</span>
        </p>

        <div className="bg-white rounded-[2rem] p-8 shadow-[0_24px_48px_rgba(144,77,0,0.06)] mb-8">
          <h2 className="text-xl font-medium text-[#7c4a2d] mb-4">
            Começar
          </h2>

          <a
            href="/plano/novo"
            className="inline-flex items-center justify-center h-14 px-8 rounded-[14px] bg-gradient-to-br from-[#904d00] to-[#ff8c00] text-white font-semibold"
          >
            Criar Novo Plano
          </a>
        </div>

        <LogoutButton />
      </div>
    </div>
  )
}
