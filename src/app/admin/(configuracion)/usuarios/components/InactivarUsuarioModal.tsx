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

interface InactivarUsuarioModalProps {
  usuario: Usuario | null
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function InactivarUsuarioModal({
  usuario,
  isOpen,
  onClose,
  onSuccess,
}: InactivarUsuarioModalProps) {
  const { sessionRequest } = useAuth()

  const handleInactivar = async () => {
    if (!usuario) return

    try {
      const result = await sessionRequest({
        url: `/usuarios/${usuario.id}/inactivacion`,
        method: 'PATCH',
      })
      toast.success('Usuario inactivado', {
        description: MessageInterpreter(result?.data),
      })
      onSuccess()
    } catch (error) {
      print('Error al inactivar usuario:', error)
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
          <AlertDialogTitle>¿Inactivar usuario?</AlertDialogTitle>
          <AlertDialogDescription>
            ¿Está seguro que desea inactivar al usuario {usuario?.usuario}?
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
