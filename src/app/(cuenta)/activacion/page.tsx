'use client'
import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { Constants } from '@/config/Constants'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { print } from '@/lib/print'
import { delay, siteName } from '@/lib/utilities'
import { useLoading } from '@/contexts/LoadingProvider'
import { useApi } from '@/lib/useApi'
import { MessageInterpreter } from '@/lib/messageInterpreter'
import { CheckCircle, Loader2, XCircle } from 'lucide-react'
import { CustomProgressBar } from '@/components/CustomProgressBar'

export default function ActivacionPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { request } = useApi()
  const { showLoading, hideLoading } = useLoading()

  const codigoActivar = searchParams.get('q')

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ['activacion', codigoActivar],
    queryFn: async () => {
      if (!codigoActivar)
        throw new Error('Código de activación no proporcionado')
      await delay(1000) // Mantenemos el delay para simular carga
      const respuesta = await request({
        url: `${Constants.baseUrl}/usuarios/cuenta/activacion`,
        method: 'patch',
        data: { codigo: codigoActivar },
      })
      return respuesta.data
    },
    enabled: !!codigoActivar,
    retry: false,
  })

  useEffect(() => {
    if (isLoading) {
      showLoading()
    } else {
      hideLoading()
    }
  }, [isLoading, showLoading, hideLoading])

  const redireccionarInicio = async () => {
    showLoading()
    await delay(1000)
    router.replace('/login')
    hideLoading()
  }

  const mensaje = isError
    ? MessageInterpreter(
        error instanceof AxiosError ? error.response?.data : String(error)
      )
    : data
      ? MessageInterpreter(data)
      : ''

  print('Estado de activación:', {
    isLoading,
    isError,
    data,
    error,
    mensaje,
  })

  return (
    <>
      <title>{`Activación de cuenta - ${siteName()}`}</title>
      <div className="container flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex justify-center">
              {isLoading ? (
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
              ) : isError ? (
                <XCircle className="h-12 w-12 text-red-500" />
              ) : (
                <CheckCircle className="h-12 w-12 text-green-500" />
              )}
            </div>
            <CardTitle className="text-2xl font-bold text-center">
              {isLoading
                ? 'Activando cuenta'
                : isError
                  ? 'Error de activación'
                  : 'Cuenta Activa'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                <p className="text-center text-gray-600">
                  Procesando su solicitud...
                </p>
                <CustomProgressBar
                  value={33}
                  className="w-full"
                  indicatorColor={'bg-background'}
                />
              </div>
            ) : (
              <p className="text-center text-gray-600">{mensaje}</p>
            )}
          </CardContent>
          <CardFooter>
            {!isLoading && (
              <Button className="w-full" onClick={redireccionarInicio}>
                Ir al inicio de sesión
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </>
  )
}
