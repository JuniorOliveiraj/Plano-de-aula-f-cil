"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Suspense, useState } from "react"

function PendenteContent() {
  const searchParams = useSearchParams()
  const pixQrCodeUrl = searchParams.get("pixQrCodeUrl")
  const pixCopiaECola = searchParams.get("pixCopiaECola")

  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    if (!pixCopiaECola) return
    await navigator.clipboard.writeText(pixCopiaECola)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div className="bg-white rounded-[2rem] p-8 shadow-[0_24px_48px_rgba(144,77,0,0.08)]">
      <div className="text-center mb-6">
        <div className="w-14 h-14 rounded-full bg-[#fff1ea] flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">⚡</span>
        </div>
        <h1 className="text-2xl font-bold text-[#2f1402] mb-2">
          Pagamento PIX pendente
        </h1>
        <p className="text-sm text-[#564334] leading-relaxed">
          Escaneie o QR Code ou copie o código abaixo para concluir o pagamento.
          O acesso será liberado automaticamente após a confirmação.
        </p>
      </div>

      {pixQrCodeUrl && (
        <div className="flex justify-center mb-6">
          <div className="p-3 border-2 border-[#f0ddd0] rounded-2xl bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={pixQrCodeUrl} alt="QR Code PIX" width={200} height={200} className="rounded-lg" />
          </div>
        </div>
      )}

      {pixCopiaECola && (
        <div className="mb-6">
          <p className="text-xs font-medium text-[#7c4a2d] mb-2">Código Pix copia e cola</p>
          <div className="flex gap-2">
            <div className="flex-1 bg-[#fff1ea] rounded-xl px-3 py-2 text-xs text-[#2f1402] break-all font-mono select-all">
              {pixCopiaECola}
            </div>
            <button
              onClick={handleCopy}
              className="shrink-0 h-10 px-4 rounded-xl bg-gradient-to-br from-[#904d00] to-[#ff8c00] text-white text-xs font-semibold hover:opacity-95 transition"
            >
              {copied ? "Copiado!" : "Copiar"}
            </button>
          </div>
        </div>
      )}

      <div className="rounded-xl bg-[#fff1ea] px-4 py-3 text-xs text-[#564334] mb-6 leading-relaxed">
        Após o pagamento, aguarde alguns instantes. Você pode fechar esta página e
        acessar o dashboard — seu plano será atualizado automaticamente.
      </div>

      <Link
        href="/dashboard"
        className="block w-full h-12 rounded-[14px] border-2 border-[#ff8c00] text-[#904d00] font-semibold text-sm text-center leading-[2.75rem] hover:bg-[#fff1ea] transition"
      >
        Ir para o Dashboard
      </Link>
    </div>
  )
}

export default function PendentePage() {
  return (
    <div className="min-h-screen bg-[#fff8f5] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Suspense fallback={<div className="text-center text-[#7c4a2d]">Carregando…</div>}>
          <PendenteContent />
        </Suspense>
      </div>
    </div>
  )
}
