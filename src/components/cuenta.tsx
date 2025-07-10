"use client"

import { useState, useEffect } from "react"
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
import { toast } from "sonner"

export function Cuenta() {
  const [name, setName] = useState("")
  const [ruc, setRuc] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [crewCapacity, setCrewCapacity] = useState("")
  const [passengerCapacity, setPassengerCapacity] = useState("")
  const [responsibleName, setResponsibleName] = useState("")
  const [responsiblePassport, setResponsiblePassport] = useState("")
  const [responsiblePhone, setResponsiblePhone] = useState("")
  const [responsibleEmail, setResponsibleEmail] = useState("")
  const [captainName, setCaptainName] = useState("")
  const [captainPassport, setCaptainPassport] = useState("")
  const [sailor1Name, setSailor1Name] = useState("")
  const [sailor1Passport, setSailor1Passport] = useState("")
  const [sailor2Name, setSailor2Name] = useState("")
  const [sailor2Passport, setSailor2Passport] = useState("")
  const [ferryRegistration, setFerryRegistration] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSavingOwner, setIsSavingOwner] = useState(false)
  const [isSavingCrew, setIsSavingCrew] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [business, setBusiness] = useState<string | null>(null)

  // Get business from localStorage and fetch owner data
  useEffect(() => {
    const fetchData = async () => {
      const storedBusiness = localStorage.getItem("easyferry-business")
      if (!storedBusiness) {
        setError("No se encontró el negocio en localStorage")
        toast.error("Error de configuración", {
          description: "No se encontró el negocio en localStorage",
        })
        return
      }
      
      setBusiness(storedBusiness)
      setIsLoading(true)
      setError(null)
      
      try {
        const [ownerResponse, crewResponse] = await Promise.all([
          fetch(`https://easy-ferry.uc.r.appspot.com/get-owner?business=${encodeURIComponent(storedBusiness)}`),
          fetch(`https://easy-ferry.uc.r.appspot.com/get-crew?business=${encodeURIComponent(storedBusiness)}`, {
            headers: {
              'Content-Type': 'text/plain',
            }
          })
        ])
        
        if (!ownerResponse.ok) {
          throw new Error('Error al obtener los datos del propietario')
        }
        if (!crewResponse.ok) {
          throw new Error('Error al obtener los datos de la tripulación')
        }

        const [ownerData, crewData] = await Promise.all([
          ownerResponse.json(),
          crewResponse.json()
        ])
        
        // Update all form fields with API data
        setName(ownerData.name || "")
        setRuc(ownerData.ruc || "")
        setPhone(ownerData.phone || "")
        setEmail(ownerData.email || "")
        setCrewCapacity(crewData.crew_capacity || "")
        setPassengerCapacity(crewData.passenger_capacity || "")
        setResponsibleName(crewData.responsible_name || "")
        setResponsiblePassport(crewData.responsible_passport || "")
        setResponsiblePhone(crewData.responsible_phone || "")
        setResponsibleEmail(crewData.responsible_email || "")
        setCaptainName(crewData.captain_name || "")
        setCaptainPassport(crewData.captain_passport || "")
        setSailor1Name(crewData.sailor1_name || "")
        setSailor1Passport(crewData.sailor1_passport || "")
        setSailor2Name(crewData.sailor2_name || "")
        setSailor2Passport(crewData.sailor2_passport || "")
        setFerryRegistration(crewData.ferry_registration || "")
        
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
        toast.error("Error al cargar datos", {
          description: `No se pudieron cargar los datos: ${errorMessage}`,
        })
        setError(errorMessage)
        console.error('Error:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const guardarPrimeraCard = async () => {
    if (!business) {
      toast.error("Error de negocio", {
        description: "No se ha identificado el negocio",
      })
      return
    }

    setIsSavingOwner(true)
    setError(null)
    
    try {
      const response = await fetch('https://easy-ferry.uc.r.appspot.com/update-owner', {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: JSON.stringify({
          business: business,
          name,
          ruc,
          phone,
          email
        })
      })

      if (!response.ok) {
        throw new Error('Error al guardar los datos del propietario')
      }

      const data = await response.json()
      toast.success("Datos personales actualizados", {
        description: "La información personal se guardó correctamente",
      })
      console.log('Datos del propietario guardados:', data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      toast.error("Error al guardar", {
        description: `No se pudieron guardar los datos personales: ${errorMessage}`,
      })
      setError(errorMessage)
      console.error('Error:', err)
    } finally {
      setIsSavingOwner(false)
    }
  }

  const guardarSegundaCard = async () => {
    if (!business) {
      toast.error("Error de negocio", {
        description: "No se ha identificado el negocio",
      })
      return
    }

    setIsSavingCrew(true)
    setError(null)
    
    try {
      const response = await fetch('https://easy-ferry.uc.r.appspot.com/update-crew', {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: JSON.stringify({
          business: business,
          crew_capacity: crewCapacity,
          passenger_capacity: passengerCapacity,
          responsible_name: responsibleName,
          responsible_passport: responsiblePassport,
          responsible_phone: responsiblePhone,
          responsible_email: responsibleEmail,
          captain_name: captainName,
          captain_passport: captainPassport,
          sailor1_name: sailor1Name,
          sailor1_passport: sailor1Passport,
          sailor2_name: sailor2Name,
          sailor2_passport: sailor2Passport,
          ferry_registration: ferryRegistration
        })
      })

      if (!response.ok) {
        throw new Error('Error al guardar los datos del barco')
      }

      const data = await response.json()
      toast.success("Datos del barco actualizados", {
        description: "La información de la embarcación se guardó correctamente",
      })
      console.log('Datos del barco guardados:', data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      toast.error("Error al guardar", {
        description: `No se pudieron guardar los datos del barco: ${errorMessage}`,
      })
      setError(errorMessage)
      console.error('Error:', err)
    } finally {
      setIsSavingCrew(false)
    }
  }

  return (
    <div className="flex flex-wrap justify-center gap-6 p-6">
      {/* Primera Card */}
      <Card className="w-full md:w-[300px]">
        <CardHeader>
          <CardTitle>Datos Personales</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-40">
              <p>Cargando datos personales...</p>
            </div>
          ) : (
            <>
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Ingresa tu nombre"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="ruc">RUC</Label>
                <Input
                  id="ruc"
                  placeholder="Ingresa tu RUC"
                  value={ruc}
                  onChange={(e) => setRuc(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  placeholder="+1 555-987-6543"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button onClick={guardarPrimeraCard} disabled={isLoading || isSavingOwner}>
            {isSavingOwner ? "Guardando..." : "Guardar"}
          </Button>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </CardFooter>
      </Card>

      {/* Segunda Card */}
      <Card className="w-full md:w-[500px]">
        <CardHeader>
          <CardTitle>Información del Barco</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-40 col-span-2">
              <p>Cargando información del barco...</p>
            </div>
          ) : (
            <>
              <div className="grid gap-2">
                <Label htmlFor="crewCapacity">Capacidad de Tripulación</Label>
                <Input
                  id="crewCapacity"
                  type="number"
                  placeholder="0"
                  value={crewCapacity}
                  onChange={(e) => setCrewCapacity(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="passengerCapacity">Capacidad de Pasajeros</Label>
                <Input
                  id="passengerCapacity"
                  type="number"
                  placeholder="55"
                  value={passengerCapacity}
                  onChange={(e) => setPassengerCapacity(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="ferryRegistration">Matrícula del Ferry</Label>
                <Input
                  id="ferryRegistration"
                  placeholder="NGSD-23"
                  value={ferryRegistration}
                  onChange={(e) => setFerryRegistration(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="responsibleName">Nombre del Responsable</Label>
                <Input
                  id="responsibleName"
                  placeholder="Nombre del responsable"
                  value={responsibleName}
                  onChange={(e) => setResponsibleName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="responsiblePassport">Pasaporte del Responsable</Label>
                <Input
                  id="responsiblePassport"
                  placeholder="Número de pasaporte"
                  value={responsiblePassport}
                  onChange={(e) => setResponsiblePassport(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="responsiblePhone">Teléfono del Responsable</Label>
                <Input
                  id="responsiblePhone"
                  placeholder="+18005559876"
                  value={responsiblePhone}
                  onChange={(e) => setResponsiblePhone(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="responsibleEmail">Email del Responsable</Label>
                <Input
                  id="responsibleEmail"
                  type="email"
                  placeholder="mario@gmail.com"
                  value={responsibleEmail}
                  onChange={(e) => setResponsibleEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="captainName">Nombre del Capitán</Label>
                <Input
                  id="captainName"
                  placeholder="New Captain Name"
                  value={captainName}
                  onChange={(e) => setCaptainName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="captainPassport">Pasaporte del Capitán</Label>
                <Input
                  id="captainPassport"
                  placeholder="04324324320"
                  value={captainPassport}
                  onChange={(e) => setCaptainPassport(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="sailor1Name">Nombre del Marinero 1</Label>
                <Input
                  id="sailor1Name"
                  placeholder="Nombre del marinero"
                  value={sailor1Name}
                  onChange={(e) => setSailor1Name(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="sailor1Passport">Pasaporte del Marinero 1</Label>
                <Input
                  id="sailor1Passport"
                  placeholder="Número de pasaporte"
                  value={sailor1Passport}
                  onChange={(e) => setSailor1Passport(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="sailor2Name">Nombre del Marinero 2</Label>
                <Input
                  id="sailor2Name"
                  placeholder="Nombre del marinero"
                  value={sailor2Name}
                  onChange={(e) => setSailor2Name(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="sailor2Passport">Pasaporte del Marinero 2</Label>
                <Input
                  id="sailor2Passport"
                  placeholder="Número de pasaporte"
                  value={sailor2Passport}
                  onChange={(e) => setSailor2Passport(e.target.value)}
                />
              </div>
            </>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={guardarSegundaCard} disabled={isLoading || isSavingCrew}>
            {isSavingCrew ? "Guardando..." : "Guardar"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}