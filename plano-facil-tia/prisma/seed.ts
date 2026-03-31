import { PrismaClient } from "@prisma/client"
import fs from "fs"
import path from "path"

const prisma = new PrismaClient()

function carregarHabilidadesBncc() {
  const dir = path.join(__dirname, "data/bncc")
  const arquivos = fs.readdirSync(dir).filter((f) => f.endsWith(".json"))

  return arquivos.flatMap((arquivo) => {
    const conteudo = fs.readFileSync(path.join(dir, arquivo), "utf-8")
    return JSON.parse(conteudo)
  })
}

async function main() {
  const habilidades = carregarHabilidadesBncc()

  await prisma.bnccHabilidade.createMany({
    data: habilidades,
    skipDuplicates: true,
  })

  await prisma.configLimite.createMany({
    data: [
      {
        id: "config-trial-gerar-plano",
        planoTipo: "TRIAL",
        funcionalidade: "GERAR_PLANO",
        limiteTotal: 3,
        limiteDiario: 5,
        limiteMensal: null,
      },
      {
        id: "config-professora-gerar-plano",
        planoTipo: "PROFESSORA",
        funcionalidade: "GERAR_PLANO",
        limiteMensal: 15,
        limiteDiario: 5,
        limiteTotal: null,
      },
      {
        id: "config-escola-gerar-plano",
        planoTipo: "ESCOLA",
        funcionalidade: "GERAR_PLANO",
        limiteMensal: 100,
        limiteDiario: 30,
        limiteTotal: null,
      },
    ],
    skipDuplicates: true,
  })

  console.log(`Seed concluído! ${habilidades.length} habilidades carregadas.`)
}

main().catch(console.error).finally(() => prisma.$disconnect())
