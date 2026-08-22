import { ShieldX } from "lucide-react"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Tarjeta 403 reutilizable: se muestra cuando un rol sin permisos abre una
// ruta restringida (p.ej. no-admin en /pacientes).
export function ForbiddenCard() {
  return (
    <Card className="mx-auto max-w-md">
      <CardHeader className="items-center text-center">
        <div className="bg-destructive/10 text-destructive mx-auto flex size-12 items-center justify-center rounded-full">
          <ShieldX className="size-6" />
        </div>
        <CardTitle>Acceso denegado</CardTitle>
        <CardDescription>
          No tienes permisos para ver esta sección. Consulta con el
          administrador del sistema si crees que es un error.
        </CardDescription>
      </CardHeader>
    </Card>
  )
}
