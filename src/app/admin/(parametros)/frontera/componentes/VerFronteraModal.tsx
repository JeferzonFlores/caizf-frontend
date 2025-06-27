import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Frontera } from '@/app/admin/(parametros)/frontera/componentes/types'

interface VerFronteraModalProps {
  frontera: Frontera | null
  isOpen: boolean
  onClose: () => void
}

export function VerFronteraModal({
  frontera,
  isOpen,
  onClose,
}: VerFronteraModalProps) {
  if (!frontera) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Detalles de la Unidad de Frontera</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-bold">Código:</span>
            <span className="col-span-3">{frontera.codigo}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-bold">Unidad de frontera:</span>
            <span className="col-span-3">{frontera.frontera}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-bold">Descripción:</span>
            <span className="col-span-3">{frontera.descripcion}</span>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-bold">Estado:</span>
            <span className="col-span-3">
              <Badge
                variant={
                  frontera.estado === 'ACTIVO' ? 'success' : 'destructive'
                }
              >
                {frontera.estado}
              </Badge>
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
