"use client"

import { useMemo, useState, useRef, useEffect } from "react"
import { signOut } from "next-auth/react"

interface TopBarProps {
  userName: string
  userImage?: string | null
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

export default function TopBar({ userName, userImage }: TopBarProps) {
  const greeting  = useMemo(getGreeting, [])
  const emoji     = useMemo(getSunEmoji,  [])
  const firstName = userName.split(" ")[0]
  const initial   = firstName.charAt(0).toUpperCase()

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
      style={{ color: "#2f1402" }}
      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#fff1ea" }}
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
          style={{ width: 34, height: 34, border: "2px solid #ffeade" }}
        />
      ) : (
        <div
          className="rounded-full flex items-center justify-center text-white text-[14px] font-700 shrink-0"
          style={{
            width: 34, height: 34,
            background: "linear-gradient(135deg,#904d00,#ff8c00)",
            border: "2px solid #ffeade",
          }}
        >
          {initial}
        </div>
      )}

      <span className="hidden sm:block text-[13px] font-500 text-[#2f1402] max-w-[100px] truncate">
        {firstName}
      </span>

      {/* chevron */}
      <svg
        width="12" height="12" fill="none" viewBox="0 0 24 24"
        stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"
        style={{ color: "#a87b5e", transition: "transform 0.2s", transform: menuAberto ? "rotate(180deg)" : "rotate(0deg)" }}
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
        backgroundColor: "rgba(255,248,245,0.85)",
        backdropFilter:  "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid #fff1ea",
        position: "sticky",
        top: 0,
        zIndex: 40,
      }}
    >
      {/* Saudação */}
      <div>
        <p className="text-[18px] font-600 text-[#2f1402] leading-tight">
          {greeting}, {firstName}! {emoji}
        </p>
        <p className="text-[13px] text-[#a87b5e]">
          {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
        </p>
      </div>

      {/* Ações direita */}
      <div className="flex items-center gap-3">

        {/* Notificações */}
        <button
          className="flex items-center justify-center rounded-full transition-colors"
          style={{ width: 40, height: 40, backgroundColor: "#fff1ea", color: "#7c4a2d" }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#ffeade" }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#fff1ea" }}
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
                backgroundColor: "#ffffff",
                boxShadow: "0 12px 32px rgba(144,77,0,0.14)",
                border: "1px solid #f0ddd0",
                top: "calc(100% + 4px)",
              }}
            >
              {/* Cabeçalho do menu */}
              <div className="px-4 py-3" style={{ borderBottom: "1px solid #f0ddd0" }}>
                <p className="text-[13px] font-600 text-[#2f1402] truncate">{userName}</p>
                <p className="text-[11px] text-[#a87b5e] mt-0.5">Professora</p>
              </div>

              {/* Itens */}
              <div className="py-1.5">
                <button
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-[13px] font-500 transition-colors"
                  style={{ color: "#2f1402" }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#fff8f5" }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent" }}
                  onClick={() => setMenuAberto(false)}
                >
                  <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ color: "#a87b5e" }}>
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  Minha conta
                </button>

                <button
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-[13px] font-500 transition-colors"
                  style={{ color: "#2f1402" }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#fff8f5" }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent" }}
                  onClick={() => setMenuAberto(false)}
                >
                  <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ color: "#a87b5e" }}>
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
                  </svg>
                  Configurações
                </button>
              </div>

              {/* Divider + Logout */}
              <div style={{ height: 1, backgroundColor: "#f0ddd0" }} />
              <div className="py-1.5">
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-[13px] font-600 transition-colors"
                  style={{ color: "#ba1a1a" }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#fde8e8" }}
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
