import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useAuth } from '@/contexts/AuthProvider'
import { print } from '@/lib/print'
import { Constants } from '@/config/Constants'

const formSchema = z.object({
  nombres: z.string().min(1, 'El nombre es requerido'),
  primerApellido: z.string().min(1, 'El primer apellido es requerido'),
  segundoApellido: z.string().optional(),
  correoElectronico: z.string().email('Correo electrónico inválido'),
})

type FormValues = z.infer<typeof formSchema>

interface EditProfileModalProps {
  isOpen: boolean
  onClose: () => void
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { user, updateProfile, sessionRequest } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombres: user?.persona.nombres || '',
      primerApellido: user?.persona.primerApellido || '',
      segundoApellido: user?.persona.segundoApellido || '',
      correoElectronico: user?.correoElectronico || '',
    },
  })

  const onSubmit = async (values: FormValues) => {
    try {
      await sessionRequest({
        url: `${Constants.baseUrl}/usuarios/cuenta/perfil`,
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        data: values,
      })

      await updateProfile()
      onClose()
    } catch (error) {
      print('Error updating profile:', error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Perfil</DialogTitle>
          <DialogDescription>
            Actualiza tu información personal aquí. Haz clic en guardar cuando
            hayas terminado.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div>
            <Label htmlFor="nombres">Nombres</Label>
            <Input id="nombres" {...register('nombres')} />
            {errors.nombres && (
              <p className="text-red-500 text-sm">{errors.nombres.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="primerApellido">Primer Apellido</Label>
            <Input id="primerApellido" {...register('primerApellido')} />
            {errors.primerApellido && (
              <p className="text-red-500 text-sm">
                {errors.primerApellido.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="segundoApellido">Segundo Apellido</Label>
            <Input id="segundoApellido" {...register('segundoApellido')} />
          </div>
          <div>
            <Label htmlFor="correoElectronico">Correo Electrónico</Label>
            <Input id="correoElectronico" {...register('correoElectronico')} />
            {errors.correoElectronico && (
              <p className="text-red-500 text-sm">
                {errors.correoElectronico.message}
              </p>
            )}
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              Guardar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default EditProfileModal
