-- CreateEnum
CREATE TYPE "Role" AS ENUM ('PROFESSORA', 'ADMIN_ESCOLA', 'ADMIN_SISTEMA');

-- CreateEnum
CREATE TYPE "PlanoTipo" AS ENUM ('TRIAL', 'PROFESSORA', 'ESCOLA');

-- CreateEnum
CREATE TYPE "TipoPlano" AS ENUM ('MENSAL', 'AULA_UNICA');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT,
    "googleId" TEXT,
    "role" "Role" NOT NULL DEFAULT 'PROFESSORA',
    "plano" "PlanoTipo" NOT NULL DEFAULT 'TRIAL',
    "trialExpiraEm" TIMESTAMP(3) NOT NULL DEFAULT NOW() + INTERVAL '14 days',
    "planosNoMes" INTEGER NOT NULL DEFAULT 0,
    "planoResetEm" TIMESTAMP(3) NOT NULL DEFAULT DATE_TRUNC('month', NOW()) + INTERVAL '1 month',
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "escolaId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Plano" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "serie" TEXT NOT NULL,
    "materia" TEXT NOT NULL,
    "tipo" "TipoPlano" NOT NULL,
    "jsonData" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Plano_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Escola" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cnpj" TEXT,
    "limiteUsers" INTEGER NOT NULL DEFAULT 10,
    "limitePlanos" INTEGER NOT NULL DEFAULT 100,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Escola_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_googleId_key" ON "User"("googleId");

-- CreateIndex
CREATE UNIQUE INDEX "Escola_cnpj_key" ON "Escola"("cnpj");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_escolaId_fkey" FOREIGN KEY ("escolaId") REFERENCES "Escola"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Plano" ADD CONSTRAINT "Plano_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
