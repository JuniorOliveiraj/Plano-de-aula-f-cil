import { PDFDocument, rgb, StandardFonts } from "pdf-lib"
import type { PlanoGerado } from "@/lib/validations"

// Retorna o código BNCC da aula, com fallback para o campo legado do plano
function bnccDaAula(aula: PlanoGerado["aulas"][number], plano: PlanoGerado): string {
  return aula.codigoBncc || plano.codigoBncc || "—"
}

// Cores neutras focadas em impressão escolar padrão
const COR_TEXTO = rgb(0, 0, 0)
const COR_HEADER_BG = rgb(0.9, 0.9, 0.9) // Cinza claro para o fundo do cabeçalho da tabela
const COR_BORDA = rgb(0, 0, 0)

const MARGEM = 40
// Colunas estruturadas conforme o modelo de referência
const COLUNAS = ["Data / Matéria", "Objetivo", "Habilidades", "Metodologia", "Avaliação"]
const LARGURAS = [80, 110, 80, 145, 100] // px por coluna (soma = 515. 595 largura A4 - 80 margens)
const CHARS = [15, 23, 14, 30, 20]       // Limite aproximado de caracteres por linha para cada coluna

function wrapText(text: string, maxChars: number): string[] {
  const words = text.split(" ")
  const lines: string[] = []
  let line = ""
  for (const word of words) {
    if ((line + " " + word).trim().length > maxChars) {
      if (line) lines.push(line.trim())
      line = word
    } else {
      line = line ? line + " " + word : word
    }
  }
  if (line) lines.push(line.trim())
  return lines.length ? lines : [""]
}

export async function gerarPdf(plano: PlanoGerado): Promise<Buffer> {
  const doc = await PDFDocument.create()
  const font = await doc.embedFont(StandardFonts.Helvetica)
  const bold = await doc.embedFont(StandardFonts.HelveticaBold)

  let page = doc.addPage([595, 842]) // A4
  let { width, height } = page.getSize()
  let y = height - MARGEM
  const ano = new Date().getFullYear()
  // ── Cabeçalho do Documento ─────────────────────────────────────
  const infoCabecalho = [
    "Planejamento: Mensal.",
    "Professora: _______________________",
    "Escola: _______________________",
    `Período: ___/___/ ${ano}`,
    `${plano.serie} - Ensino Fundamental.`
  ]

  infoCabecalho.forEach((linha) => {
    page.drawText(linha, { x: MARGEM, y, size: 12, font: bold, color: COR_TEXTO })
    y -= 16
  })
  
  y -= 14 // Espaço extra antes de iniciar a tabela

  // ── Cabeçalho da tabela ────────────────────────────────────────
  const TABLE_X = MARGEM
  const CELL_H = 20

  function desenharCabecalho(pg: Awaited<ReturnType<typeof doc.addPage>>, yPos: number) {
    let x = TABLE_X
    for (let i = 0; i < COLUNAS.length; i++) {
      pg.drawRectangle({ 
        x, y: yPos - CELL_H, 
        width: LARGURAS[i], height: CELL_H, 
        color: COR_HEADER_BG, borderColor: COR_BORDA, borderWidth: 1 
      })
      pg.drawText(COLUNAS[i], { x: x + 4, y: yPos - 14, size: 8, font: bold, color: COR_TEXTO })
      x += LARGURAS[i]
    }
    return yPos - CELL_H
  }

  y = desenharCabecalho(page, y)

  // ── Linhas das aulas ───────────────────────────────────────────
  for (let idx = 0; idx < plano.aulas.length; idx++) {
    const aula = plano.aulas[idx]
    
    // Mapeamento dos dados para as novas colunas
    const row = [
      `${aula.data}\n${plano.materia}`,
      aula.objetivo,
      bnccDaAula(aula, plano),
      aula.metodologia,
      "Atividades no caderno.\nParticipação de cada aluno.",
    ]

    // Calcula a quantidade de linhas que o texto vai ocupar para definir a altura da célula
    const linhasPorCelula = row.map((txt, i) => {
      // Divide por quebras de linha manuais (\n) primeiro, depois faz o wrap
      const partes = txt.split("\n")
      return partes.flatMap(parte => wrapText(parte, CHARS[i]))
    })
    
    const maxLinhas = Math.max(...linhasPorCelula.map((l) => l.length))
    const rowH = Math.max(CELL_H, maxLinhas * 10 + 10) // 10px de altura por linha + padding

    // Adiciona nova página se não couber na atual
    if (y - rowH < MARGEM + 30) {
      page = doc.addPage([width, height])
      y = height - MARGEM
      y = desenharCabecalho(page, y)
    }

    let x = TABLE_X
    for (let i = 0; i < LARGURAS.length; i++) {
      // Desenha o quadrado da célula
      page.drawRectangle({ 
        x, y: y - rowH, 
        width: LARGURAS[i], height: rowH, 
        borderColor: COR_BORDA, borderWidth: 1 
      })
      
      // Desenha o texto linha por linha
      const linhas = linhasPorCelula[i]
      linhas.forEach((linha, li) => {
        page.drawText(linha, { x: x + 4, y: y - 12 - li * 10, size: 8, font, color: COR_TEXTO })
      })
      x += LARGURAS[i]
    }
    y -= rowH
  }

  // ── Rodapé ────────────────────────────────────────────────────
  const pages = doc.getPages()
  pages.forEach((pg, i) => {
    const sz = pg.getSize()
    pg.drawText(`Página ${i + 1} de ${pages.length}`, {
      x: sz.width - MARGEM - 50, y: 20, size: 8, font, color: COR_TEXTO,
    })
  })

  const bytes = await doc.save()
  return Buffer.from(bytes)
}