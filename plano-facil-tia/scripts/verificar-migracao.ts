// Script de verificação de integridade pós-migração.
// Verifica se existem PlanoCalendario sem nenhuma Aula associada.
//
// Para rodar:
//   npx ts-node scripts/verificar-migracao.ts

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  const planos = await prisma.planoCalendario.findMany({
    include: { _count: { select: { aulas: true } } },
  })

  console.log(`Verificando ${planos.length} plano(s)...`)

  const pendentes = planos
    .filter((p) => p._count.aulas === 0)
    .map((p) => p.id)

  if (pendentes.length > 0) {
    console.error(`\n[AVISO] ${pendentes.length} plano(s) sem aulas na tabela relacional:`)
    pendentes.forEach((id) => console.error(`  - ${id}`))
    process.exit(1)
  }

  console.log("\n[OK] Todos os planos possuem aulas na tabela relacional.")
  process.exit(0)
}

main()
  .catch((err) => {
    console.error("Erro fatal:", err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
