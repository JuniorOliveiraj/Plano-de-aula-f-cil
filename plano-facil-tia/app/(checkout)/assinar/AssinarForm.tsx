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

interface AssinarFormProps {
  preco: number
  userName: string
}

export default function AssinarForm({ preco, userName }: AssinarFormProps) {
  const router = useRouter()

  // Form state
  const [cpfCnpj, setCpfCnpj] = useState("")
  const [billingType, setBillingType] = useState<BillingType>("PIX")

  // Card fields
  const [cardNumber, setCardNumber] = useState("")
  const [cardExpiry, setCardExpiry] = useState("")
  const [cardCvv, setCardCvv] = useState("")
  const [cardName, setCardName] = useState("")

  // UI state
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [shake, setShake] = useState(false)

  // Active step for breadcrumb
  const [step] = useState(2) // 1=Carrinho, 2=Pagamento, 3=Confirmação

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
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [])

  // ─── Google Material Symbols font ────────────────────
  useEffect(() => {
    const linkId = "material-symbols-link"
    if (document.getElementById(linkId)) return
    const link = document.createElement("link")
    link.id = linkId
    link.rel = "stylesheet"
    link.href =
      "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
    document.head.appendChild(link)
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
      setLoading(false)

      if (!res.ok || !data.sucesso) {
        const errorMsg = data.erro ?? "Ocorreu um erro ao processar sua assinatura."
        setError(errorMsg)

        // Map specific errors to fields
        const newFieldErrors: Record<string, string> = {}
        if (errorMsg.toLowerCase().includes("cpf") || errorMsg.toLowerCase().includes("cnpj")) {
          newFieldErrors.cpfCnpj = errorMsg
        } else if (errorMsg.toLowerCase().includes("cartão") || errorMsg.toLowerCase().includes("card")) {
          newFieldErrors.cardNumber = errorMsg
        }
        setFieldErrors(newFieldErrors)

        // Trigger shake animation
        setShake(true)
        setTimeout(() => setShake(false), 500)
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
      setLoading(false)
      const errorMsg = err instanceof Error ? err.message : "Erro inesperado. Tente novamente."
      setError(errorMsg)
      setShake(true)
      setTimeout(() => setShake(false), 500)
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

  // ─── Renewal date (30 days from now) ─────────────────
  const renewalDate = new Date()
  renewalDate.setDate(renewalDate.getDate() + 30)
  const renewalFormatted = renewalDate.toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  return (
    <div className="min-h-screen font-sans selection:bg-orange-100 selection:text-[#8c4b00]" style={{ background: "#fffaf8" }}>

      {/* ─── Header ────────────────────────────────────── */}
      <header
        className="fixed top-0 w-full z-50 h-20 px-8 border-b border-[#f0ddd0]/30"
        style={{
          background: "rgba(255,250,248,0.85)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center h-full">
          <a href="/">
            <div className="flex items-center space-x-3">
              <div
                className="flex items-center justify-center rounded-[10px] text-lg shrink-0"
                style={{ width: 38, height: 38, background: "linear-gradient(135deg,#904d00,#ff8c00)" }}
              >
                <img
                  src="/svg/iconsPix.png"
                  alt="Pix"
                  className="w-6 h-6 object-contain"
                />
              </div>
              <span className="text-xl font-extrabold tracking-tight" style={{ color: "#2f1402" }}>
                Plano <span className="text-[#8c4b00]">Fácil </span>
              </span>
            </div>
          </a>
          <div className="flex items-center space-x-2 text-sm font-semibold px-4 py-2 rounded-full border border-green-200 bg-green-50/50 text-green-700">
            <span className="material-symbols-outlined text-base fill-1">verified_user</span>
            <span>Ambiente 100% Seguro</span>
          </div>
        </div>
      </header>

      {/* ─── Main Content ──────────────────────────────── */}
      <main className="pt-28 pb-24 px-6 max-w-6xl mx-auto">

        {/* Breadcrumb - More visual impact */}
        <div className="mb-12 flex items-center justify-center sm:justify-start space-x-3 text-xs uppercase tracking-widest font-bold">
          <div className="flex items-center gap-2" style={{ color: "#a87b5e" }}>
            <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center">1</span>
            <span>Carrinho</span>
          </div>
          <span className="w-8 h-px bg-[#f0ddd0]" />
          <div className="flex items-center gap-2" style={{ color: "#8c4b00" }}>
            <span className="w-6 h-6 rounded-full bg-[#8c4b00] text-white flex items-center justify-center">2</span>
            <span>Pagamento</span>
          </div>
          <span className="w-8 h-px bg-[#f0ddd0]" />
          <div className="flex items-center gap-2" style={{ color: "#a87b5e", opacity: 0.5 }}>
            <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center">3</span>
            <span>Confirmação</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-14 items-start">

            {/* ─── LEFT COLUMN: Form (7/12) ───────────────────── */}
            <div className="lg:col-span-7 space-y-12">
              {/* Global error */}
              {error && (
                <div
                  className={`rounded-[1.5rem] px-6 py-5 text-sm flex items-start gap-4 font-medium border-2 transition-all duration-300 ${shake ? "animate-shake" : "animate-in fade-in"
                    }`}
                  style={{
                    background: "#fff5f5",
                    color: "#c53030",
                    borderColor: "#feb2b2",
                    boxShadow: "0 10px 15px -3px rgba(197, 48, 48, 0.1)"
                  }}
                >
                  <div className="w-10 h-10 rounded-xl bg-[#feb2b2]/30 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-2xl">error</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-base">Ops! Algo deu errado</span>
                    <span className="opacity-90">{error}</span>
                  </div>
                </div>
              )}
              {/* Section: CPF/CNPJ */}
              <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-[#f0ddd0]/40">
                <div className="flex items-center space-x-4 mb-8">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner"
                    style={{ background: "#fff1ea" }}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{ color: "#8c4b00", fontVariationSettings: "'FILL' 1" }}
                    >
                      badge
                    </span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold" style={{ color: "#2f1402" }}>
                      Identificação
                    </h2>
                    <p className="text-sm" style={{ color: "#564334" }}>Necessário para emissão da nota fiscal</p>
                  </div>
                </div>

                <div className="flex flex-col space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider ml-1" style={{ color: "#7c4a2d" }}>
                    CPF ou CNPJ
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={cpfCnpj}
                    onChange={(e) => setCpfCnpj(formatCpfCnpj(e.target.value))}
                    placeholder="000.000.000-00"
                    className="w-full h-14 px-5 rounded-2xl border-2 border-transparent outline-none transition-all text-lg font-medium"
                    style={{
                      background: "#f8f3f0",
                      color: "#2f1402",
                      boxShadow: fieldErrors.cpfCnpj ? "0 0 0 2px #ba1a1a" : "none",
                    }}
                    onFocus={(e) => {
                      if (!fieldErrors.cpfCnpj) {
                        e.currentTarget.style.borderColor = "rgba(140,75,0,0.3)"
                        e.currentTarget.style.background = "#fff"
                      }
                    }}
                    onBlur={(e) => {
                      if (!fieldErrors.cpfCnpj) {
                        e.currentTarget.style.borderColor = "transparent"
                        e.currentTarget.style.background = "#f8f3f0"
                      }
                    }}
                  />
                  {fieldErrors.cpfCnpj && (
                    <p className="text-sm font-medium mt-1 flex items-center gap-1" style={{ color: "#ba1a1a" }}>
                      <span className="material-symbols-outlined text-base">error</span>
                      {fieldErrors.cpfCnpj}
                    </p>
                  )}
                </div>
              </section>


              {/* Section: Payment Method */}
              <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-[#f0ddd0]/40">
                <div className="flex items-center space-x-4 mb-8">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner"
                    style={{ background: "#fff1ea" }}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{ color: "#8c4b00", fontVariationSettings: "'FILL' 1" }}
                    >
                      payments
                    </span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold" style={{ color: "#2f1402" }}>
                      Forma de Pagamento
                    </h2>
                    <p className="text-sm" style={{ color: "#564334" }}>Escolha o método mais prático para você</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  {/* PIX Option */}
                  <div
                    className="relative group cursor-pointer"
                    onClick={() => setBillingType("PIX")}
                  >
                    <div
                      className="h-full flex flex-col p-6 rounded-2xl transition-all duration-300 border-2"
                      style={{
                        background: billingType === "PIX" ? "#fff" : "#f8f3f0",
                        borderColor: billingType === "PIX" ? "#8c4b00" : "transparent",
                        boxShadow: billingType === "PIX" ? "0 12px 24px -4px rgba(144,77,0,0.1)" : "none",
                      }}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div
                          className={`w-12 h-12 flex items-center justify-center rounded-2xl transition
      ${billingType === "PIX" ? "ring-2 ring-[#00a859] shadow-sm" : ""}
    `}
                          style={{ background: "#e3fcf1" }}
                        >
                          <img
                            src="/svg/iconsPix.png"
                            alt="Pix"
                            className="w-6 h-6 object-contain"
                          />
                        </div>

                        {billingType === "PIX" && (
                          <div className="w-6 h-6 rounded-full bg-[#00a859] flex items-center justify-center shadow-sm animate-scaleIn">
                            <span className="material-symbols-outlined text-white text-sm">
                              check
                            </span>
                          </div>
                        )}
                      </div>
                      <p className="font-bold text-lg" style={{ color: "#2f1402" }}>PIX</p>
                      <p className="text-xs font-semibold leading-relaxed mt-1" style={{ color: "#564334" }}>
                        Aprovação imediata e acesso liberado na hora.
                      </p>
                      <div
                        className="mt-4 inline-block px-3 py-1 rounded-full text-[10px] font-black tracking-tighter w-fit"
                        style={{ background: "#ffdf91", color: "#392700" }}
                      >
                        MELHOR ESCOLHA ⚡
                      </div>
                    </div>
                  </div>

                  {/* Credit Card Option */}
                  <div
                    className="relative group cursor-pointer"
                    onClick={() => setBillingType("CREDIT_CARD")}
                  >
                    <div
                      className="h-full flex flex-col p-6 rounded-2xl transition-all duration-300 border-2"
                      style={{
                        background: billingType === "CREDIT_CARD" ? "#fff" : "#f8f3f0",
                        borderColor: billingType === "CREDIT_CARD" ? "#8c4b00" : "transparent",
                        boxShadow: billingType === "CREDIT_CARD" ? "0 12px 24px -4px rgba(144,77,0,0.1)" : "none",
                      }}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div
                          className="w-10 h-10 flex items-center justify-center rounded-xl"
                          style={{ background: "#f2f4ff" }}
                        >
                          <span className="material-symbols-outlined text-2xl" style={{ color: "#1a4f8a" }}>
                            credit_card
                          </span>
                        </div>
                        {billingType === "CREDIT_CARD" && (
                          <div className="w-6 h-6 rounded-full bg-[#8c4b00] flex items-center justify-center">
                            <span className="material-symbols-outlined text-white text-sm font-bold">check</span>
                          </div>
                        )}
                      </div>
                      <p className="font-bold text-lg" style={{ color: "#2f1402" }}>Cartão</p>
                      <p className="text-xs font-semibold leading-relaxed mt-1" style={{ color: "#564334" }}>
                        Em até 12x no cartão. Aceitamos todas as bandeiras.
                      </p>
                      <div className="mt-4 flex gap-1 items-center opacity-40">
                        <span className="text-[8px] font-bold">💳 VISA • MC • ELO</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* PIX specific info */}
                {billingType === "PIX" && (
                  <div
                    className="rounded-2xl px-6 py-5 text-sm animate-in fade-in slide-in-from-top-2 duration-300"
                    style={{ background: "#f0fdf4", border: "1px solid #dcfce7", color: "#166534" }}
                  >
                    <div className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-xl mt-0.5" style={{ color: "#22c55e" }}>
                        bolt
                      </span>
                      <p className="font-medium leading-relaxed">
                        Ao clicar em finalizar, geraremos um QR Code exclusivo para você.
                        A confirmação é <strong>instantânea</strong>.
                      </p>
                    </div>
                  </div>
                )}

                {/* Credit Card Fields - Refined spacing and visual hierarchy */}
                {billingType === "CREDIT_CARD" && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Card Name */}
                      <div className="flex flex-col space-y-2 md:col-span-2">
                        <label className="text-xs font-bold uppercase tracking-wider ml-1" style={{ color: "#7c4a2d" }}>
                          Nome no Cartão
                        </label>
                        <input
                          type="text"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value.toUpperCase())}
                          placeholder="COMO IMPRESSO NO CARTÃO"
                          className="w-full h-14 px-5 rounded-2xl border-2 border-transparent outline-none transition-all uppercase font-medium"
                          style={{
                            background: "#f8f3f0",
                            color: "#2f1402",
                            boxShadow: fieldErrors.cardName ? "0 0 0 2px #ba1a1a" : "none",
                          }}
                          onFocus={(e) => { if (!fieldErrors.cardName) { e.currentTarget.style.borderColor = "rgba(140,75,0,0.3)"; e.currentTarget.style.background = "#fff" } }}
                          onBlur={(e) => { if (!fieldErrors.cardName) { e.currentTarget.style.borderColor = "transparent"; e.currentTarget.style.background = "#f8f3f0" } }}
                        />
                      </div>

                      {/* Card Number */}
                      <div className="flex flex-col space-y-2 md:col-span-2">
                        <label className="text-xs font-bold uppercase tracking-wider ml-1" style={{ color: "#7c4a2d" }}>
                          Número do Cartão
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            inputMode="numeric"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                            placeholder="0000 0000 0000 0000"
                            maxLength={19}
                            className="w-full h-14 px-5 rounded-2xl border-2 border-transparent outline-none transition-all tracking-widest font-mono text-lg"
                            style={{
                              background: "#f8f3f0",
                              color: "#2f1402",
                              boxShadow: fieldErrors.cardNumber ? "0 0 0 2px #ba1a1a" : "none",
                            }}
                            onFocus={(e) => { if (!fieldErrors.cardNumber) { e.currentTarget.style.borderColor = "rgba(140,75,0,0.3)"; e.currentTarget.style.background = "#fff" } }}
                            onBlur={(e) => { if (!fieldErrors.cardNumber) { e.currentTarget.style.borderColor = "transparent"; e.currentTarget.style.background = "#f8f3f0" } }}
                          />
                          <span className="absolute right-5 top-1/2 -translate-y-1/2 material-symbols-outlined opacity-30">credit_card</span>
                        </div>
                      </div>

                      {/* Expiry */}
                      <div className="flex flex-col space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider ml-1" style={{ color: "#7c4a2d" }}>
                          Validade
                        </label>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                          placeholder="MM/AA"
                          maxLength={5}
                          className="w-full h-14 px-5 rounded-2xl border-2 border-transparent outline-none transition-all font-mono"
                          style={{
                            background: "#f8f3f0",
                            color: "#2f1402",
                            boxShadow: fieldErrors.cardExpiry ? "0 0 0 2px #ba1a1a" : "none",
                          }}
                          onFocus={(e) => { if (!fieldErrors.cardExpiry) { e.currentTarget.style.borderColor = "rgba(140,75,0,0.3)"; e.currentTarget.style.background = "#fff" } }}
                          onBlur={(e) => { if (!fieldErrors.cardExpiry) { e.currentTarget.style.borderColor = "transparent"; e.currentTarget.style.background = "#f8f3f0" } }}
                        />
                      </div>

                      {/* CVV */}
                      <div className="flex flex-col space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider ml-1" style={{ color: "#7c4a2d" }}>
                          CVV
                        </label>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                          placeholder="123"
                          maxLength={4}
                          className="w-full h-14 px-5 rounded-2xl border-2 border-transparent outline-none transition-all font-mono"
                          style={{
                            background: "#f8f3f0",
                            color: "#2f1402",
                            boxShadow: fieldErrors.cardCvv ? "0 0 0 2px #ba1a1a" : "none",
                          }}
                          onFocus={(e) => { if (!fieldErrors.cardCvv) { e.currentTarget.style.borderColor = "rgba(140,75,0,0.3)"; e.currentTarget.style.background = "#fff" } }}
                          onBlur={(e) => { if (!fieldErrors.cardCvv) { e.currentTarget.style.borderColor = "transparent"; e.currentTarget.style.background = "#f8f3f0" } }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </section>



              {/* Trust badges footer of form */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 px-4">
                <div className="flex items-center gap-2 opacity-50 grayscale transition hover:grayscale-0 hover:opacity-100 cursor-help">
                  <span className="text-[10px] font-black uppercase tracking-widest">Powered by</span>
                  <span className="text-xl font-bold tracking-tighter">Asaas</span>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex flex-col items-center">
                    <span className="material-symbols-outlined text-green-600 mb-1">lock</span>
                    <span className="text-[9px] font-bold uppercase tracking-widest opacity-60">SSL Secure</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="material-symbols-outlined text-blue-600 mb-1">verified</span>
                    <span className="text-[9px] font-bold uppercase tracking-widest opacity-60">PCI Compliant</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ─── RIGHT COLUMN: Order Summary (5/12) ─────────── */}
            <aside className="lg:col-span-5 lg:sticky lg:top-28 space-y-6">
              <div
                className="rounded-[2.5rem] overflow-hidden bg-white border border-[#f0ddd0]/40"
                style={{
                  boxShadow: "0 20px 40px -10px rgba(49,46,44,0.08)",
                }}
              >
                {/* Visual Header */}
                <div
                  className="p-10 text-white relative overflow-hidden"
                  style={{ background: "linear-gradient(135deg, #904d00 0%, #ff8c00 100%)" }}
                >
                  <div className="relative z-10">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Você está assinando:</span>
                    <h3 className="text-3xl font-black mt-2">Plano Professora</h3>
                    <div className="mt-4 flex items-center gap-2 text-sm font-bold bg-white/20 w-fit px-3 py-1 rounded-full backdrop-blur-md">
                      <span className="material-symbols-outlined text-base">star</span>
                      com ate 15 planos
                    </div>
                  </div>
                  {/* Decorative Circle */}
                  <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                </div>

                {/* Price and Details */}
                <div className="p-10 space-y-8">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="text-sm font-bold opacity-60" style={{ color: "#312e2c" }}>Frequência</p>
                      <p className="font-bold text-lg" style={{ color: "#312e2c" }}>Mensal</p>
                      <p className="text-xs font-semibold px-2 py-1 rounded-md bg-orange-50 text-orange-700 w-fit">
                        Próxima cobrança: {renewalFormatted}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold opacity-40 uppercase">Valor</p>
                      <p className="font-black text-2xl" style={{ color: "#312e2c" }}>
                        R$ {preco.toFixed(2).replace(".", ",")}
                      </p>
                    </div>
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="space-y-4 pt-6 border-t border-[#f0ddd0]/40">
                    <div className="flex justify-between items-center text-sm font-medium" style={{ color: "#564334" }}>
                      <span>Subtotal</span>
                      <span className="font-bold">R$ {preco.toFixed(2).replace(".", ",")}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-medium text-green-600">
                      <span>Taxas de processamento</span>
                      <span className="font-bold">R$ 0,00</span>
                    </div>

                    <div className="flex justify-between items-end pt-4">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Total a pagar</p>
                        <p className="text-4xl font-black tracking-tighter" style={{ color: "#8c4b00" }}>
                          R$ {preco.toFixed(2).replace(".", ",")}
                        </p>
                      </div>
                      <div className="text-right pb-1">
                        <p className="text-[10px] font-bold opacity-40 uppercase">Final</p>
                      </div>
                    </div>
                  </div>

                  {/* Main Action Button - High Visual Weight */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-18 rounded-[1.25rem] font-black text-xl flex items-center justify-center space-x-4 transition-all group overflow-hidden relative"
                    style={{
                      background: "linear-gradient(135deg, #2f1402 0%, #8c4b00 100%)",
                      color: "#fff",
                      boxShadow: "0 10px 30px -5px rgba(47,20,2,0.3)",
                      opacity: loading ? 0.8 : 1,
                    }}
                  >
                    {loading ? (
                      <span className="flex items-center gap-3">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processando...
                      </span>
                    ) : (
                      <>
                        <span>Finalizar Assinatura</span>
                        <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                      </>
                    )}
                  </button>

                  <p className="text-center text-[10px] font-bold opacity-40 leading-relaxed uppercase tracking-widest">
                    Ao clicar em Finalizar, você concorda com nossos <br />Termos de Uso e Política de Privacidade.
                  </p>
                </div>
              </div>

              {/* Personalized Testimonial - Uses userName */}
              <div
                className="p-8 rounded-[2rem] border-2 border-dashed border-[#f0ddd0] flex flex-col items-center text-center group"
                style={{ background: "#fff" }}
              >
                <div className="w-12 h-12 rounded-full mb-4 overflow-hidden border-2 border-[#fff1ea] bg-[#fff1ea] flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl text-[#8c4b00]">person</span>
                </div>
                <p className="italic text-sm font-medium leading-relaxed mb-4" style={{ color: "#564334" }}>
                  &ldquo;O Plano Fácil Tia mudou minha rotina. Hoje tenho mais tempo para o que realmente importa: meus alunos e minha família.&rdquo;
                </p>
                <div className="w-8 h-px bg-[#f0ddd0] mb-3 group-hover:w-16 transition-all duration-500" />
                <p className="font-black text-xs uppercase tracking-widest" style={{ color: "#2f1402" }}>
                  — Prof. {userName || "Usuária"}
                </p>
              </div>
            </aside>
          </div>
        </form>
      </main>

      {/* ─── Footer ────────────────────────────────────── */}
      <footer className="w-full py-16 mt-auto border-t border-[#f0ddd0]/40" style={{ background: "#f8f3f0" }}>
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col gap-2">
            <div className="text-xl font-black" style={{ color: "#2f1402" }}>
              Plano Fácil<span className="text-[#8c4b00]"> Tia</span>
            </div>
            <p className="text-xs font-bold opacity-40 uppercase tracking-widest">O aconchego digital para educadores.</p>
          </div>

          <div className="flex gap-10">
            <a href="#" className="text-xs font-bold uppercase tracking-widest hover:text-[#8c4b00] transition-colors" style={{ color: "#7c4a2d" }}>Privacidade</a>
            <a href="#" className="text-xs font-bold uppercase tracking-widest hover:text-[#8c4b00] transition-colors" style={{ color: "#7c4a2d" }}>Termos</a>
            <a href="#" className="text-xs font-bold uppercase tracking-widest hover:text-[#8c4b00] transition-colors" style={{ color: "#7c4a2d" }}>Ajuda</a>
          </div>

          <div className="text-[10px] font-bold opacity-40 uppercase tracking-[0.2em] text-center md:text-right">
            © 2024 Plano Fácil Tia.<br />Todos os direitos reservados.
          </div>
        </div>
      </footer>

      {/* ─── Global Animations & Styles ──────────────── */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInUp {
          from { transform: translateY(10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }
        .animate-shake {
          animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
        }
        .animate-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
        .slide-in-from-top-2 {
          animation: slideInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        /* Material Symbols overrides */
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .fill-1 {
          font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24 !important;
        }
      `}</style>
    </div>
  )
}
