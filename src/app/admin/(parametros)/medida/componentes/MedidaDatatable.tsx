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
import { ParametrosFiltros } from '@/app/admin/(parametros)/medida/componentes/ParametrosFiltros'
import { VerMedidaModal } from '@/app/admin/(parametros)/medida/componentes/VerMedidaModal'
import { AgregarEditarMedidaModal } from '@/app/admin/(parametros)/medida/componentes/AgregarEditarMedidaModal' 
import { ActivarMedidaModal } from '@/app/admin/(parametros)/medida/componentes/ActivarIMedidaModal'
import { InactivarMedidaModal } from '@/app/admin/(parametros)/medida/componentes/InactivarMedidaModal'
import {
  Medida,
  MedidaResponse,
} from '@/app/admin/(parametros)/medida/componentes/types'
import { MessageInterpreter } from '@/lib/messageInterpreter'
import { print } from '@/lib/print'

export function MedidaDatatable() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [filters, setFilters] = useState({
    filter: '',
  })
  const [debouncedFilter] = useDebounce(filters.filter, 500)
  const [selectedMedida, setSelectedMedida] = useState<Medida | null>(
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

  const fetchMedida = async () => {
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

    const response = await sessionRequest<MedidaResponse>({
      url: '/unit',
      method: 'get',
      params,
    })

    return response?.data
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ['medidas', pagination, sorting, debouncedFilter],
    queryFn: fetchMedida,
    placeholderData: keepPreviousData,
  })

  const reloadMedidas = async () => {
    await queryClient.invalidateQueries({ queryKey: ['medidas'] })
  }

  const columns: ColumnDef<Medida>[] = [
    {
      accessorKey: 'codigo',
      header: ({ column }) => <SortableHeader column={column} title="Código" />,
      cell: ({ row }) => (
        <div className="font-medium">{row.original.codigo}</div>
      ),
      meta: { mobileTitle: 'Código' },
    },
    {
      accessorKey: 'unidad',
      header: ({ column }) => <SortableHeader column={column} title="U./Medida" />,
      meta: { mobileTitle: 'U./Medida' },
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
              onClick={() => handleVerMedida(row.original)}
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
                onClick={() => handleAgregarEditarMedida(row.original)}
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

  const handleVerMedida = (medida: Medida) => {
    setSelectedMedida(medida)
    setVerModalOpen(true)
  }

  const handleAgregarEditarMedida = (medida: Medida | null) => {
    setSelectedMedida(medida)
    setAgregarEditarModalOpen(true)
  }

  const handleActivarParametro = (medida: Medida) => {
    setSelectedMedida(medida)
    setActivarModalOpen(true)
  }

  const handleInactivarParametro = (medida: Medida) => {
    setSelectedMedida(medida)
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
        <h1 className="text-2xl font-bold">Unidaes de Medida</h1>
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
              await reloadMedidas()
            }}
          >
            <RefreshCw className="mr-2 h-4 w-4" /> Recargar
          </Button>
          {permissions.create && (
            <Button
              id='agregarDepartamento'
              size={'sm'}
              onClick={() => handleAgregarEditarMedida(null)}
            >
              <Plus className="mr-2 h-4 w-4" /> Agregar Unidad de Medida
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
        <VerMedidaModal
          medida={selectedMedida}
          isOpen={verModalOpen}
          onClose={() => setVerModalOpen(false)}
        />
      )}
      {editarModalOpen && (
        <AgregarEditarMedidaModal
          medida={selectedMedida}
          isOpen={editarModalOpen}
          onClose={() => setAgregarEditarModalOpen(false)}
          onSuccess={reloadMedidas}
        />
      )}
      {activarModalOpen && (
        <ActivarMedidaModal
          medida={selectedMedida}
          isOpen={activarModalOpen}
          onClose={() => setActivarModalOpen(false)}
          onSuccess={reloadMedidas}
        />
      )}
      {inactivarModalOpen && (
        <InactivarMedidaModal
          medida={selectedMedida}
          isOpen={inactivarModalOpen}
          onClose={() => setInactivarModalOpen(false)}
          onSuccess={reloadMedidas}
        />
      )}
    </div>
  )
}
