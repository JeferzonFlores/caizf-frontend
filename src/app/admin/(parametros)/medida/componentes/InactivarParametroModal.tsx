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

interface InactivarDepartamentoModalProps {
  departamento: Departamento | null
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function InactivarDepartamentoModal({
  departamento,
  isOpen,
  onClose,
  onSuccess,
}: InactivarDepartamentoModalProps) {
  const { sessionRequest } = useAuth()

  const handleInactivar = async () => {
    if (!departamento) return

    try {
      const respuesta = await sessionRequest({
        url: `/department/${departamento.id}/inactivacion`,
        method: 'PATCH',
      })
      toast.success('Parámetro inactivado', {
        description: MessageInterpreter(respuesta?.data),
      })
      onSuccess()
    } catch (error) {
      print('Error al inactivar parámetro:', error)
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
          <AlertDialogTitle>¿Inactivar departamento?</AlertDialogTitle>
          <AlertDialogDescription>
            ¿Está seguro que desea inactivar el parámetro {departamento?.departamento}?
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
