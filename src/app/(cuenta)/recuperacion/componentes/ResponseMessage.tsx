import React from 'react'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle } from 'lucide-react'

interface ResponseMessageProps {
  message: string
  isSuccess: boolean
  onRedirect: () => void
}

export default function ResponseMessage({
  message,
  isSuccess,
  onRedirect,
}: ResponseMessageProps) {
  return (
    <div className="text-center">
      {isSuccess ? (
        <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
      ) : (
        <XCircle className="mx-auto h-12 w-12 text-red-500" />
      )}
      <p className="mt-4 text-xl font-semibold">{message}</p>
      <Button onClick={onRedirect} className="mt-4 w-full">
        Ir al inicio de sesión
      </Button>
    </div>
  )
}
