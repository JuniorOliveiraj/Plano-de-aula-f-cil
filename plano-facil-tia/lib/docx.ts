import {
  Document,
  Packer,
  Table,
  TableRow,
  TableCell,
  Paragraph,
  TextRun,
  HeadingLevel,
  WidthType,
  AlignmentType,
  BorderStyle,
} from "docx"
import type { PlanoGerado } from "@/lib/validations"

const COLUNAS = ["Aula", "Data", "Objetivo", "Metodologia", "Vídeo", "Referência"]

function celula(texto: string, negrito = false): TableCell {
  return new TableCell({
    borders: {
      top:    { style: BorderStyle.SINGLE, size: 1, color: "D4A574" },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: "D4A574" },
      left:   { style: BorderStyle.SINGLE, size: 1, color: "D4A574" },
      right:  { style: BorderStyle.SINGLE, size: 1, color: "D4A574" },
    },
    children: [
      new Paragraph({
        children: [new TextRun({ text: texto, bold: negrito, font: "Arial", size: 20 })],
      }),
    ],
  })
}

export async function gerarDocx(plano: PlanoGerado): Promise<Buffer> {
  const cabecalho = new Paragraph({
    text: `Plano de Aula — ${plano.serie} — ${plano.materia}`,
    heading: HeadingLevel.HEADING_1,
    alignment: AlignmentType.CENTER,
  })

  const headerRow = new TableRow({
    tableHeader: true,
    children: COLUNAS.map((col) => celula(col, true)),
  })

  const linhas = plano.aulas.map(
    (aula) =>
      new TableRow({
        children: [
          celula(aula.aula),
          celula(aula.data),
          celula(aula.objetivo),
          celula(aula.metodologia),
          celula(aula.video_url ?? "—"),
          celula(aula.referencia_url ?? "—"),
        ],
      })
  )

  const tabela = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [headerRow, ...linhas],
  })

  const doc = new Document({
    sections: [{ children: [cabecalho, new Paragraph(""), tabela] }],
  })

  return Buffer.from(await Packer.toBuffer(doc))
}
