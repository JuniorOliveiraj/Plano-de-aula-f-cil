"use client"

import { useState } from "react"
import { useWizardStore } from "@/store/wizardStore"

export function isValidTema(v: string): boolean {
  return v.trim().length >= 3 && v.trim().length <= 200
}

export default function PassoTema() {
  const { tema, setTema, avancar, voltar } = useWizardStore()
  const [valor, setValor] = useState(tema)
  const [erro, setErro] = useState<string | null>(null)

  function handleProximo() {
    if (!isValidTema(valor)) {
      setErro("Informe o tema ou atividade da aula.")
      return
    }
    setErro(null)
    setTema(valor.trim())
    avancar()
  }

  return (
    <div>
      <h2 className="text-xl font-medium text-[#7c4a2d] mb-6">
        Qual é o tema da aula?
      </h2>

      <textarea
        value={valor}
        onChange={(e) => {
          setValor(e.target.value)
          if (erro) setErro(null)
        }}
        maxLength={200}
        placeholder="Ex: Frações, Sistema Solar, Verbos no passado..."
        rows={3}
        className="w-full px-4 py-3 text-[#2f1402] resize-none outline-none transition"
        style={{
          minHeight: 56,
          backgroundColor: "#fff1ea",
          border: "1px solid #f0ddd0",
          borderRadius: "14px",
          color: "#2f1402",
        }}
      />

      <p className="text-right text-[12px] text-[#a87b5e] mt-1">
        {valor.length}/200
      </p>

      {erro && (
        <p className="text-sm text-[#ba1a1a] mt-2">{erro}</p>
      )}

      <div className="flex gap-3 mt-6">
        <button
          onClick={voltar}
          className="h-14 px-6 rounded-[14px] text-[#7c4a2d] font-medium"
          style={{ backgroundColor: "#fff1ea" }}
        >
          Voltar
        </button>
        <button
          disabled={valor.trim().length < 3}
          onClick={handleProximo}
          className="flex-1 h-14 rounded-[14px] text-white font-semibold disabled:opacity-60 transition-opacity hover:opacity-90"
          style={{ background: "linear-gradient(135deg,#904d00,#ff8c00)" }}
        >
          Próximo
        </button>
      </div>
    </div>
  )
}
