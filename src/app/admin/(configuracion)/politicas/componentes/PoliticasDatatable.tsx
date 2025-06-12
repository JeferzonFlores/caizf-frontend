'use client'
import { ChangeEvent, useEffect, useState } from 'react'
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { useAuth } from '@/contexts/AuthProvider'
import { Button } from '@/components/ui/button'
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
import { Edit, Eye, Plus, RefreshCw, Search, Trash2, XIcon } from 'lucide-react'
import { useDebounce } from 'use-debounce'
import { toast } from 'sonner'
import { Politica, PoliticaResponse } from './types'
import { VerPoliticaModal } from '@/app/admin/(configuracion)/politicas/componentes/VerPoliticaModal'
import { AgregarEditarPoliticaModal } from '@/app/admin/(configuracion)/politicas/componentes/AgregarEditarPoliticaModal'
import { PoliticasFiltros } from '@/app/admin/(configuracion)/politicas/componentes/PoliticasFiltros'
import { Badge } from '@/components/ui/badge'
import { EliminarPoliticaModal } from '@/app/admin/(configuracion)/politicas/componentes/EliminarPoliticaModal'
import { MessageInterpreter } from '@/lib/messageInterpreter'
import { print } from '@/lib/print'
import * as React from 'react'

export function PoliticasDatatable() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [filters, setFilters] = useState({
    filter: '',
    sujeto: [] as string[],
  })
  const [debouncedFilter] = useDebounce(filters.filter, 500)
  const [selectedPolitica, setSelectedPolitica] = useState<Politica | null>(
    null
  )
  const [verModalOpen, setVerModalOpen] = useState(false)
  const [editarModalOpen, setAgregarEditarModalOpen] = useState(false)
  const [eliminarModalOpen, setEliminarModalOpen] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
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
      setPermissions({
        create: await checkPermission('/admin/politicas', 'create'),
        read: await checkPermission('/admin/politicas', 'read'),
        update: await checkPermission('/admin/politicas', 'update'),
        delete: await checkPermission('/admin/politicas', 'delete'),
      })
    }
    fetchPermissions().catch(print)
  }, [checkPermission])

  const buildQueryParams = () => {
    const params: Record<string, string> = {
      pagina: (pagination.pageIndex + 1).toString(),
      limite: pagination.pageSize.toString(),
    }

    if (sorting.length > 0) {
      const [{ id, desc }] = sorting
      params.orden = `${desc ? '-' : ''}${id}`
    }

    if (debouncedFilter && debouncedFilter.trim() !== '') {
      params.filtro = debouncedFilter
    }

    if (filters.sujeto.length > 0) {
      params.sujeto = filters.sujeto.join(',')
    }

    return params
  }

  const fetchPoliticas = async () => {
    const params = buildQueryParams()
    const response = await sessionRequest<PoliticaResponse>({
      url: '/autorizacion/politicas',
      method: 'get',
      params,
    })
    return response?.data
  }

  const { data, isLoading, error } = useQuery({
    queryKey: [
      'politicas',
      pagination,
      sorting,
      debouncedFilter,
      filters.sujeto,
    ],
    queryFn: fetchPoliticas,
    placeholderData: keepPreviousData,
  })

  const columns: ColumnDef<Politica>[] = [
    {
      accessorKey: 'sujeto',
      header: ({ column }) => <SortableHeader column={column} title="Sujeto" />,
      meta: { mobileTitle: 'Sujeto' },
    },
    {
      accessorKey: 'objeto',
      header: ({ column }) => <SortableHeader column={column} title="Objeto" />,
      meta: { mobileTitle: 'Objeto' },
    },
    {
      accessorKey: 'accion',
      header: ({ column }) => <SortableHeader column={column} title="Acción" />,
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.accion.split('|').map((accion, index) => (
            <Badge key={index} variant="secondary">
              {accion}
            </Badge>
          ))}
        </div>
      ),
      meta: { mobileTitle: 'Acción' },
    },
    {
      accessorKey: 'app',
      header: ({ column }) => <SortableHeader column={column} title="App" />,
      cell: ({ row }) => (
        <div className="flex flex-wrap">
          <Badge key={row.index} variant="outline">
            {row.original.app}
          </Badge>
        </div>
      ),
      meta: { mobileTitle: 'App' },
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
              onClick={() => handleVerPolitica(row.original)}
            >
              <Eye className="h-4 w-4" />
            </Button>
          )}
          {permissions.update && (
            <Button
              title='Editar'
              variant="outline"
              size="icon"
              onClick={() => handleAgregarEditarPolitica(row.original)}
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
          {permissions.delete && (
            <Button
              title='Eliminar'
              variant="outline"
              size="icon"
              onClick={() => handleEliminarPolitica(row.original)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      ),
      header: 'Acciones',
    },
  ]

  const table = useReactTable({
    data: data?.datos?.filas ?? [],
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

  const handleFilterChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, filter: event.target.value }))
  }

  const handleVerPolitica = (politica: Politica) => {
    setSelectedPolitica(politica)
    setVerModalOpen(true)
  }

  const handleAgregarEditarPolitica = (politica: Politica | null) => {
    setSelectedPolitica(politica)
    setAgregarEditarModalOpen(true)
  }

  const handleEliminarPolitica = (politica: Politica) => {
    setSelectedPolitica(politica)
    setEliminarModalOpen(true)
  }

  const handleClearFilter = () => {
    setFilters((prev) => ({ ...prev, filter: '' }))
  }

  if (error) {
    toast.error('Error obteniendo políticas', {
      description: MessageInterpreter(error),
    })
  }

  const reloadPoliticas = async () => {
    await queryClient.invalidateQueries({ queryKey: ['politicas'] })
  }

  const toggleFilters = () => {
    setShowFilters((prev) => {
      if (prev) {
        // Resetear filtros al ocultar
        setFilters({ filter: '', sujeto: [] })
      }
      return !prev
    })
  }

  return (
    <div className="lg:px-8 lg:py-2 sm:px-1 sm:py-2">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Gestión de Políticas</h1>
        <div className="flex flex-wrap justify-center sm:justify-end items-center gap-2">
          <Button id='buttonBuscarPolitica' size={'sm'} onClick={toggleFilters} variant={'outline'}>
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
              await reloadPoliticas()
            }}
          >
            <RefreshCw className="mr-2 h-4 w-4" /> Recargar
          </Button>
          {permissions.create && (
            <Button
              id='agregarPolitica'
              size={'sm'}
              onClick={() => handleAgregarEditarPolitica(null)}
            >
              <Plus className="mr-2 h-4 w-4" /> Agregar Política
            </Button>
          )}
        </div>
      </div>
      {showFilters && (
        <div className="mb-4">
          <PoliticasFiltros
            filter={filters.filter}
            onFilterChange={handleFilterChange}
            onClearFilter={handleClearFilter}
          />
        </div>
      )}
      {isLoading ? (
        <div>Cargando...</div>
      ) : (
        <DataTable
          table={table}
          columns={columns}
          totalCount={data?.datos.total ?? 0}
        />
      )}
      {verModalOpen && (
        <VerPoliticaModal
          politica={selectedPolitica}
          isOpen={verModalOpen}
          onClose={() => setVerModalOpen(false)}
        />
      )}
      {editarModalOpen && (
        <AgregarEditarPoliticaModal
          politica={selectedPolitica}
          isOpen={editarModalOpen}
          onClose={() => setAgregarEditarModalOpen(false)}
          onSuccess={reloadPoliticas}
        />
      )}
      {eliminarModalOpen && (
        <EliminarPoliticaModal
          politica={selectedPolitica}
          isOpen={eliminarModalOpen}
          onClose={() => setEliminarModalOpen(false)}
          onSuccess={reloadPoliticas}
        />
      )}
    </div>
  )
}
