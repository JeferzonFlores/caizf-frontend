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

interface InactivarMercanciaModalProps {
  mercancia: Mercancia | null
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function InactivarMercanciaModal({
  mercancia,
  isOpen,
  onClose,
  onSuccess,
}: InactivarMercanciaModalProps) {
  const { sessionRequest } = useAuth()

  const handleInactivar = async () => {
    if (!mercancia) return

    try {
      const respuesta = await sessionRequest({
        url: `/commodity/${mercancia.id}/inactivacion`,
        method: 'PATCH',
      })
      toast.success('Mercancia inactivado', {
        description: MessageInterpreter(respuesta?.data),
      })
      onSuccess()
    } catch (error) {
      print('Error al inactivar mercancia:', error)
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
          <AlertDialogTitle>¿Inactivar mercancia?</AlertDialogTitle>
          <AlertDialogDescription>
            ¿Está seguro que desea inactivar el mercancia {mercancia?.mercancia}?
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
