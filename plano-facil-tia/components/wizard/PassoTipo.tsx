"use client"

import { useWizardStore } from "@/store/wizardStore"

export default function PassoTipo() {
  const { tipo, setTipo, pagDe, pagAte, setPaginas, avancar, voltar } = useWizardStore()

  const podeAvancar =
    tipo === "MENSAL" ||
    (tipo === "AULA_UNICA" &&
      ((!pagDe && !pagAte) || (pagDe && pagAte && !isNaN(Number(pagDe)) && !isNaN(Number(pagAte)))))

  return (
    <div>
      <h2 className="text-xl font-medium text-[#7c4a2d] mb-6">Tipo de plano</h2>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Mensal */}
        <button
          onClick={() => setTipo("MENSAL")}
          className="flex flex-col items-start gap-2 p-5 rounded-2xl text-left transition"
          style={{
            backgroundColor: tipo === "MENSAL" ? "#fff1ea" : "#fff8f5",
            outline: tipo === "MENSAL" ? "2px solid #ff8c00" : "none",
          }}
        >
          <span className="text-2xl">📅</span>
          <p className="text-[15px] font-600 text-[#2f1402]">Plano Mensal</p>
          <p className="text-[13px] text-[#7c4a2d]">20 a 25 aulas — cobre o mês inteiro</p>
        </button>

        {/* Aula única */}
        <button
          onClick={() => setTipo("AULA_UNICA")}
          className="flex flex-col items-start gap-2 p-5 rounded-2xl text-left transition"
          style={{
            backgroundColor: tipo === "AULA_UNICA" ? "#fff1ea" : "#fff8f5",
            outline: tipo === "AULA_UNICA" ? "2px solid #ff8c00" : "none",
          }}
        >
          <span className="text-2xl">📌</span>
          <p className="text-[15px] font-600 text-[#2f1402]">Aula Única</p>
          <p className="text-[13px] text-[#7c4a2d]">1 aula detalhada e específica</p>
        </button>
      </div>

      {/* Campo de páginas — só para aula única */}
      {tipo === "AULA_UNICA" && (
        <div className="rounded-2xl p-4 mb-6" style={{ backgroundColor: "#fff8f5" }}>
          <p className="text-sm font-medium text-[#7c4a2d] mb-3">
            Páginas do PDF (opcional)
          </p>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <label className="text-xs text-[#a87b5e] mb-1 block">De</label>
              <input
                type="number"
                min={1}
                value={pagDe}
                onChange={(e) => setPaginas(e.target.value, pagAte)}
                placeholder="1"
                className="w-full h-11 rounded-xl bg-white px-3 text-[#2f1402] outline-none focus:ring-2 focus:ring-[#ff8c00] text-sm"
                style={{ border: "1px solid #f0ddd0" }}
              />
            </div>
            <span className="text-[#a87b5e] mt-4">até</span>
            <div className="flex-1">
              <label className="text-xs text-[#a87b5e] mb-1 block">Até</label>
              <input
                type="number"
                min={1}
                value={pagAte}
                onChange={(e) => setPaginas(pagDe, e.target.value)}
                placeholder="50"
                className="w-full h-11 rounded-xl bg-white px-3 text-[#2f1402] outline-none focus:ring-2 focus:ring-[#ff8c00] text-sm"
                style={{ border: "1px solid #f0ddd0" }}
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={voltar}
          className="h-14 px-6 rounded-[14px] text-[#7c4a2d] font-medium"
          style={{ backgroundColor: "#fff1ea" }}
        >
          Voltar
        </button>
        <button
          disabled={!podeAvancar}
          onClick={avancar}
          className="flex-1 h-14 rounded-[14px] text-white font-semibold disabled:opacity-60 transition-opacity hover:opacity-90"
          style={{ background: "linear-gradient(135deg,#904d00,#ff8c00)" }}
        >
          Próximo
        </button>
      </div>
    </div>
  )
}
