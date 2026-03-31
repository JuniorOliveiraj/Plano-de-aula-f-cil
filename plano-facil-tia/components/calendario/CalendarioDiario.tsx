"use client"

import type { AulaItem } from "@/lib/distribuidor"

interface PlanoCalendarioResumo {
  id: string
  serie: string
  materia: string
  tipo: "MENSAL" | "AULA_UNICA"
  mesReferencia: string | null
  aulas: AulaItem[]
}

interface AulaComPlano {
  aula: AulaItem
  planoId: string
  aulaIndex: number
  materia: string
  serie: string
}

interface CalendarioDiarioProps {
  planos: PlanoCalendarioResumo[]
  dia: Date
  onAulaSelect: (aula: AulaItem, planoId: string, aulaIndex: number) => void
}

function formatarDataStr(date: Date): string {
  const d = String(date.getDate()).padStart(2, "0")
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const a = date.getFullYear()
  return `${d}/${m}/${a}`
}

export default function CalendarioDiario({ planos, dia, onAulaSelect }: CalendarioDiarioProps) {
  const dataStr = formatarDataStr(dia)

  const aulasNoDia: AulaComPlano[] = []
  for (const plano of planos) {
    plano.aulas.forEach((aula, idx) => {
      if (aula.data === dataStr) {
        aulasNoDia.push({
          aula,
          planoId: plano.id,
          aulaIndex: idx,
          materia: plano.materia,
          serie: plano.serie,
        })
      }
    })
  }

  if (aulasNoDia.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-16 rounded-[12px]"
        style={{ backgroundColor: "var(--ds-surface-low)" }}
      >
        <svg
          width="40"
          height="40"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ color: "var(--ds-muted)", marginBottom: 12 }}
        >
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        <p className="text-[14px]" style={{ color: "var(--ds-muted)" }}>
          Nenhuma aula para este dia
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {aulasNoDia.map(({ aula, planoId, aulaIndex, materia, serie }) => (
        <button
          key={`${planoId}-${aulaIndex}`}
          onClick={() => onAulaSelect(aula, planoId, aulaIndex)}
          className="w-full text-left flex flex-col gap-3 p-4 rounded-[12px] transition-colors"
          style={{
            backgroundColor: "var(--ds-surface-card)",
            border: "1px solid var(--ds-border)",
            boxShadow: "0 1px 4px var(--ds-shadow)",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--ds-primary)" }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--ds-border)" }}
        >
          {/* Cabeçalho do card */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-[17px] font-700" style={{ color: "var(--ds-on-surface)" }}>
                {aula.aula}
              </p>
               <p className="text-[14px] mt-0.5" style={{ color: "var(--ds-muted)" }}>
                {materia} · {serie}
              </p>
            </div>
            <span
              className="shrink-0 text-[12px] font-700 px-2.5 py-1 rounded-full"
              style={{
                backgroundColor: "var(--ds-surface-low)",
                color: "var(--ds-primary)",
                border: "1px solid var(--ds-border)",
              }}
            >
              {aula.data}
            </span>
          </div>

          {/* Conteúdo */}
          <div>
            <p className="text-[12px] font-700 uppercase tracking-[0.06em] mb-1" style={{ color: "var(--ds-muted)" }}>
              Conteúdo
            </p>
            <p className="text-[15px] leading-relaxed" style={{ color: "var(--ds-on-surface)" }}>
              {aula.conteudo}
            </p>
          </div>

          {/* Objetivo */}
          <div>
            <p className="text-[11px] font-700 uppercase tracking-[0.06em] mb-1" style={{ color: "var(--ds-muted)" }}>
              Objetivo
            </p>
            <p className="text-[15px] leading-relaxed" style={{ color: "var(--ds-on-surface)" }}>
              {aula.objetivo}
            </p>
          </div>

          {/* Metodologia */}
          <div>
            <p className="text-[11px] font-700 uppercase tracking-[0.06em] mb-1" style={{ color: "var(--ds-muted)" }}>
              Metodologia
            </p>
            <p className="text-[15px] leading-relaxed" style={{ color: "var(--ds-on-surface)" }}>
              {aula.metodologia}
            </p>
          </div>

          {/* Recursos */}
          {aula.recursos && aula.recursos.length > 0 && (
            <div>
              <p className="text-[11px] font-700 uppercase tracking-[0.06em] mb-1" style={{ color: "var(--ds-muted)" }}>
                Recursos
              </p>
              <ul className="flex flex-col gap-0.5">
                {aula.recursos.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-[13px]" style={{ color: "var(--ds-on-surface)" }}>
                    <span style={{ color: "var(--ds-primary)" }}>•</span>
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Links */}
          <div className="flex gap-3 flex-wrap">
            {aula.video_url && (
              <a
                href={aula.video_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1 text-[12px] underline"
                style={{ color: "var(--ds-primary)" }}
              >
                <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="23 7 16 12 23 17 23 7" />
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                </svg>
                Vídeo
              </a>
            )}
            {aula.referencia_url && (
              <a
                href={aula.referencia_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1 text-[12px] underline"
                style={{ color: "var(--ds-primary)" }}
              >
                <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
                </svg>
                Referência
              </a>
            )}
          </div>
        </button>
      ))}
    </div>
  )
}
