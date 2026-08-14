import { useState } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { API_URL, TOKEN_KEY } from "@/lib/constants"

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      setLoading(false)
      return
    }

    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role: "nurse" }),
      })

      if (!res.ok) {
        setError("No se pudo crear la cuenta")
        return
      }

      const data = await res.json()
      localStorage.setItem(TOKEN_KEY, data.token)
      document.cookie = `${TOKEN_KEY}=${data.token}; path=/`
      router.replace("/dashboard")
    } catch {
      setError("Error de conexión con el servidor")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Crea tu cuenta</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Completa el formulario para crear tu cuenta
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="name">Nombre completo</FieldLabel>
          <Input
            id="name"
            type="text"
            placeholder="Juan Pérez"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-background"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="email">Correo</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-background"
          />
          <FieldDescription>
            Lo usaremos para contactarte. No compartiremos tu correo con nadie.
          </FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="password">Contraseña</FieldLabel>
          <Input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-background"
          />
          <FieldDescription>
            Debe tener al menos 8 caracteres.
          </FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="confirm-password">Confirmar contraseña</FieldLabel>
          <Input
            id="confirm-password"
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="bg-background"
          />
          <FieldDescription>Por favor confirma tu contraseña.</FieldDescription>
        </Field>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Field>
          <Button type="submit" disabled={loading}>
            {loading ? "Creando cuenta…" : "Crear cuenta"}
          </Button>
        </Field>
        <Field>
          <FieldDescription className="px-6 text-center">
            ¿Ya tienes una cuenta?{" "}
            <Link href="/login" className="underline underline-offset-4">
              Inicia sesión
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
