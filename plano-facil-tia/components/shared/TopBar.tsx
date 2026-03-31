"use client"

import { useMemo, useState, useRef, useEffect } from "react"
import { signOut } from "next-auth/react"
import { useTheme } from "@/context/ThemeContext"

interface TopBarProps {
  userName: string
  userImage?: string | null
  onMenuClick?: () => void
}

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return "Bom dia"
  if (hour < 18) return "Boa tarde"
  return "Boa noite"
}

function getSunEmoji(): string {
  const hour = new Date().getHours()
  if (hour < 6)  return "🌙"
  if (hour < 12) return "🌤️"
  if (hour < 18) return "☀️"
  return "🌙"
}

export default function TopBar({ userName, userImage, onMenuClick }: TopBarProps) {
  const greeting  = useMemo(getGreeting, [])
  const emoji     = useMemo(getSunEmoji,  [])
  const firstName = userName.split(" ")[0]
  const initial   = firstName.charAt(0).toUpperCase()
  const { theme, toggleTheme } = useTheme()

  const [menuAberto, setMenuAberto] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!menuAberto) return
    function onClickFora(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuAberto(false)
      }
    }
    document.addEventListener("mousedown", onClickFora)
    return () => document.removeEventListener("mousedown", onClickFora)
  }, [menuAberto])

  const Avatar = (
    <button
      onClick={() => setMenuAberto((v) => !v)}
      className="relative flex items-center gap-2 rounded-[12px] px-2 py-1 transition-colors"
      style={{ color: "var(--ds-on-surface)" }}
      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--ds-surface-low)" }}
      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent" }}
      aria-label="Menu do usuário"
      aria-expanded={menuAberto}
    >
      {userImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={userImage}
          alt={firstName}
          className="rounded-full object-cover"
          style={{ width: 34, height: 34, border: "2px solid var(--ds-surface-container)" }}
        />
      ) : (
        <div
          className="rounded-full flex items-center justify-center text-white text-[14px] font-700 shrink-0"
          style={{
            width: 34, height: 34,
            background: "linear-gradient(135deg,#904d00,#ff8c00)",
            border: "2px solid var(--ds-surface-container)",
          }}
        >
          {initial}
        </div>
      )}

      <span className="hidden sm:block text-[13px] font-500 max-w-[100px] truncate" style={{ color: "var(--ds-on-surface)" }}>
        {firstName}
      </span>

      {/* chevron */}
      <svg
        width="12" height="12" fill="none" viewBox="0 0 24 24"
        stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"
        style={{ color: "var(--ds-muted)", transition: "transform 0.2s", transform: menuAberto ? "rotate(180deg)" : "rotate(0deg)" }}
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
    </button>
  )

  return (
    <header
      className="flex items-center justify-between px-6 shrink-0"
      style={{
        height: 64,
        backgroundColor: "var(--ds-topbar-bg)",
        backdropFilter:  "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--ds-surface-low)",
        position: "sticky",
        top: 0,
        zIndex: 40,
      }}
    >
      {/* Botão hamburguer (só no mobile) */}
      <button
        className="lg:hidden flex items-center justify-center w-10 h-10 rounded-[10px] shrink-0 transition-colors mr-2"
        style={{ backgroundColor: "var(--ds-surface-low)", color: "var(--ds-terracotta)" }}
        onClick={onMenuClick}
        aria-label="Abrir menu"
      >
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12h18M3 6h18M3 18h18" />
        </svg>
      </button>

      {/* Saudação */}
      <div className="flex-1 min-w-0">
        <p className="text-[16px] sm:text-[18px] font-600 leading-tight truncate" style={{ color: "var(--ds-on-surface)" }}>
          {greeting}, {firstName}! {emoji}
        </p>
        <p className="hidden sm:block text-[13px]" style={{ color: "var(--ds-muted)" }}>
          {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
        </p>
      </div>

      {/* Ações direita */}
      <div className="flex items-center gap-2">

        {/* ── Toggle Dark/Light Mode ────────────────── */}
        <button
          id="theme-toggle"
          onClick={toggleTheme}
          className="flex items-center justify-center rounded-full transition-all duration-300"
          style={{
            width: 40,
            height: 40,
            backgroundColor: "var(--ds-surface-low)",
            color: "var(--ds-terracotta)",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--ds-surface-container)" }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "var(--ds-surface-low)" }}
          aria-label={theme === "dark" ? "Mudar para modo claro" : "Mudar para modo escuro"}
          title={theme === "dark" ? "Modo claro" : "Modo escuro"}
        >
          {theme === "dark" ? (
            /* Ícone Sol */
            <svg
              width="18" height="18" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
              style={{ color: "var(--ds-primary)" }}
            >
              <circle cx="12" cy="12" r="5" />
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            </svg>
          ) : (
            /* Ícone Lua */
            <svg
              width="17" height="17" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
              style={{ color: "var(--ds-terracotta)" }}
            >
              <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" />
            </svg>
          )}
        </button>

        {/* Notificações */}
        <button
          className="flex items-center justify-center rounded-full transition-colors"
          style={{ width: 40, height: 40, backgroundColor: "var(--ds-surface-low)", color: "var(--ds-terracotta)" }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--ds-surface-container)" }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "var(--ds-surface-low)" }}
          aria-label="Notificações"
        >
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
          </svg>
        </button>

        {/* Avatar + dropdown */}
        <div className="relative" ref={menuRef}>
          {Avatar}

          {menuAberto && (
            <div
              className="absolute right-0 mt-2 w-52 rounded-[16px] overflow-hidden"
              style={{
                backgroundColor: "var(--ds-surface-card)",
                boxShadow: `0 12px 32px var(--ds-shadow-lg)`,
                border: "1px solid var(--ds-border)",
                top: "calc(100% + 4px)",
              }}
            >
              {/* Cabeçalho do menu */}
              <div className="px-4 py-3" style={{ borderBottom: "1px solid var(--ds-border)" }}>
                <p className="text-[13px] font-600 truncate" style={{ color: "var(--ds-on-surface)" }}>{userName}</p>
                <p className="text-[11px] mt-0.5" style={{ color: "var(--ds-muted)" }}>Professora</p>
              </div>

              {/* Itens */}
              <div className="py-1.5">
                <button
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-[13px] font-500 transition-colors"
                  style={{ color: "var(--ds-on-surface)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--ds-surface-low)" }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent" }}
                  onClick={() => setMenuAberto(false)}
                >
                  <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--ds-muted)" }}>
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  Minha conta
                </button>

                <button
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-[13px] font-500 transition-colors"
                  style={{ color: "var(--ds-on-surface)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--ds-surface-low)" }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent" }}
                  onClick={() => setMenuAberto(false)}
                >
                  <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--ds-muted)" }}>
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
                  </svg>
                  Configurações
                </button>
              </div>

              {/* Divider + Logout */}
              <div style={{ height: 1, backgroundColor: "var(--ds-border)" }} />
              <div className="py-1.5">
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-[13px] font-600 transition-colors"
                  style={{ color: "var(--ds-ink-error)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--ds-error-bg)" }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent" }}
                >
                  <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
                  </svg>
                  Sair da conta
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
