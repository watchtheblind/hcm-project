"use client"

export default function GlobalError({
  reset,
}: {
  reset: () => void
}) {
  return (
    <html lang="es">
      <body className="flex min-h-svh flex-col items-center justify-center gap-4 p-6 text-center">
        <h1 className="text-2xl font-bold">Error interno del servidor</h1>
        <p className="max-w-md text-sm text-muted-foreground">
          No se pudo cargar la aplicación. Intenta recargar la página.
        </p>
        <button
          type="button"
          onClick={reset}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Recargar
        </button>
      </body>
    </html>
  )
}
