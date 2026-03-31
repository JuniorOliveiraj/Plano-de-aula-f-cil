"use client"

import { useState, useRef, useEffect } from "react"
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

// ── Botão de download com dropdown ─────────────────────────────
function BotaoDownload({ id, serie, materia }: { id: string; serie: string; materia: string }) {
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
      const res = await fetch(`/api/planos/${id}?formato=${formato}`)
      if (!res.ok) { alert("Erro ao baixar. Tenta de novo!"); return }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `plano_${serie}_${materia}.${formato === "pdf" ? "pdf" : "docx"}`
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setBaixando(false)
    }
  }

  return (
    <div className="relative flex-1" ref={menuRef}>
      <div
        className="flex rounded-[10px] overflow-hidden"
        style={{ background: "linear-gradient(135deg,#904d00,#ff8c00)" }}
      >
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

        <div style={{ width: 1, backgroundColor: "rgba(255,255,255,0.3)" }} />

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
            className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors"
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--ds-surface-low)" }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent" }}
          >
            <span className="text-lg">📝</span>
            <div>
              <p className="text-[13px] font-600" style={{ color: "var(--ds-on-surface)" }}>Word (.docx)</p>
              <p className="text-[11px]" style={{ color: "var(--ds-muted)" }}>Edite no Word ou Google Docs</p>
            </div>
          </button>
          <div style={{ height: 1, backgroundColor: "var(--ds-border)", margin: "0 12px" }} />
          <button
            onClick={() => handleDownload("pdf")}
            className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors"
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--ds-surface-low)" }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent" }}
          >
            <span className="text-lg">📄</span>
            <div>
              <p className="text-[13px] font-600" style={{ color: "var(--ds-on-surface)" }}>PDF</p>
              <p className="text-[11px]" style={{ color: "var(--ds-muted)" }}>Pronto pra imprimir ou compartilhar</p>
            </div>
          </button>
        </div>
      )}
    </div>
  )
}

// ── Componente principal ────────────────────────────────────────
export default function PlanosClient({ planos }: { planos: Plano[] }) {
  const [filtroSerie, setFiltroSerie] = useState("")
  const [filtroMateria, setFiltroMateria] = useState("")
  const [excluindo, setExcluindo] = useState<string | null>(null)
  const [lista, setLista] = useState(planos)

  const series = [...new Set(planos.map((p) => p.serie))]
  const materias = [...new Set(planos.map((p) => p.materia))]

  const filtrados = lista.filter((p) => {
    if (filtroSerie && p.serie !== filtroSerie) return false
    if (filtroMateria && p.materia !== filtroMateria) return false
    return true
  })

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
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-700" style={{ color: "var(--ds-on-surface)" }}>Meus Planos</h1>
          <p className="text-[14px] mt-1" style={{ color: "var(--ds-muted)" }}>{lista.length} plano{lista.length !== 1 ? "s" : ""} gerado{lista.length !== 1 ? "s" : ""}</p>
        </div>
        <Link
          href="/dashboard/plano/novo"
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
          className="h-10 px-3 rounded-[10px] text-sm outline-none"
          style={{
            backgroundColor: "var(--ds-surface-low)",
            border: "1px solid var(--ds-border)",
            color: "var(--ds-on-surface)",
          }}
        >
          <option value="">Todas as séries</option>
          {series.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select
          value={filtroMateria}
          onChange={(e) => setFiltroMateria(e.target.value)}
          className="h-10 px-3 rounded-[10px] text-sm outline-none"
          style={{
            backgroundColor: "var(--ds-surface-low)",
            border: "1px solid var(--ds-border)",
            color: "var(--ds-on-surface)",
          }}
        >
          <option value="">Todas as matérias</option>
          {materias.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
        {(filtroSerie || filtroMateria) && (
          <button
            onClick={() => { setFiltroSerie(""); setFiltroMateria("") }}
            className="h-10 px-3 rounded-[10px] text-sm"
            style={{ backgroundColor: "var(--ds-surface-low)", color: "var(--ds-secondary)" }}
          >
            Limpar filtros
          </button>
        )}
      </div>

      {/* Lista */}
      {filtrados.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <span className="text-5xl mb-4">📭</span>
          <p className="text-[17px] font-600 mb-1" style={{ color: "var(--ds-on-surface)" }}>Nenhum plano encontrado</p>
          <p className="text-[14px]" style={{ color: "var(--ds-muted)" }}>
            {lista.length === 0 ? "Crie seu primeiro plano agora!" : "Tente outros filtros."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtrados.map((p) => {
            const emoji = materiaEmoji[p.materia] ?? "📄"
            const tipoLabel = p.tipo === "MENSAL" ? "Plano Mensal" : "Aula Única"
            const tipoColor = p.tipo === "MENSAL"
              ? { color: "var(--ds-tipo-mensal-color)", bg: "var(--ds-tipo-mensal-bg)" }
              : { color: "var(--ds-tipo-aula-color)",   bg: "var(--ds-tipo-aula-bg)" }

            return (
              <div
                key={p.id}
                className="flex flex-col gap-4 p-5 rounded-[20px]"
                style={{
                  backgroundColor: "var(--ds-surface-card)",
                  boxShadow: "0 4px 20px var(--ds-shadow)",
                  border: "1px solid var(--ds-surface-low)",
                }}
              >
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center text-xl rounded-[12px] shrink-0" style={{ width: 44, height: 44, backgroundColor: "var(--ds-surface-low)" }}>
                    {emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[15px] font-600 truncate" style={{ color: "var(--ds-on-surface)" }}>{p.materia}</p>
                    <p className="text-[13px]" style={{ color: "var(--ds-terracotta)" }}>{p.serie}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-700 uppercase tracking-[0.06em] px-2.5 py-1 rounded-full" style={{ color: tipoColor.color, backgroundColor: tipoColor.bg }}>
                    {tipoLabel}
                  </span>
                  <span className="text-[12px]" style={{ color: "var(--ds-muted)" }}>{p.dataCriacao}</span>
                </div>

                <div className="flex gap-2">
                  <BotaoDownload id={p.id} serie={p.serie} materia={p.materia} />
                  <Link
                    href={`/dashboard/plano/resultado/${p.id}`}
                    className="flex items-center justify-center h-10 w-10 rounded-[10px] no-underline transition-colors"
                    style={{ backgroundColor: "var(--ds-surface-low)", color: "var(--ds-terracotta)" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "var(--ds-surface-container)" }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "var(--ds-surface-low)" }}
                    title="Ver plano"
                  >
                    <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </Link>
                  <button
                    onClick={() => handleExcluir(p.id)}
                    disabled={excluindo === p.id}
                    className="flex items-center justify-center h-10 w-10 rounded-[10px] transition-colors disabled:opacity-50"
                    style={{ backgroundColor: "var(--ds-surface-low)", color: "var(--ds-ink-error)" }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--ds-error-bg)" }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "var(--ds-surface-low)" }}
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
