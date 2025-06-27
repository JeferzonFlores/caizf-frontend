import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Mercancia } from '@/app/admin/(parametros)/mercancia/componentes/types'

interface VerMercanciaModalProps {
  mercancia: Mercancia | null
  isOpen: boolean
  onClose: () => void
}

export function VerMercanciaModal({
  mercancia,
  isOpen,
  onClose,
}: VerMercanciaModalProps) {
  if (!mercancia) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Detalles de la Mercancia</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-bold">Código:</span>
            <span className="col-span-3">{mercancia.codigo}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-bold">Mercancia:</span>
            <span className="col-span-3">{mercancia.mercancia}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-bold">Descripción:</span>
            <span className="col-span-3">{mercancia.descripcion}</span>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-bold">Estado:</span>
            <span className="col-span-3">
              <Badge
                variant={
                  mercancia.estado === 'ACTIVO' ? 'success' : 'destructive'
                }
              >
                {mercancia.estado}
              </Badge>
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
