"use client"

import { useRef, useState } from "react"
import { useDrop } from "react-dnd"
import { useRouter } from "next/navigation"
import AulaChip from "./AulaChip"
import type { AulaItem } from "@/lib/distribuidor"

interface AulaNodia {
  aula: AulaItem
  planoId: string
  aulaIndex: number
  materia: string
}

interface DragItem {
  planoId: string
  aulaIndex: number
  data: string
}

interface DiaCalendarioProps {
  dia: number
  mes: number
  ano: number
  aulas: AulaNodia[]
  onAulaSelect: (aula: AulaItem, planoId: string, aulaIndex: number) => void
  onDrop: (planoId: string, aulaIndex: number, novaData: string) => void
}

function formatarDataUrl(dia: number, mes: number, ano: number): string {
  const d = String(dia).padStart(2, "0")
  const m = String(mes).padStart(2, "0")
  return `${d}-${m}-${ano}`
}

function formatarDataDisplay(dia: number, mes: number, ano: number): string {
  const d = String(dia).padStart(2, "0")
  const m = String(mes).padStart(2, "0")
  return `${d}/${m}/${ano}`
}

export default function DiaCalendario({
  dia,
  mes,
  ano,
  aulas,
  onAulaSelect,
  onDrop,
}: DiaCalendarioProps) {
  const router = useRouter()
  const [miniMenu, setMiniMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const ref = useRef<HTMLDivElement>(null)
  const [{ isOver }, drop] = useDrop<DragItem, void, { isOver: boolean }>(() => ({
    accept: "AULA_CHIP",
    drop: (item) => {
      const novaData = formatarDataDisplay(dia, mes, ano)
      onDrop(item.planoId, item.aulaIndex, novaData)
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }))

  drop(ref)

  function handleCelulaClick() {
    if (aulas.length === 0) {
      router.push(`/dashboard/plano/novo?data=${formatarDataUrl(dia, mes, ano)}`)
    } else {
      setMiniMenu((v) => !v)
    }
  }

  function handleAdicionarAula() {
    setMiniMenu(false)
    router.push(`/dashboard/plano/novo?data=${formatarDataUrl(dia, mes, ano)}`)
  }

  return (
    <div
      ref={ref}
      className="relative flex flex-col gap-2 p-2 rounded-[10px] min-h-[100px] transition-colors"
      style={{
        border: "1px solid var(--ds-border)",
        backgroundColor: isOver ? "var(--ds-surface-low)" : "var(--ds-surface-card)",
        cursor: aulas.length === 0 ? "pointer" : "default",
      }}
      onClick={aulas.length === 0 ? handleCelulaClick : undefined}
    >
      {/* Número do dia */}
      <button
        className="self-start text-[14px] font-700 w-7 h-7 flex items-center justify-center rounded-full transition-colors"
        style={{ color: "var(--ds-on-surface)" }}
        onClick={(e) => { e.stopPropagation(); handleCelulaClick() }}
        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--ds-surface-low)" }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent" }}
      >
        {dia}
      </button>

      {/* Chips de aulas */}
      <div className="flex flex-col gap-1">
        {aulas.map((item) => (
          <AulaChip
            key={`${item.planoId}-${item.aulaIndex}`}
            aula={item.aula}
            planoId={item.planoId}
            aulaIndex={item.aulaIndex}
            materia={item.materia}
            onSelect={onAulaSelect}
          />
        ))}
      </div>

      {/* Mini-menu para dias com aulas */}
      {miniMenu && aulas.length > 0 && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setMiniMenu(false)}
          />
          <div
            ref={menuRef}
            className="absolute top-8 left-0 z-20 rounded-[10px] overflow-hidden"
            style={{
              backgroundColor: "var(--ds-surface-card)",
              border: "1px solid var(--ds-border)",
              boxShadow: "0 8px 24px var(--ds-shadow)",
              minWidth: 200,
            }}
          >
            <button
              className="w-full flex items-center gap-2 px-4 py-2.5 text-left text-[13px] font-500 transition-colors"
              style={{ color: "var(--ds-on-surface)" }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--ds-surface-low)" }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent" }}
              onClick={(e) => { e.stopPropagation(); setMiniMenu(false) }}
            >
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              Ver aulas do dia
            </button>
            <div style={{ height: 1, backgroundColor: "var(--ds-border)", margin: "0 12px" }} />
            <button
              className="w-full flex items-center gap-2 px-4 py-2.5 text-left text-[13px] font-500 transition-colors"
              style={{ color: "var(--ds-on-surface)" }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--ds-surface-low)" }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent" }}
              onClick={(e) => { e.stopPropagation(); handleAdicionarAula() }}
            >
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v8M8 12h8" />
              </svg>
              Adicionar nova aula neste dia
            </button>
          </div>
        </>
      )}
    </div>
  )
}
