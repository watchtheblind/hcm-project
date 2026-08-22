"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"
import { useRouter } from "next/navigation"
import { API_URL, TOKEN_KEY } from "@/lib/constants"

export type SessionUser = {
  email: string
  role: string
}

type SessionStatus = "loading" | "authenticated" | "unauthenticated"

type SessionContextValue = {
  user: SessionUser | null
  status: SessionStatus
  logout: () => void
}

const SessionContext = createContext<SessionContextValue>({
  user: null,
  status: "loading",
  logout: () => {},
})

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY)
  document.cookie = `${TOKEN_KEY}=; path=/; SameSite=Lax; max-age=0`
}

export function SessionProvider({ children }: React.PropsWithChildren) {
  const router = useRouter()
  const [user, setUser] = useState<SessionUser | null>(null)
  // Lazy init evita setState síncrono en el efecto.
  const [status, setStatus] = useState<SessionStatus>(() =>
    typeof window !== "undefined" && localStorage.getItem(TOKEN_KEY)
      ? "loading"
      : "unauthenticated"
  )

  // Valida el token contra el backend (401 => sesión inválida) en lugar de
  // confiar solo en su presencia local.
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (!token) {
      router.replace("/login")
      return
    }

    fetch(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("sesión inválida")
        setUser(await res.json())
        setStatus("authenticated")
      })
      .catch(() => {
        clearSession()
        setStatus("unauthenticated")
        router.replace("/login")
      })
  }, [router])

  const logout = useCallback(() => {
    clearSession()
    setStatus("unauthenticated")
    router.replace("/login")
  }, [router])

  return (
    <SessionContext.Provider value={{ user, status, logout }}>
      {children}
    </SessionContext.Provider>
  )
}

export function useSession() {
  return useContext(SessionContext)
}
