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

import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format, addDays, subDays } from "date-fns"
import { es } from "date-fns/locale"
import { Label } from "@/components/ui/label"

export type Sale = {
  id: number
  created_at: string
  business_id: string
  name: string
  age: number
  route: string
  time: string
  ferry: string
  intermediary: string
  seller_id: number
}

export const columns: ColumnDef<Sale>[] = [
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
    accessorKey: "id",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="flex items-center gap-1">
        ID
        <ArrowUpDown />
      </Button>
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="flex items-center gap-1">
        Name
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
  },
  {
    accessorKey: "age",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="flex items-center gap-1">
        Age
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => <div className="text-right font-medium">{row.getValue("age")}</div>,
  },
  {
    accessorKey: "route",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="flex items-center gap-1">
        Route
        <ArrowUpDown />
      </Button>
    ),
  },
  {
    accessorKey: "time",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="flex items-center gap-1">
        Time
        <ArrowUpDown />
      </Button>
    ),
  },
  {
    accessorKey: "ferry",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="flex items-center gap-1">
        Ferry
        <ArrowUpDown />
      </Button>
    ),
  },
  {
    accessorKey: "intermediary",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="flex items-center gap-1">
        Intermediary
        <ArrowUpDown />
      </Button>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const sale = row.original
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
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

  // Estados para el reporte
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
      const response = await fetch("http://127.0.0.1:8000/marine-report", {
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

      // Obtener el blob (archivo binario) de la respuesta
      const blob = await response.blob();

      // Crear un enlace de descarga
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;

      // Obtener el nombre del archivo del header Content-Disposition o usar uno por defecto
      const contentDisposition = response.headers.get('Content-Disposition');
      let fileName = 'reporte.xlsx';

      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/);
        if (fileNameMatch && fileNameMatch[1]) {
          fileName = fileNameMatch[1];
        }
      }

      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();

      // Liberar el objeto URL
      window.URL.revokeObjectURL(downloadUrl);

    } catch (error) {
      console.error("Error al generar el reporte:", error);
      alert("Hubo un error al generar el reporte");
    } finally {
      setGeneratingReport(false);
    }
  };

  const table = useReactTable({
    data,
    columns,
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
            Date
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id="date-picker"
                className="w-32 justify-between font-normal"
              >
                {reportDate ? format(reportDate, "yyyy/MM/dd") : "Select date"}
                <ChevronDown />
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
            Time
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
    <div className="w-full relative">
      {Object.keys(rowSelection).some((key) => rowSelection[key]) && (
        <div className="absolute top-0 right-0 p-4">
          <Button variant="destructive" onClick={handleDeleteSelected} disabled={deleting}>
            {deleting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="animate-spin" />
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
                placeholder={`Filter by ${filterColumn}...`}
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
                className="w-[200px]"
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    Filter Column: {filterColumn} <ChevronDown />
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

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((hg) => (
                  <TableRow key={hg.id}>
                    {hg.headers.map((head) => (
                      <TableHead key={head.id}>
                        {head.isPlaceholder ? null : flexRender(head.column.columnDef.header, head.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id} data-state={row.getIsSelected() ? "selected" : undefined}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="text-muted-foreground flex-1 text-sm">
              {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <div className="space-x-2">
              <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} type="button">
                Previous
              </Button>
              <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} type="button">
                Next
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