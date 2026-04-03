import { create } from "zustand"

// Helper exportado para uso nos componentes
export function getPassoMaximo(modo: string): number {
  if (modo === "COM_PDF") return 7
  if (modo === "SEM_PDF") return 8
  return 1
}

interface WizardState {
  // campos existentes
  serie: string
  materia: string
  tipo: "MENSAL" | "QUINZENAL" | "AULA_UNICA" | ""
  pagDe: string
  pagAte: string
  pdfFile: File | null
  passo: number

  // novos campos
  modo: "COM_PDF" | "SEM_PDF" | ""
  tema: string
  // seleção única (AULA_UNICA)
  codigoBncc: string
  descricaoBncc: string
  // seleção múltipla (MENSAL / QUINZENAL)
  codigosBncc: string[]
  descricoesBncc: string[]
  duracao: 45 | 90

  // campo de data para integração com calendário
  dataAula: string
  // mês de referência para plano mensal (formato MM/AAAA)
  mesReferencia: string
  // nome personalizado da aula (opcional)
  nomeAula: string

  // actions existentes
  setSerie: (v: string) => void
  setMateria: (v: string) => void
  setTipo: (v: "MENSAL" | "QUINZENAL" | "AULA_UNICA") => void
  setPaginas: (de: string, ate: string) => void
  setPdf: (f: File) => void
  avancar: () => void
  voltar: () => void
  resetar: () => void

  // novas actions
  setModo: (v: "COM_PDF" | "SEM_PDF") => void
  setTema: (v: string) => void
  setCodigoBncc: (codigo: string, descricao: string) => void
  toggleCodigoBncc: (codigo: string, descricao: string) => void
  setDuracao: (v: 45 | 90) => void
  setDataAula: (v: string) => void
  setMesReferencia: (v: string) => void
  setNomeAula: (v: string) => void
}

export const useWizardStore = create<WizardState>((set) => ({
  // estado inicial existente
  serie: "",
  materia: "",
  tipo: "",
  pagDe: "",
  pagAte: "",
  pdfFile: null,
  passo: 1,

  // estado inicial novos campos
  modo: "",
  tema: "",
  codigoBncc: "",
  descricaoBncc: "",
  codigosBncc: [],
  descricoesBncc: [],
  duracao: 45,
  dataAula: "",
  mesReferencia: "",
  nomeAula: "",

  // actions existentes
  setSerie: (v) => set({ serie: v }),
  setMateria: (v) => set({ materia: v }),
  setTipo: (v) => set({ tipo: v }),
  setPaginas: (de, ate) => set({ pagDe: de, pagAte: ate }),
  setPdf: (f) => set({ pdfFile: f }),
  avancar: () =>
    set((s) => ({ passo: Math.min(s.passo + 1, getPassoMaximo(s.modo)) })),
  voltar: () => set((s) => ({ passo: Math.max(s.passo - 1, 1) })),
  resetar: () =>
    set({
      serie: "",
      materia: "",
      tipo: "",
      pagDe: "",
      pagAte: "",
      pdfFile: null,
      passo: 1,
      modo: "",
      tema: "",
      codigoBncc: "",
      descricaoBncc: "",
      codigosBncc: [],
      descricoesBncc: [],
      duracao: 45,
      dataAula: "",
      mesReferencia: "",
      nomeAula: "",
    }),

  // novas actions
  setModo: (v) => set({ modo: v, passo: 2 }),
  setTema: (v) => set({ tema: v }),
  // seleção única — AULA_UNICA
  setCodigoBncc: (codigo, descricao) =>
    set({ codigoBncc: codigo, descricaoBncc: descricao }),
  // toggle para multi-seleção — MENSAL / QUINZENAL
  toggleCodigoBncc: (codigo, descricao) =>
    set((s) => {
      const idx = s.codigosBncc.indexOf(codigo)
      if (idx >= 0) {
        return {
          codigosBncc: s.codigosBncc.filter((_, i) => i !== idx),
          descricoesBncc: s.descricoesBncc.filter((_, i) => i !== idx),
        }
      }
      return {
        codigosBncc: [...s.codigosBncc, codigo],
        descricoesBncc: [...s.descricoesBncc, descricao],
      }
    }),
  setDuracao: (v) => set({ duracao: v }),
  setDataAula: (v) => set({ dataAula: v }),
  setMesReferencia: (v) => set({ mesReferencia: v }),
  setNomeAula: (v) => set({ nomeAula: v }),
}))
