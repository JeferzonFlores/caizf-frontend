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

interface InactivarFronteraModalProps {
  frontera: Frontera | null
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function InactivarFronteraModal({
  frontera,
  isOpen,
  onClose,
  onSuccess,
}: InactivarFronteraModalProps) {
  const { sessionRequest } = useAuth()

  const handleInactivar = async () => {
    if (!frontera) return

    try {
      const respuesta = await sessionRequest({
        url: `/border/${frontera.id}/inactivacion`,
        method: 'PATCH',
      })
      toast.success('Frontera inactivado', {
        description: MessageInterpreter(respuesta?.data),
      })
      onSuccess()
    } catch (error) {
      print('Error al inactivar frontera:', error)
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
          <AlertDialogTitle>¿Inactivar frontera?</AlertDialogTitle>
          <AlertDialogDescription>
            ¿Está seguro que desea inactivar frontera {frontera?.frontera}?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleInactivar}>
            Inactivar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
