"use client"

import { useWizardStore } from "@/store/wizardStore"
import Stepper from "@/components/wizard/Stepper"
import PassoSerie from "@/components/wizard/PassoSerie"

export default function NovoPlanoPage() {
  const passo = useWizardStore((s) => s.passo)

  return (
    <div className="min-h-screen bg-[#fff8f5] px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-semibold text-[#2f1402] mb-8">
          Criar Novo Plano
        </h1>

        <Stepper />

        <div className="mt-10 bg-white rounded-[2rem] p-8 shadow-[0_24px_48px_rgba(144,77,0,0.06)]">
          {passo === 1 && <PassoSerie />}
        </div>
      </div>
    </div>
  )
}
