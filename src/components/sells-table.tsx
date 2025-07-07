"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal, Loader2, Ticket, Edit } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format, addDays, subDays } from "date-fns"
import { es } from "date-fns/locale"
import { Label } from "@/components/ui/label"
import { SellCard } from "@/components/sell-card"

export type Sale = {
  id: number
  name: string
  age: number
  route: string
  time: string
  ferry: string
  intermediary: string
  date: string
  seller: string
  passport: string
  phone: string
  status: string,
  notes: string,
  payed: string,
  payment: string
}

export const columns = (refetch: () => void): ColumnDef<Sale>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="flex items-center gap-1 whitespace-nowrap">
        Nombre
        <ArrowUpDown className="h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="whitespace-nowrap">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "age",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="flex items-center gap-1 whitespace-nowrap">
        Edad
        <ArrowUpDown className="h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="text-right font-medium whitespace-nowrap">{row.getValue("age")}</div>,
  },
  {
    accessorKey: "route",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="flex items-center gap-1 whitespace-nowrap">
        Ruta
        <ArrowUpDown className="h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="whitespace-nowrap">{row.getValue("route")}</div>,
  },
  {
    accessorKey: "time",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="flex items-center gap-1 whitespace-nowrap">
        Horario
        <ArrowUpDown className="h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="whitespace-nowrap">{row.getValue("time")}</div>,
  },
  {
    accessorKey: "ferry",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="flex items-center gap-1 whitespace-nowrap">
        Ferry
        <ArrowUpDown className="h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="whitespace-nowrap">{row.getValue("ferry")}</div>,
  },
  {
    accessorKey: "intermediary",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="flex items-center gap-1 whitespace-nowrap">
        Intermediario
        <ArrowUpDown className="h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="whitespace-nowrap">{row.getValue("intermediary")}</div>,
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="flex items-center gap-1 whitespace-nowrap">
        Fecha
        <ArrowUpDown className="h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="whitespace-nowrap">{row.getValue("date")}</div>,
  },
  {
    accessorKey: "seller",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="flex items-center gap-1 whitespace-nowrap">
        Vendedor
        <ArrowUpDown className="h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="whitespace-nowrap">{row.getValue("seller")}</div>,
  },
  {
    accessorKey: "passport",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="flex items-center gap-1 whitespace-nowrap">
        Pasaporte
        <ArrowUpDown className="h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="whitespace-nowrap">{row.getValue("passport")}</div>,
  },
  {
    accessorKey: "phone",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="flex items-center gap-1 whitespace-nowrap">
        Teléfono
        <ArrowUpDown className="h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="whitespace-nowrap">{row.getValue("phone")}</div>,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="flex items-center gap-1 whitespace-nowrap">
        Estado
        <ArrowUpDown className="h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="whitespace-nowrap">{row.getValue("status")}</div>,
  },
  {
    accessorKey: "notes",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="flex items-center gap-1 whitespace-nowrap">
        Notas
        <ArrowUpDown className="h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="whitespace-nowrap">{row.getValue("notes")}</div>,
  },
  {
    accessorKey: "payed",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="flex items-center gap-1 whitespace-nowrap">
        Pagado
        <ArrowUpDown className="h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="whitespace-nowrap">{row.getValue("payed")}</div>,
  },
  {
    accessorKey: "payment",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="flex items-center gap-1 whitespace-nowrap">
        Método de pago
        <ArrowUpDown className="h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="whitespace-nowrap">{row.getValue("payment")}</div>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const sale = row.original
      const [isDialogOpen, setIsDialogOpen] = React.useState(false)

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent className="sm:max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Editar venta</DialogTitle>
                </DialogHeader>
                <SellCard 
                  initialData={sale} 
                  isEdit={true}
                  onSuccess={() => {
                    setIsDialogOpen(false)
                    refetch() // ✅ Refrescar la tabla
                  }}
                />
              </DialogContent>
            </Dialog>
            <DropdownMenuItem>
              <Ticket className="mr-2 h-4 w-4" />
              Ticket
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export function SellsTable() {
  const [data, setData] = React.useState<Sale[]>([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const [filterColumn, setFilterColumn] = React.useState("name")
  const [filterValue, setFilterValue] = React.useState("")
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({})
  const [deleting, setDeleting] = React.useState(false)

  const [startDate, setStartDate] = React.useState<Date | undefined>(subDays(new Date(), 5))
  const [endDate, setEndDate] = React.useState<Date | undefined>(addDays(new Date(), 5))
  const [startCalendarOpen, setStartCalendarOpen] = React.useState(false)
  const [endCalendarOpen, setEndCalendarOpen] = React.useState(false)

  const [reportDate, setReportDate] = React.useState<Date | undefined>(new Date())
  const [reportTime, setReportTime] = React.useState("7")
  const [generatingReport, setGeneratingReport] = React.useState(false)

  React.useEffect(() => {
    if (filterValue) {
      setColumnFilters([{ id: filterColumn, value: filterValue }])
    } else {
      setColumnFilters([])
    }
  }, [filterColumn, filterValue])

  const fetchSales = async () => {
    const business = localStorage.getItem("easyferry-business") || ""
    const fromDate = startDate ? format(startDate, "yyyy-MM-dd") : ""
    const toDate = endDate ? format(endDate, "yyyy-MM-dd") : ""

    setLoading(true)
    setError(null)
    try {
      const response = await fetch(
        `https://easy-ferry.uc.r.appspot.com/get-sales-ferry?business=${business}&start_date=${fromDate}&end_date=${toDate}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      )
      if (!response.ok) throw new Error(`Error: ${response.statusText}`)
      const result = await response.json()
      setData(result.data)
    } catch (err: any) {
      setError(err.message || "Error fetching sales data")
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    fetchSales()
  }, [])

  const handleDeleteSelected = async () => {
    const selectedIds = table.getSelectedRowModel().rows.map((row) => row.original.id)
    if (selectedIds.length === 0) return

    setDeleting(true)
    try {
      const response = await fetch("https://easy-ferry.uc.r.appspot.com/delete-sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds }),
      })

      if (!response.ok) throw new Error(`Error deleting sales: ${response.statusText}`)

      await response.json()
      setData((prev) => prev.filter((item) => !selectedIds.includes(item.id)))
      setRowSelection({})
    } catch (error: any) {
      alert("Hubo un error al eliminar los registros.")
    } finally {
      setDeleting(false)
    }
  }

  const handleGenerateReport = async () => {
    if (!reportDate) {
      alert("Por favor selecciona una fecha para el reporte");
      return;
    }

    const business = localStorage.getItem("easyferry-business") || "";
    const formattedDate = format(reportDate, "yyyy-MM-dd");

    setGeneratingReport(true);
    try {
      const response = await fetch("https://easy-ferry.uc.r.appspot.com/marine-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          business: business,
          time: reportTime,
          date: formattedDate
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;

      const contentDisposition = response.headers.get('Content-Disposition');
      let fileName = 'reporte.xlsx';
      console.log(  )
      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename\*?=['"]?(?:UTF-\d['"]*)?([^;\r\n"']*)['"]?;?/i);
        if (fileNameMatch && fileNameMatch[1]) {
          fileName = fileNameMatch[1]
            .replace(/^["']|["']$/g, '')
            .trim()
            .replace(/_$/, ''); 
        } else {
          // Si no se puede extraer el nombre del archivo del Content-Disposition
          throw new Error("No se pudo determinar el nombre del archivo desde el servidor");
        }
      } else {
        // Si no hay header Content-Disposition
        throw new Error("El servidor no proporcionó información del nombre del archivo");
      }

      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);

    } catch (error) {
      let errorMessage = "Hubo un error al generar el reporte";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      alert(errorMessage);
    } finally {
      setGeneratingReport(false);
    }
  };

  const table = useReactTable({
    data,
    columns: columns(fetchSales),
    state: { sorting, columnFilters, columnVisibility, rowSelection },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  function Calendar24() {
    return (
      <div className="flex gap-4">
        <div className="flex flex-col gap-3">
          <Label htmlFor="date-picker" className="px-1">
            Fecha
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id="date-picker"
                className="w-32 justify-between font-normal"
              >
                {reportDate ? format(reportDate, "yyyy/MM/dd") : "Seleccionar fecha"}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
              <Calendar
                mode="single"
                selected={reportDate}
                captionLayout="dropdown"
                onSelect={setReportDate}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex flex-col gap-3">
          <Label htmlFor="time-picker" className="px-1">
            Horario
          </Label>
          <Select value={reportTime} onValueChange={setReportTime}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecciona una hora" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Hora</SelectLabel>
                <SelectItem value="am">AM</SelectItem>
                <SelectItem value="pm">PM</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 relative overflow-hidden">
      {Object.keys(rowSelection).some((key) => rowSelection[key]) && (
        <div className="absolute top-0 right-0 p-4">
          <Button variant="destructive" onClick={handleDeleteSelected} disabled={deleting}>
            {deleting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="animate-spin h-4 w-4" />
                Eliminando...
              </span>
            ) : (
              <>Eliminar registros ({Object.keys(rowSelection).filter((key) => rowSelection[key]).length})</>
            )}
          </Button>
        </div>
      )}

      {loading && <p>Cargando datos...</p>}
      {error && <p className="text-red-600">Error: {error}</p>}

      {!loading && !error && (
        <>
          <div className="flex items-center justify-between py-4 flex-wrap gap-4">
            <div className="flex items-center gap-4 flex-wrap">
              <Input
                placeholder={`Filtrar por ${filterColumn}...`}
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
                className="w-[200px]"
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    Columna: {filterColumn} <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {table
                    .getAllColumns()
                    .filter((col) => col.getCanFilter() && col.id !== "select" && col.id !== "actions")
                    .map((column) => (
                      <DropdownMenuItem
                        key={column.id}
                        className="capitalize"
                        onSelect={() => {
                          setFilterColumn(column.id)
                          setFilterValue("")
                        }}
                      >
                        {column.id}
                      </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Popover open={startCalendarOpen} onOpenChange={setStartCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="text-left font-normal w-[120px]">
                      {startDate ? format(startDate, "yyyy/MM/dd") : "Desde"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                      locale={es}
                    />
                  </PopoverContent>
                </Popover>
                <span>a</span>
                <Popover open={endCalendarOpen} onOpenChange={setEndCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="text-left font-normal w-[120px]">
                      {endDate ? format(endDate, "yyyy/MM/dd") : "Hasta"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                      locale={es}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <Button variant="secondary" disabled={loading} onClick={fetchSales}>
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="animate-spin h-4 w-4" />
                    Actualizando...
                  </span>
                ) : (
                  "Actualizar"
                )}
              </Button>
            </div>
          </div>

          <div className="rounded-md border overflow-hidden">
            <div className="overflow-x-auto w-full">
              <Table className="w-full max-w-full table-fixed">
                <TableHeader className="bg-muted sticky top-0 z-10">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead 
                          key={header.id} 
                          colSpan={header.colSpan}
                          style={{ 
                            width: header.getSize(),
                            minWidth: header.column.columnDef.minSize,
                            maxWidth: (header.column.columnDef.minSize ?? 50) + 100
                          }}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id} className="truncate">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="h-24 text-center">
                        No se encontraron resultados
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="text-muted-foreground flex-1 text-sm whitespace-nowrap">
              {table.getFilteredSelectedRowModel().rows.length} de {table.getFilteredRowModel().rows.length} fila(s) seleccionadas
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                type="button"
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                type="button"
              >
                Siguiente
              </Button>
            </div>
          </div>

          <div className="flex items-end justify-center mt-4">
            <Calendar24 />
            <Button 
              variant="default" 
              className="ml-4"
              onClick={handleGenerateReport}
              disabled={generatingReport}
            >
              {generatingReport ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="animate-spin h-4 w-4" />
                  Generando...
                </span>
              ) : (
                "Generar reporte"
              )}
            </Button>
          </div>
        </>
      )}
    </div>
  )
}