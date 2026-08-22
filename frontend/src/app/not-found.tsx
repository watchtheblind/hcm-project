import Link from "next/link"
import { FileQuestion } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-6 text-center">
      <div className="bg-muted text-muted-foreground flex size-14 items-center justify-center rounded-full">
        <FileQuestion className="size-7" />
      </div>
      <h1 className="text-2xl font-bold">Página no encontrada</h1>
      <p className="max-w-md text-sm text-muted-foreground">
        Lo sentimos, la página que buscas no existe o fue movida a otra
        dirección.
      </p>
      <Button render={<Link href="/" />}>Volver al inicio</Button>
    </div>
  )
}
