"use client"

import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"

type BillingType = "CREDIT_CARD" | "PIX"

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    AsaasCheckout?: any
  }
}

const BENEFITS = [
  "Planos de aula ilimitados por mês",
  "Acesso a todos os modelos e formatos",
  "Exportação em PDF e Word",
  "Suporte prioritário",
  "Histórico completo de planos",
]

export default function AssinarForm({ preco }: { preco: number }) {
  const router = useRouter()

  // Form state
  const [cpfCnpj, setCpfCnpj] = useState("")
  const [billingType, setBillingType] = useState<BillingType>("CREDIT_CARD")

  // Card fields
  const [cardNumber, setCardNumber] = useState("")
  const [cardExpiry, setCardExpiry] = useState("")
  const [cardCvv, setCardCvv] = useState("")
  const [cardName, setCardName] = useState("")

  // UI state
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  // Asaas SDK
  const sdkLoaded = useRef(false)

  useEffect(() => {
    if (sdkLoaded.current) return
    sdkLoaded.current = true

    const script = document.createElement("script")
    script.src = "https://sandbox.asaas.com/static/js/asaas.js"
    script.async = true
    document.head.appendChild(script)

    return () => {
      // cleanup only if still in head
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [])

  function validateFields(): boolean {
    const errors: Record<string, string> = {}

    const cpf = cpfCnpj.replace(/\D/g, "")
    if (!cpf) {
      errors.cpfCnpj = "CPF/CNPJ é obrigatório."
    } else if (cpf.length !== 11 && cpf.length !== 14) {
      errors.cpfCnpj = "CPF deve ter 11 dígitos ou CNPJ 14 dígitos."
    }

    if (billingType === "CREDIT_CARD") {
      if (!cardNumber.replace(/\s/g, "")) errors.cardNumber = "Número do cartão é obrigatório."
      if (!cardExpiry) errors.cardExpiry = "Validade é obrigatória."
      if (!cardCvv) errors.cardCvv = "CVV é obrigatório."
      if (!cardName.trim()) errors.cardName = "Nome no cartão é obrigatório."
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  async function tokenizeCard(): Promise<string | null> {
    // Try Asaas.js SDK if available
    if (window.AsaasCheckout) {
      try {
        const [expMonth, expYear] = cardExpiry.split("/")
        const token = await window.AsaasCheckout.tokenizeCard({
          cardNumber: cardNumber.replace(/\s/g, ""),
          expiryMonth: expMonth?.trim(),
          expiryYear: expYear?.trim(),
          cvv: cardCvv,
          holderName: cardName,
        })
        return token
      } catch (err) {
        console.error("Asaas tokenization error:", err)
        throw new Error("Falha ao tokenizar cartão. Verifique os dados e tente novamente.")
      }
    }

    // SDK not loaded — return a placeholder so the server can handle it
    // (server will reject invalid tokens; this path is for dev/sandbox only)
    return `card_placeholder_${Date.now()}`
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setFieldErrors({})

    if (!validateFields()) return

    setLoading(true)

    try {
      let cardToken: string | undefined

      if (billingType === "CREDIT_CARD") {
        const token = await tokenizeCard()
        if (!token) {
          setError("Não foi possível processar os dados do cartão.")
          setLoading(false)
          return
        }
        cardToken = token
      }

      const body: { cpfCnpj: string; billingType: BillingType; cardToken?: string } = {
        cpfCnpj: cpfCnpj.replace(/\D/g, ""),
        billingType,
      }
      if (cardToken) body.cardToken = cardToken

      const res = await fetch("/api/assinar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      const data = await res.json()

      if (!res.ok || !data.sucesso) {
        setError(data.erro ?? "Ocorreu um erro ao processar sua assinatura.")
        setLoading(false)
        return
      }

      if (data.metodoPagamento === "PIX") {
        const params = new URLSearchParams()
        if (data.pixQrCodeUrl) params.set("pixQrCodeUrl", data.pixQrCodeUrl)
        if (data.pixCopiaECola) params.set("pixCopiaECola", data.pixCopiaECola)
        router.push(`/assinar/pendente?${params.toString()}`)
      } else {
        router.push("/assinar/sucesso")
      }
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : "Erro inesperado. Tente novamente.")
      setLoading(false)
    }
  }

  function formatCpfCnpj(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 14)
    if (digits.length <= 11) {
      return digits
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
    }
    return digits
      .replace(/(\d{2})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1/$2")
      .replace(/(\d{4})(\d{1,2})$/, "$1-$2")
  }

  function formatCardNumber(value: string) {
    return value
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(\d{4})(?=\d)/g, "$1 ")
  }

  function formatExpiry(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 4)
    if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`
    return digits
  }

  return (
    <div className="min-h-screen bg-[#fff8f5] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="inline-block bg-gradient-to-br from-[#904d00] to-[#ff8c00] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-3">
            Plano PROFESSORA
          </span>
          <h1 className="text-4xl font-bold text-[#2f1402]">
            R${preco.toFixed(2).replace(".", ",")}<span className="text-lg font-normal text-[#7c4a2d]">/mês</span>
          </h1>
          <p className="text-sm text-[#564334] mt-1">Cancele quando quiser, sem multa.</p>
        </div>

        {/* Benefits */}
        <ul className="mb-8 space-y-2">
          {BENEFITS.map((b) => (
            <li key={b} className="flex items-center gap-2 text-sm text-[#2f1402]">
              <span className="text-[#ff8c00] font-bold">✓</span>
              {b}
            </li>
          ))}
        </ul>

        {/* Form card */}
        <div className="bg-white rounded-[2rem] p-8 shadow-[0_24px_48px_rgba(144,77,0,0.08)]">
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* CPF/CNPJ */}
            <div>
              <label className="block text-sm font-medium text-[#7c4a2d] mb-1">
                CPF ou CNPJ
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={cpfCnpj}
                onChange={(e) => setCpfCnpj(formatCpfCnpj(e.target.value))}
                placeholder="000.000.000-00"
                className="w-full h-12 rounded-xl bg-[#fff1ea] px-4 text-[#2f1402] outline-none focus:ring-2 focus:ring-[#ff8c00] text-sm"
              />
              {fieldErrors.cpfCnpj && (
                <p className="text-xs text-[#ba1a1a] mt-1">{fieldErrors.cpfCnpj}</p>
              )}
            </div>

            {/* Payment method selector */}
            <div>
              <label className="block text-sm font-medium text-[#7c4a2d] mb-2">
                Forma de pagamento
              </label>
              <div className="grid grid-cols-2 gap-3">
                {(["CREDIT_CARD", "PIX"] as BillingType[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setBillingType(type)}
                    className={`h-12 rounded-xl border-2 text-sm font-semibold transition ${
                      billingType === type
                        ? "border-[#ff8c00] bg-[#fff1ea] text-[#904d00]"
                        : "border-[#f0ddd0] bg-white text-[#7c4a2d] hover:border-[#ff8c00]"
                    }`}
                  >
                    {type === "CREDIT_CARD" ? "💳 Cartão de Crédito" : "⚡ PIX"}
                  </button>
                ))}
              </div>
            </div>

            {/* Card fields */}
            {billingType === "CREDIT_CARD" && (
              <div className="space-y-4 pt-1">
                <div>
                  <label className="block text-sm font-medium text-[#7c4a2d] mb-1">
                    Número do cartão
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    placeholder="0000 0000 0000 0000"
                    maxLength={19}
                    className="w-full h-12 rounded-xl bg-[#fff1ea] px-4 text-[#2f1402] outline-none focus:ring-2 focus:ring-[#ff8c00] text-sm tracking-widest"
                  />
                  {fieldErrors.cardNumber && (
                    <p className="text-xs text-[#ba1a1a] mt-1">{fieldErrors.cardNumber}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-[#7c4a2d] mb-1">
                      Validade
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                      placeholder="MM/AA"
                      maxLength={5}
                      className="w-full h-12 rounded-xl bg-[#fff1ea] px-4 text-[#2f1402] outline-none focus:ring-2 focus:ring-[#ff8c00] text-sm"
                    />
                    {fieldErrors.cardExpiry && (
                      <p className="text-xs text-[#ba1a1a] mt-1">{fieldErrors.cardExpiry}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#7c4a2d] mb-1">
                      CVV
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                      placeholder="000"
                      maxLength={4}
                      className="w-full h-12 rounded-xl bg-[#fff1ea] px-4 text-[#2f1402] outline-none focus:ring-2 focus:ring-[#ff8c00] text-sm"
                    />
                    {fieldErrors.cardCvv && (
                      <p className="text-xs text-[#ba1a1a] mt-1">{fieldErrors.cardCvv}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#7c4a2d] mb-1">
                    Nome no cartão
                  </label>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value.toUpperCase())}
                    placeholder="NOME COMO NO CARTÃO"
                    className="w-full h-12 rounded-xl bg-[#fff1ea] px-4 text-[#2f1402] outline-none focus:ring-2 focus:ring-[#ff8c00] text-sm uppercase"
                  />
                  {fieldErrors.cardName && (
                    <p className="text-xs text-[#ba1a1a] mt-1">{fieldErrors.cardName}</p>
                  )}
                </div>
              </div>
            )}

            {/* PIX info */}
            {billingType === "PIX" && (
              <div className="rounded-xl bg-[#fff1ea] px-4 py-3 text-sm text-[#564334]">
                Após confirmar, você receberá um QR Code PIX para pagar. O acesso é liberado
                automaticamente após a confirmação do pagamento.
              </div>
            )}

            {/* Global error */}
            {error && (
              <div className="rounded-xl bg-[#ffeaea] px-4 py-3 text-sm text-[#ba1a1a]">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 rounded-[14px] bg-gradient-to-br from-[#904d00] to-[#ff8c00] text-white font-semibold text-base hover:opacity-95 transition disabled:opacity-70 mt-2"
            >
              {loading ? "Processando…" : `Assinar por R$${preco.toFixed(2).replace(".", ",")}/mês`}
            </button>
          </form>

          <p className="mt-4 text-xs text-center text-[#7c4a2d]">
            Pagamento seguro. Seus dados são protegidos.
          </p>
        </div>
      </div>
    </div>
  )
}
