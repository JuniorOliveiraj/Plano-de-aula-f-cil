import type { Aula } from "@prisma/client"
import type { AulaItem } from "./distribuidor"

export function aulaToAulaItem(aula: Aula): AulaItem {
  return {
    id: aula.id,
    aula: aula.titulo,
    data: aula.data,
    objetivo: aula.objetivo,
    conteudo: aula.conteudo,
    metodologia: aula.metodologia,
    recursos: aula.recursos,
    codigoBncc: aula.codigoBncc ?? null,
    video_url: aula.video_url,
    referencia_url: aula.referencia_url,
  }
}
