import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Medida } from '@/app/admin/(parametros)/medida/componentes/types'

interface VerMedidaModalProps {
  medida: Medida | null
  isOpen: boolean
  onClose: () => void
}

export function VerMedidaModal({
  medida,
  isOpen,
  onClose,
}: VerMedidaModalProps) {
  if (!medida) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Detalles de la Unidad de Medida</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-bold">Código:</span>
            <span className="col-span-3">{medida.codigo}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-bold">Unidad de medida:</span>
            <span className="col-span-3">{medida.unidad}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-bold">Descripción:</span>
            <span className="col-span-3">{medida.descripcion}</span>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-bold">Estado:</span>
            <span className="col-span-3">
              <Badge
                variant={
                  medida.estado === 'ACTIVO' ? 'success' : 'destructive'
                }
              >
                {medida.estado}
              </Badge>
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
