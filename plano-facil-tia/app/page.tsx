import Link from "next/link"
import Image from "next/image"
import Footer from "@/components/landingPage/footer"
import Pricing from "@/components/landingPage/Pricing"
import FinalCta from "@/components/FinalCta"
import OcrHighlight from "@/components/landingPage/OcrHighlight"
import HeroSection from "@/components/landingPage/HeroSection"

// ── SEO & INDEXAMENTO (Next.js App Router) ────────────────
export const metadata = {
  title: 'Plano Fácil Tia | Planos de Aula Alinhados à BNCC com IA',
  description: 'Crie planos de aula completos e alinhados à BNCC em segundos. Menos burocracia, mais tempo para o que realmente importa. A IA que planeja sua aula.',
  keywords: ['plano de aula BNCC', 'gerador de plano de aula', 'IA para professores', 'ensino fundamental', 'automatizar plano de aula'],
  openGraph: {
    title: 'Plano Fácil Tia | Planos de Aula Alinhados à BNCC',
    description: 'Crie planos de aula completos e alinhados à BNCC em segundos.',
    type: 'website',
    locale: 'pt_BR',
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function Home() {

  return (
    <div className="bg-surface font-sans text-on-surface selection:bg-secondary selection:text-white min-h-screen">
      {/* ── Navigation ───────────────────────────────── */}
      <nav className="fixed top-0 w-full z-50 bg-white/85 backdrop-blur-md shadow-sm h-20 flex justify-between items-center px-8 sm:px-12" aria-label="Navegação Principal">
        <div className="text-2xl font-extrabold text-[#231102] tracking-tight">
          Plano Fácil <span className="text-primary">Tia</span>
        </div>
        <div className="hidden md:flex gap-10 items-center">
          <Link href="/" className="text-primary font-bold border-b-2 border-primary text-[17px] tracking-tight" title="Página Inicial">
            Início
          </Link>
          <a href="#recursos" className="text-on-surface-var font-medium text-[17px] tracking-tight hover:text-primary transition-colors duration-300" title="Ver Recursos">
            Recursos
          </a>
          <a href="#planos" className="text-on-surface-var font-medium text-[17px] tracking-tight hover:text-primary transition-colors duration-300" title="Ver Planos">
            Planos
          </a>
          <Link href="/login" className="text-on-surface-var font-medium text-[17px] tracking-tight hover:text-primary transition-colors duration-300" title="Fazer Login na Plataforma">
            Entrar
          </Link>
        </div>
        <Link href="/assinar" title="Assinar o Plano Fácil Tia">
          <button className="bg-primary hover:bg-primary-bright text-white px-7 py-3 rounded-full font-bold transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md">
            Assinar Agora
          </button>
        </Link>
      </nav>

      <main>
        {/* ── Hero Section ─────────────────────────────── */}
        <HeroSection/>

        {/* ── Dashboard Sneak Peek ─────────────────────── */}
        <section className="py-32 bg-surface-low overflow-hidden" aria-labelledby="dashboard-title">
          <div className="max-w-7xl mx-auto px-8 text-center mb-20">
            <h2 id="dashboard-title" className="text-4xl lg:text-5xl font-extrabold text-terracotta mb-6 tracking-tight">Simplicidade que encanta</h2>
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
                    alt="Painel de controle do software Plano Fácil Tia gerando um plano de aula alinhado à BNCC"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

              </div>
            </div>
            {/* Decorative badges */}
            <div className="absolute -right-8 top-1/2 bg-white p-4 rounded-2xl shadow-xl border border-outline-var/20 hidden xl:block animate-bounce-slow">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white">
                  <span className="material-symbols-outlined text-sm" aria-hidden="true">done</span>
                </div>
                <p className="text-sm font-bold">BNCC Validada</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 5-Step Magic ─────────────────────────────── */}
        <section className="py-32 px-8 max-w-7xl mx-auto" id="recursos" aria-labelledby="passos-title">
          <div className="text-center mb-24">
            <span className="text-primary font-extrabold text-sm uppercase tracking-[0.2em] mb-4 block">Processo Automatizado</span>
            <h2 id="passos-title" className="text-4xl lg:text-5xl font-extrabold text-terracotta mb-6 tracking-tight">O Plano Pronto em 5 Passos</h2>
            <p className="text-xl text-on-surface-var mx-auto max-w-2xl leading-relaxed">
              Do livro didático ao arquivo Word formatado em menos de 2 minutos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-12 relative">
            {/* Connecting lines for desktop */}
            <div className="hidden lg:block absolute top-10 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-outline-var/30 to-transparent -z-10" aria-hidden="true"></div>

            {[
              { step: "1", label: "Série", desc: "Defina do 1º ao 5º ano fundamental.", icon: "school" },
              { step: "2", label: "Matéria", desc: "Português, Matemática, Ciências...", icon: "menu_book" },
              { step: "3", label: "Tipo", desc: "Aula única ou plano sequencial.", icon: "category" },
              { step: "4", label: "Upload PDF", desc: "Fotos do livro didático (IA lê tudo).", icon: "upload_file" },
              { step: "5", label: "Pronto!", desc: "Baixe seu Word editável.", icon: "verified" }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center text-center space-y-6 group px-4">
                <div className="w-20 h-20 rounded-3xl bg-white flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 ambient-shadow border border-outline-var/10 transform group-hover:-translate-y-2 relative">
                  <span className="material-symbols-outlined text-4xl" aria-hidden="true">{item.icon}</span>
                  <span className="absolute -top-3 -right-3 w-8 h-8 bg-surface-container rounded-full flex items-center justify-center text-xs font-black text-on-surface-var border-4 border-surface shadow-sm">
                    {item.step}
                  </span>
                </div>
                <div className="space-y-2">
                  <h3 className="font-black text-xl text-on-surface tracking-tight">{item.label}</h3>
                  <p className="text-sm text-on-surface-var font-medium leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Feature: OCR highlight ────────────────────── */}
        <OcrHighlight/>

        {/* ── Pricing ───────────────────────────────────── */}
        <Pricing/>

        {/* ── Final CTA (Alta Conversão) ───────────────────────── */}
        <FinalCta/>

      </main>

      <Footer/>
    </div>
  )
}