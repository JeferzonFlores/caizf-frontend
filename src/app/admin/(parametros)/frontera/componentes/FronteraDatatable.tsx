'use client'

import React, { useEffect, useState } from 'react'
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { useAuth } from '@/contexts/AuthProvider'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DataTable } from '@/components/data-table/DataTable'
import { SortableHeader } from '@/components/data-table/SortableHeader'
import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from '@tanstack/react-table'
import {
  Edit,
  Eye,
  Loader,
  Plus,
  Power,
  PowerOff,
  RefreshCw,
  Search,
  XIcon,
} from 'lucide-react'
import { useDebounce } from 'use-debounce'
import { toast } from 'sonner'
import { ParametrosFiltros } from '@/app/admin/(parametros)/frontera/componentes/ParametrosFiltros'
import { VerFronteraModal } from '@/app/admin/(parametros)/frontera/componentes/VerFronteraModal'
import { AgregarEditarFronteraModal } from '@/app/admin/(parametros)/frontera/componentes/AgregarEditarFronteraModal' 
import { ActivarFronteraModal } from '@/app/admin/(parametros)/frontera/componentes/ActivarFronteraModal'
import { InactivarFronteraModal } from '@/app/admin/(parametros)/frontera/componentes/InactivarFronteraModal'
import {
  Frontera,
  FronteraResponse,
} from '@/app/admin/(parametros)/frontera/componentes/types'
import { MessageInterpreter } from '@/lib/messageInterpreter'
import { print } from '@/lib/print'

export function FronteraDatatable() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [filters, setFilters] = useState({
    filter: '',
  })
  const [debouncedFilter] = useDebounce(filters.filter, 500)
  const [selectedFrontera, setSelectedFrontera] = useState<Frontera | null>(
    null
  )
  const [verModalOpen, setVerModalOpen] = useState(false)
  const [editarModalOpen, setAgregarEditarModalOpen] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [activarModalOpen, setActivarModalOpen] = useState(false)
  const [inactivarModalOpen, setInactivarModalOpen] = useState(false)
  const { sessionRequest, checkPermission } = useAuth()
  const queryClient = useQueryClient()

  const [permissions, setPermissions] = useState({
    create: false,
    read: false,
    update: false,
    delete: false,
  })

  useEffect(() => {
    const fetchPermissions = async () => {
      const [create, read, update, del] = await Promise.all([
        checkPermission('/admin/parametros', 'create'),
        checkPermission('/admin/parametros', 'read'),
        checkPermission('/admin/parametros', 'update'),
        checkPermission('/admin/parametros', 'delete'),
      ])
      setPermissions({ create, read, update, delete: del })
    }

    fetchPermissions().catch(print)
  }, [checkPermission])

  const fetchFrontera = async () => {
    const params: Record<string, string> = {
      pagina: (pagination.pageIndex + 1).toString(),
      limite: pagination.pageSize.toString(),
    }

    if (sorting.length > 0) {
      const [{ id, desc }] = sorting
      params.orden = `${desc ? '-' : ''}${id}`
    }

    if (debouncedFilter && debouncedFilter.trim() !== '') {
      params.filtro = debouncedFilter.trim()
    }

    const response = await sessionRequest<FronteraResponse>({
      url: '/border',
      method: 'get',
      params,
    })

    return response?.data
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ['medidas', pagination, sorting, debouncedFilter],
    queryFn: fetchFrontera,
    placeholderData: keepPreviousData,
  })

  const reloadFronteras = async () => {
    await queryClient.invalidateQueries({ queryKey: ['medidas'] })
  }

  const columns: ColumnDef<Frontera>[] = [
    {
      accessorKey: 'codigo',
      header: ({ column }) => <SortableHeader column={column} title="Código" />,
      cell: ({ row }) => (
        <div className="font-medium">{row.original.codigo}</div>
      ),
      meta: { mobileTitle: 'Código' },
    },
    {
      accessorKey: 'frontera',
      header: ({ column }) => <SortableHeader column={column} title="Frontera" />,
      meta: { mobileTitle: 'Frontera' },
    },
    {
      accessorKey: 'descripcion',
      header: 'Descripción',
      cell: ({ row }) => (
        <div className="max-w-xs truncate" title={row.original.descripcion}>
          {row.original.descripcion}
        </div>
      ),
      meta: { mobileTitle: 'Descripción' },
    },

    {
      accessorKey: 'estado',
      header: ({ column }) => <SortableHeader column={column} title="Estado" />,
      cell: ({ row }) => (
        <Badge
          variant={row.original.estado === 'ACTIVO' ? 'success' : 'destructive'}
        >
          {row.original.estado}
        </Badge>
      ),
      meta: { mobileTitle: 'Estado' },
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <div className="flex space-x-2">
          {permissions.read && (
            <Button
              title='Ver detalle'
              variant="outline"
              size="icon"
              onClick={() => handleVerFrontera(row.original)}
            >
              <Eye className="h-4 w-4" />
            </Button>
          )}
          {permissions.update && (
            <>
              <Button
                title="Editar"
                variant="outline"
                size="icon"
                onClick={() => handleAgregarEditarFrontera(row.original)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                title={row.original.estado === 'INACTIVO' ? 'Activar' : 'Inactivar'}
                variant="outline"
                size="icon"
                onClick={() =>
                  row.original.estado === 'INACTIVO'
                    ? handleActivarParametro(row.original)
                    : handleInactivarParametro(row.original)
                }
              >
                {row.original.estado === 'INACTIVO' ? (
                  <Power className="h-4 w-4" />
                ) : (
                  <PowerOff className="h-4 w-4" />
                )}
              </Button>
            </>
          )}
        </div>
      ),
      header: 'Acciones',
    },
  ]

  const table = useReactTable({
    data: data?.datos.filas ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: {
      sorting,
      pagination,
    },
    manualPagination: true,
    pageCount: data ? Math.ceil(data.datos.total / pagination.pageSize) : 0,
  })

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, filter: event.target.value }))
  }

  const handleClearFilter = () => {
    setFilters((prev) => ({ ...prev, filter: '' }))
  }

  const toggleFilters = () => {
    setShowFilters(!showFilters)
    setFilters({ filter: '' })
  }

  const handleVerFrontera = (frontera: Frontera) => {
    setSelectedFrontera(frontera)
    setVerModalOpen(true)
  }

  const handleAgregarEditarFrontera = (frontera: Frontera | null) => {
    setSelectedFrontera(frontera)
    setAgregarEditarModalOpen(true)
  }

  const handleActivarParametro = (frontera: Frontera) => {
    setSelectedFrontera(frontera)
    setActivarModalOpen(true)
  }

  const handleInactivarParametro = (frontera: Frontera) => {
    setSelectedFrontera(frontera)
    setInactivarModalOpen(true)
  }

  if (error) {
    toast.error('Error obteniendo parámetros', {
      description: MessageInterpreter(error),
    })
  }

  return (
    <div className="lg:px-8 lg:py-2 sm:px-1 sm:py-2">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Zonas Fronterizas</h1>
        <div className="flex flex-wrap justify-center sm:justify-end items-center gap-2">
          <Button id='buscarParametro' size={'sm'} onClick={toggleFilters} variant={'outline'}>
            {showFilters ? (
              <XIcon className="mr-2 h-4 w-4" />
            ) : (
              <Search className="mr-2 h-4 w-4" />
            )}
            {showFilters ? 'Cerrar' : 'Buscar'}
          </Button>
          <Button
            size={'sm'}
            variant={'outline'}
            onClick={async () => {
              await reloadFronteras()
            }}
          >
            <RefreshCw className="mr-2 h-4 w-4" /> Recargar
          </Button>
          {permissions.create && (
            <Button
              id='agregarDepartamento'
              size={'sm'}
              onClick={() => handleAgregarEditarFrontera(null)}
            >
              <Plus className="mr-2 h-4 w-4" /> Agregar Frontera
            </Button>
          )}
        </div>
      </div>
      {showFilters && (
        <div className="mb-4">
          <ParametrosFiltros
            filter={filters.filter}
            onFilterChange={handleFilterChange}
            onClearFilter={handleClearFilter}
          />
        </div>
      )}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader className="h-10 w-10 animate-spin" />
        </div>
      ) : (
        <DataTable
          table={table}
          columns={columns}
          totalCount={data?.datos.total ?? 0}
        />
      )}
      {verModalOpen && (
        <VerFronteraModal
          frontera={selectedFrontera}
          isOpen={verModalOpen}
          onClose={() => setVerModalOpen(false)}
        />
      )}
      {editarModalOpen && (
        <AgregarEditarFronteraModal
          frontera={selectedFrontera}
          isOpen={editarModalOpen}
          onClose={() => setAgregarEditarModalOpen(false)}
          onSuccess={reloadFronteras}
        />
      )}
      {activarModalOpen && (
        <ActivarFronteraModal
          frontera={selectedFrontera}
          isOpen={activarModalOpen}
          onClose={() => setActivarModalOpen(false)}
          onSuccess={reloadFronteras}
        />
      )}
      {inactivarModalOpen && (
        <InactivarFronteraModal
          frontera={selectedFrontera}
          isOpen={inactivarModalOpen}
          onClose={() => setInactivarModalOpen(false)}
          onSuccess={reloadFronteras}
        />
      )}
    </div>
  )
}
