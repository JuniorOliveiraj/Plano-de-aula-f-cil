"use client"

import { useRef } from "react"
import { useDrag } from "react-dnd"
import type { AulaItem } from "@/lib/distribuidor"

interface AulaChipProps {
  aula: AulaItem
  planoId: string
  aulaIndex: number
  materia: string
  onSelect: (aula: AulaItem, planoId: string, aulaIndex: number) => void
}

export default function AulaChip({ aula, planoId, aulaIndex, materia, onSelect }: AulaChipProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "AULA_CHIP",
    item: { planoId, aulaIndex, data: aula.data },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }))

  const ref = useRef<HTMLDivElement>(null)
  drag(ref)

  return (
    <div
      ref={ref}
      onClick={() => onSelect(aula, planoId, aulaIndex)}
      className="flex flex-col gap-1 px-2.5 py-3.5 rounded-[8px] text-[13px] select-none transition-opacity"
      style={{
        backgroundColor: "var(--ds-surface-low)",
        border: "1px solid var(--ds-border)",
        cursor: isDragging ? "grabbing" : "grab",
        opacity: isDragging ? 0.5 : 1,
        maxWidth: "100%",
        overflow: "hidden",
      }}
    >
      <span
        className="font-600 truncate leading-tight"
        style={{ color: "var(--ds-on-surface)" }}
      >
        {aula.aula}
      </span>
      <span
        className="truncate leading-tight"
        style={{ color: "var(--ds-muted)" }}
      >
        {materia}
      </span>
    </div>
  )
}
