import { Medida } from '@/app/admin/(parametros)/medida/componentes/types'
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

interface ActivarMedidaModalProps {
 medida: Medida | null
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function ActivarMedidaModal({
  medida,
  isOpen,
  onClose,
  onSuccess,
}: ActivarMedidaModalProps) {
  const { sessionRequest } = useAuth()

  const handleActivar = async () => {
    if (!medida) return

    try {
      const respuesta = await sessionRequest({
        url: `/unit/${medida.id}/activacion`,
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
          <AlertDialogTitle>¿Activar Unidad de Medida?</AlertDialogTitle>
          <AlertDialogDescription>
            ¿Está seguro que desea activar el parámetro {medida?.unidad}?
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
