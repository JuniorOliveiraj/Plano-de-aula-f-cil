import Link from "next/link"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import StatCard from "@/components/shared/StatCard"
import PlanCard from "@/components/shared/PlanCard"

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const userId = (session.user as any).id as string

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { plano: true, planosNoMes: true, trialExpiraEm: true, planoResetEm: true },
  })

  const planosRecentes = await prisma.plano.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 3,
    select: { id: true, serie: true, materia: true, tipo: true, createdAt: true },
  })

  // Calcula stats
  const plano = user?.plano ?? "TRIAL"
  const usados = user?.planosNoMes ?? 0
  const limite = plano === "TRIAL" ? 3 : plano === "PROFESSORA" ? 15 : 999
  const restantes = Math.max(0, limite - usados)

  const hoje = new Date()
  const diasTrial = user?.trialExpiraEm
    ? Math.max(0, Math.ceil((user.trialExpiraEm.getTime() - hoje.getTime()) / 86400000))
    : 0

  const renovacaoEm = user?.planoResetEm
    ? user.planoResetEm.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })
    : "—"

  const statSubLabel =
    plano === "TRIAL"
      ? `${diasTrial} dia${diasTrial !== 1 ? "s" : ""} restante${diasTrial !== 1 ? "s" : ""} no trial`
      : `Renova em ${renovacaoEm}`

  return (
    <div className="space-y-8 max-w-7xl mx-auto">

      <div>
        <h1 className="text-[28px] font-700 text-[#2f1402] leading-tight">Seu painel</h1>
        <p className="text-[14px] text-[#a87b5e] mt-1">Tudo o que você precisa para preparar suas aulas.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard
          icon="📊"
          label={`Planos usados — ${plano === "TRIAL" ? "Trial" : "este mês"}`}
          value={`${usados}/${limite === 999 ? "∞" : limite}`}
          sublabel={`${restantes} restante${restantes !== 1 ? "s" : ""}`}
          variant={restantes <= 1 ? "warning" : "default"}
        />
        {plano === "TRIAL" ? (
          <StatCard
            icon="⏳"
            label="Dias no trial gratuito"
            value={`${diasTrial} dias`}
            sublabel="Sem precisar de cartão"
            variant={diasTrial <= 3 ? "warning" : "default"}
          />
        ) : (
          <StatCard
            icon="📅"
            label="Próxima renovação"
            value={renovacaoEm}
            sublabel="Contador de planos reseta"
            variant="default"
          />
        )}
        <StatCard
          icon="🎁"
          label="Todas as funcionalidades"
          value="Liberadas"
          sublabel="Plano mensal + aula única"
          variant="success"
        />
      </div>

      {/* CTA Principal */}
      <div
        className="relative flex flex-col sm:flex-row items-center justify-between gap-6 p-8 rounded-[24px] overflow-hidden"
        style={{ background: "linear-gradient(135deg,#904d00 0%,#ff8c00 100%)" }}
      >
        <div className="absolute -top-10 -right-10 rounded-full opacity-10" style={{ width: 200, height: 200, backgroundColor: "#ffffff" }} aria-hidden />
        <div className="absolute -bottom-16 -left-8 rounded-full opacity-10" style={{ width: 180, height: 180, backgroundColor: "#ffffff" }} aria-hidden />
        <div className="relative z-10">
          <p className="text-white text-[22px] font-700 mb-1">Criar Novo Plano</p>
          <p className="text-[#ffe4cc] text-[14px]">Escolha a série, envie o PDF do livro e receba o plano em Word. ✨</p>
        </div>
        <Link
          href="/dashboard/plano/novo"
          className="relative z-10 flex items-center gap-2 h-12 px-7 rounded-[14px] text-[15px] font-700 shrink-0 transition-opacity hover:opacity-90 no-underline"
          style={{ backgroundColor: "#ffffff", color: "#904d00" }}
        >
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 4v16m8-8H4" />
          </svg>
          Criar agora
        </Link>
      </div>

      {/* Planos Recentes */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[18px] font-700 text-[#2f1402]">Planos Recentes</h2>
          <Link href="/dashboard/planos" className="text-[13px] font-600 no-underline flex items-center gap-1 transition-opacity hover:opacity-70" style={{ color: "#c2571a" }}>
            Ver todos
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </Link>
        </div>

        {planosRecentes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 rounded-[20px] text-center" style={{ backgroundColor: "#fff8f5" }}>
            <span className="text-4xl mb-3">📭</span>
            <p className="text-[15px] font-500 text-[#7c4a2d]">Nenhum plano ainda</p>
            <p className="text-[13px] text-[#a87b5e] mt-1">Crie seu primeiro plano clicando em "Criar agora".</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {planosRecentes.map((p) => (
              <PlanCard
                key={p.id}
                planoId={p.id}
                materia={p.materia}
                serie={p.serie}
                tipo={p.tipo as "MENSAL" | "AULA_UNICA"}
                dataCriacao={p.createdAt.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}
              />
            ))}
          </div>
        )}
      </section>

      {/* Banner upgrade — só para trial */}
      {plano === "TRIAL" && (
        <div
          className="flex items-center justify-between p-5 rounded-[20px]"
          style={{ backgroundColor: "#fff1ea", border: "1px dashed #f0ddd0" }}
        >
          <div>
            <p className="text-[15px] font-600 text-[#7c4a2d]">Gostando do Plano Fácil Tia? 💛</p>
            <p className="text-[13px] text-[#a87b5e] mt-0.5">Assine o plano Professora por R$19,90/mês e gere até 15 planos por mês.</p>
          </div>
          <Link
            href="/assinar"
            className="flex items-center gap-2 h-10 px-5 rounded-[12px] text-[13px] font-700 shrink-0 no-underline transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#904d00", color: "#ffffff" }}
          >
            Assinar agora
          </Link>
        </div>
      )}
    </div>
  )
}
