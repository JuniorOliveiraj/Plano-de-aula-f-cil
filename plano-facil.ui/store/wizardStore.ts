import { create } from "zustand"

interface WizardState {
  serie: string
  materia: string
  tipo: "MENSAL" | "AULA_UNICA" | ""
  pagDe: string
  pagAte: string
  pdfFile: File | null
  passo: number
  setSerie: (v: string) => void
  setMateria: (v: string) => void
  setTipo: (v: "MENSAL" | "AULA_UNICA") => void
  setPaginas: (de: string, ate: string) => void
  setPdf: (f: File) => void
  avancar: () => void
  voltar: () => void
  resetar: () => void
}

export const useWizardStore = create<WizardState>((set) => ({
  serie: "",
  materia: "",
  tipo: "",
  pagDe: "",
  pagAte: "",
  pdfFile: null,
  passo: 1,
  setSerie: (v) => set({ serie: v }),
  setMateria: (v) => set({ materia: v }),
  setTipo: (v) => set({ tipo: v }),
  setPaginas: (de, ate) => set({ pagDe: de, pagAte: ate }),
  setPdf: (f) => set({ pdfFile: f }),
  avancar: () => set((s) => ({ passo: Math.min(s.passo + 1, 5) })),
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
    }),
}))
