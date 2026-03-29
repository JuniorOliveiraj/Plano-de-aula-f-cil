"use client"

import { useWizardStore } from "@/store/wizardStore"

const opcoes = [
  {
    valor: 45 as const,
    emoji: "⏱️",
    titulo: "45 minutos",
    descricao: "Aula padrão — ideal para a maioria das turmas",
  },
  {
    valor: 90 as const,
    emoji: "🕐",
    titulo: "90 minutos",
    descricao: "Aula dupla — mais tempo para atividades práticas",
  },
]

export default function PassoDuracao() {
  const { duracao, setDuracao, avancar, voltar } = useWizardStore()

  return (
    <div>
      <h2 className="text-xl font-medium text-[#7c4a2d] mb-6">
        Qual é a duração da aula?
      </h2>

      <div className="grid grid-cols-2 gap-4 mb-3">
        {opcoes.map((op) => (
          <button
            key={op.valor}
            onClick={() => { setDuracao(op.valor); avancar() }}
            className="flex flex-col items-start gap-2 p-5 rounded-2xl text-left transition"
            style={{
              backgroundColor: duracao === op.valor ? "#fff1ea" : "#fff8f5",
              outline: duracao === op.valor ? "2px solid #ff8c00" : "none",
            }}
          >
            <span className="text-2xl">{op.emoji}</span>
            <p className="text-[15px] font-semibold text-[#2f1402]">{op.titulo}</p>
            <p className="text-[13px] text-[#7c4a2d]">{op.descricao}</p>
          </button>
        ))}
      </div>

      <p className="text-xs text-[#a87b5e] mb-6">
        Você pode avançar sem selecionar — o padrão é 45 minutos.
      </p>

      <button
        onClick={voltar}
        className="h-14 px-6 rounded-[14px] text-[#7c4a2d] font-medium"
        style={{ backgroundColor: "#fff1ea" }}
      >
        Voltar
      </button>
    </div>
  )
}
