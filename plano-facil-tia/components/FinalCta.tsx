export default function FinalCta(){
    return(

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
    )
}