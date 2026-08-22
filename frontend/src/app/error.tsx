"use client"

import { AlertTriangle } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-6 text-center">
      <div className="bg-destructive/10 text-destructive flex size-14 items-center justify-center rounded-full">
        <AlertTriangle className="size-7" />
      </div>
      <h1 className="text-2xl font-bold">Algo salió mal</h1>
      <p className="max-w-md text-sm text-muted-foreground">
        Ocurrió un error inesperado al cargar esta página.
        {error.digest ? ` (Ref: ${error.digest})` : ""}
      </p>
      <Button onClick={reset}>Reintentar</Button>
    </div>
  )
}
