import { GoogleGenerativeAI } from "@google/generative-ai"
import { PlanoSchema, type PlanoGerado } from "@/lib/validations"

const MAX_TENTATIVAS = 3

/** Extrai o retryDelay em ms do erro 429 da API do Gemini, se disponível */
function extrairRetryDelay(err: unknown): number | null {
  try {
    const msg = (err as Error).message ?? ""
    const match = msg.match(/retry[^\d]*(\d+(?:\.\d+)?)s/i)
    if (match) return Math.ceil(parseFloat(match[1])) * 1000
  } catch {}
  return null
}

/** Retorna true se o erro é transitório e vale a pena tentar de novo */
function erroTransitorio(err: unknown): boolean {
  const msg = String((err as Error)?.message ?? "")
  // 429 de quota diária/mensal — não adianta tentar de novo
  if (msg.includes("free_tier") || msg.includes("quota")) return false
  // 429 de rate limit por minuto — vale esperar e tentar
  if (msg.includes("429") || msg.includes("503") || msg.includes("overloaded")) return true
  // Erros de parse/validação — vale tentar de novo
  if (err instanceof SyntaxError) return true
  return true
}

export async function gerarPlanoComGemini(params: {
  pdfBase64: string
  serie: string
  materia: string
  tipo: "MENSAL" | "QUINZENAL" | "AULA_UNICA"
  pagDe?: string
  pagAte?: string
}): Promise<PlanoGerado> {
  const { pdfBase64, serie, materia, tipo, pagDe, pagAte } = params

  const instrucaoPaginas =
    pagDe && pagAte ? `Foque apenas nas páginas ${pagDe} a ${pagAte} do PDF.` : ""

  const quantidadeAulas =
    tipo === "MENSAL" ? "entre 20 e 25 aulas"
    : tipo === "QUINZENAL" ? "exatamente 15 aulas"
    : "exatamente 1 aula detalhada"

  const prompt = `
Você é um assistente especializado em planejamento escolar para o ensino fundamental brasileiro.
Gere um plano de aula com ${quantidadeAulas} para o ${serie} do ensino fundamental, disciplina de ${materia}.
${instrucaoPaginas}
Baseie o plano no conteúdo do PDF anexado.
Para cada aula, sugira o título de 1 vídeo relevante do YouTube em português e o nome de 1 fonte confiável (Nova Escola, MEC, Khan Academy etc.).

Responda SOMENTE com um JSON válido, sem texto adicional, sem markdown, sem blocos de código.
O JSON deve seguir exatamente esta estrutura:
{
  "serie": "${serie}",
  "materia": "${materia}",
  "aulas": [
    {
      "aula": "Nome descritivo da aula",
      "data": "",
      "objetivo": "Objetivo claro e mensurável",
      "conteudo": "Conteúdo abordado na aula",
      "metodologia": "Como a aula será conduzida",
      "recursos": ["item1", "item2"],
      "video_url": "[me retorne uma url de um video do youtube sobre o assunto da aula]",
      "referencia_url": "[me retorne uma url deuma referencia]"
    }
  ]
}
  `.trim()

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      temperature: 0.1,
      responseMimeType: "application/json",
    },
  })

  let ultimoErro: unknown
  for (let tentativa = 1; tentativa <= MAX_TENTATIVAS; tentativa++) {
    try {
      const result = await model.generateContent([
        prompt,
        { inlineData: { mimeType: "application/pdf", data: pdfBase64 } },
      ])

      const texto = result.response.text().trim()
      const jsonLimpo = texto
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/\s*```$/, "")
        .trim()

      const parsed = JSON.parse(jsonLimpo)
      return PlanoSchema.parse(parsed)
    } catch (err) {
      console.error(`[gemini] Tentativa ${tentativa} falhou:`, err)
      ultimoErro = err

      if (!erroTransitorio(err) || tentativa >= MAX_TENTATIVAS) break

      const retryMs = extrairRetryDelay(err) ?? 1500 * tentativa
      console.log(`[gemini] Aguardando ${retryMs}ms antes da tentativa ${tentativa + 1}...`)
      await new Promise((r) => setTimeout(r, retryMs))
    }
  }

  throw ultimoErro
}

export function buildPromptSemPdf(params: {
  serie: string
  materia: string
  tipo: "MENSAL" | "QUINZENAL" | "AULA_UNICA"
  tema: string
  codigoBncc: string
  descricaoBncc: string
  duracao: number
  codigosBncc?: string[]
  descricoesBncc?: string[]
}): string {
  const { serie, materia, tipo, tema, codigoBncc, descricaoBncc, duracao, codigosBncc, descricoesBncc } = params
  const quantidadeAulas =
    tipo === "MENSAL" ? "entre 20 e 25 aulas"
    : tipo === "QUINZENAL" ? "exatamente 15 aulas"
    : "exatamente 1 aula detalhada"

  // Monta bloco de habilidades — múltiplas ou única
  const habilidadesTexto = codigosBncc && codigosBncc.length > 1
    ? codigosBncc
        .map((cod, i) => `- ${cod}: ${descricoesBncc?.[i] ?? ""}`)
        .join("\n")
    : `- ${codigoBncc}: ${descricaoBncc}`

  const instrucaoBncc = codigosBncc && codigosBncc.length > 1
    ? `Para cada aula, atribua o campo "codigoBncc" com o código da habilidade BNCC mais adequada para aquela aula (escolha entre: ${codigosBncc.join(", ")}). Distribua as habilidades de forma pedagógica e progressiva ao longo do plano.`
    : `Para cada aula, preencha o campo "codigoBncc" com "${codigoBncc}".`

  return `
Você é um assistente especializado em planejamento escolar para o ensino fundamental brasileiro.
Gere um plano de aula com ${quantidadeAulas} para o ${serie} do ensino fundamental, disciplina de ${materia}.

Tema/Atividade: ${tema}
Habilidades BNCC disponíveis:
${habilidadesTexto}
Duração de cada aula: ${duracao} minutos

${instrucaoBncc}
Adapte a metodologia e os recursos ao tempo de ${duracao} minutos.
Para cada aula, sugira o título de 1 vídeo relevante do YouTube em português e o nome de 1 fonte confiável (Nova Escola, MEC, Khan Academy etc.).

Responda SOMENTE com um JSON válido, sem texto adicional, sem markdown, sem blocos de código.
O JSON deve seguir exatamente esta estrutura:
{
  "serie": "${serie}",
  "materia": "${materia}",
  "aulas": [
    {
      "aula": "Nome descritivo da aula",
      "data": "",
      "codigoBncc": "EF03LP01",
      "objetivo": "Objetivo claro e mensurável alinhado à habilidade BNCC",
      "conteudo": "Conteúdo abordado na aula",
      "metodologia": "Como a aula será conduzida",
      "recursos": ["item1", "item2"],
      "video_url": "[me retorne uma url de um video do youtube sobre o assunto da aula]",
      "referencia_url": "[me retorne uma url deuma referencia]"
    }
  ]
}
  `.trim()
}

export async function gerarPlanoSemPdf(params: {
  serie: string
  materia: string
  tipo: "MENSAL" | "QUINZENAL" | "AULA_UNICA"
  tema: string
  codigoBncc: string
  descricaoBncc: string
  duracao: number
  codigosBncc?: string[]
  descricoesBncc?: string[]
}): Promise<PlanoGerado> {
  const prompt = buildPromptSemPdf(params)

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      temperature: 0.1,
      responseMimeType: "application/json",
    },
  })

  let ultimoErro: unknown
  for (let tentativa = 1; tentativa <= MAX_TENTATIVAS; tentativa++) {
    try {
      const result = await model.generateContent([prompt])
      const texto = result.response.text().trim()
      const jsonLimpo = texto
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/\s*```$/, "")
        .trim()
      const parsed = JSON.parse(jsonLimpo)
      return PlanoSchema.parse(parsed)
    } catch (err) {
      console.error(`[gemini/semPdf] Tentativa ${tentativa} falhou:`, err)
      ultimoErro = err

      if (!erroTransitorio(err) || tentativa >= MAX_TENTATIVAS) break

      const retryMs = extrairRetryDelay(err) ?? 1500 * tentativa
      console.log(`[gemini/semPdf] Aguardando ${retryMs}ms antes da tentativa ${tentativa + 1}...`)
      await new Promise((r) => setTimeout(r, retryMs))
    }
  }

  throw ultimoErro
}
