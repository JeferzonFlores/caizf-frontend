import { useMemo } from 'react'
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
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import { useAuth } from '@/contexts/AuthProvider'
import { print } from '@/lib/print'
import { PoliticasResponse } from '@/app/admin/(principal)/home/types'
import { useBreakpoint } from '@/hooks/use-breakpoint'

export default function AccessPoliciesByRole() {
  const { sessionRequest } = useAuth()
  const sm = useBreakpoint('sm')

  const {
    data: politicasData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['politicas'],
    queryFn: async () => {
      const response = await sessionRequest<PoliticasResponse>({
        url: '/autorizacion/politicas',
        method: 'get',
        params: { pagina: 1, limite: 50 },
      })
      return response?.data
    },
  })

  // Log de error si ocurre
  if (error) {
    print('Error fetching politicas data:', error)
  }

  const { politicasChartData, politicasChartConfig } = useMemo(() => {
    if (!politicasData)
      return { politicasChartData: [], politicasChartConfig: {} }

    const actionCounts: Record<string, Record<string, number>> = {}
    const uniqueActions = new Set<string>()

    politicasData.datos.filas.forEach((politica) => {
      if (politica.app === 'frontend') {
        const acciones = politica.accion.split('|')
        if (!actionCounts[politica.sujeto]) {
          actionCounts[politica.sujeto] = {}
        }
        acciones.forEach((accion) => {
          uniqueActions.add(accion)
          actionCounts[politica.sujeto][accion] =
            (actionCounts[politica.sujeto][accion] || 0) + 1
        })
      }
    })

    const chartData = Object.entries(actionCounts).map(([role, actions]) => ({
      role,
      ...actions,
    }))

    const config: ChartConfig = {}
    Array.from(uniqueActions).forEach((action, index) => {
      config[action] = {
        label: action.charAt(0).toUpperCase() + action.slice(1),
        color: `hsl(var(--chart-${index + 1}))`,
      }
    })

    return { politicasChartData: chartData, politicasChartConfig: config }
  }, [politicasData])

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
        <CardTitle>Políticas de Acceso por Rol</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex justify-center items-center px-6 pb-6">
        <ChartContainer
          config={politicasChartConfig}
          className="w-full min-h-[250px] max-h-[350px] flex justify-center items-center"
        >
          <BarChart accessibilityLayer data={politicasChartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="role"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 20)}
            />
            {sm && <YAxis />}
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <ChartLegend content={<ChartLegendContent />} />
            {Object.keys(politicasChartConfig).map((action) => (
              <Bar
                key={action}
                dataKey={action}
                stackId="a"
                fill={`var(--color-${action})`}
              />
            ))}
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
