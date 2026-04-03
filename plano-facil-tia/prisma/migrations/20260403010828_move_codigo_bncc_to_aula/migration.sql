-- Remove codigosBncc do PlanoCalendario (movido para a Aula)
ALTER TABLE "PlanoCalendario" DROP COLUMN IF EXISTS "codigosBncc";

-- Adiciona codigoBncc na Aula (habilidade BNCC atribuída pela IA a cada aula)
ALTER TABLE "Aula" ADD COLUMN IF NOT EXISTS "codigoBncc" TEXT;
