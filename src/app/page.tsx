"use client"
import { LoginForm } from "@/components/login-form";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    const checkTokenAndRedirect = async () => {
      try {
        const token = localStorage.getItem("easyferry-token");
        if (!token) return; // Si no hay token, continuar con el login

        const response = await fetch('https://easy-ferry.uc.r.appspot.com/refresh', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token })
        });

        if (response.ok) {
          const data = await response.json();
          // Si el backend devuelve un nuevo token, lo guardamos
          if (data.token) {
            localStorage.setItem("easyferry-token", data.token);
          }
          // Redirigir al dashboard si el token es válido
          router.push('/dashboard');
        } else {
          // Si la respuesta no es OK, limpiamos el localStorage
          localStorage.removeItem("easyferry-token");
          localStorage.removeItem("easyferry-business");
          // Y permanecemos en la página de login
        }
      } catch (error) {
        console.error("Error verificando token:", error);
        // En caso de error, limpiamos el localStorage
        localStorage.removeItem("easyferry-token");
        localStorage.removeItem("easyferry-business");
      }
    };

    checkTokenAndRedirect();
  }, [router]);

  return (
    <div className="bg-muted min-h-svh w-full flex items-center justify-center">
      <LoginForm />
    </div>
  );
}