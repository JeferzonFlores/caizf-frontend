import React, { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { Pie, PieChart } from 'recharts'
import { useAuth } from '@/contexts/AuthProvider'
import { print } from '@/lib/print'
import { UsuariosResponse } from '@/app/admin/(principal)/home/types'

interface UserRoleDistributionProps {
  animationDuration?: number
  isAnimationActive?: boolean
}

const UserRoleDistribution: React.FC<UserRoleDistributionProps> = ({
  animationDuration = 300,
  isAnimationActive = true,
}) => {
  const { sessionRequest } = useAuth()

  const {
    data: userData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['userRoles'],
    queryFn: async () => {
      const response = await sessionRequest<UsuariosResponse>({
        url: '/usuarios',
        method: 'get',
        params: { pagina: 1, limite: 50 },
      })
      return response?.data
    },
  })

  const { userRoleData, userRoleChartConfig } = useMemo(() => {
    if (!userData) return { userRoleData: [], userRoleChartConfig: {} }

    const roleCounts: Record<string, number> = {}
    for (const user of userData.datos.filas) {
      for (const role of user.usuarioRol) {
        roleCounts[role.rol.rol] = (roleCounts[role.rol.rol] || 0) + 1
      }
    }

    const chartData = Object.entries(roleCounts).map(([role, count]) => ({
      browser: role,
      value: count,
      fill: `var(--color-${role})`,
    }))

    const config: ChartConfig = {
      value: {
        label: 'value',
      },
    }

    Object.keys(roleCounts).forEach((role, index) => {
      const formattedRole =
        role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()
      config[role] = {
        label: formattedRole,
        color: `hsl(var(--chart-${index + 1}))`,
      }
    })

    return { userRoleData: chartData, userRoleChartConfig: config }
  }, [userData])

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: any) => {
    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <div>Cargando...</div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    print('Error fetching user role data:', error)
    return (
      <Card>
        <CardContent>
          <div>Error al cargar los datos. Por favor, intente más tarde.</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="flex flex-col h-full justify-center">
      <CardHeader className="items-center">
        <CardTitle>Distribución de Roles de Usuario</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex justify-center items-center px-6 pb-6">
        <ChartContainer
          config={userRoleChartConfig}
          className="w-full min-h-[250px] max-h-[350px] flex justify-center items-center"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent nameKey="browser" hideLabel />}
            />
            <Pie
              data={userRoleData}
              labelLine={false}
              label={renderCustomizedLabel}
              dataKey="value"
              isAnimationActive={isAnimationActive}
              animationDuration={animationDuration}
            />
            <ChartLegend
              content={<ChartLegendContent nameKey="browser" />}
              className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default UserRoleDistribution
