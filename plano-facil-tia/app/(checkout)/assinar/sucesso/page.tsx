import Link from "next/link"

export default function SucessoPage() {
  return (
    <div className="min-h-screen bg-[#fff8f5] flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="bg-white rounded-[2rem] p-10 shadow-[0_24px_48px_rgba(144,77,0,0.08)]">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#904d00] to-[#ff8c00] flex items-center justify-center mx-auto mb-6">
            <span className="text-white text-3xl">✓</span>
          </div>

          <h1 className="text-2xl font-bold text-[#2f1402] mb-3">
            Pagamento recebido!
          </h1>

          <p className="text-[#564334] text-sm leading-relaxed mb-8">
            Seu pagamento está sendo processado. O acesso ao plano{" "}
            <span className="font-semibold text-[#904d00]">PROFESSORA</span> será
            liberado em instantes.
          </p>

          <Link
            href="/dashboard"
            className="inline-block w-full h-12 rounded-[14px] bg-gradient-to-br from-[#904d00] to-[#ff8c00] text-white font-semibold text-sm leading-[3rem] hover:opacity-95 transition"
          >
            Ir para o Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
