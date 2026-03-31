"use client"

import { useState } from "react"
import { useWizardStore } from "@/store/wizardStore"

export function isValidTema(v: string): boolean {
  return v.trim().length >= 3 && v.trim().length <= 200
}

export default function PassoTema() {
  const { tema, setTema, nomeAula, setNomeAula, avancar, voltar } = useWizardStore()
  const [valor, setValor] = useState(tema)
  const [nomeValor, setNomeValor] = useState(nomeAula)
  const [erro, setErro] = useState<string | null>(null)

  function handleProximo() {
    if (!isValidTema(valor)) {
      setErro("Informe o tema ou atividade da aula.")
      return
    }
    setErro(null)
    setTema(valor.trim())
    setNomeAula(nomeValor.trim())
    avancar()
  }

  return (
    <div>
      <h2 className="text-xl font-medium mb-6" style={{ color: "var(--ds-terracotta)" }}>
        Qual é o tema da aula?
      </h2>

      {erro && (
        <p className="text-sm mt-2" style={{ color: "var(--ds-ink-error)" }}>{erro}</p>
      )}

      {/* Nome da aula — opcional */}
      <div className="mt-5">
        <label className="block text-sm font-medium mb-2" style={{ color: "var(--ds-on-surface)" }}>
          Nome da aula <span className="text-[12px] font-400" style={{ color: "var(--ds-muted)" }}>(opcional)</span>
        </label>
        <input
          type="text"
          value={nomeValor}
          onChange={(e) => setNomeValor(e.target.value)}
          maxLength={80}
          placeholder="Ex: Aula 1 — Introdução às Frações"
          className="w-full h-11 px-4 outline-none transition"
          style={{
            backgroundColor: "var(--ds-surface-low)",
            border: "1px solid var(--ds-border)",
            borderRadius: "14px",
            color: "var(--ds-on-surface)",
          }}
        />
        <p className="text-[12px] mt-1" style={{ color: "var(--ds-muted)" }}>
          Se não preencher, a IA vai nomear automaticamente.
        </p>
      </div>

      <br/>
      <textarea
        value={valor}
        onChange={(e) => {
          setValor(e.target.value)
          if (erro) setErro(null)
        }}
        maxLength={200}
        placeholder="Ex: Frações, Sistema Solar, Verbos no passado..."
        rows={3}
        className="w-full px-4 py-3 resize-none outline-none transition"
        style={{
          minHeight: 56,
          backgroundColor: "var(--ds-surface-low)",
          border: "1px solid var(--ds-border)",
          borderRadius: "14px",
          color: "var(--ds-on-surface)",
        }}
      />

      <p className="text-right text-[12px] mt-1" style={{ color: "var(--ds-muted)" }}>
        {valor.length}/200
      </p>

      

      <div className="flex gap-3 mt-6">
        <button
          onClick={voltar}
          className="h-14 px-6 rounded-[14px] font-medium"
          style={{ backgroundColor: "var(--ds-surface-low)", color: "var(--ds-terracotta)" }}
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

