"use client"

import { useTheme } from "next-themes"
import { Monitor, Moon, Sun } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const OPTIONS = [
  { value: "light", label: "Claro", icon: Sun },
  { value: "dark", label: "Oscuro", icon: Moon },
  { value: "system", label: "Sistema", icon: Monitor },
] as const

export default function AparienciaPage() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="mx-auto w-full max-w-xl">
      <Card>
        <CardHeader>
          <CardTitle>Apariencia</CardTitle>
          <CardDescription>
            Personaliza cómo se ve el panel. Se guarda automáticamente.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-2">
          {OPTIONS.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => setTheme(value)}
              className={cn(
                "flex flex-1 flex-col items-center gap-1.5 rounded-lg border p-4 text-sm transition-colors",
                theme === value
                  ? "border-primary bg-primary/5 font-medium"
                  : "hover:bg-muted"
              )}
            >
              <Icon className="size-5" />
              {label}
            </button>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
