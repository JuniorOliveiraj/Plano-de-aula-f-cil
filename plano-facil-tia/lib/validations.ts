import { z } from "zod"

export const AulaSchema = z.object({
  aula:           z.string(),
  data:           z.string(),
  objetivo:       z.string(),
  conteudo:       z.string(),
  metodologia:    z.string(),
  recursos:       z.array(z.string()),
  video_url:      z.string().nullable(),
  referencia_url: z.string().nullable(),
})

export const PlanoSchema = z.object({
  serie:   z.string(),
  materia: z.string(),
  aulas:   z.array(AulaSchema).min(1).max(25),
})

export type Aula       = z.infer<typeof AulaSchema>
export type PlanoGerado = z.infer<typeof PlanoSchema>
