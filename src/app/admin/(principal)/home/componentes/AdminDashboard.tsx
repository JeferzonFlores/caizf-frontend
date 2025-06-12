'use client'

import { useAuth } from '@/contexts/AuthProvider'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import DashboardHeader from './DashboardHeader'
import DashboardSummary from './DashboardSummary'
import UserRoleDistribution from '@/app/admin/(principal)/home/componentes/graficos/UserRoleDistribution'
import AccessPoliciesByRole from '@/app/admin/(principal)/home/componentes/graficos/AccessPoliciesByRole'
import UserGrowth from '@/app/admin/(principal)/home/componentes/graficos/UserGrowth'
import ModulesByRole from '@/app/admin/(principal)/home/componentes/graficos/ModulesByRole'
import RecentActivities from './graficos/RecentActivities'
import React, { useEffect, useState } from 'react'
import { print } from '@/lib/print'

export default function AdminDashboard() {
  const { user, checkPermission } = useAuth()

  const [permissions, setPermissions] = useState({
    getUsers: false,
    getPolicies: false,
    getModules: false,
  })

  useEffect(() => {
    const fetchPermissions = async () => {
      setPermissions({
        getUsers: await checkPermission('/admin/usuarios', 'read'),
        getPolicies: await checkPermission('/admin/politicas', 'read'),
        getModules: await checkPermission('/admin/modulos', 'read'),
      })
    }

    fetchPermissions().catch(print)
  }, [user, checkPermission])

  const hasAnyPermission = Object.values(permissions).some(Boolean)

  return (
    <div className="p-4 lg:p-8">
      <DashboardHeader />
      <DashboardSummary />
      <Tabs defaultValue="charts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="charts">Gráficos</TabsTrigger>
          <TabsTrigger value="activities">Actividades Recientes</TabsTrigger>
        </TabsList>
        <TabsContent value="charts" className="space-y-4">
          {hasAnyPermission ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {permissions.getUsers && <UserRoleDistribution />}
              {permissions.getPolicies && <AccessPoliciesByRole />}
              {permissions.getUsers && <UserGrowth />}
              {permissions.getModules && <ModulesByRole />}
            </div>
          ) : (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Sin permisos</AlertTitle>
              <AlertDescription>
                No tienes permisos para ver los gráficos de estadísticas. Por
                favor, contacta con el administrador si crees que esto es un
                error.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>
        <TabsContent value="activities">
          <RecentActivities />
        </TabsContent>
      </Tabs>
    </div>
  )
}
