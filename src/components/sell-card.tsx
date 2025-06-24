import * as React from "react"
import { Button } from "@/components/ui/button"
import { ChevronDownIcon } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function SellCard() {
  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState<Date | undefined>(undefined)
  const [name, setName] = React.useState("")
  const [age, setAge] = React.useState<number | "">("")
  const [price, setPrice] = React.useState<number | "">("")
  const [route, setRoute] = React.useState("")
  const [time, setTime] = React.useState("")
  const [ferry, setFerry] = React.useState("")
  const [intermediary, setIntermediary] = React.useState("")
  const [business, setBusiness] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [notes, setNotes] = React.useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    const business = localStorage.getItem("easyferry-business") || ""
    const email = localStorage.getItem("easyferry-email") || ""
    e.preventDefault()

    const data = {
      business: business,
      name,
      age: age === "" ? 0 : age,
      price: price === "" ? 0 : price,
      route,
      time,
      ferry,
      intermediary,
      seller_email: email,
      date:date?.toISOString().split('T')[0],
      notes
    }
    console.log(data)
    try {
      const response = await fetch("https://easy-ferry.uc.r.appspot.com/sales", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Error en el envío de datos")
      }

      const result = await response.json()
      console.log("Venta registrada:", result)

      // Limpieza del formulario (opcional)
      setName("")
      setAge("")
      setPrice("")
      setRoute("")
      setTime("")
      setFerry("")
      setIntermediary("")
      setDate(undefined)
      setNotes("")
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="flex items-center justify-center overflow-hidden">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle>Ingresa una nueva venta</CardTitle>
          <CardDescription>Proporciona los datos requeridos</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              {/* Fila 1 */}
              <div className="flex gap-4">
                <div className="flex-1 grid gap-2">
                  <Label htmlFor="name">Nombre</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="flex-1 grid gap-2">
                  <Label htmlFor="date">Fecha</Label>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        id="date"
                        className="w-full justify-between font-normal"
                      >
                        {date ? date.toLocaleDateString() : "Selecciona una fecha"}
                        <ChevronDownIcon className="ml-2 h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto overflow-hidden p-0 z-50 absolute" align="center">
                      <Calendar
                        mode="single"
                        selected={date}
                        captionLayout="dropdown"
                        onSelect={(date) => {
                          setDate(date)
                          setOpen(false)
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex-1 grid gap-2">
                  <Label htmlFor="age">Edad</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="Edad"
                    value={age}
                    onChange={(e) => setAge(e.target.value === "" ? "" : Number(e.target.value))}
                  />
                </div>
              </div>

              {/* Fila 2 */}
              <div className="flex gap-4">
                <div className="flex-1 grid gap-2">
                  <Label htmlFor="route">Ruta</Label>
                  <Select value={route} onValueChange={setRoute}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona una ruta" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Roles</SelectLabel>
                        <SelectItem value="SC-SX">SC-SX</SelectItem>
                        <SelectItem value="SX-SC">SX-SC</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1 grid gap-2">
                  <Label htmlFor="time">Hora</Label>
                  <Select value={time} onValueChange={setTime}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona un horario" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Horarios</SelectLabel>
                        <SelectItem value="7">7 AM</SelectItem>
                        <SelectItem value="15">3 PM</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1 grid gap-2">
                  <Label htmlFor="price">Precio ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="Precio"
                    value={price}
                    onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))}
                  />
                </div>
              </div>

              {/* Fila 3 */}
              <div className="flex gap-4">
                <div className="flex-1 grid gap-2">
                  <Label htmlFor="ferry">Lancha</Label>
                  <Select value={ferry} onValueChange={setFerry}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona una lancha" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Lanchas</SelectLabel>
                        <SelectItem value="Gaviota">Gaviota</SelectItem>
                        <SelectItem value="Arrecife">Arrecife</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1 grid gap-2">
                  <Label htmlFor="intermediary">Referencia</Label>
                  <Input
                    id="intermediary"
                    type="text"
                    placeholder="Opcional"
                    value={intermediary}
                    onChange={(e) => setIntermediary(e.target.value)}
                  />
                </div>
                <div className="flex-1 grid gap-2">
                  <Label htmlFor="notes">Notas</Label>
                  <Input
                    id="notes"
                    type="text"
                    placeholder="Notas adicionales"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <CardFooter className="flex-col gap-2 mt-6">
              <Button type="submit" className="w-full">
                Agregar
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
