import * as React from "react";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { boatNames } from "@/constants/embarcaciones";

export function SellCard({
  initialData,
  isEdit = false,
  onSuccess,
}: {
  initialData?: any;
  isEdit?: boolean;
  onSuccess?: () => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(
    initialData?.date ? new Date(initialData.date) : undefined
  );
  const [name, setName] = React.useState(initialData?.name ?? "");
  const [age, setAge] = React.useState<number | "">(initialData?.age ?? "");
  const [price, setPrice] = React.useState<number | "">(initialData?.price ?? "");
  const [route, setRoute] = React.useState(initialData?.route ?? "");
  const [time, setTime] = React.useState(initialData?.time ?? "");
  const [ferry, setFerry] = React.useState(initialData?.ferry ?? "");
  const [intermediary, setIntermediary] = React.useState(initialData?.intermediary ?? "");
  const [notes, setNotes] = React.useState(initialData?.notes ?? "");
  const [passport, setPassport] = React.useState(initialData?.passport ?? "");
  const [phone, setPhone] = React.useState(initialData?.phone ?? "");
  const [status, setStatus] = React.useState(initialData?.status ?? "");
  const [payed, setPayed] = React.useState<boolean>(
    typeof initialData?.payed === "string" 
      ? initialData.payed === "Si" 
      : initialData?.payed ?? true
  );
  console.log(initialData);
  const [payment, setPayment] = React.useState(initialData?.payment ?? "efectivo");
  const [isLoading, setIsLoading] = React.useState(false);

  const isFormValid =
    name.trim() !== "" &&
    date !== undefined &&
    route !== "" &&
    time !== "" &&
    price !== "" &&
    ferry !== "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const business = localStorage.getItem("easyferry-business") || "";
    const email = localStorage.getItem("easyferry-email") || "";

    const data = {
      ...(isEdit && initialData?.id && { id: initialData.id }),
      business: business,
      name,
      age: age === "" ? 0 : age,
      price: price === "" ? 0 : price,
      route,
      time,
      ferry,
      intermediary,
      seller_email: email,
      date: date?.toISOString().split("T")[0],
      notes,
      passport,
      phone,
      status,
      payed: Boolean(payed), // Aseguramos que sea booleano
      payment,
    };

    try {
      const response = await fetch("https://easy-ferry.uc.r.appspot.com/sales", {
        method: isEdit ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success(`Reserva ${isEdit ? "actualizada" : "agregada"} con éxito`, {
          description: `La reserva ha sido ${isEdit ? "actualizada" : "registrada"} correctamente.`,
        });
        if (onSuccess) {
          onSuccess();
        }
        if (!isEdit) {
          setName("");
          setAge("");
          setPrice("");
          setRoute("");
          setTime("");
          setFerry("");
          setIntermediary("");
          setDate(undefined);
          setNotes("");
          setPassport("");
          setPhone("");
          setStatus("");
          setPayed(true);
          setPayment("efectivo");
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || "Ocurrió un error al procesar la reserva.";
        toast.error(`Error al ${isEdit ? "actualizar" : "crear"} la reserva`, {
          description: `Código ${response.status}: ${errorMessage}`,
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("Error de conexión", {
        description: `No se pudo ${isEdit ? "actualizar" : "crear"} la reserva por problemas de conexión.`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center overflow-hidden">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle>{isEdit ? "" : "Nueva venta"}</CardTitle>
          <CardDescription>
            {isEdit ? "Modifica los datos necesarios" : "Completa todos los campos requeridos"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              {/* Fila 1 */}
              <div className="flex gap-4">
                <div className="flex-1 grid gap-2">
                  <Label htmlFor="name">Nombre completo*</Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="flex-1 grid gap-2">
                  <Label htmlFor="date">Fecha de viaje*</Label>
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
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(date) => {
                          setDate(date);
                          setOpen(false);
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex-1 grid gap-2">
                  <Label htmlFor="age">Edad</Label>
                  <Input
                    id="age"
                    type="number"
                    value={age}
                    onChange={(e) =>
                      setAge(e.target.value === "" ? "" : Number(e.target.value))
                    }
                    min="0"
                  />
                </div>
              </div>

              {/* Fila 2 */}
              <div className="flex gap-4">
                <div className="flex-1 grid gap-2">
                  <Label htmlFor="route">Ruta*</Label>
                  <Select value={route} onValueChange={setRoute} required>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona una ruta" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Rutas disponibles</SelectLabel>
                        <SelectItem value="SC-SX">San Cristóbal → Santa Cruz</SelectItem>
                        <SelectItem value="SX-SC">Santa Cruz → San Cristóbal</SelectItem>
                        <SelectItem value="SX-IB">Santa Cruz → Isabela</SelectItem>
                        <SelectItem value="IB-SX">Isabela → Santa Cruz</SelectItem>
                        <SelectItem value="SX-FL">Santa Cruz → Floreana</SelectItem>
                        <SelectItem value="FL-SX">Floreana → Santa Cruz</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1 grid gap-2">
                  <Label htmlFor="time">Horario*</Label>
                  <Select value={time} onValueChange={setTime} required>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona un horario" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Horarios</SelectLabel>
                        <SelectItem value="am">Mañana (am)</SelectItem>
                        <SelectItem value="pm">Tarde (pm)</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1 grid gap-2">
                  <Label htmlFor="price">Precio ($)*</Label>
                  <Input
                    id="price"
                    type="number"
                    value={price}
                    onChange={(e) =>
                      setPrice(e.target.value === "" ? "" : Number(e.target.value))
                    }
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              {/* Fila 3 */}
              <div className="flex gap-4">
                <div className="flex-1 grid gap-2">
                  <Label htmlFor="ferry">Lancha*</Label>
                  <Select value={ferry} onValueChange={setFerry} required>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona una lancha" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Embarcaciones</SelectLabel>
                        <SelectLabel>Embarcaciones</SelectLabel>
                        {boatNames.map((boat) => (
                          <SelectItem key={boat} value={boat}>
                            {boat}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1 grid gap-2">
                  <Label htmlFor="intermediary">Referencia/Intermediario</Label>
                  <Input
                    id="intermediary"
                    type="text"
                    value={intermediary}
                    onChange={(e) => setIntermediary(e.target.value)}
                  />
                </div>
                <div className="flex-1 grid gap-2">
                  <Label htmlFor="notes">Notas adicionales</Label>
                  <Input
                    id="notes"
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>

              {/* Fila 4 */}
              <div className="flex gap-4">
                <div className="flex-1 grid gap-2">
                  <Label htmlFor="passport">Pasaporte/ID</Label>
                  <Input
                    id="passport"
                    type="text"
                    value={passport}
                    onChange={(e) => setPassport(e.target.value)}
                  />
                </div>
                <div className="flex-1 grid gap-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className="flex-1 grid gap-2">
                  <Label htmlFor="status">Tipo de pasajero</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona un tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Categorías</SelectLabel>
                        <SelectItem value="residente">Residente</SelectItem>
                        <SelectItem value="turista">Turista</SelectItem>
                        <SelectItem value="transeunte">Transeunte</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Fila 5 - Campos de pago */}
              <div className="flex gap-4">
                <div className="flex-1 grid gap-2">
                  <Label htmlFor="payed">¿Pagado?</Label>
                  <Select
                    value={payed.toString()}
                    onValueChange={(value) => setPayed(value === "true")}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona una opción">
                        {payed ? "Sí" : "No"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Estado de pago</SelectLabel>
                        <SelectItem value="true">Sí</SelectItem>
                        <SelectItem value="false">No</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1 grid gap-2">
                  <Label htmlFor="payment">Método de pago</Label>
                  <Select value={payment} onValueChange={setPayment}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona un método" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Métodos de pago</SelectLabel>
                        <SelectItem value="efectivo">Efectivo</SelectItem>
                        <SelectItem value="transferencia">Transferencia</SelectItem>
                        <SelectItem value="tarjeta">Tarjeta</SelectItem>
                        <SelectItem value="otro">Otro</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1 grid gap-2">
                  {/* Espacio vacío para mantener el diseño */}
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isLoading || !isFormValid}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Procesando...
                  </>
                ) : isEdit ? (
                  "Guardar cambios"
                ) : (
                  "Registrar venta"
                )}
              </Button>
              {!isFormValid && !isLoading && (
                <p className="mt-2 text-sm text-muted-foreground text-center">
                  * Completa todos los campos obligatorios
                </p>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}