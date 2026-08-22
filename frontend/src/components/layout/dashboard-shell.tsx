"use client"

import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { SessionProvider, useSession } from "@/lib/session"

function Header() {
  const { status } = useSession()

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-1 data-[orientation=vertical]:h-4" />
      <span className="text-sm font-medium">Panel de control</span>
      {status === "loading" && (
        <span className="ml-auto text-xs text-muted-foreground">Verificando sesión…</span>
      )}
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
