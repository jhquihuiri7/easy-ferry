"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { useState } from "react"; 
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch("https://easy-ferry.uc.r.appspot.com/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
    
      const data = await response.json();
    
      if (!response.ok) {
        throw new Error(data.error || "Error al iniciar sesión");
      }
    
      // Guarda el token JWT en localStorage
      localStorage.setItem("easyferry-token", data.token);
      localStorage.setItem("easyferry-email", data.email);
      localStorage.setItem("easyferry-name", data.name);
      localStorage.setItem("easyferry-business", data.business);
    
      // Redirige al dashboard
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleLogin}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Bienvenido a Easy Ferry</h1>
                <p className="text-muted-foreground text-balance">
                  Ingresa para gestionar tu negocio
                </p>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="usuario@correo.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Contraseña</Label>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {error && (
                <div className="text-sm text-red-500">{error}</div>
              )}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="animate-spin" />}
                {isLoading ? "Porfavor espere" : "Ingresar"}
              </Button>
            </div>
          </form>
          <div className="bg-muted relative hidden md:block">
            <Image
              src="/login_bg.jpg"
              alt="Image"
              fill
              className="object-cover object-center dark:brightness-[0.2] dark:grayscale"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        © 2025 <a href="#">Logiciel Applab</a>. Todos los derechos reservados.
      </div>
    </div>
  )
}
