"use client"

import { useSession } from "@/lib/session"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const ROLE_LABELS: Record<string, string> = {
  admin: "Administrativo",
  cirujano: "Cirujano",
  residente: "Residente",
  enfermeria: "Enfermería",
}

export default function DashboardOverviewPage() {
  const { user, status } = useSession()

  return (
    <div className="mx-auto w-full max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Bienvenido al panel</CardTitle>
          <CardDescription>
            Hospital Central de Maracay — sistema de gestión hospitalaria
          </CardDescription>
        </CardHeader>
        <CardContent>
          {status === "loading" || !user ? (
            <p className="text-sm text-muted-foreground">Verificando sesión…</p>
          ) : (
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="font-medium">{user.email}</span>
              <Badge variant="secondary">
                {ROLE_LABELS[user.role] ?? user.role}
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
