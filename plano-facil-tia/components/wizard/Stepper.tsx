"use client"

import { useWizardStore, getPassoMaximo } from "@/store/wizardStore"

export default function Stepper() {
  const passo = useWizardStore((s) => s.passo)
  const modo = useWizardStore((s) => s.modo)
  const passoMaximo = getPassoMaximo(modo)

  return (
    <div className="flex gap-3">
      {Array.from({ length: passoMaximo }, (_, i) => i + 1).map((step) => (
        <div
          key={step}
          className={`h-3 rounded-full transition-all duration-300 ${
            passo >= step
              ? "bg-[#c2571a] w-16"
              : "bg-[#fff1ea] w-8"
          }`}
        />
      ))}
    </div>
  )
}
