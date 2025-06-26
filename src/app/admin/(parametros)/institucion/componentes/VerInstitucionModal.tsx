import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Institucion } from '@/app/admin/(parametros)/institucion/componentes/types'

interface VerInstitucionModalProps {
  institucion: Institucion | null
  isOpen: boolean
  onClose: () => void
}

export function VerInstitucionModal({
  institucion,
  isOpen,
  onClose,
}: VerInstitucionModalProps) {
  if (!institucion) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Detalles de la Institucion</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-bold">Código:</span>
            <span className="col-span-3">{institucion.codigo}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-bold">Institucion:</span>
            <span className="col-span-3">{institucion.institucion}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-bold">Descripción:</span>
            <span className="col-span-3">{institucion.direccion}</span>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-bold">Estado:</span>
            <span className="col-span-3">
              <Badge
                variant={
                  institucion.estado === 'ACTIVO' ? 'success' : 'destructive'
                }
              >
                {institucion.estado}
              </Badge>
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
