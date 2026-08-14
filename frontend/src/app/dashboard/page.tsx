"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { APP_NAME, TOKEN_KEY } from "@/lib/constants"

export default function DashboardPage() {
  const router = useRouter()
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const t = localStorage.getItem(TOKEN_KEY)
    if (!t) {
      router.replace("/login")
      return
    }
    setToken(t)
  }, [router])

  function handleLogout() {
    localStorage.removeItem(TOKEN_KEY)
    document.cookie = `${TOKEN_KEY}=; path=/; max-age=0`
    router.replace("/login")
  }

  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-6 p-6">
      <h1 className="text-2xl font-bold">Panel de {APP_NAME}</h1>
      <p className="text-sm text-muted-foreground">
        {token ? "Sesión autenticada con token JWT." : "Verificando sesión…"}
      </p>
      <button
        type="button"
        onClick={handleLogout}
        className="rounded-md bg-destructive px-4 py-2 text-sm font-medium text-white"
      >
        Cerrar sesión
      </button>
    </main>
  )
}