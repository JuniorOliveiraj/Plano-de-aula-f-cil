"use client"

import Link from "next/link"
import { useState } from "react"
import type { Aula } from "@/lib/validations"

interface Props {
  planoId: string
  serie: string
  materia: string
  tipo: "MENSAL" | "AULA_UNICA"
  aulas: Aula[]
  createdAt: string
  codigoBncc?: string
}

export default function ResultadoClient({ planoId, serie, materia, tipo, aulas, createdAt, codigoBncc }: Props) {
  const [baixando, setBaixando] = useState(false)

  const data = new Date(createdAt).toLocaleDateString("pt-BR", {
    month: "long", year: "numeric",
  })

  async function handleDownload(formato: "word" | "pdf") {
    setBaixando(true)
    try {
      const res = await fetch(`/api/planos/${planoId}?formato=${formato}`)
      if (!res.ok) throw new Error()
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `plano_${serie}_${materia}.${formato === "pdf" ? "pdf" : "docx"}`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      alert("Erro ao baixar. Tenta de novo!")
    } finally {
      setBaixando(false)
    }
  }

  const preview = aulas.slice(0, 3)

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Badge de sucesso */}
      <div
        className="flex items-center gap-3 p-5 rounded-[20px]"
        style={{ backgroundColor: "var(--ds-plan-pro-bg)", border: "1px solid var(--ds-ink-success)" }}
      >
        <span className="text-3xl">🎉</span>
        <div>
          <p className="text-[17px] font-700" style={{ color: "var(--ds-ink-success)" }}>Seu plano está pronto!</p>
          <p className="text-[14px]" style={{ color: "var(--ds-secondary)" }}>
            {materia} — {serie} — {data}
          </p>
        </div>
      </div>

      {/* Preview da tabela */}
      <div className="rounded-[20px] overflow-hidden" style={{ backgroundColor: "var(--ds-surface-card)", boxShadow: "0 4px 20px var(--ds-shadow)", border: "1px solid var(--ds-border)" }}>
        <div className="px-6 py-4" style={{ borderBottom: "1px solid var(--ds-border)" }}>
          <p className="text-[15px] font-600" style={{ color: "var(--ds-on-surface)" }}>
            Preview — primeiras {preview.length} aulas
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: "var(--ds-surface-low)" }}>
                {["BNCC", "Data", "Objetivo", "Metodologia"].map((col) => (
                  <th key={col} className="text-left px-4 py-3 text-[12px] font-700 uppercase tracking-wide" style={{ color: "var(--ds-muted)" }}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {preview.map((aula, i) => (
                <tr key={i} style={{ borderTop: "1px solid var(--ds-border)" }}>
                  <td className="px-4 py-3 font-600 whitespace-nowrap" style={{ color: "var(--ds-secondary)" }}>
                    {codigoBncc ?? "—"}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap" style={{ color: "var(--ds-terracotta)" }}>{aula.data}</td>
                  <td className="px-4 py-3" style={{ color: "var(--ds-on-surface)" }}>{aula.objetivo}</td>
                  <td className="px-4 py-3" style={{ color: "var(--ds-terracotta)" }}>{aula.metodologia}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {aulas.length > 3 && (
          <p className="text-center text-[13px] py-3" style={{ color: "var(--ds-muted)" }}>
            + {aulas.length - 3} aulas no arquivo completo
          </p>
        )}
      </div>

      {/* Ações */}
      <div className="flex gap-3">
        <button
          onClick={() => handleDownload("word")}
          disabled={baixando}
          className="flex-1 flex items-center justify-center gap-2 h-14 rounded-[14px] text-white font-semibold disabled:opacity-70 transition-opacity hover:opacity-90"
          style={{ background: "linear-gradient(135deg,#904d00,#ff8c00)" }}
        >
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
          </svg>
          {baixando ? "Baixando..." : "Baixar Word"}
        </button>
        <button
          onClick={() => handleDownload("pdf")}
          disabled={baixando}
          className="flex-1 flex items-center justify-center gap-2 h-14 rounded-[14px] font-semibold disabled:opacity-70 transition-opacity hover:opacity-90"
          style={{ backgroundColor: "var(--ds-surface-low)", color: "var(--ds-terracotta)" }}
        >
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" />
          </svg>
          Baixar PDF
        </button>
        <Link
          href="/dashboard"
          className="h-14 px-6 rounded-[14px] font-medium no-underline flex items-center transition-opacity hover:opacity-90"
          style={{ backgroundColor: "var(--ds-surface-low)", color: "var(--ds-terracotta)" }}
        >
          Início
        </Link>
      </div>
    </div>
  )
}

