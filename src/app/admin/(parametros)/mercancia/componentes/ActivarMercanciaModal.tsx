import { Mercancia } from '@/app/admin/(parametros)/mercancia/componentes/types'
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

interface ActivarMercanciaModalProps {
  mercancia: Mercancia | null
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function ActivarMercanciaModal({
  mercancia,
  isOpen,
  onClose,
  onSuccess,
}: ActivarMercanciaModalProps) {
  const { sessionRequest } = useAuth()

  const handleActivar = async () => {
    if (!mercancia) return

    try {
      const respuesta = await sessionRequest({
        url: `/commodity/${mercancia.id}/activacion`,
        method: 'PATCH',
      })
      toast.success('Mercancia activado', {
        description: MessageInterpreter(respuesta?.data),
      })
      onSuccess()
    } catch (error) {
      print('Error al activar mercancia:', error)
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
            ¿Está seguro que desea activar el parámetro {mercancia?.mercancia}?
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
