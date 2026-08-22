"use client"

import { useState } from "react"
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import type {
  ColumnDef,
  SortingState,
} from "@tanstack/react-table"
import { Search } from "lucide-react"

import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ForbiddenCard } from "@/components/forbidden-card"
import { useSession } from "@/lib/session"
import {
  SEX_LABELS,
  STATUS_LABELS,
  pacientesMock,
  type Paciente,
} from "@/lib/demo-data"

function fullName(p: Paciente) {
  return `${p.lastName}, ${p.firstName}`
}

function formatBirthDate(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("es-VE")
}

const columns: ColumnDef<Paciente>[] = [
  {
    accessorKey: "recordNumber",
    header: "Historia",
  },
  {
    accessorFn: fullName,
    id: "fullName",
    header: "Paciente",
  },
  {
    accessorKey: "sex",
    header: "Sexo",
    cell: ({ row }) => SEX_LABELS[row.original.sex],
  },
  {
    accessorKey: "birthDate",
    header: "F. Nacimiento",
    cell: ({ row }) => formatBirthDate(row.original.birthDate),
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => (
      <Badge
        variant={row.original.status === "active" ? "secondary" : "outline"}
      >
        {STATUS_LABELS[row.original.status]}
      </Badge>
    ),
  },
]

export default function PacientesPage() {
  const { user, status } = useSession()
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState("")

  const table = useReactTable({
    data: pacientesMock,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  if (status !== "loading" && user && user.role !== "admin") {
    return (
      <div className="py-10">
        <ForbiddenCard />
      </div>
    )
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold">Pacientes</h1>
        <p className="text-sm text-muted-foreground">
          Historias clínicas registradas en el sistema
        </p>
      </div>

      <div className="relative max-w-sm">
        <Search className="text-muted-foreground absolute top-2.5 left-2.5 size-4" />
        <Input
          placeholder="Buscar por historia o nombre…"
          className="pl-8"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
        />
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className={
                      header.column.getCanSort() ? "cursor-pointer select-none" : ""
                    }
                  >
                    {typeof header.column.columnDef.header === "string"
                      ? header.column.columnDef.header
                      : ""}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {cell.renderValue() as React.ReactNode}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  Sin resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
