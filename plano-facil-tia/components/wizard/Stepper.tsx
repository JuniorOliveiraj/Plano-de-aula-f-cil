"use client"

import { useWizardStore, getPassoMaximo } from "@/store/wizardStore"

export default function Stepper() {
  const passo = useWizardStore((s) => s.passo)
  const modo = useWizardStore((s) => s.modo)
  const passoMaximo = getPassoMaximo(modo)

  return (
    <div className="flex gap-2 w-full">
      {Array.from({ length: passoMaximo }, (_, i) => i + 1).map((step) => (
        <div
          key={step}
          className={`flex-1 h-2 rounded-full transition-all duration-300 ${
            passo >= step
              ? "active-step"
              : "inactive-step"
          }`}
          style={{
            backgroundColor: passo >= step ? "var(--ds-secondary)" : "var(--ds-surface-low)"
          }}
        />
      ))}
    </div>
  )
}

