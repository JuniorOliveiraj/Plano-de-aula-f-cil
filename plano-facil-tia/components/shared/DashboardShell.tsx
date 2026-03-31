"use client"

import { useState } from "react"
import Sidebar from "@/components/shared/Sidebar"
import TopBar from "@/components/shared/TopBar"

interface Props {
  userName: string
  userPlan: string
  userImage: string | null
  children: React.ReactNode
}

export default function DashboardShell({ userName, userPlan, userImage, children }: Props) {
  const [sidebarAberta, setSidebarAberta] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: "var(--ds-surface)" }}>

      {/* ── Overlay mobile (escurece fundo quando sidebar abre) ── */}
      {sidebarAberta && (
        <div
          className="fixed inset-0 z-30 lg:hidden"
          style={{ backgroundColor: "rgba(0,0,0,0.55)" }}
          onClick={() => setSidebarAberta(false)}
          aria-hidden
        />
      )}

      {/* ── Sidebar ── */}
      <Sidebar
        userName={userName}
        userPlan={userPlan}
        isOpen={sidebarAberta}
        onClose={() => setSidebarAberta(false)}
      />

      {/* ── Área principal ── */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar
          userName={userName}
          userImage={userImage}
          onMenuClick={() => setSidebarAberta((v) => !v)}
        />

        <main
          className="flex-1 overflow-y-auto"
          style={{ backgroundColor: "var(--ds-surface)" }}
        >
          <div className="px-4 py-6 sm:px-8 sm:py-8 lg:px-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
