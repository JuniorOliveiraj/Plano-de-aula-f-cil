import {
  Document,
  Packer,
  Table,
  TableRow,
  TableCell,
  Paragraph,
  TextRun,
  WidthType,
  BorderStyle,
} from "docx"
import type { PlanoGerado } from "@/lib/validations"

// Retorna o código BNCC da aula, com fallback para o campo legado do plano
function bnccDaAula(aula: PlanoGerado["aulas"][number], plano: PlanoGerado): string {
  return aula.codigoBncc || plano.codigoBncc || "—"
}

// Colunas baseadas na estrutura pedagógica da Catarina
const COLUNAS = [
  "Data / Matéria", 
  "Objetivo de Aprendizagem", 
  "Habilidades (BNCC)", 
  "Metodologia", 
  "Avaliação"
]

function celula(texto: string, negrito = false): TableCell {
  return new TableCell({
    borders: {
      top:    { style: BorderStyle.SINGLE, size: 1, color: "000000" }, // Cores neutras para impressão
      bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
      left:   { style: BorderStyle.SINGLE, size: 1, color: "000000" },
      right:  { style: BorderStyle.SINGLE, size: 1, color: "000000" },
    },
    margins: { top: 100, bottom: 100, left: 100, right: 100 }, // Respiro interno nas células
    children: [
      new Paragraph({
        children: [new TextRun({ text: texto || "—", bold: negrito, font: "Arial", size: 20 })],
      }),
    ],
  })
}

export async function gerarDocx(plano: PlanoGerado): Promise<Buffer> {
  const ano = new Date().getFullYear()
  // 1. Recriando o cabeçalho em formato de lista da Catarina
  const cabecalhoInfos = [
    "Planejamento: Mensal.",
    "Professora: _______________________",
    "Escola: _______________________",
    `Período: ___/___/ ${ano}`,
    `${plano.serie} - Ensino Fundamental.`
  ]

  const paragraphsCabecalho = cabecalhoInfos.map(
    (texto) =>
      new Paragraph({
        children: [new TextRun({ text: texto, font: "Arial", size: 24, bold: true })],
        spacing: { after: 60 },
      })
  )

  // 2. Cabeçalho da Tabela
  const headerRow = new TableRow({
    tableHeader: true,
    children: COLUNAS.map((col) => celula(col, true)),
  })

  // 3. Mapeando as aulas para as colunas da Catarina
  const linhas = plano.aulas.map(
    (aula) =>
      new TableRow({
        children: [
          celula(`${aula.data}\n${plano.materia}`),
          celula(aula.objetivo),
          celula(bnccDaAula(aula, plano)),
          celula(aula.metodologia),
          celula("Atividades no caderno / Participação e envolvimento"),
        ],
      })
  )

  const tabela = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [headerRow, ...linhas],
  })

  const doc = new Document({
    sections: [
      { 
        children: [
          ...paragraphsCabecalho, 
          new Paragraph({ text: "", spacing: { after: 300 } }), // Espaço entre cabeçalho e tabela
          tabela
        ] 
      }
    ],
  })

  return Buffer.from(await Packer.toBuffer(doc))
}