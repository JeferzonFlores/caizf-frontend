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
  Plus,
  Power,
  PowerOff,
  RefreshCw,
  Search,
  XIcon,
} from 'lucide-react'
import { useDebounce } from 'use-debounce'
import { toast } from 'sonner'
import DynamicIcon from '@/components/Icon'
import { ModulosFiltros } from '@/app/admin/(configuracion)/modulos/componentes/ModulosFiltros'
import { VerModuloModal } from '@/app/admin/(configuracion)/modulos/componentes/VerModuloModal'
import { AgregarEditarModuloModal } from '@/app/admin/(configuracion)/modulos/componentes/AgregarEditarModuloModal'
import { ActivarModuloModal } from '@/app/admin/(configuracion)/modulos/componentes/ActivarModuloModal'
import { InactivarModuloModal } from '@/app/admin/(configuracion)/modulos/componentes/InactivarModuloModal'
import { MessageInterpreter } from '@/lib/messageInterpreter'
import { print } from '@/lib/print'
import {
  Modulo,
  ModulosResponse,
} from '@/app/admin/(configuracion)/modulos/componentes/types'

export function ModulosDatatable() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [filters, setFilters] = useState({
    filter: '',
  })
  const [debouncedFilter] = useDebounce(filters.filter, 500)
  const [selectedModulo, setSelectedModulo] = useState<Modulo | null>(null)
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
        checkPermission('/admin/modulos', 'create'),
        checkPermission('/admin/modulos', 'read'),
        checkPermission('/admin/modulos', 'update'),
        checkPermission('/admin/modulos', 'delete'),
      ])
      setPermissions({ create, read, update, delete: del })
    }

    fetchPermissions().catch(print)
  }, [checkPermission])

  const fetchModulos = async () => {
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

    const response = await sessionRequest<ModulosResponse>({
      url: '/autorizacion/modulos',
      method: 'get',
      params,
    })

    return response?.data
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ['modulos', pagination, sorting, debouncedFilter],
    queryFn: fetchModulos,
    placeholderData: keepPreviousData,
  })

  const { data: secciones } = useQuery({
    queryKey: ['secciones'],
    queryFn: async () => {
      const response = await sessionRequest<any>({
        url: '/autorizacion/modulos',
        method: 'get',
        params: { pagina: 1, limite: 20, seccion: true },
      })
      return response?.data.datos.filas || []
    },
  })

  const columns: ColumnDef<Modulo>[] = [
    {
      accessorKey: 'label',
      header: ({ column }) => (
        <SortableHeader column={column} title="Etiqueta" />
      ),
      meta: { mobileTitle: 'Etiqueta' },
    },
    {
      accessorKey: 'url',
      header: ({ column }) => <SortableHeader column={column} title="URL" />,
      meta: { mobileTitle: 'URL' },
    },
    {
      accessorKey: 'nombre',
      header: ({ column }) => <SortableHeader column={column} title="Nombre" />,
      meta: { mobileTitle: 'Nombre' },
    },
    {
      accessorKey: 'propiedades.orden',
      header: ({ column }) => <SortableHeader column={column} title="Orden" />,
      meta: { mobileTitle: 'Orden' },
    },
    {
      accessorKey: 'propiedades.icono',
      header: 'Ícono',
      cell: ({ row }) =>
        row.original.propiedades.icono ? (
          <DynamicIcon name={row.original.propiedades.icono} size={24} />
        ) : (
          'N/A'
        ),
      meta: { mobileTitle: 'Ícono' },
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
            <>
              <Button
                title='Ver detalle'
                variant="outline"
                size="icon"
                onClick={() => handleVerModulo(row.original)}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </>
          )}
          {permissions.update && (
            <>
              <Button
                title='Editar'
                variant="outline"
                size="icon"
                onClick={() => handleAgregarEditarModulo(row.original)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              {row.original.estado === 'INACTIVO' ? (
                <Button
                  title='Inactivar'
                  variant="outline"
                  size="icon"
                  onClick={() => handleActivarModulo(row.original)}
                >
                  <Power className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  title='Activar'
                  variant="outline"
                  size="icon"
                  onClick={() => handleInactivarModulo(row.original)}
                >
                  <PowerOff className="h-4 w-4" />
                </Button>
              )}
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

  const reloadModulos = async () => {
    await queryClient.invalidateQueries({ queryKey: ['modulos'] })
  }

  const handleVerModulo = (modulo: Modulo) => {
    setSelectedModulo(modulo)
    setVerModalOpen(true)
  }

  const handleAgregarEditarModulo = (modulo: Modulo | null) => {
    setSelectedModulo(modulo)
    setAgregarEditarModalOpen(true)
  }

  const handleActivarModulo = (modulo: Modulo) => {
    setSelectedModulo(modulo)
    setActivarModalOpen(true)
  }

  const handleInactivarModulo = (modulo: Modulo) => {
    setSelectedModulo(modulo)
    setInactivarModalOpen(true)
  }

  if (error) {
    toast.error('Error obteniendo módulos', {
      description: MessageInterpreter(error),
    })
  }

  return (
    <div className="lg:px-8 lg:py-2 sm:px-1 sm:py-2">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Gestión de Módulos</h1>
        <div className="flex flex-wrap justify-center sm:justify-end items-center gap-2">
          <Button id='buttonBuscarModulo' size={'sm'} onClick={toggleFilters} variant={'outline'}>
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
              await reloadModulos()
            }}
          >
            <RefreshCw className="mr-2 h-4 w-4" /> Recargar
          </Button>
          {permissions.create && (
            <Button id='agregarModulo' size={'sm'} onClick={() => handleAgregarEditarModulo(null)}>
              <Plus className="mr-2 h-4 w-4" /> Agregar Módulo
            </Button>
          )}
        </div>
      </div>
      {showFilters && (
        <div className="mb-4">
          <ModulosFiltros
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
        <VerModuloModal
          modulo={selectedModulo}
          isOpen={verModalOpen}
          onClose={() => setVerModalOpen(false)}
        />
      )}
      {editarModalOpen && (
        <AgregarEditarModuloModal
          modulo={selectedModulo}
          isOpen={editarModalOpen}
          onClose={() => setAgregarEditarModalOpen(false)}
          onSuccess={reloadModulos}
          secciones={secciones ?? []}
        />
      )}
      {activarModalOpen && (
        <ActivarModuloModal
          modulo={selectedModulo}
          isOpen={activarModalOpen}
          onClose={() => setActivarModalOpen(false)}
          onSuccess={reloadModulos}
        />
      )}
      {inactivarModalOpen && (
        <InactivarModuloModal
          modulo={selectedModulo}
          isOpen={inactivarModalOpen}
          onClose={() => setInactivarModalOpen(false)}
          onSuccess={reloadModulos}
        />
      )}
    </div>
  )
}
