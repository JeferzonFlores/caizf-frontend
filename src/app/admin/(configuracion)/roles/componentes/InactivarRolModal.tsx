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

interface InactivarRolModalProps {
  rol: Rol | null
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function InactivarRolModal({
  rol,
  isOpen,
  onClose,
  onSuccess,
}: InactivarRolModalProps) {
  const { sessionRequest } = useAuth()

  const handleInactivar = async () => {
    if (!rol) return

    try {
      const result = await sessionRequest({
        url: `/autorizacion/roles/${rol.id}/inactivacion`,
        method: 'PATCH',
      })
      toast.success('Rol inactivado', {
        description: MessageInterpreter(result?.data),
      })
      onSuccess()
    } catch (error) {
      print('Error al inactivar rol:', error)
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
          <AlertDialogTitle>¿Inactivar rol?</AlertDialogTitle>
          <AlertDialogDescription>
            ¿Está seguro que desea inactivar el rol {rol?.nombre}? Esta acción
            puede afectar a los usuarios que tienen este rol asignado.
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
