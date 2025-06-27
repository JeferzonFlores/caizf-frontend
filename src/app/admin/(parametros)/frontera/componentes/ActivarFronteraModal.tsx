import { Frontera } from '@/app/admin/(parametros)/frontera/componentes/types'
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

interface ActivarFronteraModalProps {
 frontera: Frontera | null
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function ActivarFronteraModal({
  frontera,
  isOpen,
  onClose,
  onSuccess,
}: ActivarFronteraModalProps) {
  const { sessionRequest } = useAuth()

  const handleActivar = async () => {
    if (!frontera) return

    try {
      const respuesta = await sessionRequest({
        url: `/border/${frontera.id}/activacion`,
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
          <AlertDialogTitle>¿Activar Frontera?</AlertDialogTitle>
          <AlertDialogDescription>
            ¿Está seguro que desea activar el frontera {frontera?.frontera}?
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
