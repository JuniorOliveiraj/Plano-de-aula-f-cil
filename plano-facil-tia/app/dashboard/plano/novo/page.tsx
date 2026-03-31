"use client"

import React, { useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { useWizardStore, getPassoMaximo } from "@/store/wizardStore"
import Stepper from "@/components/wizard/Stepper"
import PassoEscolhaModo from "@/components/wizard/PassoEscolhaModo"
import PassoSerie from "@/components/wizard/PassoSerie"
import PassoMateria from "@/components/wizard/PassoMateria"
import PassoTipo from "@/components/wizard/PassoTipo"
import PassoUpload from "@/components/wizard/PassoUpload"
import PassoRevisao from "@/components/wizard/PassoRevisao"
import PassoTema from "@/components/wizard/PassoTema"
import PassoBncc from "@/components/wizard/PassoBncc"
import PassoDuracao from "@/components/wizard/PassoDuracao"

const PASSOS_COM_PDF: Record<number, React.ComponentType> = {
  1: PassoEscolhaModo,
  2: PassoSerie,
  3: PassoMateria,
  4: PassoTipo,
  5: PassoBncc,
  6: PassoUpload,
  7: PassoRevisao,
}

const PASSOS_SEM_PDF: Record<number, React.ComponentType> = {
  1: PassoEscolhaModo,
  2: PassoSerie,
  3: PassoMateria,
  4: PassoTipo,
  5: PassoTema,
  6: PassoBncc,
  7: PassoDuracao,
  8: PassoRevisao,
}

function NovoPlanoContent() {
  const searchParams = useSearchParams()
  const passo = useWizardStore((s) => s.passo)
  const modo = useWizardStore((s) => s.modo)
  const setDataAula = useWizardStore((s) => s.setDataAula)
  const setTipo = useWizardStore((s) => s.setTipo)
  const setModo = useWizardStore((s) => s.setModo)

  useEffect(() => {
    const dataParam = searchParams.get("data")
    if (dataParam) {
      // Converter de DD-MM-AAAA para DD/MM/AAAA
      const dataFormatada = dataParam.replace(/-/g, "/")
      setDataAula(dataFormatada)
      setTipo("AULA_UNICA")
      // Pré-selecionar modo SEM_PDF e avançar para o passo 2
      setModo("SEM_PDF")
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const mapaAtual = modo === "SEM_PDF" ? PASSOS_SEM_PDF : PASSOS_COM_PDF
  const PassoAtual = mapaAtual[passo]
  const passoMaximo = getPassoMaximo(modo)

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-[28px] font-700 leading-tight" style={{ color: "var(--ds-on-surface)" }}>
          Criar Novo Plano
        </h1>
        <p className="text-[14px] mt-1" style={{ color: "var(--ds-muted)" }}>
          Passo {passo} de {passoMaximo}
        </p>
      </div>

      <Stepper />

      <div
        className="mt-8 rounded-[2rem] p-8"
        style={{
          backgroundColor: "var(--ds-surface-card)",
          boxShadow: "0 24px 48px var(--ds-shadow-lg)",
        }}
      >
        {PassoAtual && <PassoAtual />}
      </div>
    </div>
  )
}

export default function NovoPlanoPage() {
  return (
    <Suspense fallback={null}>
      <NovoPlanoContent />
    </Suspense>
  )
}
