"use client"

import { LogOut } from "lucide-react"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { SessionProvider, useSession } from "@/lib/session"

function Header() {
  const { status, logout } = useSession()

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-1 data-[orientation=vertical]:h-4" />
      <span className="text-sm font-medium">Panel de control</span>
      <div className="ml-auto flex items-center gap-2">
        {status === "loading" && (
          <span className="text-xs text-muted-foreground">Verificando sesión…</span>
        )}
        {status === "authenticated" && (
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            aria-label="Cerrar sesión"
          >
            <LogOut />
            Cerrar sesión
          </Button>
        )}
      </div>
    </header>
  )
}

// Shell cliente del dashboard: valida la sesión contra /auth/me una vez y
// provee el contexto a sidebar/páginas. El borde duro lo pone proxy.ts.
export function DashboardShell({ children }: React.PropsWithChildren) {
  return (
    <SessionProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <Header />
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </SessionProvider>
  )
}
