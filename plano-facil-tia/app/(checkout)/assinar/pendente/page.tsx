"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Suspense, useEffect, useState } from "react"

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

  return (
    <div className="min-h-screen font-sans" style={{ background: "#fffaf8" }}>
      {/* ─── Header (Same as AssinarForm) ───────────────────── */}
      <header
        className="fixed top-0 w-full z-50 h-20 px-8 border-b border-[#f0ddd0]/30"
        style={{
          background: "rgba(255,250,248,0.85)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        <Link href="/dashboard">
          <div className="max-w-7xl mx-auto flex justify-between items-center h-full">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#904d00] to-[#ff8c00] flex items-center justify-center shadow-lg shadow-orange-900/20">
                <span className="material-symbols-outlined text-white text-2xl">auto_stories</span>
              </div>
              <span className="text-xl font-extrabold tracking-tight" style={{ color: "#2f1402" }}>
                Plano Fácil<span className="text-[#8c4b00]"> Tia</span>
              </span>
            </div>
            <div className="flex items-center space-x-2 text-sm font-semibold px-4 py-2 rounded-full border border-green-200 bg-green-50/50 text-green-700">
              <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
              <span>Segurança Ativa</span>
            </div>
          </div>
        </Link >
      </header>

      {/* ─── Main Content ──────────────────────────────── */}
      <main className="pt-28 pb-24 px-6 max-w-4xl mx-auto">

        {/* Breadcrumb - Step 3 Active */}
        <div className="mb-12 flex items-center justify-center space-x-3 text-xs uppercase tracking-widest font-bold">
          <div className="flex items-center gap-2 opacity-40">
            <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center font-bold">1</span>
            <span>Carrinho</span>
          </div>
          <span className="w-8 h-px bg-[#f0ddd0] opacity-30" />
          <div className="flex items-center gap-2 opacity-40">
            <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center font-bold">2</span>
            <span>Pagamento</span>
          </div>
          <span className="w-8 h-px bg-[#f0ddd0]" />
          <div className="flex items-center gap-2" style={{ color: "#8c4b00" }}>
            <span className="w-6 h-6 rounded-full bg-[#8c4b00] text-white flex items-center justify-center font-bold">3</span>
            <span>Confirmação</span>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] p-10 xl:p-14 shadow-sm border border-[#f0ddd0]/40 overflow-hidden relative">
          {/* Visual Accents */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-bl-full opacity-50" />

          <div className="relative z-10">
            <div className="text-center mb-10">
              <div className="w-20 h-20 rounded-[2rem] bg-orange-50 flex items-center justify-center mx-auto mb-6 transform rotate-3 shadow-inner">
                <span className="text-4xl">⚡</span>
              </div>
              <h1 className="text-3xl font-black text-[#2f1402] mb-3 tracking-tight">
                Seu PIX foi gerado!
              </h1>
              <p className="text-sm font-medium text-[#564334] max-w-md mx-auto leading-relaxed">
                Escaneie o QR Code ou copie o código abaixo para concluir sua assinatura.
                O acesso é liberado em menos de 1 minuto após o pagamento.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              {/* QR Code Section */}
              <div className="flex flex-col items-center">
                {pixQrCodeUrl ? (
                  <div className="p-4 border-2 border-[#f0ddd0] rounded-3xl bg-white shadow-xl shadow-orange-900/5 group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={pixQrCodeUrl}
                      alt="QR Code PIX"
                      width={220}
                      height={220}
                      className="rounded-2xl group-hover:scale-[1.02] transition-transform duration-500"
                    />
                  </div>
                ) : (
                  <div className="w-56 h-56 rounded-3xl bg-[#f8f3f0] animate-pulse flex items-center justify-center text-xs font-bold text-[#a87b5e] uppercase">
                    Gerando QR Code...
                  </div>
                )}
                <p className="mt-4 text-[10px] font-black uppercase tracking-widest opacity-40">Aponte a câmera do seu banco</p>
              </div>

              {/* Copia e Cola Section */}
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.15em] text-[#7c4a2d] mb-3 block">
                    Pix Copia e Cola
                  </label>
                  <div className="flex flex-col gap-3">
                    <div className="bg-[#f8f3f0] rounded-2xl p-4 text-[11px] text-[#2f1402] break-all font-mono leading-relaxed select-all border border-transparent hover:border-[#f0ddd0] transition-colors min-h-[5rem] flex items-center">
                      {pixCopiaECola || "Aguardando código..."}
                    </div>
                    <button
                      onClick={handleCopy}
                      disabled={!pixCopiaECola}
                      className="w-full h-14 rounded-2xl font-black text-xs uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-3 relative overflow-hidden group"
                      style={{
                        background: copied ? "#22c55e" : "linear-gradient(135deg, #2f1402 0%, #8c4b00 100%)",
                        color: "white",
                        boxShadow: "0 10px 20px -5px rgba(144,77,0,0.2)",
                      }}
                    >
                      <span className="material-symbols-outlined text-lg">
                        {copied ? "check_circle" : "content_copy"}
                      </span>
                      {copied ? "Copiado com sucesso!" : "Copiar Código Pix"}
                    </button>
                  </div>
                </div>

                <div className="rounded-2xl bg-orange-50/50 border border-orange-100 p-5 space-y-3">
                  <div className="flex items-center gap-2 text-[#8c4b00]">
                    <span className="material-symbols-outlined text-lg font-bold">info</span>
                    <span className="text-[11px] font-black uppercase tracking-widest">Informação Importante</span>
                  </div>
                  <p className="text-[11px] font-medium leading-relaxed" style={{ color: "#564334" }}>
                    Após o pagamento, não é necessário enviar comprovante. O sistema identificará automaticamente e você receberá um e-mail de boas-vindas.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-14 pt-8 border-t border-[#f0ddd0]/40 flex flex-col sm:flex-row items-center justify-between gap-6">
              <Link
                href="/dashboard"
                className="group flex items-center gap-2 text-sm font-bold text-[#7c4a2d] hover:text-[#8c4b00] transition-colors"
              >
                <span className="material-symbols-outlined text-lg group-hover:-translate-x-1 transition-transform">arrow_back</span>
                Voltar para o Dashboard
              </Link>

              <div className="flex items-center gap-4 opacity-50">
                <div className="flex flex-col items-center">
                  <span className="material-symbols-outlined text-base">verified_user</span>
                  <span className="text-[8px] font-black uppercase mt-1">Garantia 7 dias</span>
                </div>
                <div className="w-px h-6 bg-[#f0ddd0]" />
                <div className="flex flex-col items-center">
                  <span className="material-symbols-outlined text-base">support_agent</span>
                  <span className="text-[8px] font-black uppercase mt-1">Suporte VIP</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ─── Footer ────────────────────────────────────── */}
      <footer className="w-full py-12 mt-auto border-t border-[#f0ddd0]/40" style={{ background: "#f8f3f0" }}>
        <div className="max-w-4xl mx-auto px-8 flex flex-col sm:flex-row justify-between items-center gap-6 opacity-60">
          <div className="text-xs font-black uppercase tracking-widest text-[#2f1402]">
            Plano Fácil<span className="text-[#8c4b00]"> Tia</span>
          </div>
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#7c4a2d]">
            © 2024 • O aconchego digital para educadores.
          </div>
        </div>
      </footer>

      {/* ─── Shared Styles ─────────────────────────── */}
      <style>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
      `}</style>
    </div>
  )
}

export default function PendentePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fffaf8] flex items-center justify-center font-bold text-[#8c4b00] animate-pulse">Carregando checkout seguro...</div>}>
      <PendenteContent />
    </Suspense>
  )
}
