'use client'
import * as React from 'react'
import { useEffect, useState } from 'react'
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Edit,
  Eye,
  Key,
  Power,
  PowerOff,
  RefreshCw,
  Search,
  UserPlus,
  XIcon,
} from 'lucide-react'
import { DataTable } from '@/components/data-table/DataTable'
import { VerUsuarioModal } from '@/app/admin/(configuracion)/usuarios/components/VerUsuarioModal'
import { AgregarEditarUsuarioModal } from '@/app/admin/(configuracion)/usuarios/components/AgregarEditarUsuarioModal'
import { SortableHeader } from '@/components/data-table/SortableHeader'
import {
  RolResponse,
  Usuario,
  UsuariosResponse,
} from '@/app/admin/(configuracion)/usuarios/types'
import { useDebounce } from 'use-debounce'
import { useAuth } from '@/contexts/AuthProvider'
import { ActivarUsuarioModal } from '@/app/admin/(configuracion)/usuarios/components/ActivarUsuarioModal'
import { InactivarUsuarioModal } from '@/app/admin/(configuracion)/usuarios/components/InactivarUsuarioModal'
import { RestablecerContrasenaModal } from '@/app/admin/(configuracion)/usuarios/components/RestablecerContrasenaModal'
import { UsuariosFiltros } from '@/app/admin/(configuracion)/usuarios/components/UsuariosFiltros'
import { print } from '@/lib/print'
import { toast } from 'sonner'
import { MessageInterpreter } from '@/lib/messageInterpreter'

export function UsuariosDataTable() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [filters, setFilters] = useState({
    filter: '',
    roleFilter: [] as string[],
  })
  const [debouncedFilter] = useDebounce(filters.filter, 500)
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null)
  const [verModalOpen, setVerModalOpen] = useState(false)
  const [editarModalOpen, setAgregarEditarModalOpen] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [activarModalOpen, setActivarModalOpen] = useState(false)
  const [inactivarModalOpen, setInactivarModalOpen] = useState(false)
  const [restablecerModalOpen, setRestablecerModalOpen] = useState(false)
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
        checkPermission('/admin/usuarios', 'create'),
        checkPermission('/admin/usuarios', 'read'),
        checkPermission('/admin/usuarios', 'update'),
        checkPermission('/admin/usuarios', 'delete'),
      ])
      setPermissions({ create, read, update, delete: del })
    }

    fetchPermissions().catch(print)
  }, [checkPermission])

  const fetchUsuarios = async () => {
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

    if (filters.roleFilter.length > 0) {
      params.rol = filters.roleFilter.join(',')
    }

    const response = await sessionRequest<UsuariosResponse>({
      url: '/usuarios',
      method: 'get',
      params,
    })

    return response?.data
  }

  const { data, isLoading, error } = useQuery({
    queryKey: [
      'usuarios',
      pagination,
      sorting,
      debouncedFilter,
      filters.roleFilter,
    ],
    queryFn: fetchUsuarios,
    placeholderData: keepPreviousData,
  })

  const { data: rolesData } = useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      const response = await sessionRequest<RolResponse>({
        url: '/autorizacion/roles',
        method: 'get',
      })
      return response?.data.datos ?? []
    },
  })

  const reloadUsuarios = async () => {
    await queryClient.invalidateQueries({ queryKey: ['usuarios'] })
  }

  const columns: ColumnDef<Usuario>[] = [
    {
      accessorKey: 'persona.nroDocumento',
      header: ({ column }) => (
        <SortableHeader column={column} title="Nro. Documento" />
      ),
      size: 150,
      meta: { mobileTitle: 'Nro. Documento' },
    },
    {
      accessorKey: 'persona',
      header: ({ column }) => (
        <SortableHeader column={column} title="Nombres" />
      ),
      cell: ({ row }) => {
        const { nombres, primerApellido, segundoApellido } =
          row.original.persona
        return `${nombres} ${primerApellido} ${segundoApellido}`
      },
      meta: { mobileTitle: 'Nombres' },
    },
    {
      accessorKey: 'usuario',
      header: ({ column }) => (
        <SortableHeader column={column} title="Usuario" />
      ),
      meta: { mobileTitle: 'Usuario' },
    },
    {
      accessorKey: 'ciudadaniaDigital',
      header: 'Tipo',
      cell: ({ row }) =>
        row.original.ciudadaniaDigital ? 'Ciudadanía Digital' : 'Normal',
      meta: { mobileTitle: 'Tipo' },
    },
    {
      accessorKey: 'usuarioRol',
      header: 'Roles',
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.usuarioRol.map((ur, index) => (
            <Badge key={index} variant="secondary">
              {ur.rol.rol}
            </Badge>
          ))}
        </div>
      ),
      meta: { mobileTitle: 'Roles' },
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
              onClick={() => handleVerUsuario(row.original)}
            >
              <Eye className="h-4 w-4" />
            </Button>
          )}
          {permissions.update && (
            <>
              <Button
                title='Editar'
                variant="outline"
                size="icon"
                onClick={() => handleAgregarEditarUsuario(row.original)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              {row.original.estado === 'INACTIVO' ? (
                <Button
                  title='Activar'
                  variant="outline"
                  size="icon"
                  onClick={() => handleActivarUsuario(row.original)}
                >
                  <Power className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  title='Inactivar'
                  variant="outline"
                  size="icon"
                  onClick={() => handleInactivarUsuario(row.original)}
                >
                  <PowerOff className="h-4 w-4" />
                </Button>
              )}
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleRestablecerContrasena(row.original)}
              >
                <Key className="h-4 w-4" />
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

  const handleRoleFilterChange = (selectedRoles: string[]) => {
    setFilters((prev) => ({ ...prev, roleFilter: selectedRoles }))
  }

  const handleClearFilter = () => {
    setFilters({ filter: '', roleFilter: [] })
  }

  const toggleFilters = () => {
    setShowFilters((prev) => !prev)
    if (showFilters) {
      handleClearFilter()
    }
  }

  const handleVerUsuario = (usuario: Usuario) => {
    setSelectedUser(usuario)
    setVerModalOpen(true)
  }

  const handleAgregarEditarUsuario = (usuario: Usuario | null) => {
    setSelectedUser(usuario)
    setAgregarEditarModalOpen(true)
  }

  const handleActivarUsuario = (usuario: Usuario) => {
    setSelectedUser(usuario)
    setActivarModalOpen(true)
  }

  const handleInactivarUsuario = (usuario: Usuario) => {
    setSelectedUser(usuario)
    setInactivarModalOpen(true)
  }

  const handleRestablecerContrasena = (usuario: Usuario) => {
    setSelectedUser(usuario)
    setRestablecerModalOpen(true)
  }

  if (error) {
    toast.error('Error obteniendo usuarios', {
      description: MessageInterpreter(error),
    })
  }

  return (
    <div className="lg:px-8 lg:py-2 sm:px-1 sm:py-2">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold ">Gestión de Usuarios</h1>
        <div className="flex flex-wrap justify-center sm:justify-end items-center gap-2">
          <Button id='buttonBuscarUsuario' size={'sm'} onClick={toggleFilters} variant={'outline'}>
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
              await reloadUsuarios()
            }}
          >
            <RefreshCw className="mr-2 h-4 w-4" /> Recargar
          </Button>
          {permissions.create && (
            <Button
              id='agregarUsuario'
              size={'sm'}
              onClick={() => handleAgregarEditarUsuario(null)}
            >
              <UserPlus className="mr-2 h-4 w-4" /> Agregar Usuario
            </Button>
          )}
        </div>
      </div>
      {showFilters && (
        <div className="mb-4">
          <UsuariosFiltros
            filter={filters.filter}
            roleFilter={filters.roleFilter}
            roles={rolesData ?? []}
            onFilterChange={handleFilterChange}
            onRoleFilterChange={handleRoleFilterChange}
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
        <VerUsuarioModal
          usuario={selectedUser}
          isOpen={verModalOpen}
          onClose={() => setVerModalOpen(false)}
        />
      )}
      {editarModalOpen && (
        <AgregarEditarUsuarioModal
          usuario={selectedUser}
          isOpen={editarModalOpen}
          roles={rolesData ?? []}
          onSuccess={reloadUsuarios}
          onClose={() => setAgregarEditarModalOpen(false)}
        />
      )}
      {activarModalOpen && (
        <ActivarUsuarioModal
          usuario={selectedUser}
          isOpen={activarModalOpen}
          onClose={() => setActivarModalOpen(false)}
          onSuccess={reloadUsuarios}
        />
      )}
      {inactivarModalOpen && (
        <InactivarUsuarioModal
          usuario={selectedUser}
          isOpen={inactivarModalOpen}
          onClose={() => setInactivarModalOpen(false)}
          onSuccess={reloadUsuarios}
        />
      )}
      {restablecerModalOpen && (
        <RestablecerContrasenaModal
          usuario={selectedUser}
          isOpen={restablecerModalOpen}
          onClose={() => setRestablecerModalOpen(false)}
          onSuccess={reloadUsuarios}
        />
      )}
    </div>
  )
}
