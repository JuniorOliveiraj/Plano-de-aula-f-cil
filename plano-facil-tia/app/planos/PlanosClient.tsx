"use client"

import { useState } from "react"
import Link from "next/link"

interface Plano {
  id: string
  serie: string
  materia: string
  tipo: "MENSAL" | "AULA_UNICA"
  dataCriacao: string
}

const materiaEmoji: Record<string, string> = {
  "Matemática": "🔢", "Português": "📖", "História": "🏛️",
  "Geografia": "🌎", "Ciências": "🔬", "Arte": "🎨", "Ed. Física": "⚽",
}

export default function PlanosClient({ planos }: { planos: Plano[] }) {
  const [filtroSerie, setFiltroSerie] = useState("")
  const [filtroMateria, setFiltroMateria] = useState("")
  const [excluindo, setExcluindo] = useState<string | null>(null)
  const [lista, setLista] = useState(planos)

  const series   = [...new Set(planos.map((p) => p.serie))]
  const materias = [...new Set(planos.map((p) => p.materia))]

  const filtrados = lista.filter((p) => {
    if (filtroSerie   && p.serie   !== filtroSerie)   return false
    if (filtroMateria && p.materia !== filtroMateria) return false
    return true
  })

  async function handleDownload(id: string, serie: string, materia: string) {
    const res = await fetch(`/api/planos/${id}`)
    if (!res.ok) { alert("Erro ao baixar. Tenta de novo!"); return }
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `plano_${serie}_${materia}.docx`
    a.click()
    URL.revokeObjectURL(url)
  }

  async function handleExcluir(id: string) {
    if (!confirm("Tem certeza? Não dá pra desfazer.")) return
    setExcluindo(id)
    const res = await fetch(`/api/planos/${id}`, { method: "DELETE" })
    if (res.ok) {
      setLista((prev) => prev.filter((p) => p.id !== id))
    } else {
      alert("Erro ao excluir. Tenta de novo!")
    }
    setExcluindo(null)
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-700 text-[#2f1402]">Meus Planos</h1>
          <p className="text-[14px] text-[#a87b5e] mt-1">{lista.length} plano{lista.length !== 1 ? "s" : ""} gerado{lista.length !== 1 ? "s" : ""}</p>
        </div>
        <Link
          href="/plano/novo"
          className="flex items-center gap-2 h-11 px-5 rounded-[12px] text-[14px] font-600 text-white no-underline transition-opacity hover:opacity-90"
          style={{ background: "linear-gradient(135deg,#904d00,#ff8c00)" }}
        >
          + Novo plano
        </Link>
      </div>

      {/* Filtros */}
      <div className="flex gap-3 flex-wrap">
        <select
          value={filtroSerie}
          onChange={(e) => setFiltroSerie(e.target.value)}
          className="h-10 px-3 rounded-[10px] text-sm text-[#2f1402] outline-none"
          style={{ backgroundColor: "#fff1ea", border: "1px solid #f0ddd0" }}
        >
          <option value="">Todas as séries</option>
          {series.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select
          value={filtroMateria}
          onChange={(e) => setFiltroMateria(e.target.value)}
          className="h-10 px-3 rounded-[10px] text-sm text-[#2f1402] outline-none"
          style={{ backgroundColor: "#fff1ea", border: "1px solid #f0ddd0" }}
        >
          <option value="">Todas as matérias</option>
          {materias.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
        {(filtroSerie || filtroMateria) && (
          <button
            onClick={() => { setFiltroSerie(""); setFiltroMateria("") }}
            className="h-10 px-3 rounded-[10px] text-sm text-[#c2571a]"
            style={{ backgroundColor: "#fff8f5" }}
          >
            Limpar filtros
          </button>
        )}
      </div>

      {/* Lista */}
      {filtrados.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <span className="text-5xl mb-4">📭</span>
          <p className="text-[17px] font-600 text-[#2f1402] mb-1">Nenhum plano encontrado</p>
          <p className="text-[14px] text-[#a87b5e]">
            {lista.length === 0 ? "Crie seu primeiro plano agora!" : "Tente outros filtros."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtrados.map((p) => {
            const emoji = materiaEmoji[p.materia] ?? "📄"
            const tipoLabel = p.tipo === "MENSAL" ? "Plano Mensal" : "Aula Única"
            const tipoColor = p.tipo === "MENSAL"
              ? { color: "#904d00", bg: "#fff1ea" }
              : { color: "#2e7d32", bg: "#edf7ee" }

            return (
              <div
                key={p.id}
                className="flex flex-col gap-4 p-5 rounded-[20px] bg-white"
                style={{ boxShadow: "0 4px 20px rgba(144,77,0,0.06)", border: "1px solid #fff1ea" }}
              >
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center text-xl rounded-[12px] shrink-0" style={{ width: 44, height: 44, backgroundColor: "#fff1ea" }}>
                    {emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[15px] font-600 text-[#2f1402] truncate">{p.materia}</p>
                    <p className="text-[13px] text-[#7c4a2d]">{p.serie}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-700 uppercase tracking-[0.06em] px-2.5 py-1 rounded-full" style={{ color: tipoColor.color, backgroundColor: tipoColor.bg }}>
                    {tipoLabel}
                  </span>
                  <span className="text-[12px] text-[#a87b5e]">{p.dataCriacao}</span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleDownload(p.id, p.serie, p.materia)}
                    className="flex-1 flex items-center justify-center gap-1.5 h-10 rounded-[10px] text-[13px] font-600 text-white transition-opacity hover:opacity-90"
                    style={{ background: "linear-gradient(135deg,#904d00,#ff8c00)" }}
                  >
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                    </svg>
                    Baixar
                  </button>
                  <button
                    onClick={() => handleExcluir(p.id)}
                    disabled={excluindo === p.id}
                    className="flex items-center justify-center h-10 w-10 rounded-[10px] transition-colors disabled:opacity-50"
                    style={{ backgroundColor: "#fff1ea", color: "#ba1a1a" }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#fde8e8" }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#fff1ea" }}
                    title="Excluir plano"
                  >
                    <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
                    </svg>
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
