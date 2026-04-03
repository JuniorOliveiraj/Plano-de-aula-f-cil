import { z } from "zod"

// Normaliza strings vazias, "N/A", "null" etc. para null
const urlOuNull = z
  .string()
  .optional()
  .nullable()
  .transform((v) => {
    if (!v || v.trim() === "" || v.trim().toLowerCase() === "n/a" || v.trim().toLowerCase() === "null") return null
    return v.trim()
  })

export const AulaSchema = z.object({
  aula:           z.string().min(1),
  data:           z.string().default(""),
  objetivo:       z.string().default(""),
  conteudo:       z.string().default(""),
  metodologia:    z.string().default(""),
  recursos:       z.array(z.string()).default([]),
  codigoBncc:     z.string().optional().nullable().transform((v) => v?.trim() || null),
  video_url:      urlOuNull,
  referencia_url: urlOuNull,
})

export const PlanoSchema = z.object({
  serie:          z.string(),
  materia:        z.string(),
  // campo legado — mantido para planos antigos salvos no jsonData
  codigoBncc:     z.string().optional(),
  // multi-seleção de habilidades BNCC
  codigosBncc:    z.array(z.string()).optional(),
  descricoesBncc: z.array(z.string()).optional(),
  aulas:          z.array(AulaSchema).min(1).max(30),
})

export type Aula        = z.infer<typeof AulaSchema>
export type PlanoGerado = z.infer<typeof PlanoSchema>

/** Retorna os códigos BNCC únicos de todas as aulas do plano */
export function getCodigosBncc(plano: PlanoGerado): string[] {
  const codigos = plano.aulas
    .map((a) => a.codigoBncc)
    .filter((c): c is string => Boolean(c))
  // fallback para planos legados que tinham codigoBncc no nível do plano
  if (codigos.length === 0 && plano.codigoBncc) return [plano.codigoBncc]
  return [...new Set(codigos)]
}
