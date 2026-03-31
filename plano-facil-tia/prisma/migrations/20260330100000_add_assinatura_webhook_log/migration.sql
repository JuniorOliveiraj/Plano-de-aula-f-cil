-- CreateEnum
CREATE TYPE "AssinaturaStatus" AS ENUM ('PENDENTE', 'ATIVA', 'INADIMPLENTE', 'CANCELADA');

-- AlterTable
ALTER TABLE "User" ADD COLUMN "asaasCustomerId" TEXT,
ADD COLUMN "asaasSubscriptionId" TEXT;

-- CreateTable
CREATE TABLE "Assinatura" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "asaasSubscriptionId" TEXT NOT NULL,
    "status" "AssinaturaStatus" NOT NULL DEFAULT 'PENDENTE',
    "metodoPagamento" TEXT NOT NULL,
    "valor" DECIMAL(10,2) NOT NULL,
    "criadaEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadaEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Assinatura_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebhookLog" (
    "id" TEXT NOT NULL,
    "evento" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "processado" BOOLEAN NOT NULL DEFAULT false,
    "erro" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WebhookLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Assinatura_userId_key" ON "Assinatura"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Assinatura_asaasSubscriptionId_key" ON "Assinatura"("asaasSubscriptionId");

-- CreateIndex
CREATE INDEX "WebhookLog_evento_idx" ON "WebhookLog"("evento");

-- CreateIndex
CREATE INDEX "WebhookLog_criadoEm_idx" ON "WebhookLog"("criadoEm");

-- AddForeignKey
ALTER TABLE "Assinatura" ADD CONSTRAINT "Assinatura_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
