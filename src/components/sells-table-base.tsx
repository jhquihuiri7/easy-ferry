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
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Loader2 } from "lucide-react"

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
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center gap-1"
      >
        ID
        {column.getIsSorted() === "asc" ? (
          <ChevronDown className="rotate-180" />
        ) : column.getIsSorted() === "desc" ? (
          <ChevronDown />
        ) : (
          <ArrowUpDown />
        )}
      </Button>
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center gap-1"
      >
        Name
        {column.getIsSorted() === "asc" ? (
          <ChevronDown className="rotate-180" />
        ) : column.getIsSorted() === "desc" ? (
          <ChevronDown />
        ) : (
          <ArrowUpDown />
        )}
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
  },
  {
    accessorKey: "age",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center gap-1"
      >
        Age
        {column.getIsSorted() === "asc" ? (
          <ChevronDown className="rotate-180" />
        ) : column.getIsSorted() === "desc" ? (
          <ChevronDown />
        ) : (
          <ArrowUpDown />
        )}
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-right font-medium">{row.getValue("age")}</div>
    ),
  },
  {
    accessorKey: "route",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center gap-1"
      >
        Route
        {column.getIsSorted() === "asc" ? (
          <ChevronDown className="rotate-180" />
        ) : column.getIsSorted() === "desc" ? (
          <ChevronDown />
        ) : (
          <ArrowUpDown />
        )}
      </Button>
    ),
  },
  {
    accessorKey: "time",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center gap-1"
      >
        Time
        {column.getIsSorted() === "asc" ? (
          <ChevronDown className="rotate-180" />
        ) : column.getIsSorted() === "desc" ? (
          <ChevronDown />
        ) : (
          <ArrowUpDown />
        )}
      </Button>
    ),
  },
  {
    accessorKey: "ferry",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center gap-1"
      >
        Ferry
        {column.getIsSorted() === "asc" ? (
          <ChevronDown className="rotate-180" />
        ) : column.getIsSorted() === "desc" ? (
          <ChevronDown />
        ) : (
          <ArrowUpDown />
        )}
      </Button>
    ),
  },
  {
    accessorKey: "intermediary",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center gap-1"
      >
        Intermediary
        {column.getIsSorted() === "asc" ? (
          <ChevronDown className="rotate-180" />
        ) : column.getIsSorted() === "desc" ? (
          <ChevronDown />
        ) : (
          <ArrowUpDown />
        )}
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
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(sale.id.toString())}
            >
              Copy ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]


export function SellsTableBase() {
  // ... estados originales
  const [data, setData] = React.useState<Sale[]>([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    async function fetchSales() {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(
          "https://easy-ferry.uc.r.appspot.com/get-sales?business_id=fsadsfgsdgfdsfgfdssdfcdw",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
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
    fetchSales()
  }, [])

  const [filterColumn, setFilterColumn] = React.useState<string>("name")
  const [filterValue, setFilterValue] = React.useState<string>("")

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({})
  const [deleting, setDeleting] = React.useState(false)



  React.useEffect(() => {
    if (filterValue) {
      setColumnFilters([{ id: filterColumn, value: filterValue }])
    } else {
      setColumnFilters([])
    }
  }, [filterColumn, filterValue])

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  // Handler para eliminar los registros seleccionados
  const handleDeleteSelected = async () => {
  const selectedIds = table
  .getSelectedRowModel()
  .rows
  .map((row) => row.original.id)


  if (selectedIds.length === 0) return

  setDeleting(true)
  try {
    const response = await fetch("https://easy-ferry.uc.r.appspot.com/delete-sales", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ids: selectedIds }),
    })

    if (!response.ok) {
      throw new Error(`Error deleting sales: ${response.statusText}`)
    }

    const result = await response.json()
    console.log("Deleted successfully:", result)

    setData((prevData) => prevData.filter((item) => !selectedIds.includes(item.id)))
    setRowSelection({})
  } catch (error: any) {
    console.error("Failed to delete:", error)
    alert("Hubo un error al eliminar los registros.")
  } finally {
    setDeleting(false)
  }
  }



  return (
    <div className="w-full relative">
      {/* Botón eliminar aparece solo si hay seleccionados */}
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
          <div className="flex items-center py-4 gap-4">
            <Input
              placeholder={`Filter by ${filterColumn}...`}
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              className="max-w-sm"
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

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() ? "selected" : undefined}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
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
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}


