import { Usuario } from '../types'
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

interface ActivarUsuarioModalProps {
  usuario: Usuario | null
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function ActivarUsuarioModal({
  usuario,
  isOpen,
  onClose,
  onSuccess,
}: ActivarUsuarioModalProps) {
  const { sessionRequest } = useAuth()

  const handleActivar = async () => {
    if (!usuario) return

    try {
      const result = await sessionRequest({
        url: `/usuarios/${usuario.id}/activacion`,
        method: 'PATCH',
      })
      toast.success('Usuario activado', {
        description: MessageInterpreter(result?.data),
      })
      onSuccess()
    } catch (error) {
      print('Error al activar usuario:', error)
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
          <AlertDialogTitle>¿Activar usuario?</AlertDialogTitle>
          <AlertDialogDescription>
            ¿Está seguro que desea activar al usuario {usuario?.usuario}?
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
