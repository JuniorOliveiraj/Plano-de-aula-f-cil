"use client"

import DiaCalendario from "./DiaCalendario"
import type { AulaItem } from "@/lib/distribuidor"

interface PlanoCalendarioResumo {
  id: string
  serie: string
  materia: string
  tipo: "MENSAL" | "AULA_UNICA"
  mesReferencia: string | null
  aulas: AulaItem[]
}

interface CalendarioSemanalProps {
  planos: PlanoCalendarioResumo[]
  semanaInicio: Date
  onAulaSelect: (aula: AulaItem, planoId: string, aulaIndex: number) => void
  onDrop: (planoId: string, aulaIndex: number, novaData: string) => void
}

const NOMES_DIA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

function formatarDataStr(date: Date): string {
  const d = String(date.getDate()).padStart(2, "0")
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const a = date.getFullYear()
  return `${d}/${m}/${a}`
}

function formatarDiaHeader(date: Date): string {
  const d = String(date.getDate()).padStart(2, "0")
  const m = String(date.getMonth() + 1).padStart(2, "0")
  return `${d}/${m}`
}

export default function CalendarioSemanal({
  planos,
  semanaInicio,
  onAulaSelect,
  onDrop,
}: CalendarioSemanalProps) {
  // Gerar os 7 dias da semana a partir de semanaInicio (domingo)
  const dias: Date[] = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(semanaInicio)
    d.setDate(semanaInicio.getDate() + i)
    return d
  })

  function aulasParaDia(date: Date) {
    const dataStr = formatarDataStr(date)
    const resultado: { aula: AulaItem; planoId: string; aulaIndex: number; materia: string }[] = []
    for (const plano of planos) {
      plano.aulas.forEach((aula, idx) => {
        if (aula.data === dataStr) {
          resultado.push({ aula, planoId: plano.id, aulaIndex: idx, materia: plano.materia })
        }
      })
    }
    return resultado
  }

  return (
    <div className="grid grid-cols-7 gap-2">
      {dias.map((dia, i) => (
        <div key={i} className="flex flex-col gap-1">
          {/* Cabeçalho da coluna */}
          <div
            className="text-center py-2 rounded-[8px]"
            style={{ backgroundColor: "var(--ds-surface-low)" }}
          >
            <p className="text-[13px] font-700 uppercase tracking-[0.06em]" style={{ color: "var(--ds-muted)" }}>
              {NOMES_DIA[dia.getDay()]}
            </p>
            <p className="text-[15px] font-700" style={{ color: "var(--ds-on-surface)" }}>
              {formatarDiaHeader(dia)}
            </p>
          </div>

          {/* Célula do dia */}
          <DiaCalendario
            dia={dia.getDate()}
            mes={dia.getMonth() + 1}
            ano={dia.getFullYear()}
            aulas={aulasParaDia(dia)}
            onAulaSelect={onAulaSelect}
            onDrop={onDrop}
          />
        </div>
      ))}
    </div>
  )
}
