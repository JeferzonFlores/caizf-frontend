import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { Line, LineChart, XAxis, YAxis } from 'recharts'
import { print } from '@/lib/print'
import { useAuth } from '@/contexts/AuthProvider'
import { UsuariosResponse } from '@/app/admin/(principal)/home/types'
import { useBreakpoint } from '@/hooks/use-breakpoint'

export default function UserGrowth() {
  const { sessionRequest } = useAuth()
  const sm = useBreakpoint('sm')

  const { data, isLoading, error } = useQuery({
    queryKey: ['usuarios'],
    queryFn: () =>
      sessionRequest<UsuariosResponse>({
        url: '/usuarios',
        method: 'get',
        params: { pagina: 1, limite: 50 },
      }),
  })

  const userGrowthData = useMemo(() => {
    if (!data) return []

    const sortedUsers = [...data.data?.datos?.filas].sort(
      (a, b) =>
        new Date(a.fechaCreacion).getTime() -
        new Date(b.fechaCreacion).getTime()
    )

    const growthData: { date: string; users: number }[] = []
    let userCount = 0

    sortedUsers.forEach((user) => {
      const date = new Date(user.fechaCreacion).toISOString().split('T')[0]
      userCount++

      if (
        growthData.length === 0 ||
        growthData[growthData.length - 1].date !== date
      ) {
        growthData.push({ date, users: userCount })
      } else {
        growthData[growthData.length - 1].users = userCount
      }
    })

    return growthData
  }, [data])

  const userGrowthConfig: ChartConfig = {
    users: {
      label: 'Usuarios',
      color: '#10B981',
    },
  }

  if (error) {
    print('Error fetching user growth data:', error)
    return <div>Error al cargar los datos</div>
  }

  return (
    <Card className="flex flex-col h-full justify-center">
      <CardHeader className="items-center">
        <CardTitle>Crecimiento de Usuarios</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex justify-center items-center px-6 pb-6">
        {isLoading ? (
          <div>Cargando...</div>
        ) : (
          <ChartContainer
            config={userGrowthConfig}
            className="w-full min-h-[250px] max-h-[350px] flex justify-center items-center"
          >
            <LineChart data={userGrowthData}>
              <XAxis dataKey="date" />
              {sm && <YAxis />}
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Line
                dataKey="desktop"
                type="natural"
                stroke="var(--color-desktop)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                dataKey="users"
                type="natural"
                stroke="var(--color-users)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
