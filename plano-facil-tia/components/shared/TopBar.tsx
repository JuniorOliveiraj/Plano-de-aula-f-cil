"use client"

import { useMemo } from "react"

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
  const greeting = useMemo(getGreeting, [])
  const emoji    = useMemo(getSunEmoji,  [])
  const firstName = userName.split(" ")[0]
  const initial   = firstName.charAt(0).toUpperCase()

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
        zIndex: 10,
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

        {/* Avatar */}
        {userImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={userImage}
            alt={firstName}
            className="rounded-full object-cover"
            style={{ width: 38, height: 38, border: "2px solid #ffeade" }}
          />
        ) : (
          <div
            className="rounded-full flex items-center justify-center text-white text-[15px] font-700 shrink-0"
            style={{
              width: 38, height: 38,
              background: "linear-gradient(135deg,#904d00,#ff8c00)",
              border: "2px solid #ffeade",
            }}
          >
            {initial}
          </div>
        )}
      </div>
    </header>
  )
}
