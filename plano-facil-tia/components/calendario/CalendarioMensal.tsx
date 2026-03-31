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

interface CalendarioMensalProps {
  planos: PlanoCalendarioResumo[]
  mes: number
  ano: number
  onAulaSelect: (aula: AulaItem, planoId: string, aulaIndex: number) => void
  onDrop: (planoId: string, aulaIndex: number, novaData: string) => void
}

const DIAS_SEMANA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

function formatarDataStr(dia: number, mes: number, ano: number): string {
  const d = String(dia).padStart(2, "0")
  const m = String(mes).padStart(2, "0")
  return `${d}/${m}/${ano}`
}

export default function CalendarioMensal({
  planos,
  mes,
  ano,
  onAulaSelect,
  onDrop,
}: CalendarioMensalProps) {
  const totalDias = new Date(ano, mes, 0).getDate()
  const primeiroDiaSemana = new Date(ano, mes - 1, 1).getDay() // 0=Dom

  // Construir array de células: null para dias fora do mês, número para dias do mês
  const celulas: (number | null)[] = [
    ...Array(primeiroDiaSemana).fill(null),
    ...Array.from({ length: totalDias }, (_, i) => i + 1),
  ]

  // Preencher até completar a última linha (múltiplo de 7)
  while (celulas.length % 7 !== 0) {
    celulas.push(null)
  }

  function aulasParaDia(dia: number) {
    const dataStr = formatarDataStr(dia, mes, ano)
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
    <div className="flex flex-col gap-1">
      {/* Cabeçalho dos dias da semana */}
      <div className="grid grid-cols-7 gap-1">
        {DIAS_SEMANA.map((nome) => (
          <div
            key={nome}
            className="text-center text-[11px] font-700 uppercase tracking-[0.06em] py-2"
            style={{ color: "var(--ds-muted)" }}
          >
            {nome}
          </div>
        ))}
      </div>

      {/* Grade de dias */}
      <div className="grid grid-cols-7 gap-1">
        {celulas.map((dia, idx) => {
          if (dia === null) {
            return (
              <div
                key={`empty-${idx}`}
                className="min-h-[72px] rounded-[8px]"
                style={{ backgroundColor: "var(--ds-surface-low)", opacity: 0.4 }}
              />
            )
          }

          const aulas = aulasParaDia(dia)
          return (
            <DiaCalendario
              key={dia}
              dia={dia}
              mes={mes}
              ano={ano}
              aulas={aulas}
              onAulaSelect={onAulaSelect}
              onDrop={onDrop}
            />
          )
        })}
      </div>
    </div>
  )
}
