"use client"

import { useState } from "react"
import { useWizardStore } from "@/store/wizardStore"

const materias = ["Matemática", "Português", "História", "Geografia", "Ciências", "Arte", "Ed. Física"]

export default function PassoMateria() {
  const { materia, setMateria, avancar, voltar } = useWizardStore()
  const [outra, setOutra] = useState(
    materias.includes(materia) ? "" : materia
  )
  const [usandoOutra, setUsandoOutra] = useState(
    !!materia && !materias.includes(materia)
  )

  function selecionar(m: string) {
    setUsandoOutra(false)
    setOutra("")
    setMateria(m)
  }

  function selecionarOutra() {
    setUsandoOutra(true)
    setMateria(outra)
  }

  const podeAvancar = usandoOutra ? outra.trim().length > 0 : !!materia

  function handleAvancar() {
    if (usandoOutra) setMateria(outra.trim())
    avancar()
  }

  return (
    <div>
      <h2 className="text-xl font-medium text-[#7c4a2d] mb-6">Escolha a matéria</h2>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {materias.map((m) => (
          <button
            key={m}
            onClick={() => selecionar(m)}
            className="h-14 rounded-2xl text-base font-medium transition"
            style={{
              backgroundColor: materia === m && !usandoOutra ? "#fff1ea" : "#fff8f5",
              color: materia === m && !usandoOutra ? "#2f1402" : "#564334",
              outline: materia === m && !usandoOutra ? "2px solid #ff8c00" : "none",
            }}
          >
            {m}
          </button>
        ))}
      </div>

      {/* Outra matéria */}
      <div
        className="rounded-2xl p-4 mb-8 cursor-pointer transition"
        style={{
          backgroundColor: usandoOutra ? "#fff1ea" : "#fff8f5",
          outline: usandoOutra ? "2px solid #ff8c00" : "none",
        }}
        onClick={selecionarOutra}
      >
        <p className="text-sm font-medium text-[#7c4a2d] mb-2">Outra matéria</p>
        <input
          type="text"
          maxLength={40}
          placeholder="Digite a matéria..."
          value={outra}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => {
            setOutra(e.target.value)
            setUsandoOutra(true)
            setMateria(e.target.value)
          }}
          className="w-full bg-transparent text-[#2f1402] outline-none text-sm placeholder:text-[#a87b5e]"
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={voltar}
          className="h-14 px-6 rounded-[14px] text-[#7c4a2d] font-medium transition"
          style={{ backgroundColor: "#fff1ea" }}
        >
          Voltar
        </button>
        <button
          disabled={!podeAvancar}
          onClick={handleAvancar}
          className="flex-1 h-14 rounded-[14px] text-white font-semibold disabled:opacity-60 transition-opacity hover:opacity-90"
          style={{ background: "linear-gradient(135deg,#904d00,#ff8c00)" }}
        >
          Próximo
        </button>
      </div>
    </div>
  )
}
