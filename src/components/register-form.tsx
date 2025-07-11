"use client"
import * as React from "react"
import { Ship, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface RegisterFormProps extends React.ComponentProps<"div"> {
  token: string
}

export function RegisterForm({
  className,
  token,
  ...props
}: RegisterFormProps) {
  const router = useRouter()
  const [firstName, setFirstName] = React.useState("")
  const [lastName, setLastName] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [business, setBusiness] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [isFetchingEmail, setIsFetchingEmail] = React.useState(false)

  // Obtener el email asociado al token cuando el componente se monta
  React.useEffect(() => {
    const fetchEmail = async () => {
      setIsFetchingEmail(true)
      try {
        const response = await fetch(`https://easy-ferry.uc.r.appspot.com/get-token-mail?token=${token}`)
        
        if (!response.ok) {
          throw new Error("Error al obtener el email asociado al token")
        }

        const data = await response.json()
        setEmail(data.email)
      } catch (error) {
        console.error("Error al obtener email:", error)
        toast.error("Error", {
          description: "No se pudo obtener el email asociado al token de registro",
        })
      } finally {
        setIsFetchingEmail(false)
      }
    }

    fetchEmail()
  }, [token])

  const markTokenAsUsed = async () => {
    try {
      const response = await fetch("https://easy-ferry.uc.r.appspot.com/use-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ token }),
      })

      if (!response.ok) {
        throw new Error("Error al marcar el token como usado")
      }

      console.log("Token marcado como usado exitosamente")
    } catch (error) {
      console.error("Error al marcar token:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      toast.error("Error", {
        description: "No se pudo obtener el email asociado al token",
      })
      return
    }

    setIsLoading(true)

    const payload = {
      first_name: firstName,
      last_name: lastName,
      email, // Añadimos el email al payload
      password,
      business_id: parseInt(business, 10),
      token
    }

    try {
      const response = await fetch("https://easy-ferry.uc.r.appspot.com/register", {
        method: "POST",
        headers: {
          "Content-Type": "text/plain",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error("Error al registrar usuario")
      }

      const result = await response.json()
      console.log("Registro exitoso:", result)

      // Marcar el token como usado
      await markTokenAsUsed()

      // Mostrar toast de éxito
      toast.success("Registro exitoso", {
        description: "Tu cuenta ha sido creada correctamente",
        duration: 2000,
      })

      // Limpiar formulario
      setFirstName("")
      setLastName("")
      setPassword("")
      setBusiness("")

      // Redirigir después de 2 segundos
      setTimeout(() => {
        router.push("https://easy-ferry.vercel.app/login")
      }, 2000)

    } catch (error) {
      console.error("Error:", error)
      toast.error("Error en el registro", {
        description: "Hubo un problema al crear tu cuenta. Inténtalo nuevamente.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <a
              href="#"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-8 items-center justify-center rounded-md">
                <Ship className="size-6" />
              </div>
              <span className="sr-only">Easy Ferry</span>
            </a>
            <h1 className="text-xl font-bold">Bienvenido a Easy Ferry</h1>
            <div className="text-center text-sm">
              No tienes una cuenta, ¡regístrate!
            </div>
            {isFetchingEmail && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Cargando información del token...
              </div>
            )}
            {email && (
              <div className="text-sm">
                Registrando: <span className="font-medium">{email}</span>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-6">
            <div className="grid gap-3">
              <Label htmlFor="first_name">Nombre</Label>
              <Input
                id="first_name"
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <Label htmlFor="last_name">Apellido</Label>
              <Input
                id="last_name"
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Label htmlFor="business">Empresa</Label>
              <Select value={business} onValueChange={setBusiness}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona una empresa" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Empresa</SelectLabel>
                    <SelectItem value="1">Gaviota</SelectItem>
                    <SelectItem value="2">Viamar</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || isFetchingEmail || !email}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registrando...
                </>
              ) : (
                "Registrarse"
              )}
            </Button>
          </div>
        </div>
      </form>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        Al hacer clic en continuar, aceptas nuestros{" "}
        <a href="#">Términos de Servicio</a> y{" "}
        <a href="#">Política de Privacidad</a>.
      </div>
    </div>
  )
}