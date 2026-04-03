"use client"

import { useRouter } from "next/navigation"
import { useState, useRef, useEffect } from "react"

interface PlanCardProps {
  planoId: string
  materia: string
  serie: string
  tipo: "MENSAL" | "AULA_UNICA"
  dataCriacao: string
  origem?: "plano" | "calendario"
}

const materiaEmoji: Record<string, string> = {
  "Matemática":  "🔢",
  "Português":   "📖",
  "História":    "🏛️",
  "Geografia":   "🌎",
  "Ciências":    "🔬",
  "Arte":        "🎨",
  "Ed. Física":  "⚽",
}

export default function PlanCard({ planoId, materia, serie, tipo, dataCriacao, origem = "plano" }: PlanCardProps) {
  const router = useRouter()
  const emoji = materiaEmoji[materia] ?? "📄"
  const tipoLabel = tipo === "MENSAL" ? "Plano Mensal" : "Aula Única"
  const tipoColor = tipo === "MENSAL"
    ? { color: "var(--ds-tipo-mensal-color)", bg: "var(--ds-tipo-mensal-bg)" }
    : { color: "var(--ds-tipo-aula-color)",   bg: "var(--ds-tipo-aula-bg)" }

  const [menuAberto, setMenuAberto] = useState(false)
  const [baixando, setBaixando] = useState(false)
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

  async function handleDownload(formato: "word" | "pdf") {
    setMenuAberto(false)
    setBaixando(true)
    try {
      const url = origem === "calendario"
        ? `/api/calendario/planos/${planoId}/download?formato=${formato}`
        : `/api/planos/${planoId}?formato=${formato}`
      const res = await fetch(url)
      if (!res.ok) { alert("Erro ao baixar. Tenta de novo!"); return }
      const blob = await res.blob()
      const a = document.createElement("a")
      a.href = URL.createObjectURL(blob)
      a.download = `plano_${serie}_${materia}.${formato === "pdf" ? "pdf" : "docx"}`
      a.click()
      URL.revokeObjectURL(a.href)
    } finally {
      setBaixando(false)
    }
  }

  const verHref = origem === "calendario"
    ? `/dashboard/calendario`
    : `/dashboard/plano/resultado/${planoId}`

  return (
    <div
      className="flex flex-col gap-4 p-5 rounded-[20px] transition-all duration-200"
      style={{
        backgroundColor: "var(--ds-surface-card)",
        boxShadow: "0 4px 20px var(--ds-shadow)",
        border: "1px solid var(--ds-surface-low)",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement
        el.style.boxShadow = "0 8px 32px var(--ds-shadow-lg)"
        el.style.transform = "translateY(-2px)"
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement
        el.style.boxShadow = "0 4px 20px var(--ds-shadow)"
        el.style.transform = "translateY(0)"
      }}
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <div
          className="flex items-center justify-center text-xl rounded-[12px] shrink-0"
          style={{ width: 44, height: 44, backgroundColor: "var(--ds-surface-low)" }}
        >
          {emoji}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[15px] font-600 truncate" style={{ color: "var(--ds-on-surface)" }}>{materia}</p>
          <p className="text-[13px]" style={{ color: "var(--ds-terracotta)" }}>{serie}</p>
        </div>
      </div>

      {/* Tags */}
      <div className="flex items-center gap-2 flex-wrap">
        <span
          className="text-[11px] font-700 uppercase tracking-[0.06em] px-2.5 py-1 rounded-full"
          style={{ color: tipoColor.color, backgroundColor: tipoColor.bg }}
        >
          {tipoLabel}
        </span>
        <span className="text-[12px]" style={{ color: "var(--ds-muted)" }}>{dataCriacao}</span>
      </div>

      {/* Botões */}
      <div className="flex gap-2 pt-1">
        {/* Botão de download com dropdown */}
        <div className="relative flex-1" ref={menuRef}>
          <div
            className="flex rounded-[10px] overflow-hidden"
            style={{ background: "linear-gradient(135deg,#904d00,#ff8c00)" }}
          >
            {/* Parte principal — clica para abrir/fechar */}
            <button
              onClick={() => setMenuAberto((v) => !v)}
              disabled={baixando}
              className="flex-1 flex items-center justify-center gap-1.5 h-10 text-[13px] font-600 text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {baixando ? (
                <>
                  <svg className="animate-spin" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                    <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeOpacity={0.3} />
                    <path d="M3 12a9 9 0 019-9" />
                  </svg>
                  Baixando…
                </>
              ) : (
                <>
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                  </svg>
                  Baixar
                </>
              )}
            </button>

            {/* Divisor */}
            <div style={{ width: 1, backgroundColor: "rgba(255,255,255,0.3)" }} />

            {/* Seta */}
            <button
              onClick={() => setMenuAberto((v) => !v)}
              disabled={baixando}
              className="flex items-center justify-center w-8 h-10 text-white transition-opacity hover:opacity-90 disabled:opacity-60"
              aria-label="Escolher formato de download"
            >
              <svg
                width="12" height="12" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"
                style={{ transition: "transform 0.2s", transform: menuAberto ? "rotate(180deg)" : "rotate(0deg)" }}
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
          </div>

          {/* Dropdown */}
          {menuAberto && (
            <div
              className="absolute left-0 right-0 mt-1.5 rounded-[12px] overflow-hidden z-50"
              style={{
                backgroundColor: "var(--ds-surface-card)",
                boxShadow: "0 8px 24px var(--ds-shadow-lg)",
                border: "1px solid var(--ds-border)",
              }}
            >
              <button
                onClick={() => handleDownload("word")}
                className="w-full flex items-center gap-3 px-4 py-3 text-left text-[13px] font-500 transition-colors"
                style={{ color: "var(--ds-on-surface)" }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--ds-surface-low)" }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent" }}
              >
                <span className="text-lg">📝</span>
                <div>
                  <p className="font-600" style={{ color: "var(--ds-on-surface)" }}>Word (.docx)</p>
                  <p className="text-[11px]" style={{ color: "var(--ds-muted)" }}>Edite no Word ou Google Docs</p>
                </div>
              </button>
              <div style={{ height: 1, backgroundColor: "var(--ds-border)", margin: "0 12px" }} />
              <button
                onClick={() => handleDownload("pdf")}
                className="w-full flex items-center gap-3 px-4 py-3 text-left text-[13px] font-500 transition-colors"
                style={{ color: "var(--ds-on-surface)" }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--ds-surface-low)" }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent" }}
              >
                <span className="text-lg">📄</span>
                <div>
                  <p className="font-600" style={{ color: "var(--ds-on-surface)" }}>PDF</p>
                  <p className="text-[11px]" style={{ color: "var(--ds-muted)" }}>Pronto pra imprimir ou compartilhar</p>
                </div>
              </button>
            </div>
          )}
        </div>

        <button
          onClick={() => router.push(verHref)}
          className="flex items-center justify-center gap-1.5 h-10 px-4 rounded-[10px] text-[13px] font-500 transition-colors duration-150"
          style={{
            backgroundColor: "var(--ds-surface-low)",
            color: "var(--ds-terracotta)",
            border: "1px solid var(--ds-border)",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--ds-surface-container)" }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "var(--ds-surface-low)" }}
        >
          Ver
        </button>
      </div>
    </div>
  )
}
