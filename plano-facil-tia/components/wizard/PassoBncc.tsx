"use client"

import { useEffect, useState } from "react"
import { useWizardStore } from "@/store/wizardStore"

const AREA_MAP: Record<string, string> = {
  "Matemática": "MA",
  "Português":  "LP",
  "História":   "HI",
  "Geografia":  "GE",
  "Ciências":   "CI",
}

interface Habilidade {
  codigo: string
  descricao: string
}

export function formatHabilidade(h: { codigo: string; descricao: string }): string {
  return `${h.codigo} – ${h.descricao}`
}

export function paginar<T>(items: T[], pagina: number): { exibidas: T[] } {
  return { exibidas: items.slice(0, pagina * 12) }
}

export default function PassoBncc() {
  const { serie, materia, codigoBncc, setCodigoBncc, avancar, voltar } = useWizardStore()

  const [habilidades, setHabilidades] = useState<Habilidade[]>([])
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [pagina, setPagina] = useState(1)

  function buscar() {
    const serieNum = parseInt(serie)
    const area = AREA_MAP[materia]

    if (!serieNum || !area) {
      setErro("Série ou matéria inválida para busca BNCC.")
      return
    }

    setLoading(true)
    setErro(null)
    setHabilidades([])
    setPagina(1)

    fetch(`/api/bncc?serie=${serieNum}&area=${area}`)
      .then((res) => {
        if (!res.ok) return res.json().then((d) => Promise.reject(d.erro ?? "Erro ao buscar habilidades."))
        return res.json()
      })
      .then((data: Habilidade[]) => setHabilidades(data))
      .catch((msg: string) => setErro(msg))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    buscar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const { exibidas } = paginar(habilidades, pagina)
  const temMais = exibidas.length < habilidades.length

  return (
    <div>
      <h2 className="text-xl font-medium mb-6" style={{ color: "var(--ds-terracotta)" }}>
        Selecione a habilidade BNCC
      </h2>

      {loading && (
        <div className="flex justify-center py-10">
          <div className="border-4 border-t-transparent rounded-full w-8 h-8 animate-spin" style={{ borderColor: "var(--ds-primary-bright)", borderTopColor: "transparent" }} />
        </div>
      )}

      {!loading && erro && (
        <div className="mb-6">
          <p className="text-sm mb-3" style={{ color: "var(--ds-ink-error)" }}>{erro}</p>
          <button
            onClick={buscar}
            className="text-[13px] font-medium underline"
            style={{ color: "var(--ds-secondary)" }}
          >
            Tentar novamente
          </button>
        </div>
      )}

      {!loading && !erro && habilidades.length === 0 && (
        <p className="text-sm mb-6" style={{ color: "var(--ds-on-surface-var)" }}>
          Nenhuma habilidade encontrada para essa série e matéria.
        </p>
      )}

      {!loading && !erro && habilidades.length > 0 && (
        <div className="flex flex-col gap-2 mb-4">
          {exibidas.map((h) => {
            const selecionado = codigoBncc === h.codigo
            return (
              <button
                key={h.codigo}
                onClick={() => setCodigoBncc(h.codigo, h.descricao)}
                className="rounded-[12px] px-4 py-3 text-left transition"
                style={{
                  backgroundColor: selecionado ? "var(--ds-surface-low)" : "var(--ds-surface)",
                  outline: selecionado ? "2px solid var(--ds-primary-bright)" : "none",
                }}
              >
                <span className="text-[13px] text-left" style={{ color: "var(--ds-on-surface)" }}>
                  {formatHabilidade(h)}
                </span>
              </button>
            )
          })}
        </div>
      )}

      {temMais && (
        <button
          onClick={() => setPagina((p) => p + 1)}
          className="text-[13px] font-medium underline mb-6"
          style={{ color: "var(--ds-secondary)" }}
        >
          Carregar mais
        </button>
      )}

      <div className="flex gap-3 mt-6">
        <button
          onClick={voltar}
          className="h-14 px-6 rounded-[14px] font-medium"
          style={{ backgroundColor: "var(--ds-surface-low)", color: "var(--ds-terracotta)" }}
        >
          Voltar
        </button>
        <button
          disabled={!codigoBncc}
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

