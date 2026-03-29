import { prisma } from "@/lib/prisma"
import bcrypt from "bcrypt"

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json()

    if (!name || !email || !password) {
      return Response.json({ error: "Dados inválidos" }, { status: 400 })
    }

    if (password.length < 6) {
      return Response.json({ error: "Senha muito curta" }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return Response.json({ error: "Email já cadastrado" }, { status: 400 })
    }

    const hash = await bcrypt.hash(password, 12)

    await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: hash,
      },
    })

    return Response.json({ success: true })
  } catch {
    return Response.json({ error: "Erro interno" }, { status: 500 })
  }
}
