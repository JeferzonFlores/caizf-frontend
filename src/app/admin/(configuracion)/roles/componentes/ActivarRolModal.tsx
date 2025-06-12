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
import { Rol } from '@/app/admin/(configuracion)/roles/componentes/types'

interface ActivarRolModalProps {
  rol: Rol | null
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function ActivarRolModal({
  rol,
  isOpen,
  onClose,
  onSuccess,
}: ActivarRolModalProps) {
  const { sessionRequest } = useAuth()

  const handleActivar = async () => {
    if (!rol) return

    try {
      const result = await sessionRequest({
        url: `/autorizacion/roles/${rol.id}/activacion`,
        method: 'PATCH',
      })
      toast.success('Rol activado', {
        description: MessageInterpreter(result?.data),
      })
      onSuccess()
    } catch (error) {
      print('Error al activar rol:', error)
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
          <AlertDialogTitle>¿Activar rol?</AlertDialogTitle>
          <AlertDialogDescription>
            ¿Está seguro que desea activar el rol {rol?.nombre}?
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
