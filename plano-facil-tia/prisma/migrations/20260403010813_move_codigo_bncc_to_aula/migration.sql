/*
  Warnings:

  - You are about to drop the column `codigosBncc` on the `PlanoCalendario` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Aula" ADD COLUMN     "codigoBncc" TEXT;

-- AlterTable
ALTER TABLE "PlanoCalendario" DROP COLUMN "codigosBncc";
