-- CreateTable
CREATE TABLE "PlanoCalendario" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "serie" TEXT NOT NULL,
    "materia" TEXT NOT NULL,
    "tipo" "TipoPlano" NOT NULL,
    "mesReferencia" TEXT,
    "bnccHabilidadeId" INTEGER,
    "jsonData" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlanoCalendario_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PlanoCalendario_userId_mesReferencia_idx" ON "PlanoCalendario"("userId", "mesReferencia");

-- CreateIndex
CREATE INDEX "PlanoCalendario_userId_idx" ON "PlanoCalendario"("userId");

-- AddForeignKey
ALTER TABLE "PlanoCalendario" ADD CONSTRAINT "PlanoCalendario_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanoCalendario" ADD CONSTRAINT "PlanoCalendario_bnccHabilidadeId_fkey" FOREIGN KEY ("bnccHabilidadeId") REFERENCES "BnccHabilidade"("id") ON DELETE SET NULL ON UPDATE CASCADE;
