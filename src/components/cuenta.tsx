"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function Cuenta() {
  const [nombre, setNombre] = useState("")
  const [cedula, setCedula] = useState("")
  const [responsable, setResponsable] = useState("")
  const [correo, setCorreo] = useState("")

  const guardarPrimeraCard = () => {
    console.log("Nombre:", nombre)
    console.log("Cédula:", cedula)
  }

  const guardarSegundaCard = () => {
    console.log("Responsable:", responsable)
    console.log("Correo:", correo)
  }

  return (
    <div className="flex flex-wrap justify-center gap-6 p-6">
      {/* Primera Card */}
      <Card className="w-full md:w-[350px]">
        <CardHeader>
          <CardTitle>Datos Personales</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div>
            <Label htmlFor="nombre">Nombre</Label>
            <Input
              id="nombre"
              placeholder="Ingresa tu nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="cedula">Cédula</Label>
            <Input
              id="cedula"
              placeholder="1234567890"
              value={cedula}
              onChange={(e) => setCedula(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={guardarPrimeraCard}>Guardar</Button>
        </CardFooter>
      </Card>

      {/* Segunda Card */}
      <Card className="w-full md:w-[350px]">
        <CardHeader>
          <CardTitle>Responsable</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div>
            <Label htmlFor="responsable">Responsable</Label>
            <Input
              id="responsable"
              placeholder="Nombre del responsable"
              value={responsable}
              onChange={(e) => setResponsable(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="correo">Correo</Label>
            <Input
              id="correo"
              type="email"
              placeholder="correo@ejemplo.com"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={guardarSegundaCard}>Guardar</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
