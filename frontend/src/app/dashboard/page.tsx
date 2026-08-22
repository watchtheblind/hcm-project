"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { API_URL, APP_NAME, TOKEN_KEY } from "@/lib/constants"

const ROLE_LABELS: Record<string, string> = {
  admin: "Administrativo",
  cirujano: "Cirujano",
  residente: "Residente",
  enfermeria: "Enfermería",
}

type SessionUser = { email: string; role: string }

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<SessionUser | null>(null)

  function clearSession() {
    localStorage.removeItem(TOKEN_KEY)
    document.cookie = `${TOKEN_KEY}=; path=/; SameSite=Lax; max-age=0`
  }

  useEffect(() => {
    const t = localStorage.getItem(TOKEN_KEY)
    if (!t) {
      router.replace("/login")
      return
    }

    // Valida el token contra el backend, no solo su presencia local:
    // un token expirado o revocado manda 401 y cierra sesión.
    fetch(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${t}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("sesión inválida")
        return res.json()
      })
      .then((data: SessionUser) => setUser(data))
      .catch(() => {
        clearSession()
        router.replace("/login")
      })
  }, [router])

  function handleLogout() {
    clearSession()
    router.replace("/login")
  }

  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-6 p-6">
      <h1 className="text-2xl font-bold">Panel de {APP_NAME}</h1>
      <p className="text-sm text-muted-foreground">
        {user
          ? `Sesión activa: ${user.email} · Rol: ${ROLE_LABELS[user.role] ?? user.role}`
          : "Verificando sesión…"}
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
