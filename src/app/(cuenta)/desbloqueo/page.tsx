'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { Constants } from '@/config/Constants'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useLoading } from '@/contexts/LoadingProvider'
import { useApi } from '@/lib/useApi'
import { print } from '@/lib/print'
import { delay, siteName } from '@/lib/utilities'
import { MessageInterpreter } from '@/lib/messageInterpreter'
import { CheckCircle, Loader2, LockOpen, XCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export default function DesbloqueoPage() {
  const { showLoading, hideLoading } = useLoading()
  const { request } = useApi()
  const router = useRouter()
  const searchParams = useSearchParams()
  const codigoDesbloqueo = searchParams.get('q')

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ['desbloqueo', codigoDesbloqueo],
    queryFn: async () => {
      if (!codigoDesbloqueo)
        throw new Error('No se proporcionó un código de desbloqueo válido.')
      await delay(1000)
      const respuesta = await request<any>({
        url: `${Constants.baseUrl}/usuarios/cuenta/desbloqueo`,
        params: { id: codigoDesbloqueo },
      })
      return respuesta.data
    },
    enabled: !!codigoDesbloqueo,
    retry: false,
  })

  const redireccionarInicio = async () => {
    showLoading()
    await delay(1000)
    router.replace('/login')
    hideLoading()
  }

  const mensaje = isError
    ? MessageInterpreter(
        error instanceof AxiosError
          ? error.response?.data?.mensaje || error.message
          : String(error)
      )
    : data
      ? MessageInterpreter(data)
      : ''

  print('Estado de desbloqueo:', {
    isLoading,
    isError,
    data,
    error,
    mensaje,
  })

  return (
    <>
      <title>{`Desbloqueo de cuenta - ${siteName()}`}</title>
      <div className="container flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex justify-center mb-6">
              <LockOpen className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold text-center flex items-center justify-center">
              Desbloqueo de Cuenta
            </CardTitle>
            <CardDescription className="text-center">
              Proceso de desbloqueo de su cuenta
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {isLoading ? (
              <div className="flex flex-col items-center">
                <Loader2 className="h-8 w-8 animate-spin" />
                <p className="mt-2">Procesando su solicitud...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                {(isError || data) && (
                  <Alert
                    variant={isError ? 'destructive' : 'default'}
                    className="mb-4"
                  >
                    {isError ? (
                      <XCircle className="h-4 w-4" />
                    ) : (
                      <CheckCircle className="h-4 w-4" />
                    )}
                    <AlertTitle>{isError ? 'Error' : 'Éxito'}</AlertTitle>
                    <AlertDescription>{mensaje}</AlertDescription>
                  </Alert>
                )}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              onClick={redireccionarInicio}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <LockOpen className="mr-2 h-4 w-4" />
              )}
              Ir al inicio de sesión
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  )
}
