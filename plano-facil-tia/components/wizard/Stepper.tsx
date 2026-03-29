"use client"

import { useWizardStore } from "@/store/wizardStore"

export default function Stepper() {
  const passo = useWizardStore((s) => s.passo)

  return (
    <div className="flex gap-3">
      {[1, 2, 3, 4, 5].map((step) => (
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
