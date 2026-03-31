"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

interface SidebarProps {
  userName: string
  userPlan: string
  isOpen?: boolean
  onClose?: () => void
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
    href: "/dashboard/calendario",
    label: "Calendário",
    exact: false,
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </svg>
    ),
  },
  {
    href: "/dashboard/ajuda",
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

export default function Sidebar({ userName, userPlan, isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname()
  const firstName = userName.split(" ")[0]

  // Planconfig usando variáveis CSS — muda automaticamente com o tema
  const planLabel: Record<string, string> = {
    TRIAL: "Trial gratuito",
    PROFESSORA: "Plano Professora",
    ESCOLA: "Plano Escola",
  }
  const plan = planLabel[userPlan] ?? planLabel.TRIAL
  const planVarColor = userPlan === "PROFESSORA"
    ? "var(--ds-plan-pro-color)"
    : userPlan === "ESCOLA"
      ? "var(--ds-plan-escola-color)"
      : "var(--ds-plan-trial-color)"
  const planVarBg = userPlan === "PROFESSORA"
    ? "var(--ds-plan-pro-bg)"
    : userPlan === "ESCOLA"
      ? "var(--ds-plan-escola-bg)"
      : "var(--ds-plan-trial-bg)"
  const planDot = userPlan === "PROFESSORA"
    ? "var(--ds-ink-success)"
    : userPlan === "ESCOLA"
      ? "var(--ds-plan-escola-color)"
      : "var(--ds-primary-bright)"

  function isActive(href: string, exact: boolean) {
    return exact ? pathname === href : pathname.startsWith(href)
  }

  return (
    <aside
      className={`flex flex-col h-screen fixed lg:relative z-40 transition-transform duration-300 lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      style={{
        width: 240,
        minWidth: 240,
        backgroundColor: "var(--ds-surface-card)",
        borderRight: "1px solid var(--ds-surface-low)",
      }}
    >
      {/* ── Botão fechar (só no mobile) ─────────────── */}
      <button
        className="lg:hidden absolute top-4 right-4 flex items-center justify-center w-8 h-8 rounded-full transition-colors"
        style={{ backgroundColor: "var(--ds-surface-low)", color: "var(--ds-terracotta)" }}
        onClick={onClose}
        aria-label="Fechar menu"
      >
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>

      {/* ── Logo ───────────────────────────────── */}
      <div className="flex items-center gap-3 px-5 py-6">
        <div
          className="flex items-center justify-center rounded-[10px] text-lg shrink-0"
          style={{ width: 38, height: 38, background: "linear-gradient(135deg,#904d00,#ff8c00)" }}
        >
          <img
            src="/imgs/Logo.png"
            alt="Pix"
            className="w-6 h-6 object-contain"
          />
        </div>
        <div className="leading-tight">
          <span className="block text-[15px] font-700" style={{ color: "var(--ds-terracotta)" }}>Plano Fácil</span>
          <span className="block text-[11px] font-700 tracking-[0.07em] uppercase" style={{ color: "var(--ds-secondary)" }}>Tia</span>
        </div>
      </div>

      {/* ── Divider ────────────────────────────── */}
      <div className="mx-4 h-px" style={{ backgroundColor: "var(--ds-surface-low)" }} />

      {/* ── Nav ────────────────────────────────── */}
      <nav className="flex flex-col gap-[2px] px-3 py-4 flex-1">
        {navItems.map((item) => {
          const active = isActive(item.href, item.exact)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="flex items-center gap-3 h-12 px-3 rounded-[12px] text-[15px] no-underline transition-colors duration-150 group"
              style={{
                backgroundColor: active ? "var(--ds-surface-low)" : "transparent",
                color: active ? "var(--ds-primary)" : "var(--ds-on-surface-var)",
                fontWeight: active ? 600 : 500,
                borderLeft: active ? "3px solid var(--ds-primary-bright)" : "3px solid transparent",
              }}
              onMouseEnter={(e) => { if (!active) e.currentTarget.style.backgroundColor = "var(--ds-surface-low)" }}
              onMouseLeave={(e) => { if (!active) e.currentTarget.style.backgroundColor = "transparent" }}
            >
              <span style={{ color: active ? "var(--ds-primary-bright)" : "var(--ds-muted)" }} className="shrink-0 transition-colors">
                {item.icon}
              </span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* ── Bottom: Plan badge ─────────────────── */}
      <div className="px-3 pb-5 space-y-2">
        <div className="rounded-[14px] p-3" style={{ backgroundColor: planVarBg }}>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: planDot }} />
            <span className="text-[11px] font-700 uppercase tracking-[0.06em]" style={{ color: planVarColor }}>
              {plan}
            </span>
          </div>
          <p className="text-[13px]" style={{ color: "var(--ds-on-surface-var)" }}>Olá, {firstName}! 👋</p>
        </div>
      </div>
    </aside>
  )
}
