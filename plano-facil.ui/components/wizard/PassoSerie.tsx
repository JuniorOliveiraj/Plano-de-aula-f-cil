"use client"

import { useWizardStore } from "@/store/wizardStore"

const series = ["1º Ano", "2º Ano", "3º Ano", "4º Ano", "5º Ano"]

export default function PassoSerie() {
  const { serie, setSerie, avancar } = useWizardStore()

  return (
    <div>
      <h2 className="text-xl font-medium text-[#7c4a2d] mb-6">
        Escolha a série
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {series.map((s) => (
          <button
            key={s}
            onClick={() => setSerie(s)}
            className={`h-16 rounded-2xl text-base font-medium transition ${
              serie === s
                ? "bg-[#fff1ea] ring-2 ring-[#ff8c00] text-[#2f1402]"
                : "bg-[#fff8f5] text-[#564334]"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <button
        disabled={!serie}
        onClick={avancar}
        className="w-full h-14 rounded-[14px] bg-gradient-to-br from-[#904d00] to-[#ff8c00] text-white font-semibold disabled:opacity-60"
      >
        Próximo
      </button>
    </div>
  )
}
