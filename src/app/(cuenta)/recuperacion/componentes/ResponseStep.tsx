import React from 'react'
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import ResponseMessage from './ResponseMessage'

interface ResponseStepProps {
  message: string
  isSuccess: boolean
  onRedirect: () => void
}

export default function ResponseStep({
  message,
  isSuccess,
  onRedirect,
}: ResponseStepProps) {
  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Resultado
        </CardTitle>
        <CardDescription className="text-center">
          Información sobre tu solicitud.
        </CardDescription>
      </CardHeader>
      <ResponseMessage
        message={message}
        isSuccess={isSuccess}
        onRedirect={onRedirect}
      />
    </>
  )
}
