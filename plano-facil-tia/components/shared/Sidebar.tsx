"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

interface SidebarProps {
  userName: string
  userPlan: string
}

const navItems = [
  {
    href: "/dashboard",
    label: "Início",
    exact: true,
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    href: "/dashboard/plano/novo",
    label: "Novo Plano",
    exact: false,
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v8M8 12h8" />
      </svg>
    ),
  },
  {
    href: "/dashboard/planos",
    label: "Meus Planos",
    exact: false,
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    href: "/ajuda",
    label: "Ajuda",
    exact: false,
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01" />
      </svg>
    ),
  },
]

const planConfig: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  TRIAL:      { label: "Trial gratuito",   color: "#c2571a", bg: "#fff1ea", dot: "#ff8c00" },
  PROFESSORA: { label: "Plano Professora", color: "#2e6b35", bg: "#edf7ee", dot: "#4caf50" },
  ESCOLA:     { label: "Plano Escola",     color: "#1a4f8a", bg: "#e8f1fb", dot: "#2196f3" },
}

export default function Sidebar({ userName, userPlan }: SidebarProps) {
  const pathname = usePathname()
  const plan = planConfig[userPlan] ?? planConfig.TRIAL
  const firstName = userName.split(" ")[0]

  function isActive(href: string, exact: boolean) {
    return exact ? pathname === href : pathname.startsWith(href)
  }

  return (
    <aside className="flex flex-col h-screen bg-[#ffffff] border-r border-[#fff1ea]" style={{ width: 240, minWidth: 240 }}>

      {/* ── Logo ───────────────────────────────── */}
      <div className="flex items-center gap-3 px-5 py-6">
        <div
          className="flex items-center justify-center rounded-[10px] text-lg shrink-0"
          style={{ width: 38, height: 38, background: "linear-gradient(135deg,#904d00,#ff8c00)" }}
        >
          📝
        </div>
        <div className="leading-tight">
          <span className="block text-[15px] font-700 text-[#7c4a2d]">Plano Fácil</span>
          <span className="block text-[11px] font-700 tracking-[0.07em] uppercase text-[#c2571a]">Tia</span>
        </div>
      </div>

      {/* ── Divider ────────────────────────────── */}
      <div className="mx-4 h-px bg-[#fff1ea]" />

      {/* ── Nav ────────────────────────────────── */}
      <nav className="flex flex-col gap-[2px] px-3 py-4 flex-1">
        {navItems.map((item) => {
          const active = isActive(item.href, item.exact)
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 h-12 px-3 rounded-[12px] text-[15px] font-500 no-underline transition-colors duration-150 group"
              style={{
                backgroundColor: active ? "#fff1ea" : "transparent",
                color:           active ? "#904d00" : "#564334",
                fontWeight:      active ? 600 : 500,
                borderLeft:      active ? "3px solid #ff8c00" : "3px solid transparent",
              }}
              onMouseEnter={(e) => { if (!active) e.currentTarget.style.backgroundColor = "#fffaf7" }}
              onMouseLeave={(e) => { if (!active) e.currentTarget.style.backgroundColor = "transparent" }}
            >
              <span style={{ color: active ? "#ff8c00" : "#a87b5e" }} className="shrink-0 transition-colors">
                {item.icon}
              </span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* ── Bottom: Plan badge ─────────────────── */}
      <div className="px-3 pb-5 space-y-2">
        <div className="rounded-[14px] p-3" style={{ backgroundColor: plan.bg }}>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: plan.dot }} />
            <span className="text-[11px] font-700 uppercase tracking-[0.06em]" style={{ color: plan.color }}>
              {plan.label}
            </span>
          </div>
          <p className="text-[13px] text-[#564334]">Olá, {firstName}! 👋</p>
        </div>
      </div>
    </aside>
  )
}
