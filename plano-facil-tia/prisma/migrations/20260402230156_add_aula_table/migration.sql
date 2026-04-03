-- AlterTable
ALTER TABLE "PlanoCalendario" ALTER COLUMN "jsonData" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Aula" (
    "id" TEXT NOT NULL,
    "planoCalendarioId" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "objetivo" TEXT NOT NULL,
    "conteudo" TEXT NOT NULL,
    "metodologia" TEXT NOT NULL,
    "recursos" TEXT[],
    "video_url" TEXT,
    "referencia_url" TEXT,
    "ordem" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Aula_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Aula_data_idx" ON "Aula"("data");

-- CreateIndex
CREATE INDEX "Aula_planoCalendarioId_data_idx" ON "Aula"("planoCalendarioId", "data");

-- AddForeignKey
ALTER TABLE "Aula" ADD CONSTRAINT "Aula_planoCalendarioId_fkey" FOREIGN KEY ("planoCalendarioId") REFERENCES "PlanoCalendario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
