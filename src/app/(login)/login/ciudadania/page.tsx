'use client'
import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { delay } from '@/lib/utilities'
import { guardarCookie } from '@/lib/cookies'
import { MessageInterpreter } from '@/lib/messageInterpreter'
import { useAuth } from '@/contexts/AuthProvider'
import { useQuery } from '@tanstack/react-query'
import { useLoading } from '@/contexts/LoadingProvider'
import { print } from '@/lib/print'
import { useApi } from '@/lib/useApi'

export default function CiudadaniaPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { fetchUserProfile } = useAuth()
  const { showLoading, hideLoading } = useLoading()
  const { request } = useApi()

  const autorizarCiudadania = async (parametros: Record<string, string>) => {
    const response = await request<any>({
      url: '/ciudadania-autorizar',
      method: 'get',
      params: parametros,
    })

    return response.data
  }

  const { isLoading, error, data } = useQuery({
    queryKey: ['autorizarCiudadania', searchParams.toString()],
    queryFn: () =>
      autorizarCiudadania(Object.fromEntries(searchParams.entries())),
    enabled: searchParams.size > 0 && !searchParams.has('error'),
    retry: false,
  })

  useEffect(() => {
    if (data) {
      const handleSuccess = async () => {
        if (data.url) {
          toast.error('Error en autenticación', {
            description: data.mensaje || 'Error en autenticación',
          })
          await delay(2000)
          window.location.href = data.url
          return
        }

        print(`Sesión Autorizada`, data)
        guardarCookie('auth', data.access_token, { path: '/' })
        await fetchUserProfile()
        router.replace('/admin/home')
      }

      handleSuccess().catch(print)
    }
  }, [data, router, fetchUserProfile])

  useEffect(() => {
    if (error) {
      const handleError = async () => {
        print(`Error al autorizar sesión`, error)
        toast.error('Error', {
          description: MessageInterpreter(error.message),
        })

        showLoading()
        await delay(1000)
        router.replace('/login')
        hideLoading()
      }

      handleError().catch(print)
    }
  }, [error, router, showLoading, hideLoading])

  useEffect(() => {
    if (searchParams.size === 0 || searchParams.has('error')) {
      router.replace('/login')
    }
  }, [searchParams, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4" />
          <h2 className="text-lg font-semibold">Ingresando con Ciudadanía</h2>
          <p className="text-sm text-muted-foreground">Por favor espere...</p>
        </div>
      </div>
    )
  }

  return null
}
