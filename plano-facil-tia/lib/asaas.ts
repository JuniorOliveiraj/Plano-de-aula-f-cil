// Constantes server-side — NUNCA aceitas do cliente
export const PRECO_ASSINATURA = Number(process.env.VALOR_PLANO_BASICO)
export const PLANO_ASSINATURA_TIPO = "PROFESSORA" as const

export interface AsaasClienteInput {
  nome: string
  email: string
  cpfCnpj: string
}

export interface AsaasAssinaturaInput {
  customerId: string
  billingType: "CREDIT_CARD" | "PIX"
  cardToken?: string
  nextDueDate: string // YYYY-MM-DD
}

export interface AsaasAssinaturaResponse {
  id: string
  status: string
  billingType: string
  pixQrCodeUrl?: string
  pixCopiaECola?: string
}

export interface AsaasPixResponse {
  pixQrCodeUrl?: string
  pixCopiaECola?: string
  encodedImage?: string  // base64 QR code image from Asaas
  payload?: string       // copia e cola field name used by Asaas
}

export class AsaasClient {
  private baseUrl: string
  private apiKey: string

  constructor() {
    const apiUrl = process.env.ASAAS_API_URL
    const apiKey = process.env.ASAAS_API_KEY

    if (!apiUrl) {
      throw new Error(
        "Variável de ambiente ASAAS_API_URL não configurada. " +
        "Defina ASAAS_API_URL no arquivo .env (ex: https://api-sandbox.asaas.com/api/v3)"
      )
    }

    if (!apiKey) {
      throw new Error(
        "Variável de ambiente ASAAS_API_KEY não configurada. " +
        "Defina ASAAS_API_KEY no arquivo .env com a chave de API da Asaas."
      )
    }

    this.baseUrl = apiUrl.replace(/\/$/, "")
    this.apiKey = apiKey
  }

  private async fetchWithTimeout(url: string, options: RequestInit): Promise<Response> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 15_000)

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          "access_token": this.apiKey,
          ...options.headers,
        },
      })
      return response
    } finally {
      clearTimeout(timeoutId)
    }
  }

  async criarCliente(input: AsaasClienteInput): Promise<{ id: string }> {
    const response = await this.fetchWithTimeout(`${this.baseUrl}/customers`, {
      method: "POST",
      body: JSON.stringify({
        name: input.nome,
        email: input.email,
        cpfCnpj: input.cpfCnpj,
      }),
    })

    if (!response.ok) {
      const body = await response.text()
      throw new Error(
        `Asaas criarCliente falhou com HTTP ${response.status}: ${body}`
      )
    }

    return response.json()
  }

  async criarAssinatura(input: AsaasAssinaturaInput): Promise<AsaasAssinaturaResponse> {
    const payload: Record<string, unknown> = {
      customer: input.customerId,
      billingType: input.billingType,
      value: PRECO_ASSINATURA,
      cycle: "MONTHLY",
      nextDueDate: input.nextDueDate,
    }

    if (input.billingType === "CREDIT_CARD" && input.cardToken) {
      payload.creditCardToken = input.cardToken
    }

    const response = await this.fetchWithTimeout(`${this.baseUrl}/subscriptions`, {
      method: "POST",
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const body = await response.text()
      throw new Error(
        `Asaas criarAssinatura falhou com HTTP ${response.status}: ${body}`
      )
    }

    return response.json()
  }

  async cancelarAssinatura(subscriptionId: string): Promise<void> {
    const response = await this.fetchWithTimeout(
      `${this.baseUrl}/subscriptions/${subscriptionId}`,
      { method: "DELETE" }
    )

    if (!response.ok) {
      const body = await response.text()
      throw new Error(
        `Asaas cancelarAssinatura falhou com HTTP ${response.status}: ${body}`
      )
    }
  }

  /**
   * Busca os pagamentos de uma assinatura e retorna os dados PIX do primeiro.
   * Necessário porque /subscriptions não retorna QR code diretamente.
   */
  async buscarPixDaAssinatura(subscriptionId: string): Promise<AsaasPixResponse> {
    // Busca os pagamentos (charges) da assinatura
    const response = await this.fetchWithTimeout(
      `${this.baseUrl}/payments?subscription=${subscriptionId}&limit=1`,
      { method: "GET" }
    )

    if (!response.ok) {
      return {}
    }

    const data = await response.json() as { data?: Array<{ id: string }> }
    const firstPayment = data.data?.[0]
    if (!firstPayment) return {}

    // Busca o QR code PIX do pagamento
    const pixResponse = await this.fetchWithTimeout(
      `${this.baseUrl}/payments/${firstPayment.id}/pixQrCode`,
      { method: "GET" }
    )

    if (!pixResponse.ok) return {}

    return pixResponse.json()
  }
}
