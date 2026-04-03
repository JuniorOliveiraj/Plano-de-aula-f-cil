"use client"

import { useState, useEffect, useCallback } from "react"
import { HTML5Backend } from "react-dnd-html5-backend"
import { DndProvider } from "react-dnd"
import CalendarioMensal from "./CalendarioMensal"
import CalendarioSemanal from "./CalendarioSemanal"
import CalendarioDiario from "./CalendarioDiario"
import AulaDetalheModal from "./AulaDetalheModal"
import type { AulaItem } from "@/lib/distribuidor"

interface PlanoCalendarioResumo {
  id: string
  serie: string
  materia: string
  tipo: "MENSAL" | "AULA_UNICA"
  mesReferencia: string | null
  aulas: AulaItem[]
}

type Visualizacao = "mensal" | "semanal" | "diaria"

interface AulaModal {
  aula: AulaItem
  planoId: string
  aulaIndex: number
}

const MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
]

const MESES_CURTOS = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]

function inicioSemana(date: Date): Date {
  const d = new Date(date)
  d.setDate(d.getDate() - d.getDay()) // recuar até domingo
  d.setHours(0, 0, 0, 0)
  return d
}

function formatarTitulo(
  visualizacao: Visualizacao,
  mes: number,
  ano: number,
  semanaInicio: Date,
  diaAtual: Date
): string {
  if (visualizacao === "mensal") {
    return `${MESES[mes - 1]} ${ano}`
  }
  if (visualizacao === "semanal") {
    const fim = new Date(semanaInicio)
    fim.setDate(semanaInicio.getDate() + 6)
    const dInicio = String(semanaInicio.getDate()).padStart(2, "0")
    const dFim = String(fim.getDate()).padStart(2, "0")
    const mFim = MESES_CURTOS[fim.getMonth()]
    if (semanaInicio.getMonth() === fim.getMonth()) {
      return `${dInicio} - ${dFim} ${mFim} ${fim.getFullYear()}`
    }
    const mInicio = MESES_CURTOS[semanaInicio.getMonth()]
    return `${dInicio} ${mInicio} - ${dFim} ${mFim} ${fim.getFullYear()}`
  }
  // diaria
  const d = String(diaAtual.getDate()).padStart(2, "0")
  const m = MESES_CURTOS[diaAtual.getMonth()]
  return `${d} ${m} ${diaAtual.getFullYear()}`
}

export default function CalendarioShell() {
  const [visualizacao, setVisualizacao] = useState<Visualizacao>("semanal")
  const [mes, setMes] = useState(() => new Date().getMonth() + 1)
  const [ano, setAno] = useState(() => new Date().getFullYear())
  const [semanaInicio, setSemanaInicio] = useState<Date>(() => inicioSemana(new Date()))
  const [diaAtual, setDiaAtual] = useState<Date>(() => {
    const d = new Date(); d.setHours(0,0,0,0); return d
  })
  const [planos, setPlanos] = useState<PlanoCalendarioResumo[]>([])
  const [carregando, setCarregando] = useState(false)
  const [aulaModal, setAulaModal] = useState<AulaModal | null>(null)
  const [menuDownload, setMenuDownload] = useState(false)

  const labelPeriodo: Record<Visualizacao, string> = {
    diaria: "Dia",
    semanal: "Semana",
    mensal: "Mês",
  }

  function datasParaPeriodo(): string[] {
    function fmt(d: Date) {
      return `${String(d.getDate()).padStart(2,"0")}/${String(d.getMonth()+1).padStart(2,"0")}/${d.getFullYear()}`
    }
    if (visualizacao === "diaria") return [fmt(diaAtual)]
    if (visualizacao === "semanal") {
      return Array.from({ length: 7 }, (_, i) => {
        const d = new Date(semanaInicio)
        d.setDate(semanaInicio.getDate() + i)
        return fmt(d)
      })
    }
    // mensal
    const totalDias = new Date(ano, mes, 0).getDate()
    return Array.from({ length: totalDias }, (_, i) => {
      const d = new Date(ano, mes - 1, i + 1)
      return fmt(d)
    })
  }

  async function handleDownload(formato: "word" | "pdf") {
    setMenuDownload(false)
    const datas = datasParaPeriodo()
    const params = new URLSearchParams({
      formato,
      datas: datas.join(","),
      titulo,
    })
    try {
      const res = await fetch(`/api/calendario/download?${params}`)
      if (!res.ok) { alert("Nenhuma aula encontrada para este período."); return }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `calendario_${titulo.replace(/\s+/g,"_")}.${formato === "pdf" ? "pdf" : "docx"}`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      alert("Erro ao baixar. Tenta de novo!")
    }
  }

  // Busca planos de um ou dois meses (quando semana cruza meses)
  const buscarPlanos = useCallback(async (m: number, a: number, m2?: number, a2?: number) => {
    setCarregando(true)
    try {
      const url1 = `/api/calendario/planos?mes=${String(m).padStart(2, "0")}&ano=${a}`
      const res1 = await fetch(url1)
      const data1 = res1.ok ? await res1.json() : { planos: [] }
      let todos: PlanoCalendarioResumo[] = data1.planos ?? []

      // Se a semana cruza para outro mês, buscar também
      if (m2 !== undefined && a2 !== undefined && (m2 !== m || a2 !== a)) {
        const url2 = `/api/calendario/planos?mes=${String(m2).padStart(2, "0")}&ano=${a2}`
        const res2 = await fetch(url2)
        const data2 = res2.ok ? await res2.json() : { planos: [] }
        // Mesclar sem duplicatas por id
        const ids = new Set(todos.map((p) => p.id))
        for (const p of (data2.planos ?? [])) {
          if (!ids.has(p.id)) todos.push(p)
        }
      }

      setPlanos(todos)
    } catch {
      // silencioso
    } finally {
      setCarregando(false)
    }
  }, [])

  // Ao trocar para mensal, garantir que mes/ano reflitam o dia atual da semana visível
  // (não o domingo de início que pode ser do mês anterior)
  useEffect(() => {
    if (visualizacao === "mensal") {
      // Usar a quinta-feira da semana atual como âncora (sempre cai no mês "principal" da semana)
      const ancora = new Date(semanaInicio)
      ancora.setDate(semanaInicio.getDate() + 4) // domingo + 4 = quinta
      const m = ancora.getMonth() + 1
      const a = ancora.getFullYear()
      setMes(m)
      setAno(a)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visualizacao])

  // Buscar ao montar e ao mudar mês/ano (visão mensal e diária)
  useEffect(() => {
    if (visualizacao !== "semanal") {
      buscarPlanos(mes, ano)
    }
  }, [mes, ano, visualizacao, buscarPlanos])

  // Na visão semanal: buscar sempre que a semana mudar, passando os dois meses se necessário
  useEffect(() => {
    if (visualizacao !== "semanal") return
    const inicio = semanaInicio
    const fim = new Date(inicio)
    fim.setDate(inicio.getDate() + 6)

    const m1 = inicio.getMonth() + 1
    const a1 = inicio.getFullYear()
    const m2 = fim.getMonth() + 1
    const a2 = fim.getFullYear()

    buscarPlanos(m1, a1, m2, a2)
  }, [semanaInicio, visualizacao, buscarPlanos])

  // Na visão diária: buscar quando o dia mudar de mês
  useEffect(() => {
    if (visualizacao !== "diaria") return
    const m = diaAtual.getMonth() + 1
    const a = diaAtual.getFullYear()
    setMes(m)
    setAno(a)
    buscarPlanos(m, a)
  }, [diaAtual, visualizacao, buscarPlanos])

  function navAnterior() {
    if (visualizacao === "mensal") {
      if (mes === 1) { setMes(12); setAno((a) => a - 1) }
      else setMes((m) => m - 1)
    } else if (visualizacao === "semanal") {
      setSemanaInicio((s) => {
        const d = new Date(s)
        d.setDate(d.getDate() - 7)
        return d
      })
    } else {
      setDiaAtual((d) => {
        const nd = new Date(d)
        nd.setDate(nd.getDate() - 1)
        return nd
      })
    }
  }

  function navProximo() {
    if (visualizacao === "mensal") {
      if (mes === 12) { setMes(1); setAno((a) => a + 1) }
      else setMes((m) => m + 1)
    } else if (visualizacao === "semanal") {
      setSemanaInicio((s) => {
        const d = new Date(s)
        d.setDate(d.getDate() + 7)
        return d
      })
    } else {
      setDiaAtual((d) => {
        const nd = new Date(d)
        nd.setDate(nd.getDate() + 1)
        return nd
      })
    }
  }

  function irParaHoje() {
    const agora = new Date()
    agora.setHours(0, 0, 0, 0)
    setMes(agora.getMonth() + 1)
    setAno(agora.getFullYear())
    setSemanaInicio(inicioSemana(agora))
    setDiaAtual(agora)
  }

  function handleAulaSelect(aula: AulaItem, planoId: string, aulaIndex: number) {
    setAulaModal({ aula, planoId, aulaIndex })
  }

  async function handleDrop(planoId: string, aulaIndex: number, novaData: string) {
    try {
      const res = await fetch(`/api/calendario/planos/${planoId}/aulas/${aulaIndex}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: novaData }),
      })
      if (res.ok) {
        const body = await res.json()
        setPlanos((prev) =>
          prev.map((p) =>
            p.id === planoId ? { ...p, aulas: body.aulas } : p
          )
        )
      }
    } catch {
      // silencioso
    }
  }

  function handleAulaAtualizada(planoId: string, novasAulas: AulaItem[]) {
    setPlanos((prev) =>
      prev.map((p) => (p.id === planoId ? { ...p, aulas: novasAulas } : p))
    )
    setAulaModal(null)
  }

  const titulo = formatarTitulo(visualizacao, mes, ano, semanaInicio, diaAtual)

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col gap-4 h-full">
        {/* Barra de controles */}
        <div
          className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 rounded-[12px]"
          style={{
            backgroundColor: "var(--ds-surface-card)",
            border: "1px solid var(--ds-border)",
            boxShadow: "0 1px 4px var(--ds-shadow)",
          }}
        >
          {/* Navegação */}
          <div className="flex items-center gap-2">
            <button
              onClick={navAnterior}
              className="flex items-center justify-center w-8 h-8 rounded-[8px] transition-colors"
              style={{ backgroundColor: "var(--ds-surface-low)", color: "var(--ds-on-surface)" }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--ds-border)" }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "var(--ds-surface-low)" }}
              aria-label="Anterior"
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            <h2 className="text-[15px] font-600 min-w-[160px] text-center" style={{ color: "var(--ds-on-surface)" }}>
              {titulo}
            </h2>

            <button
              onClick={navProximo}
              className="flex items-center justify-center w-8 h-8 rounded-[8px] transition-colors"
              style={{ backgroundColor: "var(--ds-surface-low)", color: "var(--ds-on-surface)" }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--ds-border)" }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "var(--ds-surface-low)" }}
              aria-label="Próximo"
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>

            <button
              onClick={irParaHoje}
              className="h-8 px-3 rounded-[8px] text-[12px] font-600 transition-colors"
              style={{
                backgroundColor: "var(--ds-surface-low)",
                color: "var(--ds-on-surface)",
                border: "1px solid var(--ds-border)",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--ds-border)" }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "var(--ds-surface-low)" }}
            >
              Hoje
            </button>
          </div>

          {/* Seletor de visualização + Botão download */}
          <div className="flex items-center gap-2">
            <div
              className="flex rounded-[8px] overflow-hidden"
              style={{ border: "1px solid var(--ds-border)" }}
            >
              {(["mensal", "semanal", "diaria"] as Visualizacao[]).map((v) => {
                const labels: Record<Visualizacao, string> = {
                  mensal: "Mensal",
                  semanal: "Semanal",
                  diaria: "Diária",
                }
                const ativo = visualizacao === v
                return (
                  <button
                    key={v}
                    onClick={() => setVisualizacao(v)}
                    className="h-8 px-4 text-[12px] font-600 transition-colors"
                    style={{
                      backgroundColor: ativo ? "var(--ds-primary)" : "transparent",
                      color: ativo ? "#fff" : "var(--ds-on-surface)",
                    }}
                  >
                    {labels[v]}
                  </button>
                )
              })}
            </div>

            {/* Botão Baixar com dropdown */}
            <div className="relative">
              <button
                onClick={() => setMenuDownload((v) => !v)}
                className="flex items-center gap-1.5 h-8 px-3 rounded-[8px] text-[12px] font-600 transition-colors"
                style={{
                  backgroundColor: "var(--ds-surface-low)",
                  color: "var(--ds-on-surface)",
                  border: "1px solid var(--ds-border)",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--ds-border)" }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "var(--ds-surface-low)" }}
              >
                <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Baixar ({labelPeriodo[visualizacao]})
                <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {menuDownload && (
                <>
                  {/* overlay para fechar ao clicar fora */}
                  <div className="fixed inset-0 z-10" onClick={() => setMenuDownload(false)} />
                  <div
                    className="absolute right-0 top-full mt-1 z-20 rounded-[8px] overflow-hidden flex flex-col"
                    style={{
                      backgroundColor: "var(--ds-surface-card)",
                      border: "1px solid var(--ds-border)",
                      boxShadow: "0 4px 12px var(--ds-shadow)",
                      minWidth: 160,
                    }}
                  >
                    <button
                      onClick={() => handleDownload("pdf")}
                      className="flex items-center gap-2 px-4 py-2.5 text-[13px] text-left transition-colors"
                      style={{ color: "var(--ds-on-surface)" }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--ds-surface-low)" }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent" }}
                    >
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                      Exportar PDF
                    </button>
                    <button
                      onClick={() => handleDownload("word")}
                      className="flex items-center gap-2 px-4 py-2.5 text-[13px] text-left transition-colors"
                      style={{ color: "var(--ds-on-surface)" }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--ds-surface-low)" }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent" }}
                    >
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                        <polyline points="10 9 9 9 8 9" />
                      </svg>
                      Exportar Word
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>        </div>

        {/* Conteúdo do calendário */}
        <div className="flex-1 overflow-auto">
          {carregando ? (
            <CalendarioSkeleton visualizacao={visualizacao} />
          ) : (
            <>
              {visualizacao === "mensal" && (
                <CalendarioMensal
                  planos={planos}
                  mes={mes}
                  ano={ano}
                  onAulaSelect={handleAulaSelect}
                  onDrop={handleDrop}
                />
              )}
              {visualizacao === "semanal" && (
                <CalendarioSemanal
                  planos={planos}
                  semanaInicio={semanaInicio}
                  onAulaSelect={handleAulaSelect}
                  onDrop={handleDrop}
                />
              )}
              {visualizacao === "diaria" && (
                <CalendarioDiario
                  planos={planos}
                  dia={diaAtual}
                  onAulaSelect={handleAulaSelect}
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* Modal de detalhes da aula */}
      {aulaModal && (
        <AulaDetalheModal
          aula={aulaModal.aula}
          planoId={aulaModal.planoId}
          aulaIndex={aulaModal.aulaIndex}
          onClose={() => setAulaModal(null)}
          onAulaAtualizada={(novasAulas) => handleAulaAtualizada(aulaModal.planoId, novasAulas)}
        />
      )}
    </DndProvider>
  )
}

function CalendarioSkeleton({ visualizacao }: { visualizacao: Visualizacao }) {
  const pulse = {
    backgroundColor: "var(--ds-surface-low)",
    borderRadius: 8,
    animation: "pulse 1.5s ease-in-out infinite",
  } as React.CSSProperties

  if (visualizacao === "semanal") {
    return (
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-2">
            {/* cabeçalho da coluna */}
            <div style={{ ...pulse, height: 48 }} />
            {/* células de aula */}
            {Array.from({ length: Math.floor(Math.random() * 2) + 1 }).map((_, j) => (
              <div key={j} style={{ ...pulse, height: 52 }} />
            ))}
          </div>
        ))}
      </div>
    )
  }

  if (visualizacao === "mensal") {
    return (
      <div className="flex flex-col gap-1">
        {/* cabeçalho dias semana */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} style={{ ...pulse, height: 28 }} />
          ))}
        </div>
        {/* grade de dias — 5 semanas */}
        {Array.from({ length: 5 }).map((_, w) => (
          <div key={w} className="grid grid-cols-7 gap-1">
            {Array.from({ length: 7 }).map((_, d) => (
              <div key={d} style={{ ...pulse, height: 72 }} />
            ))}
          </div>
        ))}
      </div>
    )
  }

  // diária
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} style={{ ...pulse, height: 120 }} />
      ))}
    </div>
  )
}
