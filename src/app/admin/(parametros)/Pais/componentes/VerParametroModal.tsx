import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Parametro } from '@/app/admin/(configuracion)/parametros/componentes/types'

interface VerParametroModalProps {
  parametro: Parametro | null
  isOpen: boolean
  onClose: () => void
}

export function VerParametroModal({
  parametro,
  isOpen,
  onClose,
}: VerParametroModalProps) {
  if (!parametro) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Detalles del Parámetro</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-bold">Código:</span>
            <span className="col-span-3">{parametro.codigo}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-bold">Nombre:</span>
            <span className="col-span-3">{parametro.nombre}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-bold">Descripción:</span>
            <span className="col-span-3">{parametro.descripcion}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-bold">Grupo:</span>
            <span className="col-span-3">{parametro.grupo}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-bold">Estado:</span>
            <span className="col-span-3">
              <Badge
                variant={
                  parametro.estado === 'ACTIVO' ? 'success' : 'destructive'
                }
              >
                {parametro.estado}
              </Badge>
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
