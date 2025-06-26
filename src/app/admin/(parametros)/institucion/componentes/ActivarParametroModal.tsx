import { Departamento } from '@/app/admin/(parametros)/departamentos/componentes/types'
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

interface ActivarDepartamentoModalProps {
  departamento: Departamento | null
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function ActivarDepartamentoModal({
  departamento,
  isOpen,
  onClose,
  onSuccess,
}: ActivarDepartamentoModalProps) {
  const { sessionRequest } = useAuth()

  const handleActivar = async () => {
    if (!departamento) return

    try {
      const respuesta = await sessionRequest({
        url: `/parametros/${departamento.id}/activacion`,
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
          <AlertDialogTitle>¿Activar parámetro?</AlertDialogTitle>
          <AlertDialogDescription>
            ¿Está seguro que desea activar el parámetro {departamento?.departamento}?
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
