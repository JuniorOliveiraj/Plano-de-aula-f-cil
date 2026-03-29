"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleCredentialsLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      setError("Email ou senha incorretos.")
      setLoading(false)
      return
    }

    window.location.href = "/dashboard"
    setLoading(false)
  }

  async function handleGoogleLogin() {
    await signIn("google", {
      callbackUrl: "/dashboard",
    })
  }

  return (
    <div className="min-h-screen bg-[#fff8f5] flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white rounded-[2rem] p-10 shadow-[0_24px_48px_rgba(144,77,0,0.06)]">
        <h1 className="text-3xl font-semibold text-[#2f1402] mb-2">
          Bem-vinda de volta, tia 💛
        </h1>

        <p className="text-sm text-[#564334] mb-8 leading-relaxed">
          Entre para continuar criando planos lindos e organizados.
        </p>

        <button
          onClick={handleGoogleLogin}
          className="w-full h-14 rounded-[14px] bg-gradient-to-br from-[#904d00] to-[#ff8c00] text-white font-semibold text-base hover:opacity-95 transition mb-6"
        >
          Entrar com Google
        </button>

        <div className="my-6" />

        <form onSubmit={handleCredentialsLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-[#7c4a2d] mb-2">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-14 rounded-xl bg-[#fff1ea] px-4 text-[#2f1402] outline-none focus:ring-2 focus:ring-[#ff8c00]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#7c4a2d] mb-2">
              Senha
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-14 rounded-xl bg-[#fff1ea] px-4 text-[#2f1402] outline-none focus:ring-2 focus:ring-[#ff8c00]"
            />
          </div>

          {error && (
            <p className="text-sm text-[#ba1a1a]">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 rounded-[14px] bg-gradient-to-br from-[#904d00] to-[#ff8c00] text-white font-semibold text-base hover:opacity-95 transition disabled:opacity-70"
          >
            {loading ? "Entrando..." : "Entrar com Email"}
          </button>
        </form>

        <p className="mt-8 text-sm text-[#564334]">
          Ainda não tem conta?{" "}
          <a href="/cadastro" className="text-[#c2571a] font-medium">
            Criar conta
          </a>
        </p>
      </div>
    </div>
  )
}
