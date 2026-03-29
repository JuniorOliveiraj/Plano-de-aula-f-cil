import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcrypt"

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error("NEXTAUTH_SECRET is not defined in environment variables.")
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const normalizedEmail = String(credentials.email).toLowerCase().trim()

        const user = await prisma.user.findUnique({
          where: { email: normalizedEmail },
        })

        if (!user || !user.passwordHash) {
          return null
        }

        const senhaValida = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        )

        if (!senhaValida) {
          return null
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          plano: user.plano,
          role: user.role,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = (user as any).id
        token.plano = (user as any).plano
        token.role = (user as any).role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        ;(session.user as any).id = token.userId
        ;(session.user as any).plano = token.plano
        ;(session.user as any).role = token.role
      }
      return session
    },
  },
})
