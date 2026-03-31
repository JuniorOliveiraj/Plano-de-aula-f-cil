import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcrypt"

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error("NEXTAUTH_SECRET is not defined in environment variables.")
}

// 👇 Tipagem dos dados retornados no login
type AppUser = {
  id: string
  name: string | null
  email: string | null
  plano: string | null
  role: string | null
}

// 👇 Tipagem das credenciais
type CredentialsInput = {
  email: string
  password: string
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
        // 👇 cast seguro
        const creds = credentials as CredentialsInput

        if (!creds?.email || !creds?.password) {
          return null
        }

        const email = creds.email.toLowerCase().trim()
        const password = creds.password

        const user = await prisma.user.findUnique({
          where: { email },
        })

        if (!user || !user.passwordHash) {
          return null
        }

        const senhaValida = await bcrypt.compare(
          password,
          user.passwordHash
        )

        if (!senhaValida) {
          return null
        }

        // 👇 retorno tipado
        const appUser: AppUser = {
          id: user.id,
          name: user.name,
          email: user.email,
          plano: user.plano,
          role: user.role,
        }

        return appUser
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const u = user as AppUser

        token.userId = u.id
        token.plano = u.plano
        token.role = u.role
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