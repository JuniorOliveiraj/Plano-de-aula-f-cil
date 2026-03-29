-- CreateTable
CREATE TABLE "BnccHabilidade" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "serie" INTEGER NOT NULL,
    "area" TEXT NOT NULL,
    "unidade" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BnccHabilidade_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BnccHabilidade_codigo_key" ON "BnccHabilidade"("codigo");

-- CreateIndex
CREATE INDEX "BnccHabilidade_serie_area_idx" ON "BnccHabilidade"("serie", "area");
