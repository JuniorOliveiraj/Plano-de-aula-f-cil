"use client"

import { useWizardStore } from "@/store/wizardStore"
import Stepper from "@/components/wizard/Stepper"
import PassoSerie from "@/components/wizard/PassoSerie"
import PassoMateria from "@/components/wizard/PassoMateria"
import PassoTipo from "@/components/wizard/PassoTipo"
import PassoUpload from "@/components/wizard/PassoUpload"
import PassoRevisao from "@/components/wizard/PassoRevisao"

const TITULOS = ["", "Série", "Matéria", "Tipo de plano", "PDF do livro", "Revisão"]

export default function NovoPlanoPage() {
  const passo = useWizardStore((s) => s.passo)

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-[28px] font-700 text-[#2f1402] leading-tight">
          Criar Novo Plano
        </h1>
        <p className="text-[14px] text-[#a87b5e] mt-1">
          Passo {passo} de 5 — {TITULOS[passo]}
        </p>
      </div>

      <Stepper />

      <div className="mt-8 bg-white rounded-[2rem] p-8 shadow-[0_24px_48px_rgba(144,77,0,0.06)]">
        {passo === 1 && <PassoSerie />}
        {passo === 2 && <PassoMateria />}
        {passo === 3 && <PassoTipo />}
        {passo === 4 && <PassoUpload />}
        {passo === 5 && <PassoRevisao />}
      </div>
    </div>
  )
}
