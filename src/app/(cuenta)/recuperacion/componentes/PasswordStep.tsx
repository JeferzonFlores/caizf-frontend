import React from 'react'
import {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import PasswordForm from './PasswordForm'
import { LockKeyhole } from 'lucide-react'

interface PasswordStepProps {
  onSubmit: (password: string) => void
  isLoading: boolean
}

export default function PasswordStep({
  onSubmit,
  isLoading,
}: PasswordStepProps) {
  return (
    <>
      <CardHeader>
        <div className="flex justify-center mb-6">
          <LockKeyhole className="h-12 w-12 text-primary" />
        </div>
        <CardTitle className="text-2xl font-bold text-center">
          Cambia tu contraseña
        </CardTitle>
        <CardDescription className="text-center mt-2">
          Ingresa tu nueva contraseña para recuperar tu cuenta.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <PasswordForm onSubmit={onSubmit} isLoading={isLoading} />
      </CardContent>
    </>
  )
}
