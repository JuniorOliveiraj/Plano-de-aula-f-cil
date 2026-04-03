"use client"

import { useState, useRef, useEffect } from "react"
import { useWizardStore } from "@/store/wizardStore"

// ── Mini date picker personalizado ──────────────────────────────
const MESES = [
  "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
  "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro",
]
const DIAS_SEMANA = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"]

function formatarDDMMAAAA(date: Date): string {
  const d = String(date.getDate()).padStart(2,"0")
  const m = String(date.getMonth()+1).padStart(2,"0")
  return `${d}/${m}/${date.getFullYear()}`
}

function parseDDMMAAAA(str: string): Date | null {
  const parts = str.split("/")
  if (parts.length !== 3) return null
  const [d, m, y] = parts.map(Number)
  const date = new Date(y, m-1, d)
  if (date.getFullYear()===y && date.getMonth()===m-1 && date.getDate()===d) return date
  return null
}

interface DatePickerProps {
  value: string
  onChange: (v: string) => void
}

function DatePicker({ value, onChange }: DatePickerProps) {
  const hoje = new Date(); hoje.setHours(0,0,0,0)
  const inicial = parseDDMMAAAA(value) ?? hoje
  const [aberto, setAberto] = useState(false)
  const [mes, setMes] = useState(inicial.getMonth())
  const [ano, setAno] = useState(inicial.getFullYear())
  const ref = useRef<HTMLDivElement>(null)

  // fechar ao clicar fora
  useEffect(() => {
    if (!aberto) return
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setAberto(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [aberto])

  const totalDias = new Date(ano, mes+1, 0).getDate()
  const primeiroDia = new Date(ano, mes, 1).getDay()
  const celulas: (number|null)[] = [
    ...Array(primeiroDia).fill(null),
    ...Array.from({length: totalDias}, (_,i) => i+1),
  ]
  while (celulas.length % 7 !== 0) celulas.push(null)

  const selecionado = parseDDMMAAAA(value)

  function selecionar(dia: number) {
    const d = new Date(ano, mes, dia)
    onChange(formatarDDMMAAAA(d))
    setAberto(false)
  }

  function navMes(delta: number) {
    let nm = mes + delta
    let na = ano
    if (nm < 0) { nm = 11; na-- }
    if (nm > 11) { nm = 0; na++ }
    setMes(nm); setAno(na)
  }

  const isPast = (dia: number) => new Date(ano, mes, dia) < hoje
  const isHoje = (dia: number) => {
    const h = new Date(); return dia===h.getDate() && mes===h.getMonth() && ano===h.getFullYear()
  }
  const isSel = (dia: number) =>
    selecionado && dia===selecionado.getDate() && mes===selecionado.getMonth() && ano===selecionado.getFullYear()

  return (
    <div ref={ref} className="relative">
      {/* Input com ícone */}
      <button
        type="button"
        onClick={() => setAberto(v => !v)}
        className="w-full h-11 rounded-xl px-3 flex items-center justify-between text-sm transition-colors"
        style={{
          backgroundColor: "var(--ds-surface-card)",
          border: `1px solid ${aberto ? "var(--ds-primary-bright)" : "var(--ds-border)"}`,
          color: value ? "var(--ds-on-surface)" : "var(--ds-muted)",
          outline: aberto ? "2px solid var(--ds-primary-bright)" : "none",
          outlineOffset: 1,
        }}
      >
        <span>{value || "Selecione uma data"}</span>
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{color:"var(--ds-muted)",flexShrink:0}}>
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <path d="M16 2v4M8 2v4M3 10h18"/>
        </svg>
      </button>

      {/* Calendário dropdown */}
      {aberto && (
        <div
          className="absolute left-0 z-50 mt-2 rounded-2xl p-4 select-none"
          style={{
            backgroundColor: "var(--ds-surface-card)",
            border: "1px solid var(--ds-border)",
            boxShadow: "0 8px 32px var(--ds-shadow-lg)",
            minWidth: 280,
          }}
        >
          {/* Cabeçalho navegação */}
          <div className="flex items-center justify-between mb-3">
            <button type="button" onClick={() => navMes(-1)}
              className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors"
              style={{backgroundColor:"var(--ds-surface-low)",color:"var(--ds-on-surface)"}}
              onMouseEnter={e=>{e.currentTarget.style.backgroundColor="var(--ds-border)"}}
              onMouseLeave={e=>{e.currentTarget.style.backgroundColor="var(--ds-surface-low)"}}
            >
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            <span className="text-[14px] font-600" style={{color:"var(--ds-on-surface)"}}>
              {MESES[mes]} {ano}
            </span>
            <button type="button" onClick={() => navMes(1)}
              className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors"
              style={{backgroundColor:"var(--ds-surface-low)",color:"var(--ds-on-surface)"}}
              onMouseEnter={e=>{e.currentTarget.style.backgroundColor="var(--ds-border)"}}
              onMouseLeave={e=>{e.currentTarget.style.backgroundColor="var(--ds-surface-low)"}}
            >
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          </div>

          {/* Dias da semana */}
          <div className="grid grid-cols-7 mb-1">
            {DIAS_SEMANA.map(d => (
              <div key={d} className="text-center text-[10px] font-700 uppercase py-1" style={{color:"var(--ds-muted)"}}>
                {d}
              </div>
            ))}
          </div>

          {/* Grade de dias */}
          <div className="grid grid-cols-7 gap-0.5">
            {celulas.map((dia, idx) => {
              if (!dia) return <div key={`e-${idx}`} />
              const passado = isPast(dia)
              const hoje_ = isHoje(dia)
              const sel = isSel(dia)
              return (
                <button
                  key={dia}
                  type="button"
                  disabled={passado}
                  onClick={() => selecionar(dia)}
                  className="h-8 w-full rounded-lg text-[13px] font-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: sel
                      ? "var(--ds-primary-bright)"
                      : hoje_
                        ? "var(--ds-surface-low)"
                        : "transparent",
                    color: sel ? "#fff" : hoje_ ? "var(--ds-primary-bright)" : "var(--ds-on-surface)",
                    fontWeight: sel || hoje_ ? 700 : 500,
                    outline: hoje_ && !sel ? "1px solid var(--ds-primary-bright)" : "none",
                  }}
                  onMouseEnter={e => { if (!sel && !passado) e.currentTarget.style.backgroundColor="var(--ds-surface-low)" }}
                  onMouseLeave={e => { if (!sel) e.currentTarget.style.backgroundColor = hoje_ ? "var(--ds-surface-low)" : "transparent" }}
                >
                  {dia}
                </button>
              )
            })}
          </div>

          {/* Botão Hoje */}
          <div className="mt-3 pt-3" style={{borderTop:"1px solid var(--ds-border)"}}>
            <button
              type="button"
              onClick={() => { onChange(formatarDDMMAAAA(hoje)); setAberto(false) }}
              className="w-full h-8 rounded-lg text-[12px] font-600 transition-colors"
              style={{backgroundColor:"var(--ds-surface-low)",color:"var(--ds-on-surface)"}}
              onMouseEnter={e=>{e.currentTarget.style.backgroundColor="var(--ds-border)"}}
              onMouseLeave={e=>{e.currentTarget.style.backgroundColor="var(--ds-surface-low)"}}
            >
              Hoje
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Componente principal ─────────────────────────────────────────
export default function PassoTipo() {
  const { tipo, setTipo, pagDe, pagAte, setPaginas, avancar, voltar, dataAula, setDataAula, modo, mesReferencia, setMesReferencia } = useWizardStore()

  // Mês/ano atual como default para plano mensal
  const hoje = new Date()
  const [mesSel, setMesSel] = useState(() => {
    if (mesReferencia) {
      const [m] = mesReferencia.split("/").map(Number)
      return m - 1
    }
    return hoje.getMonth()
  })
  const [anoSel, setAnoSel] = useState(() => {
    if (mesReferencia) {
      const [, a] = mesReferencia.split("/").map(Number)
      return a
    }
    return hoje.getFullYear()
  })

  function navMesSel(delta: number) {
    let nm = mesSel + delta
    let na = anoSel
    if (nm < 0) { nm = 11; na-- }
    if (nm > 11) { nm = 0; na++ }
    setMesSel(nm)
    setAnoSel(na)
    setMesReferencia(`${String(nm + 1).padStart(2, "0")}/${na}`)
  }

  // Inicializa mesReferencia se ainda não estiver definido
  useEffect(() => {
    if ((tipo === "MENSAL" || tipo === "QUINZENAL") && !mesReferencia) {
      setMesReferencia(`${String(mesSel + 1).padStart(2, "0")}/${anoSel}`)
    }
  }, [tipo])

  const podeAvancar =
    (tipo === "MENSAL" && mesReferencia.length > 0) ||
    (tipo === "QUINZENAL" && mesReferencia.length > 0) ||
    (tipo === "AULA_UNICA" && modo === "SEM_PDF" && dataAula.length === 10) ||
    (tipo === "AULA_UNICA" && modo !== "SEM_PDF" &&
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

        {/* Quinzenal */}
        <button
          onClick={() => setTipo("QUINZENAL")}
          className="flex flex-col items-start gap-2 p-5 rounded-2xl text-left transition"
          style={{
            backgroundColor: tipo === "QUINZENAL" ? "var(--ds-surface-low)" : "var(--ds-surface)",
            outline: tipo === "QUINZENAL" ? "2px solid var(--ds-primary-bright)" : "none",
          }}
        >
          <span className="text-2xl">📆</span>
          <p className="text-[15px] font-600" style={{ color: "var(--ds-on-surface)" }}>Plano Quinzenal</p>
          <p className="text-[13px]" style={{ color: "var(--ds-terracotta)" }}>15 aulas — cobre duas semanas</p>
        </button>

        {/* Aula única */}
        <button
          onClick={() => setTipo("AULA_UNICA")}
          className="flex flex-col items-start gap-2 p-5 rounded-2xl text-left transition col-span-2"
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

      {/* Seletor de mês — plano mensal ou quinzenal no modo SEM_PDF */}
      {(tipo === "MENSAL" || tipo === "QUINZENAL") && modo === "SEM_PDF" && (
        <div className="rounded-2xl p-4 mb-6" style={{ backgroundColor: "var(--ds-surface)" }}>
          <p className="text-sm font-medium mb-3" style={{ color: "var(--ds-terracotta)" }}>
            Mês de referência <span style={{ color: "var(--ds-ink-error)" }}>*</span>
          </p>
          <div className="flex items-center justify-between gap-3">
            <button type="button" onClick={() => navMesSel(-1)}
              className="w-9 h-9 flex items-center justify-center rounded-xl transition-colors"
              style={{ backgroundColor: "var(--ds-surface-low)", color: "var(--ds-on-surface)" }}
            >
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            <span className="text-[15px] font-600" style={{ color: "var(--ds-on-surface)" }}>
              {MESES[mesSel]} {anoSel}
            </span>
            <button type="button" onClick={() => navMesSel(1)}
              className="w-9 h-9 flex items-center justify-center rounded-xl transition-colors"
              style={{ backgroundColor: "var(--ds-surface-low)", color: "var(--ds-on-surface)" }}
            >
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          </div>
        </div>
      )}

      {/* Date picker — aula única no modo SEM_PDF */}
      {tipo === "AULA_UNICA" && modo === "SEM_PDF" && (
        <div className="rounded-2xl p-4 mb-6" style={{ backgroundColor: "var(--ds-surface)" }}>
          <p className="text-sm font-medium mb-3" style={{ color: "var(--ds-terracotta)" }}>
            Data da aula <span style={{ color: "var(--ds-ink-error)" }}>*</span>
          </p>
          <DatePicker value={dataAula} onChange={setDataAula} />
          {!dataAula && (
            <p className="text-[12px] mt-2" style={{ color: "var(--ds-muted)" }}>
              Selecione a data para continuar
            </p>
          )}
          {dataAula && (
            <p className="text-[12px] mt-2" style={{ color: "var(--ds-muted)" }}>
              📅 Você pode alterar a data se quiser.
            </p>
          )}
        </div>
      )}

      {/* Campo de páginas — aula única no modo COM_PDF */}
      {tipo === "AULA_UNICA" && modo !== "SEM_PDF" && (
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
                  color: "var(--ds-on-surface)",
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
                  color: "var(--ds-on-surface)",
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
