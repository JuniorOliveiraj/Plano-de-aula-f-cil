"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { PDFDocument } from "pdf-lib"
import { useWizardStore } from "@/store/wizardStore"

const ERROS: Record<string, string> = {
  TRIAL_EXPIRADO:   "Seu período gratuito acabou. Assine para continuar gerando planos!",
  LIMITE_TRIAL:     "Você usou todos os planos do trial. Assine para continuar!",
  LIMITE_MENSAL:    "Você usou todos os planos do mês. Aguarde a renovação.",
  LIMITE_DIARIO:    "Você já gerou 5 planos hoje. Volta amanhã para continuar!",
  FALHA_GERACAO:    "Algo deu errado. Clica em 'Tentar novamente' que a gente resolve!",
  PDF_INVALIDO:     "Não consegui abrir esse PDF. Tenta outro arquivo.",
  PDF_MUITO_GRANDE: "Arquivo muito grande, tia. Use um PDF de até 20MB.",
}

// Etapas com peso de tempo estimado (soma = 100)
const ETAPAS = [
  { label: "Preparando o PDF",   peso: 10,  duracao: 3000  },
  { label: "Enviando para a IA", peso: 20,  duracao: 8000  },
  { label: "Criando as aulas",   peso: 55,  duracao: 30000 },
  { label: "Montando o Word",    peso: 15,  duracao: 5000  },
]

// Timeout total: 120s
const TIMEOUT_MS = 120_000

async function cortarPdf(file: File, pagDe: string, pagAte: string): Promise<File> {
  const arrayBuffer = await file.arrayBuffer()
  const pdfOriginal = await PDFDocument.load(arrayBuffer)
  const totalPaginas = pdfOriginal.getPageCount()
  const inicio = Math.max(1, parseInt(pagDe) || 1)
  const fim    = Math.min(totalPaginas, parseInt(pagAte) || totalPaginas)
  const indices = Array.from({ length: fim - inicio + 1 }, (_, i) => inicio - 1 + i)
  const pdfCortado = await PDFDocument.create()
  const paginas = await pdfCortado.copyPages(pdfOriginal, indices)
  paginas.forEach((p) => pdfCortado.addPage(p))
  const bytes = await pdfCortado.save()
  return new File([bytes.buffer as ArrayBuffer], file.name, { type: "application/pdf" })
}

// Calcula % acumulada até o início de cada etapa
function percentualBase(etapaIdx: number) {
  return ETAPAS.slice(0, etapaIdx).reduce((acc, e) => acc + e.peso, 0)
}

export default function PassoRevisao() {
  const router = useRouter()
  const { serie, materia, tipo, pagDe, pagAte, pdfFile, voltar, resetar } = useWizardStore()

  const [gerando, setGerando]       = useState(false)
  const [etapaIdx, setEtapaIdx]     = useState(0)
  const [progresso, setProgresso]   = useState(0)
  const [erro, setErro]             = useState<string | null>(null)
  const [tempoDecorrido, setTempo]  = useState(0)

  const timerRef    = useRef<ReturnType<typeof setInterval> | null>(null)
  const timeoutRef  = useRef<ReturnType<typeof setTimeout>  | null>(null)
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const tipoLabel  = tipo === "MENSAL" ? "Plano Mensal" : "Aula Única"
  const temPaginas = tipo === "AULA_UNICA" && pagDe && pagAte

  // Limpa todos os timers
  function limparTimers() {
    if (timerRef.current)    clearInterval(timerRef.current)
    if (timeoutRef.current)  clearTimeout(timeoutRef.current)
    if (progressRef.current) clearInterval(progressRef.current)
  }

  // Contador de tempo decorrido (atualiza a cada segundo)
  useEffect(() => {
    if (!gerando) { setTempo(0); return }
    const id = setInterval(() => setTempo((t) => t + 1), 1000)
    return () => clearInterval(id)
  }, [gerando])

  function iniciarProgressoEtapa(idx: number) {
    if (progressRef.current) clearInterval(progressRef.current)
    const base = percentualBase(idx)
    const teto = base + ETAPAS[idx].peso
    const duracao = ETAPAS[idx].duracao
    const passos = 40
    const incremento = ETAPAS[idx].peso / passos
    let atual = base

    progressRef.current = setInterval(() => {
      atual = Math.min(atual + incremento, teto - 1) // nunca chega ao teto sozinho
      setProgresso(Math.round(atual))
    }, duracao / passos)
  }

  function avancarEtapa(idx: number) {
    setEtapaIdx(idx)
    iniciarProgressoEtapa(idx)
  }

  async function handleGerar() {
    if (!pdfFile || gerando) return
    setGerando(true)
    setErro(null)
    setProgresso(0)
    avancarEtapa(0)

    // Timeout global de 120s
    timeoutRef.current = setTimeout(() => {
      limparTimers()
      setErro("Demorou mais que o esperado. Tenta de novo, tia! ⏱️")
      setGerando(false)
    }, TIMEOUT_MS)

    try {
      // Etapa 0 — preparar PDF
      const arquivoFinal = temPaginas
        ? await cortarPdf(pdfFile, pagDe, pagAte)
        : pdfFile

      // Etapa 1 — enviando
      avancarEtapa(1)

      const formData = new FormData()
      formData.append("pdf",     arquivoFinal)
      formData.append("serie",   serie)
      formData.append("materia", materia)
      formData.append("tipo",    tipo)
      if (pagDe)  formData.append("pagDe",  pagDe)
      if (pagAte) formData.append("pagAte", pagAte)

      // Etapa 2 — IA processando (avança após 3s do envio)
      timerRef.current = setTimeout(() => avancarEtapa(2), 3000)

      const res  = await fetch("/api/gerar-plano", { method: "POST", body: formData })
      const data = await res.json()

      // Etapa 3 — montando Word
      avancarEtapa(3)
      setProgresso(85)

      limparTimers()

      if (!res.ok) {
        setErro(ERROS[data.erro] ?? "Erro inesperado. Tenta de novo!")
        setGerando(false)
        return
      }

      setProgresso(100)
      await new Promise((r) => setTimeout(r, 400)) // pequena pausa para mostrar 100%
      resetar()
      router.push(`/plano/resultado/${data.planoId}`)
    } catch (e) {
      limparTimers()
      console.error("[PassoRevisao] erro:", e)
      setErro(ERROS.FALHA_GERACAO)
      setGerando(false)
    }
  }

  // ── Tela de loading ──────────────────────────────────────────
  if (gerando) {
    const etapa = ETAPAS[etapaIdx]
    const minutos = Math.floor(tempoDecorrido / 60)
    const segundos = tempoDecorrido % 60
    const tempoStr = minutos > 0
      ? `${minutos}m ${segundos}s`
      : `${segundos}s`

    return (
      <div className="flex flex-col items-center py-6 text-center">
        {/* Círculo de progresso */}
        <div className="relative mb-6" style={{ width: 96, height: 96 }}>
          <svg width="96" height="96" viewBox="0 0 96 96" style={{ transform: "rotate(-90deg)" }}>
            <circle cx="48" cy="48" r="40" fill="none" stroke="#fff1ea" strokeWidth="8" />
            <circle
              cx="48" cy="48" r="40" fill="none"
              stroke="#ff8c00" strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 40}`}
              strokeDashoffset={`${2 * Math.PI * 40 * (1 - progresso / 100)}`}
              style={{ transition: "stroke-dashoffset 0.6s ease" }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[18px] font-700 text-[#904d00]">{progresso}%</span>
          </div>
        </div>

        <p className="text-[18px] font-600 text-[#2f1402] mb-1">
          {etapa.label}…
        </p>
        <p className="text-[13px] text-[#a87b5e] mb-1">
          pode tomar um cafezinho! ☕
        </p>
        <p className="text-[12px] text-[#c2a090] mb-8">
          Tempo decorrido: {tempoStr}
        </p>

        {/* Etapas */}
        <div className="flex flex-col gap-2 w-full">
          {ETAPAS.map((e, i) => {
            const concluida = i < etapaIdx
            const ativa     = i === etapaIdx
            return (
              <div
                key={e.label}
                className="flex items-center gap-3 px-4 py-2.5 rounded-[12px] transition-all"
                style={{
                  backgroundColor: concluida ? "#edf7ee" : ativa ? "#fff1ea" : "#fff8f5",
                }}
              >
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-700 shrink-0"
                  style={{
                    backgroundColor: concluida ? "#4caf50" : ativa ? "#ff8c00" : "#f0ddd0",
                    color: concluida || ativa ? "#fff" : "#a87b5e",
                  }}
                >
                  {concluida ? "✓" : i + 1}
                </div>
                <span
                  className="text-[13px] flex-1 text-left"
                  style={{ color: concluida ? "#2e7d32" : ativa ? "#2f1402" : "#a87b5e" }}
                >
                  {e.label}
                </span>
                {ativa && (
                  <span className="text-[11px] text-[#ff8c00] font-600">em andamento</span>
                )}
                {concluida && (
                  <span className="text-[11px] text-[#4caf50] font-600">concluído</span>
                )}
              </div>
            )
          })}
        </div>

        {/* Aviso de demora após 60s */}
        {tempoDecorrido >= 60 && (
          <div
            className="mt-6 px-4 py-3 rounded-[12px] text-[13px] text-left w-full"
            style={{ backgroundColor: "#fff8e1", color: "#e65100" }}
          >
            ⏳ Está demorando um pouco mais que o normal. PDFs grandes podem levar até 2 minutos. Aguarde mais um pouco!
          </div>
        )}
      </div>
    )
  }

  // ── Formulário de revisão ────────────────────────────────────
  return (
    <div>
      <h2 className="text-xl font-medium text-[#7c4a2d] mb-6">Revisar e confirmar</h2>

      <div className="rounded-2xl p-5 mb-4 space-y-3" style={{ backgroundColor: "#fff8f5" }}>
        {[
          { label: "Série",   value: serie },
          { label: "Matéria", value: materia },
          { label: "Tipo",    value: tipoLabel },
          ...(temPaginas ? [{ label: "Páginas", value: `${pagDe} a ${pagAte}` }] : []),
          { label: "PDF",     value: pdfFile?.name ?? "—" },
        ].map(({ label, value }) => (
          <div key={label} className="flex items-center justify-between">
            <span className="text-[13px] text-[#a87b5e]">{label}</span>
            <span className="text-[14px] font-500 text-[#2f1402] max-w-[60%] text-right truncate">{value}</span>
          </div>
        ))}
      </div>

      {temPaginas && (
        <div
          className="flex items-start gap-2 px-4 py-3 rounded-[12px] mb-4 text-[13px]"
          style={{ backgroundColor: "#edf7ee", color: "#2e7d32" }}
        >
          <span>✂️</span>
          <span>Só as páginas {pagDe} a {pagAte} serão enviadas para a IA — mais rápido e econômico.</span>
        </div>
      )}

      {erro && (
        <div
          className="px-4 py-3 rounded-[12px] mb-4 text-[13px]"
          style={{ backgroundColor: "#fde8e8", color: "#ba1a1a", border: "1px solid #f5c2c2" }}
        >
          ⚠️ {erro}
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
          onClick={handleGerar}
          className="flex-1 h-14 rounded-[14px] text-white font-semibold transition-opacity hover:opacity-90"
          style={{ background: "linear-gradient(135deg,#2e7d32,#4caf50)" }}
        >
          {erro ? "Tentar novamente ✨" : "Gerar Meu Plano Agora ✨"}
        </button>
      </div>
    </div>
  )
}
