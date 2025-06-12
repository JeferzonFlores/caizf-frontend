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
import { print } from '@/lib/print'
import { useAuth } from '@/contexts/AuthProvider'
import { PoliticasResponse } from '@/app/admin/(principal)/home/types'
import { useBreakpoint } from '@/hooks/use-breakpoint'

export default function ModulesByRole() {
  const { sessionRequest } = useAuth()
  const sm = useBreakpoint('sm')

  const fetchPoliticas = async () => {
    const response = await sessionRequest<PoliticasResponse>({
      url: '/autorizacion/politicas',
      method: 'get',
      params: { pagina: 1, limite: 50 },
    })
    return response?.data
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ['politicas'],
    queryFn: fetchPoliticas,
  })

  const { modulesByRoleData, modulesByRoleConfig } = useMemo(() => {
    if (!data) return { modulesByRoleData: [], modulesByRoleConfig: {} }

    const modulesByRole: Record<string, Record<string, number>> = {}
    const modules = new Set<string>()

    data?.datos?.filas.forEach((politica) => {
      print(`politica: `, politica)
      if (politica.app === 'frontend') {
        const role = politica.sujeto
        const moduleName = politica.objeto.split('/')[2]

        if (!modulesByRole[role]) modulesByRole[role] = {}
        if (!modulesByRole[role][moduleName])
          modulesByRole[role][moduleName] = 0
        modulesByRole[role][moduleName]++
        modules.add(moduleName)
      }
    })

    const chartData = Object.entries(modulesByRole).map(([role, modules]) => ({
      role,
      ...modules,
    }))

    const config: ChartConfig = {}
    Array.from(modules).forEach((module, index) => {
      if (module) {
        config[module] = {
          label: module?.charAt(0)?.toUpperCase() + module?.slice(1),
          color: `hsl(var(--chart-${index + 1}))`,
        }
      }
    })

    return { modulesByRoleData: chartData, modulesByRoleConfig: config }
  }, [data])

  if (error) {
    print('Error fetching modules by role data:', error)
    return <div>Error al cargar los datos</div>
  }

  return (
    <Card className="flex flex-col h-full justify-center">
      <CardHeader className="items-center">
        <CardTitle>Módulos por Rol</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex justify-center items-center px-6 pb-6">
        {isLoading ? (
          <div>Cargando...</div>
        ) : (
          <ChartContainer
            config={modulesByRoleConfig}
            className="w-full min-h-[250px] max-h-[350px] flex justify-center items-center"
          >
            <BarChart accessibilityLayer data={modulesByRoleData}>
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
              <ChartLegend
                className="flex-wrap gap-2"
                content={<ChartLegendContent />}
              />
              {Object.keys(modulesByRoleConfig).map((module, index) => (
                <Bar
                  key={`${module}-${index}`}
                  dataKey={module}
                  stackId="a"
                  fill={`var(--color-${module})`}
                />
              ))}
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
