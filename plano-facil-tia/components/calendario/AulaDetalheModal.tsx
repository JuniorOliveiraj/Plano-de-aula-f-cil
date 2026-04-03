"use client"

import { useState, useEffect, useRef } from "react"
import type { AulaItem } from "@/lib/distribuidor"

interface AulaDetalheModalProps {
  aula: AulaItem | null
  planoId: string | null
  aulaIndex: number | null
  aulaId?: string
  onClose: () => void
  onAulaAtualizada: (novasAulas: AulaItem[]) => void
}

export default function AulaDetalheModal({
  aula,
  planoId,
  aulaIndex,
  aulaId,
  onClose,
  onAulaAtualizada,
}: AulaDetalheModalProps) {
  const [baixando, setBaixando] = useState(false)
  const [menuDownload, setMenuDownload] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  async function handleDownload(formato: "word" | "pdf") {
    if (!planoId || aulaIndex === null) return
    setMenuDownload(false)
    setBaixando(true)
    try {
      const res = await fetch(
        `/api/calendario/planos/${planoId}/download?formato=${formato}&aulaIndex=${aulaIndex}`
      )
      if (!res.ok) return
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `aula_${aulaIndex + 1}.${formato === "pdf" ? "pdf" : "docx"}`
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setBaixando(false)
    }
  }

  // Fechar menu ao clicar fora
  useEffect(() => {
    if (!menuDownload) return
    function handler(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuDownload(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [menuDownload])
  const [novaData, setNovaData] = useState("")
  const [novoTitulo, setNovoTitulo] = useState("")
  const [editandoTitulo, setEditandoTitulo] = useState(false)
  const [salvandoTitulo, setSalvandoTitulo] = useState(false)
  const [salvando, setSalvando] = useState(false)
  const [conflito, setConflito] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (aula) {
      setNovaData(aula.data)
      setNovoTitulo(aula.aula)
      setConflito(false)
      setErro(null)
      setEditandoTitulo(false)
    }
  }, [aula])

  // Fechar com Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [onClose])

  if (!aula) return null

  async function salvarTitulo() {
    if (!planoId || aulaIndex === null || !novoTitulo.trim()) return
    const aulaPath = aulaId ?? String(aulaIndex)
    setSalvandoTitulo(true)
    try {
      const res = await fetch(
        `/api/calendario/planos/${planoId}/aulas/${aulaPath}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ titulo: novoTitulo.trim() }),
        }
      )
      if (res.ok) {
        const body = await res.json()
        onAulaAtualizada(body.aulas)
        setEditandoTitulo(false)
      }
    } catch {
      // silencioso
    } finally {
      setSalvandoTitulo(false)
    }
  }

  async function salvarData(forcar = false) {
    if (!planoId || aulaIndex === null) return
    const aulaPath = aulaId ?? String(aulaIndex)
    setSalvando(true)
    setErro(null)
    try {
      const res = await fetch(
        `/api/calendario/planos/${planoId}/aulas/${aulaPath}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: novaData, forcar }),
        }
      )
      if (res.status === 409) { setConflito(true); setSalvando(false); return }
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        setErro(body.erro ?? "Erro ao salvar data")
        setSalvando(false)
        return
      }
      const body = await res.json()
      onAulaAtualizada(body.aulas)
      onClose()
    } catch {
      setErro("Erro de conexão. Tente novamente.")
    } finally {
      setSalvando(false)
    }
  }

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 flex items-center justify-center p-4"
        style={{ backgroundColor: "rgba(0,0,0,0.55)", backdropFilter: "blur(2px)" }}
        onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      >
        {/* Modal centralizado */}
        <div
          ref={panelRef}
          className="relative flex flex-col w-full rounded-[24px] overflow-hidden"
          style={{
            maxWidth: 900,
            maxHeight: "90vh",
            backgroundColor: "var(--ds-surface-card)",
            border: "1px solid var(--ds-border)",
            boxShadow: "0 24px 64px rgba(0,0,0,0.35)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-6 py-4 shrink-0"
            style={{ borderBottom: "1px solid var(--ds-border)" }}
          >
            <div className="flex items-center gap-3">
              <div
                className="flex items-center justify-center w-9 h-9 rounded-[10px] text-base shrink-0"
                style={{ backgroundColor: "var(--ds-surface-low)" }}
              >
                📌
              </div>
              <div className="flex-1 min-w-0">
                {editandoTitulo ? (
                  <div className="flex items-center gap-2">
                    <input
                      autoFocus
                      value={novoTitulo}
                      onChange={(e) => setNovoTitulo(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") salvarTitulo()
                        if (e.key === "Escape") { setEditandoTitulo(false); setNovoTitulo(aula.aula) }
                      }}
                      className="flex-1 h-8 px-2 rounded-[6px] text-[14px] font-600 outline-none min-w-0"
                      style={{
                        backgroundColor: "var(--ds-surface-low)",
                        border: "1px solid var(--ds-primary-bright)",
                        color: "var(--ds-on-surface)",
                      }}
                    />
                    <button
                      onClick={salvarTitulo}
                      disabled={salvandoTitulo || !novoTitulo.trim()}
                      className="h-8 px-3 rounded-[6px] text-[12px] font-600 shrink-0 disabled:opacity-50"
                      style={{ background: "linear-gradient(135deg,#904d00,#ff8c00)", color: "#fff" }}
                    >
                      {salvandoTitulo ? "…" : "OK"}
                    </button>
                    <button
                      onClick={() => { setEditandoTitulo(false); setNovoTitulo(aula.aula) }}
                      className="h-8 w-8 flex items-center justify-center rounded-[6px] shrink-0"
                      style={{ backgroundColor: "var(--ds-surface-low)", color: "var(--ds-muted)" }}
                    >
                      <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6L6 18M6 6l12 12"/>
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 group">
                    <p className="text-[15px] font-700 leading-tight truncate" style={{ color: "var(--ds-on-surface)" }}>
                      {aula.aula}
                    </p>
                    <button
                      onClick={() => setEditandoTitulo(true)}
                      className="opacity-0 group-hover:opacity-100 flex items-center justify-center w-6 h-6 rounded-[4px] transition-opacity shrink-0"
                      style={{ backgroundColor: "var(--ds-surface-low)", color: "var(--ds-muted)" }}
                      title="Editar título"
                    >
                      <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                  </div>
                )}
                <p className="text-[12px] mt-0.5" style={{ color: "var(--ds-muted)" }}>{aula.data}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex items-center justify-center w-8 h-8 rounded-full transition-colors shrink-0"
              style={{ backgroundColor: "var(--ds-surface-low)", color: "var(--ds-muted)" }}
              aria-label="Fechar"
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Corpo com scroll */}
          <div className="flex flex-col gap-5 px-6 py-5 overflow-y-auto flex-1">

            {/* Reagendamento */}
            <div
              className="rounded-[12px] p-4"
              style={{ backgroundColor: "var(--ds-surface-low)", border: "1px solid var(--ds-border)" }}
            >
              <p className="text-[11px] font-700 uppercase tracking-[0.06em] mb-2" style={{ color: "var(--ds-muted)" }}>
                Reagendar aula
              </p>
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  value={novaData}
                  onChange={(e) => { setNovaData(e.target.value); setConflito(false); setErro(null) }}
                  placeholder="DD/MM/AAAA"
                  className="flex-1 h-9 px-3 rounded-[8px] text-[13px] outline-none"
                  style={{
                    backgroundColor: "var(--ds-surface-card)",
                    border: "1px solid var(--ds-border)",
                    color: "var(--ds-on-surface)",
                  }}
                />
                <button
                  onClick={() => salvarData(false)}
                  disabled={salvando || novaData === aula.data}
                  className="h-9 px-4 rounded-[8px] text-[13px] font-600 transition-opacity disabled:opacity-50 shrink-0"
                  style={{ background: "linear-gradient(135deg,#904d00,#ff8c00)", color: "#fff" }}
                >
                  {salvando ? "Salvando…" : "Salvar"}
                </button>
              </div>
              {conflito && (
                <div className="mt-3 p-3 rounded-[8px]" style={{ backgroundColor: "var(--ds-surface-card)", border: "1px solid var(--ds-border)" }}>
                  <p className="text-[13px] font-600 mb-2" style={{ color: "var(--ds-terracotta)" }}>
                    Já existe uma aula nesta data para este plano
                  </p>
                  <div className="flex gap-2">
                    <button onClick={() => salvarData(true)} disabled={salvando}
                      className="h-8 px-3 rounded-[8px] text-[12px] font-600 disabled:opacity-50"
                      style={{ background: "linear-gradient(135deg,#904d00,#ff8c00)", color: "#fff" }}>
                      Confirmar mesmo assim
                    </button>
                    <button onClick={() => setConflito(false)}
                      className="h-8 px-3 rounded-[8px] text-[12px] font-500"
                      style={{ backgroundColor: "var(--ds-surface-low)", border: "1px solid var(--ds-border)", color: "var(--ds-on-surface)" }}>
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
              {erro && <p className="mt-1 text-[12px]" style={{ color: "var(--ds-terracotta)" }}>{erro}</p>}
            </div>

            {/* Conteúdo */}
            <Section label="Conteúdo" text={aula.conteudo} />

            {/* Objetivo */}
            <Section label="Objetivo" text={aula.objetivo} />

            {/* Metodologia */}
            <Section label="Metodologia" text={aula.metodologia} />

            {/* Recursos */}
            {aula.recursos && aula.recursos.length > 0 && (
              <div>
                <Label>Recursos</Label>
                <ul className="flex flex-col gap-1 mt-1">
                  {aula.recursos.map((r, i) => (
                    <li key={i} className="flex items-start gap-2 text-[13px]" style={{ color: "var(--ds-on-surface)" }}>
                      <span style={{ color: "var(--ds-primary-bright)" }}>•</span>
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Links */}
            <div className="flex gap-3 flex-wrap">
              {aula.video_url && (
                <a href={aula.video_url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 h-8 px-3 rounded-[8px] text-[12px] font-600 no-underline transition-opacity hover:opacity-80"
                  style={{ backgroundColor: "var(--ds-surface-low)", color: "var(--ds-primary)", border: "1px solid var(--ds-border)" }}>
                  <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                  </svg>
                  Ver vídeo
                </a>
              )}
              {aula.referencia_url && (
                <a href={aula.referencia_url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 h-8 px-3 rounded-[8px] text-[12px] font-600 no-underline transition-opacity hover:opacity-80"
                  style={{ backgroundColor: "var(--ds-surface-low)", color: "var(--ds-primary)", border: "1px solid var(--ds-border)" }}>
                  <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
                  </svg>
                  Referência
                </a>
              )}
            </div>
          </div>

          {/* Footer */}
          <div
            className="px-6 py-4 shrink-0 flex items-center justify-between gap-3"
            style={{ borderTop: "1px solid var(--ds-border)" }}
          >
            {/* Botão de download com dropdown */}
            <div className="relative" ref={menuRef}>
              <div
                className="flex rounded-[10px] overflow-hidden"
                style={{ background: "linear-gradient(135deg,#904d00,#ff8c00)" }}
              >
                <button
                  onClick={() => setMenuDownload((v) => !v)}
                  disabled={baixando}
                  className="flex items-center gap-2 h-9 px-4 text-[13px] font-600 text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                >
                  {baixando ? (
                    <>
                      <svg className="animate-spin" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                        <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeOpacity={0.3}/><path d="M3 12a9 9 0 019-9"/>
                      </svg>
                      Baixando…
                    </>
                  ) : (
                    <>
                      <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                      </svg>
                      Baixar aula
                    </>
                  )}
                </button>
                <div style={{ width: 1, backgroundColor: "rgba(255,255,255,0.3)" }} />
                <button
                  onClick={() => setMenuDownload((v) => !v)}
                  disabled={baixando}
                  className="flex items-center justify-center w-8 h-9 text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                  aria-label="Escolher formato"
                >
                  <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"
                    style={{ transition: "transform 0.2s", transform: menuDownload ? "rotate(180deg)" : "rotate(0deg)" }}>
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </button>
              </div>

              {menuDownload && (
                <div
                  className="absolute bottom-full left-0 mb-1.5 rounded-[12px] overflow-hidden z-50"
                  style={{
                    backgroundColor: "var(--ds-surface-card)",
                    border: "1px solid var(--ds-border)",
                    boxShadow: "0 8px 24px var(--ds-shadow-lg)",
                    minWidth: 180,
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
                      <p className="text-[11px]" style={{ color: "var(--ds-muted)" }}>Pronto pra imprimir</p>
                    </div>
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={onClose}
              className="h-9 px-5 rounded-[10px] text-[13px] font-600 transition-colors"
              style={{ backgroundColor: "var(--ds-surface-low)", color: "var(--ds-on-surface)", border: "1px solid var(--ds-border)" }}
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-700 uppercase tracking-[0.06em] mb-1" style={{ color: "var(--ds-muted)" }}>
      {children}
    </p>
  )
}

function Section({ label, text }: { label: string; text: string }) {
  return (
    <div>
      <Label>{label}</Label>
      <p className="text-[13px] leading-relaxed whitespace-pre-line" style={{ color: "var(--ds-on-surface)" }}>
        {text}
      </p>
    </div>
  )
}
