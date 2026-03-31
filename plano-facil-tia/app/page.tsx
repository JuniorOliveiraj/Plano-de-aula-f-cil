import Link from "next/link"
import Image from "next/image"

export default function Home() {
  const socialLinks = [
    {
      name: "Instagram",
      url: "#",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
        </svg>
      )
    },
    {
      name: "YouTube",
      url: "#",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path>
          <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
        </svg>
      )
    },
    {
      name: "Facebook",
      url: "#",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
        </svg>
      )
    },
    {
      name: "E-mail",
      url: "#",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
          <polyline points="22,6 12,13 2,6"></polyline>
        </svg>
      )
    }
  ];
  return (
    <div className="bg-surface font-sans text-on-surface selection:bg-secondary selection:text-white min-h-screen">
      {/* ── Navigation ───────────────────────────────── */}
      <nav className="fixed top-0 w-full z-50 bg-white/85 backdrop-blur-md shadow-sm h-20 flex justify-between items-center px-8 sm:px-12">
        <div className="text-2xl font-extrabold text-[#231102] tracking-tight">
          Plano Fácil <span className="text-primary">Tia</span>
        </div>
        <div className="hidden md:flex gap-10 items-center">
          <Link href="/" className="text-primary font-bold border-b-2 border-primary text-[17px] tracking-tight">
            Início
          </Link>
          <a href="#recursos" className="text-on-surface-var font-medium text-[17px] tracking-tight hover:text-primary transition-colors duration-300">
            Recursos
          </a>
          <a href="#planos" className="text-on-surface-var font-medium text-[17px] tracking-tight hover:text-primary transition-colors duration-300">
            Planos
          </a>
          <Link href="/login" className="text-on-surface-var font-medium text-[17px] tracking-tight hover:text-primary transition-colors duration-300">
            Entrar
          </Link>
        </div>
        <Link href="/assinar">
          <button className="bg-primary hover:bg-primary-bright text-white px-7 py-3 rounded-full font-bold transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md">
            Assinar Agora
          </button>
        </Link>
      </nav>

      {/* ── Hero Section ─────────────────────────────── */}
      <header className="pt-40 pb-24 px-8 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        <div className="flex-1 space-y-8 text-center lg:text-left">
          <span className="inline-block px-5 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold tracking-wider uppercase">
            Gerado por IA e otimizado para o MEC
          </span>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-[#231102] leading-[1.1] tracking-tight">
            Recupere suas noites. <br />
            <span className="text-primary">Deixe a IA planejar</span> sua aula.
          </h1>
          <p className="text-xl text-on-surface-var leading-relaxed max-w-2xl mx-auto lg:mx-0">
            Crie planos de aula completos e alinhados à BNCC em segundos. Menos burocracia, mais tempo para o que realmente importa: seus alunos.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start pt-4">
            <Link href="/cadastro">
              <button className="sunshine-gradient text-white px-10 py-5 rounded-2xl font-extrabold text-xl2 flex items-center justify-center gap-3 whitespace-nowrap cta-glow transition-all duration-300 transform hover:-translate-y-1">
                <span>Começar agora grátis</span>
                <span className="material-symbols-outlined text-2xl">arrow_forward</span>
              </button>


            </Link>
            <div className="flex items-center justify-center gap-4 px-2">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-surface-container flex items-center justify-center text-xs text-on-surface-var font-bold">
                    {i === 4 ? "+2k" : "👩‍🏫"}
                  </div>
                ))}
              </div>
              <p className="text-sm font-semibold text-on-surface-var">+2.400 professoras já usam</p>
            </div>
          </div>
          <p className="text-sm text-on-surface-var/60 flex items-center justify-center lg:justify-start gap-2">
            <span className="material-symbols-outlined text-sm text-ink-success">verified</span>
            Sem cartão de crédito necessário &nbsp;•&nbsp; 14 dias de teste
          </p>
        </div>

        <div className="flex-1 relative w-full max-w-xl lg:max-w-none">
          <div className="absolute -top-10 -right-10 w-72 h-72 bg-primary/10 rounded-full blur-[80px]"></div>
          <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-secondary/10 rounded-full blur-[80px]"></div>
          <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl transform lg:rotate-3 hover:rotate-0 transition-transform duration-700">
            <img
              className="w-full h-[500px] object-cover"
              src="/imgs/landingPage/mulher-sorridente-com-foto-media-na-biblioteca_23-2149204753.jpg"
              alt="Professora sorridente em sala de aula"
            />
            <div className="absolute bottom-8 left-8 right-8 bg-white/90 backdrop-blur-md p-8 rounded-[2rem] ambient-shadow border border-white/20">
              <p className="italic text-terracotta font-semibold text-lg leading-relaxed">
                "O Plano Fácil Tia me devolveu 5 horas por semana. É como ter uma assistente pedagógica particular disponível 24h."
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">AP</div>
                <div>
                  <p className="font-bold text-on-surface">Prof. Ana Paula</p>
                  <p className="text-xs text-on-surface-var">3º Ano Fundamental • Escola Adventista</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── Dashboard Sneak Peek ─────────────────────── */}
      <section className="py-32 bg-surface-low overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 text-center mb-20">
          <h2 className="text-4xl lg:text-5xl font-extrabold text-terracotta mb-6 tracking-tight">Simplicidade que encanta</h2>
          <p className="text-xl text-on-surface-var max-w-7xl mx-auto leading-relaxed">
            Interface limpa, focada e sem distrações. Projetada especificamente para a rotina do educador — sem complicação técnica.
          </p>
        </div>

        <div className="max-w-6xl mx-auto px-8 relative">
          <div className="max-w-6xl mx-auto px-8 relative">
            <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-outline-var/30 transform hover:scale-[1.01] transition-transform duration-500">

              {/* Mockup Header */}
              <div className="h-16 bg-surface-container/50 border-b border-outline-var/20 flex items-center px-8 gap-4">
                <div className="flex gap-2">
                  <div className="w-3.5 h-3.5 rounded-full bg-red-400"></div>
                  <div className="w-3.5 h-3.5 rounded-full bg-amber-400"></div>
                  <div className="w-3.5 h-3.5 rounded-full bg-green-400"></div>
                </div>

                <div className="mx-auto bg-white/80 border border-outline-var/20 px-6 py-1.5 rounded-full text-xs text-on-surface-var/60 font-medium tracking-wide">
                  app.planofaciltia.com.br/dashboard
                </div>
              </div>

              {/* Mockup Content */}
              <div className="w-full h-[500px]">
                <img
                  src="/imgs/landingPage/dashboard.png"
                  alt="Dashboard"
                  className="w-full h-full object-cover"
                />
              </div>

            </div>
          </div>
          {/* Decorative badges */}
          <div className="absolute -right-8 top-1/2 bg-white p-4 rounded-2xl shadow-xl border border-outline-var/20 hidden xl:block animate-bounce-slow">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-sm">done</span>
              </div>
              <p className="text-sm font-bold">BNCC Validada</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5-Step Magic ─────────────────────────────── */}
      <section className="py-32 px-8 max-w-7xl mx-auto" id="recursos">
        <div className="text-center mb-24">
          <span className="text-primary font-extrabold text-sm uppercase tracking-[0.2em] mb-4 block">Processo Automatizado</span>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-terracotta mb-6 tracking-tight">O Plano Pronto em 5 Passos</h2>
          <p className="text-xl text-on-surface-var mx-auto max-w-2xl leading-relaxed">
            Do livro didático ao arquivo Word formatado em menos de 2 minutos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-12 relative">
          {/* Connecting lines for desktop */}
          <div className="hidden lg:block absolute top-10 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-outline-var/30 to-transparent -z-10"></div>

          {[
            { step: "1", label: "Série", desc: "Defina do 1º ao 5º ano fundamental.", icon: "school" },
            { step: "2", label: "Matéria", desc: "Português, Matemática, Ciências...", icon: "menu_book" },
            { step: "3", label: "Tipo", desc: "Aula única ou plano sequencial.", icon: "category" },
            { step: "4", label: "Upload PDF", desc: "Fotos do livro didático (IA lê tudo).", icon: "upload_file" },
            { step: "5", label: "Pronto!", desc: "Baixe seu Word editável.", icon: "verified" }
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col items-center text-center space-y-6 group px-4">
              <div className="w-20 h-20 rounded-3xl bg-white flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 ambient-shadow border border-outline-var/10 transform group-hover:-translate-y-2 relative">
                <span className="material-symbols-outlined text-4xl">{item.icon}</span>
                <span className="absolute -top-3 -right-3 w-8 h-8 bg-surface-container rounded-full flex items-center justify-center text-xs font-black text-on-surface-var border-4 border-surface shadow-sm">
                  {item.step}
                </span>
              </div>
              <div className="space-y-2">
                <h4 className="font-black text-xl text-on-surface tracking-tight">{item.label}</h4>
                <p className="text-sm text-on-surface-var font-medium leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Feature: OCR highlight ────────────────────── */}
      <section className="py-32 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 flex flex-col lg:flex-row items-center gap-20">
          <div className="flex-1 order-2 lg:order-1 relative">
            <div className="bg-surface p-12 rounded-[3.5rem] ambient-shadow border border-outline-var/10 text-center relative overflow-hidden">
              <div className="mb-8 inline-flex items-center justify-center w-28 h-28 bg-green-50 text-green-600 rounded-full shadow-inner animate-pulse">
                <span className="material-symbols-outlined text-7xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              </div>
              <h3 className="text-3xl font-extrabold mb-4 text-on-surface tracking-tight">Upload Concluído!</h3>
              <p className="text-on-surface-var text-lg font-medium">Transformando fotos de celular em objetivos BNCC...</p>

              <div className="mt-12 w-full bg-surface-container h-4 rounded-full overflow-hidden shadow-sm p-1">
                <div className="bg-primary h-full w-[95%] rounded-full shadow-lg"></div>
              </div>

              <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                <span className="material-symbols-outlined text-[200px]">picture_as_pdf</span>
              </div>
            </div>
            {/* Floating decoration */}
            <div className="absolute -bottom-6 -right-6 bg-[#FEF3C7] p-6 rounded-3xl shadow-xl border border-amber-200">
              <p className="text-amber-900 font-black text-center leading-none text-2xl">98.4%</p>
              <p className="text-amber-800 text-[10px] font-bold uppercase tracking-widest mt-1 text-center">Precisão OCR</p>
            </div>
          </div>

          <div className="flex-1 space-y-10 order-1 lg:order-2">
            <h2 className="text-4xl lg:text-5xl font-extrabold text-terracotta leading-[1.15] tracking-tight">
              Chega de <span className="text-primary italic">digitar</span> o livro didático.
            </h2>
            <p className="text-xl text-on-surface-var leading-relaxed font-medium">
              Nossa tecnologia proprietária de OCR reconhece textos e imagens de livros didáticos, transformando fotos de celular em metodologias e avaliações automaticamente em conformidade com o MEC.
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
              {[
                "Arquivos PDF de até 20MB",
                "Conversão direta para BNCC",
                "Sugestões de atividades extras",
                "Metodologias Ativas inclusas",
                "Formatação Word ABNT",
                "Foco em Multidisciplinaridade"
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-3 font-bold text-on-surface group">
                  <span className="material-symbols-outlined text-primary group-hover:scale-125 transition-transform">verified</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Pricing ───────────────────────────────────── */}
      <section className="py-24 px-6 md:px-8 max-w-[1400px] mx-auto bg-[#fff8f5] font-sans" id="planos">
        {/* ── Level 0 Background (Warm White) ───────────────────── */}

        {/* ── Cabeçalho da Seção ──────────────────────────────── */}
        <div className="text-center mb-16 md:mb-24">
          <span className="text-[#c2571a] font-bold text-[0.6875rem] uppercase tracking-[0.05rem] mb-4 block">
            Invista em você
          </span>
          <h2 className="text-[2rem] md:text-[2.5rem] lg:text-5xl font-medium text-[#7c4a2d] mb-6 tracking-tight">
            O Investimento na Sua Paz
          </h2>
          <p className="text-[0.875rem] md:text-[1.125rem] text-[#564334] mx-auto max-w-2xl leading-[1.6]">
            Escolha o plano que melhor se adapta à sua carga horária escolar.
            Sem pegadinhas, apenas mais tempo para você e seus alunos.
          </p>
        </div>

        {/* ── Grid Assímetrica e Camadas Tonais ───────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-6 items-center max-w-6xl mx-auto">

          {/* ── Card: Trial Gratuito (Level 1) ─────────────────── */}
          <div className="flex flex-col p-8 md:p-10 bg-[#fff1ea] rounded-[2rem] h-full lg:h-[90%] transition-transform hover:-translate-y-1">
            <div className="mb-8">
              <h3 className="text-[1.375rem] font-medium text-[#7c4a2d] mb-4">Trial Gratuito</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-[2.5rem] font-bold text-[#2f1402]">R$ 0</span>
              </div>
              {/* Daily Note Chip Style */}
              <p className="mt-4 bg-[#ffdbca] text-[#7c4a2d] font-bold uppercase text-[0.6875rem] tracking-[0.05rem] px-4 py-2 rounded-full inline-block">
                Experimente sem compromisso
              </p>
            </div>

            <ul className="space-y-6 mb-12 flex-1">
              {["14 dias de acesso", "Até 3 planos completos", "Download em Word", "Suporte por E-mail"].map((item, i) => (
                <li key={i} className="flex items-start gap-4 text-[#564334] text-[0.875rem] font-medium leading-[1.6]">
                  <span className="material-symbols-outlined text-[#ff8c00] text-[24px]">check</span>
                  <span className="pt-0.5">{item}</span>
                </li>
              ))}
            </ul>

            {/* Secondary Button */}
            <a href="/cadastro" className="block w-full">
              <button className="w-full h-[52px] rounded-[14px] bg-[#FFF0E6] border border-[#F0DDD0] text-[#C2571A] font-semibold text-[1rem] hover:bg-[#ffeade] transition-colors flex items-center justify-center">
                Começar Grátis
              </button>
            </a>
          </div>

          {/* ── Card: Plano Pro (Level 2 - The Focal Point) ────── */}
          <div className="flex flex-col p-8 md:p-12 bg-[#ffffff] rounded-[2rem] shadow-[0_24px_48px_rgba(144,77,0,0.06)] relative z-10 lg:-mx-4 lg:py-16 transition-transform hover:-translate-y-2">

            <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-[#ffdbca] text-[#7c4a2d] px-6 py-2 rounded-full text-[0.6875rem] font-bold uppercase tracking-[0.05rem] shadow-sm whitespace-nowrap">
              Nossa Recomendação
            </div>

            <div className="mt-4 mb-8">
              <h3 className="text-[1.375rem] font-medium text-[#7c4a2d] mb-4">Plano Professora</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-[3rem] font-bold text-[#2f1402] tracking-tight">R$ ${process.env.NEXT_PUBLIC_PRECO_MENSAL}</span>
                <span className="text-[#c2571a] font-medium">/mês</span>
              </div>
              <p className="text-[#c2571a] font-medium mt-4 text-[0.875rem]">
                Ideal para a rotina diária na sala de aula.
              </p>
            </div>

            <ul className="space-y-6 mb-12 flex-1">
              {[
                "Planos Ilimitados",
                "Upload de PDF ilimitado",
                "Exportação Word configurada",
                "Suporte prioritário (WhatsApp)",
                "Conteúdo BNCC atualizado 2024",
                "Metodologias Ativas Ilimitadas"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-4 text-[#2f1402] text-[0.875rem] font-medium leading-[1.6]">
                  {/* 24px min size for accessibility */}
                  <span className="material-symbols-outlined text-[#904d00] text-[24px]">verified</span>
                  <span className="pt-0.5">{item}</span>
                </li>
              ))}
            </ul>

            {/* Primary Button (Signature Texture Gradient) */}
            <a href="/assinar" className="block w-full">
              <button className="w-full h-[56px] rounded-[14px] bg-gradient-to-br from-[#904d00] to-[#ff8c00] text-white font-semibold text-[1.125rem] shadow-[0_8px_16px_rgba(255,140,0,0.2)] hover:shadow-[0_12px_24px_rgba(255,140,0,0.3)] hover:scale-[1.02] transition-all flex items-center justify-center">
                Assinar Plano Pro
              </button>
            </a>
          </div>

          {/* ── Card: Plano Escola (Level 1) ───────────────────── */}
          <div className="flex flex-col p-8 md:p-10 bg-[#fff1ea] rounded-[2rem] h-full lg:h-[90%] transition-transform hover:-translate-y-1">
            <div className="mb-8">
              <h3 className="text-[1.375rem] font-medium text-[#7c4a2d] mb-4">Plano Escola</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-[2rem] font-bold text-[#2f1402] leading-none mt-2 mb-2">Sob Consulta</span>
              </div>
              <p className="mt-4 bg-[#ffdbca] text-[#7c4a2d] font-bold uppercase text-[0.6875rem] tracking-[0.05rem] px-4 py-2 rounded-full inline-block">
                B2B e Licenciamento
              </p>
            </div>

            <ul className="space-y-6 mb-12 flex-1">
              {["Painel de Gestão Pedagógica", "Padronização por Escola", "Relatórios de Desempenho", "Treinamento para Equipe"].map((item, i) => (
                <li key={i} className="flex items-start gap-4 text-[#564334] text-[0.875rem] font-medium leading-[1.6]">
                  <span className="material-symbols-outlined text-[#ff8c00] text-[24px]">check</span>
                  <span className="pt-0.5">{item}</span>
                </li>
              ))}
            </ul>

            {/* Secondary Button */}
            <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer" className="block w-full">
              <button className="w-full h-[52px] rounded-[14px] bg-[#FFF0E6] border border-[#F0DDD0] text-[#C2571A] font-semibold text-[1rem] hover:bg-[#ffeade] transition-colors flex items-center justify-center">
                Falar com Vendas
              </button>
            </a>
          </div>

        </div>
      </section>

      {/* ── Final CTA (Alta Conversão) ───────────────────────── */}
      <section className="px-6 md:px-8 max-w-[1400px] mx-auto mt-12 py-32 px-8">
        <div
          className="relative max-w-6xl mx-auto rounded-[2.5rem] p-12 md:p-20 text-center overflow-hidden shadow-[0_24px_48px_rgba(144,77,0,0.15)] group"
          style={{ background: 'linear-gradient(135deg, rgb(144, 77, 0) 0%, rgb(255, 140, 0) 100%)' }}
        >
          {/* Elementos Decorativos (Bolinhas) */}
          <div
            className="absolute -top-16 -right-16 rounded-full opacity-10 pointer-events-none transition-transform duration-1000 group-hover:scale-110"
            aria-hidden="true"
            style={{ width: '350px', height: '350px', backgroundColor: '#ffffff' }}
          ></div>
          <div
            className="absolute -bottom-24 -left-16 rounded-full opacity-10 pointer-events-none transition-transform duration-1000 group-hover:scale-110"
            aria-hidden="true"
            style={{ width: '300px', height: '300px', backgroundColor: '#ffffff' }}
          ></div>
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-5 pointer-events-none"
            aria-hidden="true"
            style={{ width: '800px', height: '800px', backgroundColor: '#ffffff' }}
          ></div>

          {/* Conteúdo da CTA */}
          <div className="relative z-10 max-w-3xl mx-auto space-y-10">
            <div className="space-y-6">
              <h2 className="text-[2.25rem] md:text-[3.5rem] font-medium text-white tracking-tight leading-[1.15]">
                Pronta para recuperar seus <br className="hidden md:block" /> finais de semana?
              </h2>
              <p className="text-[1.125rem] md:text-[1.25rem] text-[#fff8f5] opacity-95 font-medium max-w-2xl mx-auto leading-[1.6]">
                Deixe a formatação complexa e a burocracia com a gente. Crie planos de aula alinhados à BNCC em minutos e volte a focar no que realmente importa: <span className="underline decoration-[#fff8f5]/40 underline-offset-4">ensinar com amor</span>.
              </p>
            </div>

            <div className="flex flex-col items-center gap-8 pt-4">
              <a href="/cadastro" className="block w-full sm:w-auto">
                {/* Botão com alto contraste (Fundo quente claro, texto da cor primária) */}
                <button className="w-full sm:w-auto h-[64px] rounded-[16px] bg-[#fff8f5] text-[#904d00] text-[1.125rem] font-bold px-10 shadow-[0_8px_24px_rgba(0,0,0,0.12)] hover:shadow-[0_16px_32px_rgba(0,0,0,0.2)] hover:-translate-y-1 transition-all flex items-center justify-center gap-3">
                  <span className="material-symbols-outlined text-[24px]">auto_awesome</span>
                  Quero simplificar minha rotina
                </button>
              </a>

              {/* Badges de confiança que quebram objeções */}
              <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8 opacity-90 text-[#fff8f5]">
                <div className="flex items-center gap-2 font-medium text-[0.875rem]">
                  <span className="material-symbols-outlined text-[20px]">no_credit_card</span>
                  Sem Cartão de Crédito
                </div>
                <div className="flex items-center gap-2 font-medium text-[0.875rem]">
                  <span className="material-symbols-outlined text-[20px]">timer</span>
                  Pronto em Segundos
                </div>
                <div className="flex items-center gap-2 font-medium text-[0.875rem]">
                  <span className="material-symbols-outlined text-[20px]">verified</span>
                  100% Alinhado à BNCC
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer (Hearthside Ledger Style) ─────────────────── */}
      <footer className="bg-[#2f1402] text-[#fff8f5] w-full pt-24 pb-12 px-6 md:px-8 mt-24 rounded-t-[3rem] mt-auto">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8">

          {/* Brand & Social Column */}
          <div className="lg:col-span-5 space-y-10">
            <div className="text-[2.25rem] font-medium tracking-tight">
              Plano Fácil <span className="text-[#ff8c00]">Tia</span>
            </div>
            <p className="text-[#ddc1ae] font-medium text-[1.125rem] leading-[1.6] max-w-sm">
              A plataforma de inteligência artificial dedicada ao educador brasileiro. Facilitamos a burocracia para você focar no que ama: ensinar.
            </p>

            <div className="flex gap-4">
              {socialLinks.map((social, i) => (
                <a
                  key={i}
                  href={social.url}
                  aria-label={social.name}
                  className="w-14 h-14 rounded-full bg-[#fff8f5]/5 flex items-center justify-center text-[#fff8f5] hover:bg-[#ff8c00] hover:text-[#2f1402] hover:-translate-y-1 transition-all"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-12 lg:gap-8 lg:pl-10">

            {/* Column 1 */}
            <div className="space-y-6">
              <h5 className="font-bold text-[#ff8c00] uppercase text-[0.6875rem] tracking-[0.05rem]">Produto</h5>
              <ul className="space-y-5 font-medium text-[0.875rem] text-[#ddc1ae]">
                <li><a href="/" className="hover:text-[#fff8f5] transition-colors">Início</a></li>
                <li><a href="#recursos" className="hover:text-[#fff8f5] transition-colors">Recursos</a></li>
                <li><a href="#planos" className="hover:text-[#fff8f5] transition-colors">Preços</a></li>
                <li><a href="/login" className="hover:text-[#fff8f5] transition-colors">Login</a></li>
              </ul>
            </div>

            {/* Column 2 */}
            <div className="space-y-6">
              <h5 className="font-bold text-[#ff8c00] uppercase text-[0.6875rem] tracking-[0.05rem]">Empresa</h5>
              <ul className="space-y-5 font-medium text-[0.875rem] text-[#ddc1ae]">
                <li><a href="#" className="hover:text-[#fff8f5] transition-colors">Sobre Nós</a></li>
                <li><a href="#" className="hover:text-[#fff8f5] transition-colors">Carreiras</a></li>
                <li><a href="#" className="hover:text-[#fff8f5] transition-colors">Blog da Tia</a></li>
                <li><a href="#" className="hover:text-[#fff8f5] transition-colors">Fale conosco</a></li>
              </ul>
            </div>

            {/* Column 3 */}
            <div className="space-y-6 col-span-2 sm:col-span-1">
              <h5 className="font-bold text-[#ff8c00] uppercase text-[0.6875rem] tracking-[0.05rem]">Jurídico</h5>
              <ul className="space-y-5 font-medium text-[0.875rem] text-[#ddc1ae]">
                <li><a href="#" className="hover:text-[#fff8f5] transition-colors">Termos de Uso</a></li>
                <li><a href="#" className="hover:text-[#fff8f5] transition-colors">Privacidade (LGPD)</a></li>
                <li><a href="#" className="hover:text-[#fff8f5] transition-colors">Cookies</a></li>
              </ul>
            </div>

          </div>
        </div>

        {/* Bottom Bar (Copyright & Badges) */}
        <div className="max-w-6xl mx-auto mt-20 pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-[0.6875rem] font-bold uppercase tracking-[0.05rem] text-[#ddc1ae]/60">
          <p>© 2026 Plano Fácil.</p>
          <div className="flex flex-wrap justify-center gap-6 md:gap-8">
            <p className="flex items-center gap-1">Conforme diretrizes MEC</p>
            <p className="flex items-center gap-1">Infraestrutura AWS & OpenAI</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
