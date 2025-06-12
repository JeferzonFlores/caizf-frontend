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
import { Politica } from '@/app/admin/(configuracion)/politicas/componentes/types'
import { MessageInterpreter } from '@/lib/messageInterpreter'
import { print } from '@/lib/print'

interface EliminarPoliticaModalProps {
  politica: Politica | null
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function EliminarPoliticaModal({
  politica,
  isOpen,
  onClose,
  onSuccess,
}: EliminarPoliticaModalProps) {
  const { sessionRequest } = useAuth()

  const handleEliminar = async () => {
    if (!politica) return

    try {
      const result = await sessionRequest({
        url: `/autorizacion/politicas/${politica.sujeto}/${politica.objeto}`,
        method: 'DELETE',
      })
      toast.success('Política eliminada', {
        description: MessageInterpreter(result?.data),
      })
      onSuccess()
    } catch (error) {
      print('Error al eliminar política:', error)
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
          <AlertDialogTitle>¿Eliminar política?</AlertDialogTitle>
          <AlertDialogDescription>
            ¿Está seguro que desea eliminar la política para el sujeto
            {politica?.sujeto} y objeto {politica?.objeto}? Esta acción no se
            puede deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleEliminar}>
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
