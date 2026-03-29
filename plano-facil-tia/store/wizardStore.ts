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
  tipo: "MENSAL" | "AULA_UNICA" | ""
  pagDe: string
  pagAte: string
  pdfFile: File | null
  passo: number

  // novos campos
  modo: "COM_PDF" | "SEM_PDF" | ""
  tema: string
  codigoBncc: string
  descricaoBncc: string
  duracao: 45 | 90

  // actions existentes
  setSerie: (v: string) => void
  setMateria: (v: string) => void
  setTipo: (v: "MENSAL" | "AULA_UNICA") => void
  setPaginas: (de: string, ate: string) => void
  setPdf: (f: File) => void
  avancar: () => void
  voltar: () => void
  resetar: () => void

  // novas actions
  setModo: (v: "COM_PDF" | "SEM_PDF") => void
  setTema: (v: string) => void
  setCodigoBncc: (codigo: string, descricao: string) => void
  setDuracao: (v: 45 | 90) => void
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
  duracao: 45,

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
      duracao: 45,
    }),

  // novas actions
  setModo: (v) => set({ modo: v, passo: 2 }),
  setTema: (v) => set({ tema: v }),
  setCodigoBncc: (codigo, descricao) =>
    set({ codigoBncc: codigo, descricaoBncc: descricao }),
  setDuracao: (v) => set({ duracao: v }),
}))
