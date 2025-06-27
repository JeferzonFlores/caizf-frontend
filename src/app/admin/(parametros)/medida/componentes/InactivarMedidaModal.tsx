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

interface InactivarMedidaModalProps {
  medida: Medida | null
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function InactivarMedidaModal({
  medida,
  isOpen,
  onClose,
  onSuccess,
}: InactivarMedidaModalProps) {
  const { sessionRequest } = useAuth()

  const handleInactivar = async () => {
    if (!medida) return

    try {
      const respuesta = await sessionRequest({
        url: `/unit/${medida.id}/inactivacion`,
        method: 'PATCH',
      })
      toast.success('Medida inactivado', {
        description: MessageInterpreter(respuesta?.data),
      })
      onSuccess()
    } catch (error) {
      print('Error al inactivar medida:', error)
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
          <AlertDialogTitle>¿Inactivar medida?</AlertDialogTitle>
          <AlertDialogDescription>
            ¿Está seguro que desea inactivar unidada de medida {medida?.unidad}?
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
