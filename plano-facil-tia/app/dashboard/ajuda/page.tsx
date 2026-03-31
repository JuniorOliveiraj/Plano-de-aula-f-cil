"use client"

import React from "react"
import Link from "next/link"

const HelpCard = ({ 
  icon, 
  title, 
  children, 
  href 
}: { 
  icon: string; 
  title: string; 
  children: React.ReactNode; 
  href?: string 
}) => {
  const content = (
    <div 
      className="p-6 rounded-[24px] transition-all hover:scale-[1.01]"
      style={{ 
        backgroundColor: "var(--ds-surface-card)",
        border: "1px solid var(--ds-border)",
        boxShadow: "0 4px 24px var(--ds-shadow)"
      }}
    >
      <div className="flex items-center gap-4 mb-4">
        <span className="text-3xl">{icon}</span>
        <h3 className="text-[19px] font-700" style={{ color: "var(--ds-on-surface)" }}>{title}</h3>
      </div>
      <div className="text-[15px] leading-relaxed" style={{ color: "var(--ds-on-surface-var)" }}>
        {children}
      </div>
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="no-underline block h-full">
        {content}
      </Link>
    )
  }

  return content
}

export default function AjudaPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      {/* ── Header ── */}
      <div className="text-center space-y-3">
        <h1 className="text-[36px] font-800 leading-tight" style={{ color: "var(--ds-on-surface)" }}>
          Como podemos ajudar você? 💛
        </h1>
        <p className="text-[18px] max-w-2xl mx-auto" style={{ color: "var(--ds-muted)" }}>
          Preparamos este guia rápido para você tirar o máximo proveito do Plano Fácil Tia e economizar tempo no seu planejamento.
        </p>
      </div>

      {/* ── Principais Temas ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <HelpCard icon="📝" title="Criando um Novo Plano" href="/dashboard/plano/novo">
          Clique em <strong>"Novo Plano"</strong> e escolha entre dois modos:
          <ul className="mt-2 space-y-1 list-disc pl-5">
            <li><strong>Com PDF do Livro:</strong> Você envia o arquivo do livro e a nossa IA gera as aulas baseadas nele.</li>
            <li><strong>Sem PDF:</strong> Você descreve o tema e a IA cria tudo seguindo a BNCC.</li>
          </ul>
        </HelpCard>

        <HelpCard icon="📅" title="Usando o Calendário" href="/dashboard/calendario">
          No seu <strong>Calendário</strong>, você pode:
          <ul className="mt-2 space-y-1 list-disc pl-5">
            <li>Visualizar suas aulas por mês, semana ou dia.</li>
            <li><strong>Arrastar e Soltar:</strong> Mude uma aula de dia clicando e arrastando-a no calendário mensal/semanal.</li>
            <li>Clique no número do dia para adicionar uma nova aula avulsa.</li>
          </ul>
        </HelpCard>

        <HelpCard icon="💾" title="Download e Impressão" href="/dashboard/planos">
          Vá em <strong>"Meus Planos"</strong> para baixar seus arquivos:
          <ul className="mt-2 space-y-1 list-disc pl-5">
            <li><strong>Word (.docx):</strong> Totalmente editável para você fazer seus ajustes finais.</li>
            <li><strong>PDF:</strong> Pronto para imprimir ou enviar para a coordenação.</li>
          </ul>
        </HelpCard>

        <HelpCard icon="📚" title="Organização de Aulas" href="/dashboard/planos">
          Seus planos ficam guardados com segurança. Você pode:
          <ul className="mt-2 space-y-1 list-disc pl-5">
            <li>Filtrar por <strong>Série</strong> ou <strong>Matéria</strong> para achar rápido o que precisa.</li>
            <li>Excluir planos que não vai mais usar.</li>
            <li>Ver o detalhe completo de cada aula gerada pela IA.</li>
          </ul>
        </HelpCard>
      </div>

      {/* ── FAQ ou Dicas ── */}
      <section className="space-y-6 pt-6">
        <h2 className="text-[24px] font-700 text-center" style={{ color: "var(--ds-on-surface)" }}>Perguntas Frequentes</h2>
        <div className="space-y-4 max-w-4xl mx-auto">
          {[
            { q: "Posso editar o plano depois de pronto?", a: "Sim! Ao baixar no formato Word, você tem total liberdade para alterar qualquer parte do texto no seu computador ou celular." },
            { q: "O que acontece se o meu trial acabar?", a: "Seus planos continuam guardados! Para criar novos, você precisará assinar o plano mensal Professora." },
            { q: "A IA segue a BNCC?", a: "Sim, todos os planos são gerados levando em conta as competências e habilidades da BNCC para cada série selecionada." },
          ].map((item, i) => (
            <details 
              key={i} 
              className="group p-5 rounded-[18px] transition-all cursor-pointer"
              style={{ backgroundColor: "var(--ds-surface-low)", border: "1px solid var(--ds-border)" }}
            >
              <summary className="text-[17px] font-600 flex justify-between items-center list-none" style={{ color: "var(--ds-on-surface)" }}>
                {item.q}
                <span className="transition-transform group-open:rotate-180">▼</span>
              </summary>
              <p className="mt-3 text-[15px] leading-relaxed" style={{ color: "var(--ds-on-surface-var)" }}>
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* ── CTA Suporte ── */}
      <div 
        className="p-8 rounded-[32px] text-center space-y-4"
        style={{ background: "linear-gradient(135deg, var(--ds-surface-low), var(--ds-surface-card))", border: "2px dashed var(--ds-border)" }}
      >
        <h3 className="text-[22px] font-800" style={{ color: "var(--ds-terracotta)" }}>Ainda precisa de ajuda?</h3>
        <p className="text-[16px]" style={{ color: "var(--ds-muted)" }}>
          Nossa equipe está pronta para te atender de segunda a sexta, das 08h às 18h.
        </p>
        <div className="flex flex-wrap justify-center gap-4 pt-2">
          <a 
            href="#" 
            className="flex items-center gap-2 px-6 h-12 rounded-[14px] text-[15px] font-700 no-underline transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#25D366", color: "#fff" }}
          >
            Falar pelo WhatsApp
          </a>
          <a 
            href="mailto:suporte@planofaciltia.com.br" 
            className="flex items-center gap-2 px-6 h-12 rounded-[14px] text-[15px] font-700 no-underline transition-opacity hover:opacity-90"
            style={{ backgroundColor: "var(--ds-primary)", color: "#fff" }}
          >
            Enviar E-mail
          </a>
        </div>
      </div>
    </div>
  )
}
