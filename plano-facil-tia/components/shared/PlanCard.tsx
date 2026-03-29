"use client"

import { useRouter } from "next/navigation"

interface PlanCardProps {
  planoId: string
  materia: string
  serie: string
  tipo: "MENSAL" | "AULA_UNICA"
  dataCriacao: string
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

export default function PlanCard({ planoId, materia, serie, tipo, dataCriacao }: PlanCardProps) {
  const router = useRouter()
  const emoji = materiaEmoji[materia] ?? "📄"
  const tipoLabel = tipo === "MENSAL" ? "Plano Mensal" : "Aula Única"
  const tipoColor = tipo === "MENSAL" ? { color: "#904d00", bg: "#fff1ea" } : { color: "#2e7d32", bg: "#edf7ee" }

  async function handleDownload() {
    const res = await fetch(`/api/planos/${planoId}`)
    if (!res.ok) { alert("Erro ao baixar. Tenta de novo!"); return }
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `plano_${serie}_${materia}.docx`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div
      className="flex flex-col gap-4 p-5 rounded-[20px] transition-all duration-200"
      style={{
        backgroundColor: "#ffffff",
        boxShadow: "0 4px 20px rgba(144,77,0,0.06)",
        border: "1px solid #fff1ea",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement
        el.style.boxShadow = "0 8px 32px rgba(144,77,0,0.12)"
        el.style.transform = "translateY(-2px)"
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement
        el.style.boxShadow = "0 4px 20px rgba(144,77,0,0.06)"
        el.style.transform = "translateY(0)"
      }}
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <div
          className="flex items-center justify-center text-xl rounded-[12px] shrink-0"
          style={{ width: 44, height: 44, backgroundColor: "#fff1ea" }}
        >
          {emoji}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[15px] font-600 text-[#2f1402] truncate">{materia}</p>
          <p className="text-[13px] text-[#7c4a2d]">{serie}</p>
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
        <span className="text-[12px] text-[#a87b5e]">{dataCriacao}</span>
      </div>

      {/* Botões */}
      <div className="flex gap-2 pt-1">
        <button
          onClick={handleDownload}
          className="flex-1 flex items-center justify-center gap-1.5 h-10 rounded-[10px] text-[13px] font-600 text-white transition-opacity duration-150 hover:opacity-90"
          style={{ background: "linear-gradient(135deg,#904d00,#ff8c00)" }}
        >
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
          </svg>
          Baixar
        </button>
        <button
          onClick={() => router.push(`/plano/resultado/${planoId}`)}
          className="flex items-center justify-center gap-1.5 h-10 px-4 rounded-[10px] text-[13px] font-500 transition-colors duration-150"
          style={{ backgroundColor: "#fff1ea", color: "#7c4a2d", border: "1px solid #f0ddd0" }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#ffeade" }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#fff1ea" }}
        >
          Ver
        </button>
      </div>
    </div>
  )
}
