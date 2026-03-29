import { GoogleGenerativeAI } from "@google/generative-ai"
import { PlanoSchema, type PlanoGerado } from "@/lib/validations"

const MAX_TENTATIVAS = 3

export async function gerarPlanoComGemini(params: {
  pdfBase64: string
  serie: string
  materia: string
  tipo: "MENSAL" | "AULA_UNICA"
  pagDe?: string
  pagAte?: string
}): Promise<PlanoGerado> {
  const { pdfBase64, serie, materia, tipo, pagDe, pagAte } = params

  const instrucaoPaginas =
    pagDe && pagAte ? `Foque apenas nas páginas ${pagDe} a ${pagAte} do PDF.` : ""

  const quantidadeAulas =
    tipo === "MENSAL" ? "entre 20 e 25 aulas" : "exatamente 1 aula detalhada"

  const prompt = `
Você é um assistente especializado em planejamento escolar para o ensino fundamental brasileiro.
Gere um plano de aula com ${quantidadeAulas} para o ${serie} do ensino fundamental, disciplina de ${materia}.
${instrucaoPaginas}
Baseie o plano no conteúdo do PDF anexado.
Para cada aula, sugira 1 vídeo do YouTube em português e 1 referência confiável (Nova Escola, MEC, Khan Academy etc.).

Responda SOMENTE com um JSON válido, sem texto adicional, sem markdown, sem blocos de código.
O JSON deve seguir exatamente esta estrutura:
{
  "serie": "${serie}",
  "materia": "${materia}",
  "aulas": [
    {
      "aula": "Aula 1",
      "data": "DD/MM/AAAA",
      "objetivo": "...",
      "conteudo": "...",
      "metodologia": "...",
      "recursos": ["item1", "item2"],
      "video_url": "https://youtube.com/...",
      "referencia_url": "https://..."
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
        {
          inlineData: {
            mimeType: "application/pdf",
            data: pdfBase64,
          },
        },
      ])

      const texto = result.response.text().trim()

      // Remove possível markdown residual (```json ... ```)
      const jsonLimpo = texto
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/\s*```$/, "")
        .trim()

      const parsed = JSON.parse(jsonLimpo)
      return PlanoSchema.parse(parsed)
    } catch (err) {
      console.error(`[gemini] Tentativa ${tentativa} falhou:`, err)
      ultimoErro = err
      if (tentativa < MAX_TENTATIVAS) {
        await new Promise((r) => setTimeout(r, 1500 * tentativa))
      }
    }
  }

  throw ultimoErro
}
