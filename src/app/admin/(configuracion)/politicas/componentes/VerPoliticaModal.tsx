import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Politica } from '@/app/admin/(configuracion)/politicas/componentes/types'
import { Badge } from '@/components/ui/badge'

interface VerPoliticaModalProps {
  politica: Politica | null
  isOpen: boolean
  onClose: () => void
}

export function VerPoliticaModal({
  politica,
  isOpen,
  onClose,
}: VerPoliticaModalProps) {
  if (!politica) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Detalles de la Política</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-bold">Sujeto:</span>
            <span className="col-span-3">{politica.sujeto}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-bold">Objeto:</span>
            <span className="col-span-3">{politica.objeto}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-bold">Acción:</span>
            <span className="col-span-3">{politica.accion}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-bold">App:</span>
            <span className="col-span-3">
              <Badge variant={'outline'}>{politica.app}</Badge>
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
