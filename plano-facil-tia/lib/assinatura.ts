import { prisma } from "./prisma"
import { AsaasClient, PRECO_ASSINATURA } from "./asaas"

export interface IniciarAssinaturaInput {
  userId: string
  cpfCnpj: string
  billingType: "CREDIT_CARD" | "PIX"
  cardToken?: string
  // campos valor/plano/amount são IGNORADOS — definidos server-side
}

export interface IniciarAssinaturaResult {
  sucesso: boolean
  metodoPagamento: "CREDIT_CARD" | "PIX"
  pixQrCodeUrl?: string
  pixCopiaECola?: string
  erro?: string
}

export class AssinaturaService {
  private asaasClient: AsaasClient

  constructor() {
    this.asaasClient = new AsaasClient()
  }

  /**
   * Retorna o asaasCustomerId existente ou cria um novo cliente na Asaas.
   * Idempotente: se já existe asaasCustomerId, retorna sem criar duplicata.
   */
  async criarOuBuscarCliente(userId: string, cpfCnpj: string): Promise<string> {
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: { name: true, email: true, asaasCustomerId: true },
    })

    if (user.asaasCustomerId) {
      return user.asaasCustomerId
    }

    const { id: asaasCustomerId } = await this.asaasClient.criarCliente({
      nome: user.name,
      email: user.email,
      cpfCnpj,
    })

    await prisma.user.update({
      where: { id: userId },
      data: { asaasCustomerId },
    })

    return asaasCustomerId
  }

  /**
   * Inicia uma assinatura recorrente mensal de R$xx,xx.
   * Ignora qualquer campo valor/plano/amount do input — usa constantes server-side.
   * Retorna resultado sem expor asaasCustomerId ou asaasSubscriptionId.
   */
  async iniciarAssinatura(input: IniciarAssinaturaInput): Promise<IniciarAssinaturaResult> {
    const { userId, cpfCnpj, billingType, cardToken } = input

    try {
      const customerId = await this.criarOuBuscarCliente(userId, cpfCnpj)

      const nextDueDate = new Date().toISOString().slice(0, 10) // YYYY-MM-DD

      const assinatura = await this.asaasClient.criarAssinatura({
        customerId,
        billingType,
        cardToken,
        nextDueDate,
      })

      await prisma.$transaction([
        prisma.assinatura.upsert({
          where: { userId },
          create: {
            userId,
            asaasSubscriptionId: assinatura.id,
            status: "PENDENTE",
            metodoPagamento: billingType,
            valor: PRECO_ASSINATURA,
          },
          update: {
            asaasSubscriptionId: assinatura.id,
            status: "PENDENTE",
            metodoPagamento: billingType,
            valor: PRECO_ASSINATURA,
          },
        }),
        prisma.user.update({
          where: { id: userId },
          data: { asaasSubscriptionId: assinatura.id },
        }),
      ])

      const result: IniciarAssinaturaResult = {
        sucesso: true,
        metodoPagamento: billingType,
      }

      // Para PIX, busca o QR code do primeiro pagamento da assinatura
      if (billingType === "PIX") {
        try {
          const pixData = await this.asaasClient.buscarPixDaAssinatura(assinatura.id)
          // Asaas retorna encodedImage (base64) e payload (copia e cola)
          if (pixData.encodedImage) {
            result.pixQrCodeUrl = `data:image/png;base64,${pixData.encodedImage}`
          } else if (pixData.pixQrCodeUrl) {
            result.pixQrCodeUrl = pixData.pixQrCodeUrl
          }
          result.pixCopiaECola = pixData.payload ?? pixData.pixCopiaECola
        } catch (e) {
          console.warn("[AssinaturaService] Não foi possível buscar PIX QR code:", e)
        }
      } else {
        if (assinatura.pixQrCodeUrl) result.pixQrCodeUrl = assinatura.pixQrCodeUrl
        if (assinatura.pixCopiaECola) result.pixCopiaECola = assinatura.pixCopiaECola
      }

      return result
    } catch (error) {
      console.error("[AssinaturaService] iniciarAssinatura error:", error)
      const mensagem = error instanceof Error ? error.message : "Erro ao iniciar assinatura"
      return { sucesso: false, metodoPagamento: billingType, erro: mensagem }
    }
  }

  /**
   * Cancela a assinatura na Asaas e atualiza o status local para CANCELADA.
   * Não altera User.plano — aguarda webhook SUBSCRIPTION_DELETED para isso.
   */
  async cancelarAssinatura(userId: string): Promise<void> {
    const assinatura = await prisma.assinatura.findUniqueOrThrow({
      where: { userId },
      select: { asaasSubscriptionId: true },
    })

    await this.asaasClient.cancelarAssinatura(assinatura.asaasSubscriptionId)

    await prisma.assinatura.update({
      where: { userId },
      data: { status: "CANCELADA" },
    })
  }

  /**
   * Processa eventos de webhook da Asaas.
   * Atualiza estado local conforme o tipo de evento.
   * Eventos desconhecidos ou subscriptionId não mapeado: loga e retorna sem lançar.
   */
  async processarWebhook(evento: string, payload: unknown): Promise<void> {
    const p = payload as Record<string, unknown>

    const asaasSubscriptionId =
      (p.subscription as string | undefined) ??
      ((p.payment as Record<string, unknown> | undefined)?.subscription as string | undefined)

    if (!asaasSubscriptionId) {
      console.warn("[AssinaturaService] processarWebhook: asaasSubscriptionId não encontrado no payload", { evento })
      return
    }

    const assinatura = await prisma.assinatura.findUnique({
      where: { asaasSubscriptionId },
      select: { userId: true },
    })

    if (!assinatura) {
      console.warn("[AssinaturaService] processarWebhook: asaasSubscriptionId não mapeado", { asaasSubscriptionId, evento })
      return
    }

    const { userId } = assinatura

    switch (evento) {
      case "PAYMENT_CONFIRMED":
      case "PAYMENT_RECEIVED":
        await prisma.$transaction([
          prisma.user.update({
            where: { id: userId },
            data: { plano: "PROFESSORA", ativo: true },
          }),
          prisma.assinatura.update({
            where: { asaasSubscriptionId },
            data: { status: "ATIVA" },
          }),
        ])
        break

      case "PAYMENT_OVERDUE":
        await prisma.$transaction([
          prisma.user.update({
            where: { id: userId },
            data: { ativo: false },
          }),
          prisma.assinatura.update({
            where: { asaasSubscriptionId },
            data: { status: "INADIMPLENTE" },
          }),
        ])
        break

      case "SUBSCRIPTION_DELETED":
        await prisma.$transaction([
          prisma.user.update({
            where: { id: userId },
            data: { plano: "TRIAL", ativo: true },
          }),
          prisma.assinatura.update({
            where: { asaasSubscriptionId },
            data: { status: "CANCELADA" },
          }),
        ])
        break

      default:
        console.warn("[AssinaturaService] processarWebhook: evento desconhecido", { evento })
        break
    }
  }
}
