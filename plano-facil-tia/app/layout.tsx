import type { Metadata } from "next"
import { Plus_Jakarta_Sans } from "next/font/google"
import SessionProviderWrapper from "@/components/shared/SessionProviderWrapper"
import "./globals.css"

const jakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "Plano Fácil Tia — Planos de aula em 1 minuto",
  description:
    "Gere planos de aula completos para o ensino fundamental em menos de 1 minuto. Envie o PDF do livro e receba o plano em Word pronto para entregar.",
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={jakartaSans.variable}>
      <body>
        <SessionProviderWrapper>{children}</SessionProviderWrapper>
      </body>
    </html>
  )
}
