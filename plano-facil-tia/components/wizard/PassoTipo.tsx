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
      <h2 className="text-xl font-medium mb-6" style={{ color: "var(--ds-terracotta)" }}>Tipo de plano</h2>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Mensal */}
        <button
          onClick={() => setTipo("MENSAL")}
          className="flex flex-col items-start gap-2 p-5 rounded-2xl text-left transition"
          style={{
            backgroundColor: tipo === "MENSAL" ? "var(--ds-surface-low)" : "var(--ds-surface)",
            outline: tipo === "MENSAL" ? "2px solid var(--ds-primary-bright)" : "none",
          }}
        >
          <span className="text-2xl">📅</span>
          <p className="text-[15px] font-600" style={{ color: "var(--ds-on-surface)" }}>Plano Mensal</p>
          <p className="text-[13px]" style={{ color: "var(--ds-terracotta)" }}>20 a 25 aulas — cobre o mês inteiro</p>
        </button>

        {/* Aula única */}
        <button
          onClick={() => setTipo("AULA_UNICA")}
          className="flex flex-col items-start gap-2 p-5 rounded-2xl text-left transition"
          style={{
            backgroundColor: tipo === "AULA_UNICA" ? "var(--ds-surface-low)" : "var(--ds-surface)",
            outline: tipo === "AULA_UNICA" ? "2px solid var(--ds-primary-bright)" : "none",
          }}
        >
          <span className="text-2xl">📌</span>
          <p className="text-[15px] font-600" style={{ color: "var(--ds-on-surface)" }}>Aula Única</p>
          <p className="text-[13px]" style={{ color: "var(--ds-terracotta)" }}>1 aula detalhada e específica</p>
        </button>
      </div>

      {/* Campo de páginas — só para aula única */}
      {tipo === "AULA_UNICA" && (
        <div className="rounded-2xl p-4 mb-6" style={{ backgroundColor: "var(--ds-surface)" }}>
          <p className="text-sm font-medium mb-3" style={{ color: "var(--ds-terracotta)" }}>
            Páginas do PDF (opcional)
          </p>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <label className="text-xs mb-1 block" style={{ color: "var(--ds-muted)" }}>De</label>
              <input
                type="number"
                min={1}
                value={pagDe}
                onChange={(e) => setPaginas(e.target.value, pagAte)}
                placeholder="1"
                className="w-full h-11 rounded-xl px-3 outline-none focus:ring-2 focus:ring-[#ff8c00] text-sm"
                style={{
                  backgroundColor: "var(--ds-surface-card)",
                  border: "1px solid var(--ds-border)",
                  color: "var(--ds-on-surface)"
                }}
              />
            </div>
            <span className="mt-4" style={{ color: "var(--ds-muted)" }}>até</span>
            <div className="flex-1">
              <label className="text-xs mb-1 block" style={{ color: "var(--ds-muted)" }}>Até</label>
              <input
                type="number"
                min={1}
                value={pagAte}
                onChange={(e) => setPaginas(pagDe, e.target.value)}
                placeholder="50"
                className="w-full h-11 rounded-xl px-3 outline-none focus:ring-2 focus:ring-[#ff8c00] text-sm"
                style={{
                  backgroundColor: "var(--ds-surface-card)",
                  border: "1px solid var(--ds-border)",
                  color: "var(--ds-on-surface)"
                }}
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={voltar}
          className="h-14 px-6 rounded-[14px] font-medium"
          style={{ backgroundColor: "var(--ds-surface-low)", color: "var(--ds-terracotta)" }}
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

