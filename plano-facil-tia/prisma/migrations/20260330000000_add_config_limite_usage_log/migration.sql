-- CreateEnum
CREATE TYPE "FuncionalidadeTipo" AS ENUM ('GERAR_PLANO');

-- CreateTable
CREATE TABLE "ConfigLimite" (
    "id" TEXT NOT NULL,
    "planoTipo" "PlanoTipo" NOT NULL,
    "funcionalidade" "FuncionalidadeTipo" NOT NULL,
    "limiteMensal" INTEGER,
    "limiteDiario" INTEGER,
    "limiteTotal" INTEGER,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConfigLimite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsageLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "funcionalidade" "FuncionalidadeTipo" NOT NULL,
    "mes" INTEGER NOT NULL,
    "ano" INTEGER NOT NULL,
    "totalMes" INTEGER NOT NULL DEFAULT 0,
    "totalDia" INTEGER NOT NULL DEFAULT 0,
    "totalGeral" INTEGER NOT NULL DEFAULT 0,
    "ultimoUso" TIMESTAMP(3),

    CONSTRAINT "UsageLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ConfigLimite_planoTipo_funcionalidade_key" ON "ConfigLimite"("planoTipo", "funcionalidade");

-- CreateIndex
CREATE UNIQUE INDEX "UsageLog_userId_funcionalidade_mes_ano_key" ON "UsageLog"("userId", "funcionalidade", "mes", "ano");

-- AddForeignKey
ALTER TABLE "UsageLog" ADD CONSTRAINT "UsageLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
