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
import { RolesFiltros } from '@/app/admin/(configuracion)/roles/componentes/RolesFiltros'
import { AgregarEditarRolModal } from '@/app/admin/(configuracion)/roles/componentes/AgregarEditarRolModal'
import { ActivarRolModal } from '@/app/admin/(configuracion)/roles/componentes/ActivarRolModal'
import { InactivarRolModal } from '@/app/admin/(configuracion)/roles/componentes/InactivarRolModal'
import { VerRolModal } from '@/app/admin/(configuracion)/roles/componentes/VerRolModal'
import { MessageInterpreter } from '@/lib/messageInterpreter'
import { print } from '@/lib/print'
import {
  Rol,
  RolesResponse,
} from '@/app/admin/(configuracion)/roles/componentes/types'

export function RolesDatatable() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [filter, setFilter] = useState<string>('')
  const [debouncedFilter] = useDebounce(filter, 500)
  const [selectedRol, setSelectedRol] = useState<Rol | null>(null)
  const [editarModalOpen, setEditarModalOpen] = useState(false)
  const [activarModalOpen, setActivarModalOpen] = useState(false)
  const [inactivarModalOpen, setInactivarModalOpen] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [verModalOpen, setVerModalOpen] = useState(false)

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
        create: await checkPermission('/admin/usuarios', 'create'),
        read: await checkPermission('/admin/usuarios', 'read'),
        update: await checkPermission('/admin/usuarios', 'update'),
        delete: await checkPermission('/admin/usuarios', 'delete'),
      })
    }

    fetchPermissions().catch(print)
  }, [checkPermission])

  const fetchRoles = async () => {
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

    const response = await sessionRequest<RolesResponse>({
      url: '/autorizacion/roles/todos',
      method: 'get',
      params,
    })

    return response?.data
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ['roles', pagination, sorting, debouncedFilter],
    queryFn: fetchRoles,
    placeholderData: keepPreviousData,
  })

  const columns: ColumnDef<Rol>[] = [
    {
      accessorKey: 'rol',
      header: ({ column }) => <SortableHeader column={column} title="Rol" />,
      meta: { mobileTitle: 'Rol' },
    },
    {
      accessorKey: 'nombre',
      header: ({ column }) => <SortableHeader column={column} title="Nombre" />,
      meta: { mobileTitle: 'Nombre' },
    },
    {
      accessorKey: 'descripcion',
      header: 'Descripción',
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
          {permissions.update && (
            <>
              <Button
                title='Ver detalle'
                variant="outline"
                size="icon"
                onClick={() => handleVerRol(row.original)}
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                title="Editar"
                variant="outline"
                size="icon"
                onClick={() => handleEditarRol(row.original)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              {row.original.estado === 'INACTIVO' ? (
                <Button
                  title='Activar'
                  variant="outline"
                  size="icon"
                  onClick={() => handleActivarRol(row.original)}
                >
                  <Power className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  title='Inactivar'
                  variant="outline"
                  size="icon"
                  onClick={() => handleInactivarRol(row.original)}
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
    setFilter(event.target.value)
  }

  const handleClearFilter = () => {
    setFilter('')
  }

  const handleAgregarRol = () => {
    setSelectedRol(null)
    setEditarModalOpen(true)
  }

  const handleVerRol = (rol: Rol) => {
    setSelectedRol(rol)
    setVerModalOpen(true)
  }

  const handleEditarRol = (rol: Rol) => {
    setSelectedRol(rol)
    setEditarModalOpen(true)
  }

  const handleActivarRol = (rol: Rol) => {
    setSelectedRol(rol)
    setActivarModalOpen(true)
  }

  const handleInactivarRol = (rol: Rol) => {
    setSelectedRol(rol)
    setInactivarModalOpen(true)
  }

  if (error) {
    toast.error('Error obteniendo roles', {
      description: MessageInterpreter(error),
    })
  }

  const reloadRoles = async () => {
    await queryClient.invalidateQueries({ queryKey: ['roles'] })
  }

  const toggleFilters = () => {
    setShowFilters(!showFilters)
    setFilter('')
  }

  return (
    <div className="lg:px-8 lg:py-2 sm:px-1 sm:py-2">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Gestión de Roles</h1>
        <div className="flex flex-wrap justify-center sm:justify-end items-center gap-2">
          <Button id='buttonBuscarRol' size={'sm'} onClick={toggleFilters} variant={'outline'}>
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
              await reloadRoles()
            }}
          >
            <RefreshCw className="mr-2 h-4 w-4" /> Recargar
          </Button>
          {permissions.create && (
            <Button id='agregarRol' size={'sm'} onClick={handleAgregarRol}>
              <Plus className="mr-2 h-4 w-4" /> Agregar Rol
            </Button>
          )}
        </div>
      </div>
      {showFilters && (
        <div className="mb-4">
          <RolesFiltros
            filter={filter}
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
        <VerRolModal
          rol={selectedRol}
          isOpen={verModalOpen}
          onClose={() => setVerModalOpen(false)}
        />
      )}
      {editarModalOpen && (
        <AgregarEditarRolModal
          rol={selectedRol}
          isOpen={editarModalOpen}
          onClose={() => setEditarModalOpen(false)}
          onSuccess={reloadRoles}
        />
      )}
      {activarModalOpen && (
        <ActivarRolModal
          rol={selectedRol}
          isOpen={activarModalOpen}
          onClose={() => setActivarModalOpen(false)}
          onSuccess={reloadRoles}
        />
      )}
      {inactivarModalOpen && (
        <InactivarRolModal
          rol={selectedRol}
          isOpen={inactivarModalOpen}
          onClose={() => setInactivarModalOpen(false)}
          onSuccess={reloadRoles}
        />
      )}
    </div>
  )
}
