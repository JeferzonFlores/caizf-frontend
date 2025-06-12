import React from 'react'
import { Constants } from '@/config/Constants'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const EnvironmentIndicator = () => {
  const entorno = Constants.appEnv

  const getMessage = () => {
    switch (entorno) {
      case 'development':
        return 'DEV'
      case 'test':
        return 'TEST'
      case 'production':
        return 'PROD'
      default:
        return entorno.toUpperCase()
    }
  }

  // No retornamos null para producción, ahora siempre mostramos el indicador
  return (
    <Badge
      variant="secondary"
      className={cn(
        'fixed right-4 bottom-4 z-50 px-3 py-1 text-white font-bold shadow-lg',
        'bg-red-600 hover:bg-red-700'
      )}
    >
      {getMessage()}
    </Badge>
  )
}

export default EnvironmentIndicator
