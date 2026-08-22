"use client"

import { HeartPulse } from "lucide-react"
import { useSession } from "@/lib/session"
import { APP_NAME } from "@/lib/constants"

export function AppBrand() {
  const { user } = useSession()

  return (
    <div className="flex items-center gap-2 px-2 py-1.5">
      <div className="bg-primary text-primary-foreground flex size-8 shrink-0 items-center justify-center rounded-lg">
        <HeartPulse className="size-4" />
      </div>
      <div className="grid flex-1 text-left leading-tight">
        <span className="truncate text-sm font-semibold">
          {user?.email.split("@")[0].toUpperCase() ?? "HCM"}
        </span>
        <span className="truncate text-xs text-muted-foreground">
          {APP_NAME}
        </span>
      </div>
    </div>
  )
}
