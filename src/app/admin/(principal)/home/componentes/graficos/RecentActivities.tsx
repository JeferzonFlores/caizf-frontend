import { useMemo, useState, useEffect } from 'react'
import { useQueries } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ContactRound, Puzzle, Users } from 'lucide-react'
import { useAuth } from '@/contexts/AuthProvider'
import { print } from '@/lib/print'
import {
  ModulosResponse,
  RolesResponse,
  UsuariosResponse,
} from '@/app/admin/(principal)/home/types'

type ActivityType = 'usuario' | 'rol' | 'modulo'

interface Activity {
  id: string
  tipo: ActivityType
  accion: string
  entidad: string
  fecha: string
  time?: string
}

export default function RecentActivities() {
  const { sessionRequest, checkPermission } = useAuth()
  const [permissions, setPermissions] = useState({
    getUsers: false,
    getRoles: false,
    getModules: false,
  })

  useEffect(() => {
    const fetchPermissions = async () => {
      const [getUsers, getRoles, getModules] = await Promise.all([
        checkPermission('/admin/usuarios', 'read'),
        checkPermission('/admin/roles', 'read'),
        checkPermission('/admin/modulos', 'read'),
      ])
      setPermissions({ getUsers, getRoles, getModules })
    }

    fetchPermissions().catch(print)
  }, [checkPermission])

  const queryConfigs = useMemo(() => {
    const configs = []

    if (permissions.getUsers) {
      configs.push({
        queryKey: ['usuarios'],
        queryFn: () =>
          sessionRequest<UsuariosResponse>({
            url: '/usuarios',
            method: 'get',
            params: { limite: 10, pagina: 1, orden: '-fechaCreacion' },
          }),
      })
    }

    if (permissions.getRoles) {
      configs.push({
        queryKey: ['roles'],
        queryFn: () =>
          sessionRequest<RolesResponse>({
            url: '/autorizacion/roles/todos',
            method: 'get',
            params: { limite: 10, pagina: 1, orden: '-fechaCreacion' },
          }),
      })
    }

    if (permissions.getModules) {
      configs.push({
        queryKey: ['modulos'],
        queryFn: () =>
          sessionRequest<ModulosResponse>({
            url: '/autorizacion/modulos',
            method: 'get',
            params: { limite: 10, pagina: 1, orden: '-fechaCreacion' },
          }),
      })
    }

    return configs
  }, [permissions, sessionRequest])

  const queries = useQueries({ queries: queryConfigs })

  const activities = useMemo(() => {
    if (queries.some((query) => query.isLoading)) return []

    const allActivities = queries.flatMap((query, index) => {
      const data = query.data?.data?.datos?.filas
      if (!data) return []

      const tipo = ['usuario', 'rol', 'modulo'][index] as ActivityType
      return data.map((item: any) => ({
        id: `${tipo}-${item.id}`,
        tipo,
        accion: 'creado',
        entidad: item.usuario || item.nombre,
        fecha: item.fechaCreacion,
      }))
    })

    return allActivities
      .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
      .slice(0, 10)
      .map((activity) => ({
        ...activity,
        time: new Date(activity.fecha).toLocaleString(),
      }))
  }, [queries])

  const isLoading = queries.some((query) => query.isLoading)
  const error = queries.find((query) => query.error)

  const getActivityIcon = (tipo: string) => {
    switch (tipo) {
      case 'usuario':
        return <Users className="h-6 w-6 text-blue-500" />
      case 'rol':
        return <ContactRound className="h-6 w-6 text-green-500" />
      case 'modulo':
        return <Puzzle className="h-6 w-6 text-purple-500" />
      default:
        return <ContactRound className="h-6 w-6 text-gray-500" />
    }
  }

  const getActivityMessage = (activity: Activity) => {
    return `${activity.tipo.charAt(0).toUpperCase() + activity.tipo.slice(1)} ${activity.accion}: ${activity.entidad}`
  }

  if (error) {
    print('Error fetching recent activities:', error.error)
    return <div>Error al cargar las actividades recientes</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Actividades Recientes</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div>Cargando...</div>
        ) : activities.length > 0 ? (
          <ul className="space-y-4">
            {activities.map((activity) => (
              <li
                key={activity.id}
                className="flex items-center space-x-4 p-4 bg-accent rounded-lg transition-colors hover:bg-accent/80"
              >
                <div className="flex-shrink-0">
                  {getActivityIcon(activity.tipo)}
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    {getActivityMessage(activity)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {activity.time}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div>No hay actividades recientes para mostrar</div>
        )}
      </CardContent>
    </Card>
  )
}
