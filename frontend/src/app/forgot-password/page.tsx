"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, MailCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

// Recuperación de contraseña (demo): el backend aún no expone este flujo.
export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)
  const [email, setEmail] = useState("")

  if (sent) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center p-6">
        <Card className="w-full max-w-sm text-center">
          <CardContent className="flex flex-col items-center gap-3 pt-6">
            <MailCheck className="text-primary size-10" />
            <p className="text-sm">
              Si <span className="font-medium">{email}</span> está registrado,
              recibirás instrucciones para restablecer tu contraseña.
            </p>
            <Button
              variant="outline"
              size="sm"
              render={<Link href="/login" />}
            >
              <ArrowLeft /> Volver a iniciar sesión
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Recuperar contraseña</CardTitle>
          <CardDescription>
            Ingresa tu correo y te enviaremos instrucciones
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault()
              setSent(true)
            }}
          >
            <Field>
              <FieldLabel htmlFor="email">Correo</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <FieldDescription>
                Usarás este correo para restablecer tu contraseña.
              </FieldDescription>
            </Field>
            <Button type="submit">Enviar instrucciones</Button>
            <Button variant="ghost" size="sm" render={<Link href="/login" />}>
              <ArrowLeft /> Volver a iniciar sesión
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
