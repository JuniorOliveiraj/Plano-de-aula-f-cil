export default function Pricing() {
    return (<section className="py-24 px-6 md:px-8 max-w-[1400px] mx-auto bg-[#fff8f5] font-sans" id="planos">
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
    )
}