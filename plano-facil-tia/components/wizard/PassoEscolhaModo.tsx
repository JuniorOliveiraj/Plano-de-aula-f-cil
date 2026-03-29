"use client"

import { useWizardStore } from "@/store/wizardStore"

const modos = [
  {
    valor: "COM_PDF" as const,
    emoji: "📄",
    titulo: "Com PDF",
    descricao: "Envie o livro didático em PDF e a IA cria o plano",
  },
  {
    valor: "SEM_PDF" as const,
    emoji: "🤖",
    titulo: "Apenas IA",
    descricao: "Selecione série, matéria e código BNCC — sem precisar de PDF",
  },
]

export default function PassoEscolhaModo() {
  const { modo, setModo } = useWizardStore()

  function handleSelecionar(valor: "COM_PDF" | "SEM_PDF") {
    setModo(valor)
  }

  return (
    <div>
      <h2 className="text-xl font-medium text-[#7c4a2d] mb-6">
        Como você quer criar o plano?
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {modos.map((item) => {
          const selecionado = modo === item.valor
          return (
            <button
              key={item.valor}
              onClick={() => handleSelecionar(item.valor)}
              className="flex flex-col items-start gap-3 p-6 text-left transition"
              style={{
                borderRadius: "2rem",
                minHeight: "160px",
                backgroundColor: selecionado ? "#fff1ea" : "#fff8f5",
                outline: selecionado ? "2px solid #ff8c00" : "none",
              }}
            >
              <span className="text-3xl">{item.emoji}</span>
              <p className="text-[15px] font-semibold text-[#2f1402]">{item.titulo}</p>
              <p className="text-[13px] text-[#564334] leading-relaxed">{item.descricao}</p>
            </button>
          )
        })}
      </div>
    </div>
  )
}
