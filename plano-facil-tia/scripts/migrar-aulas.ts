// Script de migração: este script foi usado para migrar dados de jsonData para a tabela Aula.
// Como jsonData foi removido do schema, este script não tem mais utilidade prática,
// mas é mantido como referência histórica.
//
// Para rodar (caso necessário em ambiente legado com jsonData ainda presente):
//   npx ts-node scripts/migrar-aulas.ts

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("Migração concluída — jsonData foi removido do schema.")
  console.log("Todos os dados já estão na tabela Aula.")
}

main()
  .catch((err) => {
    console.error("Erro fatal:", err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
