import React from 'react'
import {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import EmailForm from './EmailForm'
import { Mail } from 'lucide-react'

interface EmailStepProps {
  onSubmit: (email: string) => void
  isLoading: boolean
}

export default function EmailStep({ onSubmit, isLoading }: EmailStepProps) {
  return (
    <>
      <CardHeader>
        <div className="flex items-center justify-center mb-4">
          <Mail className="w-12 h-12 text-primary" />
        </div>
        <CardTitle className="text-2xl font-bold text-center">
          Recupera tu cuenta
        </CardTitle>
        <CardDescription className="text-center mt-2">
          Ingresa tu correo electrónico para recibir un enlace de recuperación.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <EmailForm onSubmit={onSubmit} isLoading={isLoading} />
      </CardContent>
    </>
  )
}
