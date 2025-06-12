import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  flexRender,
  Table as TableType,
  ColumnDef,
} from '@tanstack/react-table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface DataTableProps<TData> {
  table: TableType<TData>
  columns: ColumnDef<TData, any>[]
  totalCount: number // Nueva prop para el total de registros
}

export function DataTable<TData>({
  table,
  columns,
  totalCount,
}: DataTableProps<TData>) {
  const getColumnTitle = (column: ColumnDef<TData, any>) => {
    if (column.meta && 'mobileTitle' in column.meta) {
      return column.meta.mobileTitle as string
    }
    if (typeof column.header === 'string') {
      return column.header
    }
    return column.id || ''
  }

  return (
    <div>
      {/* Vista de tarjetas para móviles */}
      <div className="space-y-4 md:hidden">
        {table.getRowModel().rows.map((row) => (
          <Card key={row.id}>
            <CardContent className="p-4">
              {row.getVisibleCells().map((cell) => (
                <div key={cell.id} className="mb-2 flex justify-between">
                  <div className="mr-2">
                    {getColumnTitle(cell.column.columnDef)}:
                  </div>
                  <div>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Vista de tabla para pantallas más grandes */}
      <Card className="hidden md:block rounded-b border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    style={{
                      maxWidth: header.column.columnDef.size,
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
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No hay resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
      {/* Controles de paginación */}
      <div className="flex items-center justify-between space-x-2 py-4">
        <Select
          value={table.getState().pagination.pageSize.toString()}
          onValueChange={(value) => table.setPageSize(Number(value))}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select page size" />
          </SelectTrigger>
          <SelectContent>
            {[10, 20, 50].map((pageSize) => (
              <SelectItem key={pageSize} value={`${pageSize}`}>
                {pageSize} registros
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500 ml-2">
            Total: {totalCount} registros
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  )
}
