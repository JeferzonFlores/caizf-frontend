import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ContactRound, Puzzle, Users } from 'lucide-react'
import { useAuth } from '@/contexts/AuthProvider'
import {
  ModulosResponse,
  RolesResponse,
  UsuariosResponse,
} from '@/app/admin/(principal)/home/types'

export default function DashboardSummary() {
  const { sessionRequest, checkPermission, user } = useAuth()

  const { data: permissions } = useQuery({
    queryKey: ['dashboardPermissions', user?.id],
    queryFn: async () => ({
      getUsers: await checkPermission('/admin/usuarios', 'read'),
      getRoles: await checkPermission('/admin/roles', 'read'),
      getModules: await checkPermission('/admin/modulos', 'read'),
    }),
    enabled: !!user,
  })

  const { data: usersData, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['users'],
    queryFn: () =>
      sessionRequest<UsuariosResponse>({
        url: '/usuarios',
        method: 'get',
        params: { pagina: 1, limite: 10 },
      }),
    enabled: !!permissions?.getUsers,
  })

  const { data: rolesData, isLoading: isLoadingRoles } = useQuery({
    queryKey: ['roles'],
    queryFn: () =>
      sessionRequest<RolesResponse>({
        url: '/autorizacion/roles/todos',
        method: 'get',
        params: { pagina: 1, limite: 10 },
      }),
    enabled: !!permissions?.getRoles,
  })

  const { data: modulesData, isLoading: isLoadingModules } = useQuery({
    queryKey: ['modules'],
    queryFn: () =>
      sessionRequest<ModulosResponse>({
        url: '/autorizacion/modulos',
        method: 'get',
        params: { pagina: 1, limite: 10 },
      }),
    enabled: !!permissions?.getModules,
  })

  const isLoading = isLoadingUsers || isLoadingRoles || isLoadingModules

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {permissions?.getUsers && (
        <Card className="transition-shadow hover:shadow-lg ">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Usuarios
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading
                ? 'Cargando...'
                : (usersData?.data.datos.total ?? 'N/A')}
            </div>
          </CardContent>
        </Card>
      )}

      {permissions?.getRoles && (
        <Card className="transition-shadow hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Roles
            </CardTitle>
            <ContactRound className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading
                ? 'Cargando...'
                : (rolesData?.data?.datos?.total ?? 'N/A')}
            </div>
          </CardContent>
        </Card>
      )}

      {permissions?.getModules && (
        <Card className="transition-shadow hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Módulos
            </CardTitle>
            <Puzzle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading
                ? 'Cargando...'
                : (modulesData?.data.datos.total ?? 'N/A')}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
