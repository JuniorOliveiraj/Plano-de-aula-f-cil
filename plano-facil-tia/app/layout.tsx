import type { Metadata } from "next"
import { Plus_Jakarta_Sans } from "next/font/google"
import SessionProviderWrapper from "@/components/shared/SessionProviderWrapper"
import { ThemeProvider } from "@/context/ThemeContext"
import "./globals.css"

const jakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "Plano Fácil — Planos de aula em 1 minuto",
  description:
    "Gere planos de aula completos para o ensino fundamental em menos de 1 minuto. Envie o PDF do livro e receba o plano em Word pronto para entregar.",
}

// Script anti-flash: aplica o tema ANTES do React hidratar, evitando
// o piscar de tela branca quando o usuário tem o tema escuro salvo.
const themeScript = `
(function(){
  try{
    var t=localStorage.getItem('pft-theme');
    if(t==='dark'||t==='light'){document.documentElement.setAttribute('data-theme',t);return;}
    var prefersDark=window.matchMedia('(prefers-color-scheme:dark)').matches;
    document.documentElement.setAttribute('data-theme',prefersDark?'dark':'light');
  }catch(e){}
})();
`

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={jakartaSans.variable} suppressHydrationWarning>
      <head>
        {/* Script anti-flash — deve ser o primeiro script executado */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=block" />
      </head>
      <body>
        <ThemeProvider>
          <SessionProviderWrapper>{children}</SessionProviderWrapper>
        </ThemeProvider>
      </body>
    </html>
  )
}

