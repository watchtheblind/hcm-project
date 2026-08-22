"use client"

import { useEffect, useState } from "react"
import { API_URL, TOKEN_KEY } from "@/lib/constants"
import { Badge } from "@/components/ui/badge"
import { ForbiddenCard } from "@/components/forbidden-card"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const ROLE_LABELS: Record<string, string> = {
  admin: "Administrativo",
  cirujano: "Cirujano",
  residente: "Residente",
  enfermeria: "Enfermería",
}

type Usuario = { email: string; role: string }

// Usuarios sembrados (prisma/seed.ts) — demo hasta que el backend exponga
// GET /users. El rol se verifica con la sesión real; no-admin ve 403.
const usuariosDemo: Usuario[] = [
  { email: "admin@hcm.local", role: "admin" },
  { email: "cirujano@hcm.local", role: "cirujano" },
  { email: "residente@hcm.local", role: "residente" },
  { email: "enfermeria@hcm.local", role: "enfermeria" },
]

export default function UsuariosPage() {
  const [role, setRole] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (!token) return
    fetch(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: Usuario | null) => setRole(data?.role ?? null))
      .catch(() => setRole(null))
  }, [])

  if (role !== null && role !== "admin") {
    return (
      <div className="py-10">
        <ForbiddenCard />
      </div>
    )
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold">Usuarios</h1>
        <p className="text-sm text-muted-foreground">
          Cuentas con acceso al sistema
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {usuariosDemo.map((u) => (
          <Card key={u.email}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base break-all">{u.email}</CardTitle>
              <CardDescription>Cuenta institucional</CardDescription>
            </CardHeader>
            <CardContent>
              <Badge variant="secondary">{ROLE_LABELS[u.role] ?? u.role}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
