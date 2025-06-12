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

interface InactivarModuloModalProps {
  modulo: Modulo | null
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function InactivarModuloModal({
  modulo,
  isOpen,
  onClose,
  onSuccess,
}: InactivarModuloModalProps) {
  const { sessionRequest } = useAuth()

  const handleInactivar = async () => {
    if (!modulo) return

    try {
      const result = await sessionRequest({
        url: `/autorizacion/modulos/${modulo.id}/inactivacion`,
        method: 'PATCH',
      })
      toast.success('Módulo inactivado', {
        description: MessageInterpreter(result?.data),
      })
      onSuccess()
    } catch (error) {
      print('Error al inactivar módulo:', error)
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
          <AlertDialogTitle>¿Inactivar módulo?</AlertDialogTitle>
          <AlertDialogDescription>
            ¿Está seguro que desea inactivar el módulo {modulo?.label}? Esta
            acción puede afectar el funcionamiento del sistema.
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
