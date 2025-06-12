import { httpClient } from './HttpClient'
import { AxiosError, AxiosRequestConfig } from 'axios'
import { print } from '@/lib/print'

const SUCCESSFUL_STATUS_CODES = [200, 201, 202]

export const useApi = () => {
  const request = async <T>(config: AxiosRequestConfig) => {
    print(
      `🚀 Iniciando petición ${config.method?.toUpperCase() ?? ''} a ${config.url}`
    )
    print(`📊 Parámetros:`, config.params || 'Ninguno')
    print(`📦 Cuerpo de la petición:`, config.data || 'Ninguno')

    try {
      const response = await httpClient.request<T>(config)

      if (!SUCCESSFUL_STATUS_CODES.includes(response.status)) {
        print(
          `❌ Error en la petición: ${response.status} ${response.statusText}`
        )
        throw new Error(response.statusText || 'Error en la solicitud')
      }

      print(`✅ Petición exitosa: ${response.status} ${response.statusText}`)
      print(`📩 Respuesta:`, response.data)

      return response
    } catch (error) {
      if (isNetworkError(error)) {
        print(`🌐 Error de red:`, error.message)
      } else {
        print(`🔥 Error en la petición:`, error)
      }
      throw error
    }
  }

  const isNetworkError = (err: AxiosError | any): err is AxiosError => {
    return !!err.isAxiosError && !err.response
  }

  return {
    request,
    isNetworkError,
  }
}
