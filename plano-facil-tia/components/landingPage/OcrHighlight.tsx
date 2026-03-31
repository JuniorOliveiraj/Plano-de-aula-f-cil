export default function OcrHighlight() {
    return (

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
    )
}