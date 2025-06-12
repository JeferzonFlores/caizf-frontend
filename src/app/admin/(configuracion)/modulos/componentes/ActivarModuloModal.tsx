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
import { Modulo } from '@/app/admin/(configuracion)/modulos/componentes/types'

interface ActivarModuloModalProps {
  modulo: Modulo | null
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function ActivarModuloModal({
  modulo,
  isOpen,
  onClose,
  onSuccess,
}: ActivarModuloModalProps) {
  const { sessionRequest } = useAuth()

  const handleActivar = async () => {
    if (!modulo) return

    try {
      const result = await sessionRequest({
        url: `/autorizacion/modulos/${modulo.id}/activacion`,
        method: 'PATCH',
      })
      toast.success('Módulo activado', {
        description: MessageInterpreter(result?.data),
      })
      onSuccess()
    } catch (error) {
      print('Error al activar módulo:', error)
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
          <AlertDialogTitle>¿Activar módulo?</AlertDialogTitle>
          <AlertDialogDescription>
            ¿Está seguro que desea activar el módulo {modulo?.label}?
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
