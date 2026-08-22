"use client"

import { useSession } from "@/lib/session"
import { Badge } from "@/components/ui/badge"
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

export default function PerfilPage() {
  const { user, status } = useSession()

  return (
    <div className="mx-auto w-full max-w-xl">
      <Card>
        <CardHeader>
          <CardTitle>Perfil</CardTitle>
          <CardDescription>Información de tu cuenta</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 text-sm">
          {status === "loading" || !user ? (
            <p className="text-muted-foreground">Cargando…</p>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Correo</span>
                <span className="font-medium">{user.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Rol</span>
                <Badge variant="secondary">
                  {ROLE_LABELS[user.role] ?? user.role}
                </Badge>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
