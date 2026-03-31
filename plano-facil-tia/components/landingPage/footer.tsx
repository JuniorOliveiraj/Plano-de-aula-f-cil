export default function Footer() {
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
    )
}