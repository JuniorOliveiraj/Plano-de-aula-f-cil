"use client"

import { useWizardStore } from "@/store/wizardStore"

const series = ["1º Ano", "2º Ano", "3º Ano", "4º Ano", "5º Ano"]

export default function PassoSerie() {
  const { serie, setSerie, avancar } = useWizardStore()

  return (
    <div>
      <h2 className="text-xl font-medium mb-6" style={{ color: "var(--ds-terracotta)" }}>
        Escolha a série
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {series.map((s) => (
          <button
            key={s}
            onClick={() => setSerie(s)}
            className="h-16 rounded-2xl text-base font-medium transition"
            style={{
              backgroundColor: serie === s ? "var(--ds-surface-low)" : "var(--ds-surface)",
              outline: serie === s ? "2px solid var(--ds-primary-bright)" : "none",
              color: serie === s ? "var(--ds-on-surface)" : "var(--ds-on-surface-var)",
            }}
          >
            {s}
          </button>
        ))}
      </div>

      <button
        disabled={!serie}
        onClick={avancar}
        className="w-full h-14 rounded-[14px] text-white font-semibold disabled:opacity-60 transition-opacity hover:opacity-90"
        style={{ background: "linear-gradient(135deg,#904d00,#ff8c00)" }}
      >
        Próximo
      </button>
    </div>
  )
}

