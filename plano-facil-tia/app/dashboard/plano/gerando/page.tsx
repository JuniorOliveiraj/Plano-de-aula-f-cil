"use client"

import Link from "next/link"

// Esta página só é exibida se alguém acessar /plano/gerando diretamente
// O fluxo real de geração acontece inline no PassoRevisao (passo 5 do wizard)
export default function GerandoPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
      <span className="text-5xl mb-4">🔍</span>
      <p className="text-[20px] font-600 text-[#2f1402] mb-2">Nenhuma geração em andamento</p>
      <p className="text-[15px] text-[#7c4a2d] mb-8">
        Para criar um plano, use o assistente de criação.
      </p>
      <Link
        href="/dashboard/plano/novo"
        className="h-12 px-6 rounded-[14px] text-white font-semibold no-underline transition-opacity hover:opacity-90"
        style={{ background: "linear-gradient(135deg,#904d00,#ff8c00)" }}
      >
        Criar novo plano
      </Link>
    </div>
  )
}
