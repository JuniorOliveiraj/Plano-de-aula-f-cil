"use client"

import { signOut } from "next-auth/react"

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="h-12 px-6 rounded-[14px] bg-[#fff1ea] text-[#c2571a] font-medium"
    >
      Sair da conta
    </button>
  )
}
