import Link from "next/link";

export default function HeroSection() {
    return (

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
    )
}