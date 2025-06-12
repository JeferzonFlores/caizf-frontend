import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Shield } from 'lucide-react'
import DynamicIcon from '@/components/Icon'
import { useAuth } from '@/contexts/AuthProvider'
import { print } from '@/lib/print'
import { useRouter } from 'next/navigation'

interface AccountDetailsCardProps {}

const AccountDetailsCard: React.FC<AccountDetailsCardProps> = () => {
  const { user, changeRole } = useAuth()
  const router = useRouter()

  if (!user) {
    return null
  }

  const handleRoleChange = async (idRol: string) => {
    try {
      await changeRole(idRol)
    } catch (error) {
      print('Error changing role:', error)
    }
  }

  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader>
        <CardTitle>Detalles de la Cuenta</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="roles">
          <TabsList>
            <TabsTrigger value="roles">Roles</TabsTrigger>
            <TabsTrigger value="modulos">Módulos</TabsTrigger>
          </TabsList>
          <TabsContent value="roles">
            <div className="space-y-4">
              {user.roles.map((role) => (
                <div
                  key={role.idRol}
                  className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-4 rounded-lg"
                  onClick={async () => {
                    await handleRoleChange(role.idRol)
                  }}
                >
                  <div className="flex items-center">
                    <Shield className="mr-2" />
                    <div>
                      <h3 className="font-semibold">{role.nombre}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {role.descripcion}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={user.idRol === role.idRol ? 'default' : 'outline'}
                  >
                    {user.idRol === role.idRol ? 'Activo' : 'Inactivo'}
                  </Badge>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="modulos">
            <div className="space-y-4">
              {user.roles
                .find((r) => r.idRol === user.idRol)
                ?.modulos.map((modulo) => (
                  <div
                    key={modulo.id}
                    className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg"
                  >
                    <h3 className="font-semibold">{modulo.label}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {modulo.propiedades.descripcion}
                    </p>
                    <div className="mt-2 space-y-2">
                      {modulo.subModulo.map((subModulo) => (
                        <div
                          key={subModulo.id}
                          className="bg-white dark:bg-gray-700 p-2 rounded"
                          onClick={() => {
                            router.push(subModulo.url)
                          }}
                        >
                          <div className={'flex items-center'}>
                            <DynamicIcon
                              name={subModulo.propiedades.icono}
                              size={24}
                              className="m-3 ml-2"
                            />
                            <div>
                              <div>
                                <span className={'font-semibold'}>
                                  {subModulo.label}
                                </span>
                              </div>
                              <div>
                                <span className={'text-sm text-gray-500'}>
                                  {subModulo.propiedades.descripcion}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default AccountDetailsCard
