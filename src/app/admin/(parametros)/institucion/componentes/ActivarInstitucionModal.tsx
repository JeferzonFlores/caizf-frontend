import { Institucion } from '@/app/admin/(parametros)/institucion/componentes/types'
import { useAuth } from '@/contexts/AuthProvider'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { MessageInterpreter } from '@/lib/messageInterpreter'
import { print } from '@/lib/print'

interface ActivarInstitucionModalProps {
  institucion: Institucion | null
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function ActivarInstitucionModal({
  institucion,
  isOpen,
  onClose,
  onSuccess,
}: ActivarInstitucionModalProps) {
  const { sessionRequest } = useAuth()

  const handleActivar = async () => {
    if (!institucion) return

    try {
      const respuesta = await sessionRequest({
        url: `/institution/${institucion.id}/activacion`,
        method: 'PATCH',
      })
      toast.success('Parámetro activado', {
        description: MessageInterpreter(respuesta?.data),
      })
      onSuccess()
    } catch (error) {
      print('Error al activar parámetro:', error)
      toast.error('Error', {
        description: MessageInterpreter(error),
      })
    } finally {
      onClose()
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Activar parámetro?</AlertDialogTitle>
          <AlertDialogDescription>
            ¿Está seguro que desea activar el parámetro {institucion?.institucion}?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleActivar}>Activar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
