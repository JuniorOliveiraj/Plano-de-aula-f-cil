import Link from "next/link"

const steps = [
  { emoji: "📚", title: "Escolha a série e matéria", desc: "Clique na opção certa — sem digitar nada." },
  { emoji: "📄", title: "Envie o PDF do livro",      desc: "O livro didático da sua turma, qualquer edição." },
  { emoji: "✅", title: "Baixe o plano em Word",     desc: "Pronto para imprimir e entregar na escola." },
]

const plans = [
  {
    name: "Trial",
    price: "Grátis",
    period: "14 dias",
    color: "#c2571a",
    bg: "#fff1ea",
    items: ["3 planos no total", "Plano mensal e aula única", "Download em Word", "Sem cartão de crédito"],
    cta: "Começar grátis",
    href: "/cadastro",
    highlight: false,
  },
  {
    name: "Professora",
    price: "R$19,90",
    period: "por mês",
    color: "#ffffff",
    bg: "linear-gradient(135deg,#904d00,#ff8c00)",
    items: ["15 planos por mês", "Plano mensal e aula única", "Download em Word", "Suporte por WhatsApp"],
    cta: "Assinar agora",
    href: "/cadastro?plano=professora",
    highlight: true,
  },
  {
    name: "Escola",
    price: "R$150+",
    period: "por mês",
    color: "#1a4f8a",
    bg: "#e8f1fb",
    items: ["10+ professoras", "Planos ilimitados", "Relatório de uso", "Contrato personalizado"],
    cta: "Falar com a gente",
    href: "https://wa.me/5511999999999",
    highlight: false,
  },
]

export default function Home() {
  return (
    <div style={{ backgroundColor: "#fff8f5", minHeight: "100vh" }}>

      {/* ── Navbar ───────────────────────────────────── */}
      <header
        className="flex items-center justify-between px-8 py-4"
        style={{
          backgroundColor: "rgba(255,248,245,0.85)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          position: "sticky", top: 0, zIndex: 20,
          borderBottom: "1px solid #fff1ea",
        }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="flex items-center justify-center text-lg rounded-[10px]"
            style={{ width: 36, height: 36, background: "linear-gradient(135deg,#904d00,#ff8c00)" }}
          >📝</div>
          <span className="text-[16px] font-700 text-[#7c4a2d]">Plano Fácil Tia</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login"
            className="h-10 px-5 rounded-[12px] text-[14px] font-500 flex items-center no-underline transition-colors hover:bg-[#fff1ea]"
            style={{ color: "#7c4a2d" }}
          >Entrar</Link>
          <Link href="/cadastro"
            className="h-10 px-5 rounded-[12px] text-[14px] font-600 flex items-center no-underline text-white transition-opacity hover:opacity-90"
            style={{ background: "linear-gradient(135deg,#904d00,#ff8c00)" }}
          >Criar conta grátis</Link>
        </div>
      </header>

      {/* ── Hero ─────────────────────────────────────── */}
      <section className="relative flex flex-col lg:flex-row items-center gap-12 px-8 py-24 max-w-6xl mx-auto">

        {/* Texto */}
        <div className="flex-1 max-w-xl">
          <span
            className="inline-block text-[12px] font-700 uppercase tracking-[0.08em] px-3 py-1.5 rounded-full mb-6"
            style={{ backgroundColor: "#fff1ea", color: "#c2571a" }}
          >
            Para professoras do 1º ao 5º ano
          </span>

          <h1 className="text-[42px] font-700 leading-[1.15] text-[#2f1402] mb-5">
            Crie seu plano de aula em{" "}
            <span style={{ color: "#ff8c00" }}>menos de 1 minuto</span>
          </h1>

          <p className="text-[17px] text-[#564334] leading-[1.65] mb-8">
            Você escolhe a série e a matéria, sobe o PDF do livro didático —
            a gente entrega o plano completo em Word, pronto para imprimir e entregar na escola.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/cadastro"
              className="inline-flex items-center justify-center gap-2 h-14 px-8 rounded-[14px] text-[16px] font-700 text-white no-underline transition-opacity hover:opacity-90"
              style={{ background: "linear-gradient(135deg,#904d00,#ff8c00)" }}
            >
              Experimentar grátis — 14 dias
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center h-14 px-6 rounded-[14px] text-[15px] font-500 no-underline transition-colors hover:bg-[#ffeade]"
              style={{ backgroundColor: "#fff1ea", color: "#7c4a2d", border: "1px solid #f0ddd0" }}
            >
              Já tenho conta
            </Link>
          </div>

          <p className="text-[13px] text-[#a87b5e] mt-4">
            ✓ Sem cartão de crédito &nbsp;·&nbsp; ✓ 3 planos grátis &nbsp;·&nbsp; ✓ Cancela quando quiser
          </p>
        </div>

        {/* Preview card flutuante */}
        <div className="flex-1 flex justify-center">
          <div
            className="relative rounded-[28px] p-6"
            style={{
              backgroundColor: "#ffffff",
              boxShadow: "0 24px 64px rgba(144,77,0,0.14)",
              width: "100%", maxWidth: 380,
            }}
          >
            {/* Header do card */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-[12px] text-xl flex items-center justify-center" style={{ backgroundColor: "#fff1ea" }}>📊</div>
              <div>
                <p className="text-[14px] font-700 text-[#2f1402]">Plano Mensal — Matemática</p>
                <p className="text-[12px] text-[#a87b5e]">1º Ano · 25 aulas geradas</p>
              </div>
            </div>

            {/* Linhas mockadas */}
            {[
              { aula: "Aula 1", obj: "Números de 1 a 10", met: "Jogo com tampinhas" },
              { aula: "Aula 2", obj: "Adição simples",    met: "Material dourado" },
              { aula: "Aula 3", obj: "Subtração visual",  met: "Desenho e contagem" },
            ].map((row, i) => (
              <div key={i} className="flex items-center gap-3 py-2.5" style={{ borderTop: i === 0 ? "1px solid #fff1ea" : "1px solid #fff8f5" }}>
                <span className="text-[11px] font-700 uppercase tracking-wide shrink-0" style={{ color: "#c2571a", width: 40 }}>{row.aula}</span>
                <div className="flex-1">
                  <p className="text-[13px] font-500 text-[#2f1402]">{row.obj}</p>
                  <p className="text-[11px] text-[#a87b5e]">{row.met}</p>
                </div>
              </div>
            ))}

            <p className="text-[12px] text-[#a87b5e] text-center mt-3">+ 22 aulas no arquivo Word</p>

            {/* Botão */}
            <div
              className="mt-4 h-11 rounded-[12px] flex items-center justify-center gap-2 text-[14px] font-600 text-white"
              style={{ background: "linear-gradient(135deg,#904d00,#ff8c00)" }}
            >
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
              </svg>
              Baixar Word
            </div>

            {/* Badge flutuante */}
            <div
              className="absolute -top-4 -right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-700 text-white"
              style={{ background: "linear-gradient(135deg,#2e7d32,#4caf50)", boxShadow: "0 4px 12px rgba(46,125,50,0.3)" }}
            >
              ✓ Pronto em 30s
            </div>
          </div>
        </div>
      </section>

      {/* ── Como funciona ────────────────────────────── */}
      <section style={{ backgroundColor: "#fff1ea" }}>
        <div className="max-w-5xl mx-auto px-8 py-20">
          <div className="text-center mb-12">
            <p className="text-[12px] font-700 uppercase tracking-[0.08em] text-[#c2571a] mb-2">Simples assim</p>
            <h2 className="text-[32px] font-700 text-[#2f1402]">Como funciona</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((step, i) => (
              <div key={i} className="flex flex-col items-center text-center gap-4 p-8 rounded-[24px]" style={{ backgroundColor: "#ffffff", boxShadow: "0 4px 20px rgba(144,77,0,0.06)" }}>
                <div
                  className="text-3xl flex items-center justify-center rounded-[16px]"
                  style={{ width: 64, height: 64, backgroundColor: "#fff1ea" }}
                >{step.emoji}</div>
                <div>
                  <p className="text-[12px] font-700 uppercase tracking-[0.06em] text-[#c2571a] mb-1">Passo {i + 1}</p>
                  <p className="text-[16px] font-700 text-[#2f1402] mb-1">{step.title}</p>
                  <p className="text-[14px] text-[#564334] leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Planos ───────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-8 py-20">
        <div className="text-center mb-12">
          <p className="text-[12px] font-700 uppercase tracking-[0.08em] text-[#c2571a] mb-2">Sem surpresas</p>
          <h2 className="text-[32px] font-700 text-[#2f1402]">Planos e preços</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="flex flex-col gap-6 p-7 rounded-[24px]"
              style={{
                background: plan.bg,
                boxShadow: plan.highlight
                  ? "0 16px 48px rgba(144,77,0,0.22)"
                  : "0 4px 20px rgba(144,77,0,0.07)",
                transform: plan.highlight ? "scale(1.04)" : "none",
              }}
            >
              <div>
                <p className="text-[13px] font-700 uppercase tracking-[0.06em] mb-2" style={{ color: plan.highlight ? "rgba(255,255,255,0.75)" : plan.color }}>
                  {plan.name}
                </p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-[36px] font-700" style={{ color: plan.highlight ? "#ffffff" : "#2f1402" }}>{plan.price}</span>
                  <span className="text-[14px]" style={{ color: plan.highlight ? "rgba(255,255,255,0.6)" : "#a87b5e" }}>/{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-2 flex-1">
                {plan.items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-[14px]" style={{ color: plan.highlight ? "rgba(255,255,255,0.9)" : "#564334" }}>
                    <span style={{ color: plan.highlight ? "#ffe4cc" : "#ff8c00" }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className="flex items-center justify-center h-12 rounded-[12px] text-[14px] font-700 no-underline transition-opacity hover:opacity-90"
                style={plan.highlight
                  ? { backgroundColor: "#ffffff", color: "#904d00" }
                  : { backgroundColor: plan.highlight ? "#904d00" : "#fff1ea", color: plan.color || "#904d00", border: "1px solid #f0ddd0" }
                }
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────── */}
      <footer style={{ borderTop: "1px solid #fff1ea" }}>
        <div className="max-w-5xl mx-auto px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">📝</span>
            <span className="text-[14px] font-600 text-[#7c4a2d]">Plano Fácil Tia</span>
          </div>
          <div className="flex gap-6">
            {["Privacidade", "Termos de uso", "Ajuda"].map((item) => (
              <Link key={item} href="#" className="text-[13px] text-[#a87b5e] no-underline hover:text-[#7c4a2d] transition-colors">
                {item}
              </Link>
            ))}
          </div>
          <p className="text-[12px] text-[#a87b5e]">© 2026 Plano Fácil Tia</p>
        </div>
      </footer>
    </div>
  )
}
