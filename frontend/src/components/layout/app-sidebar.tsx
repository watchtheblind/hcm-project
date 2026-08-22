"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BedDouble,
  LayoutDashboard,
  Settings,
  UsersRound,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { AppBrand } from "@/components/layout/app-brand"
import { NavUser } from "@/components/layout/nav-user"
import { useSession } from "@/lib/session"

type NavItem = {
  title: string
  url: string
  icon: React.ElementType
  roles?: string[] // ausente => visible para todos
}

const NAV_GROUPS: { label: string; items: NavItem[] }[] = [
  {
    label: "General",
    items: [
      { title: "Panel", url: "/dashboard", icon: LayoutDashboard },
      {
        title: "Pacientes",
        url: "/dashboard/pacientes",
        icon: BedDouble,
        roles: ["admin"],
      },
      {
        title: "Usuarios",
        url: "/dashboard/usuarios",
        icon: UsersRound,
        roles: ["admin"],
      },
    ],
  },
  {
    label: "Ajustes",
    items: [
      { title: "Perfil", url: "/dashboard/settings", icon: Settings },
      {
        title: "Apariencia",
        url: "/dashboard/settings/apariencia",
        icon: Settings,
      },
    ],
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { user, status } = useSession()

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <AppBrand />
      </SidebarHeader>
      <SidebarContent>
        {NAV_GROUPS.map((group) => {
          // Oculta ítems restringidos por rol; el grupo desaparece si queda vacío.
          const visible = group.items.filter(
            (item) => !item.roles || (user && item.roles.includes(user.role))
          )
          if (visible.length === 0) return null

          return (
            <SidebarGroup key={group.label}>
              <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {visible.map((item) => (
                    <SidebarMenuItem key={item.url}>
                      <SidebarMenuButton
                        render={<Link href={item.url} />}
                        isActive={pathname === item.url}
                        tooltip={item.title}
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )
        })}
      </SidebarContent>
      <SidebarFooter>{status === "authenticated" && <NavUser />}</SidebarFooter>
    </Sidebar>
  )
}
