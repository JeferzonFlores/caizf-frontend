import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Modulo } from '@/app/admin/(configuracion)/modulos/componentes/types'

interface VerModuloModalProps {
  modulo: Modulo | null
  isOpen: boolean
  onClose: () => void
}

export function VerModuloModal({
  modulo,
  isOpen,
  onClose,
}: VerModuloModalProps) {
  if (!modulo) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Detalles del Módulo</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-bold">Etiqueta:</span>
            <span className="col-span-3">{modulo.label}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-bold">URL:</span>
            <span className="col-span-3">{modulo.url}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-bold">Nombre:</span>
            <span className="col-span-3">{modulo.nombre}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-bold">Orden:</span>
            <span className="col-span-3">{modulo.propiedades.orden}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-bold">Descripción:</span>
            <span className="col-span-3">{modulo.propiedades.descripcion}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-bold">Ícono:</span>
            <span className="col-span-3">
              {modulo.propiedades.icono || 'N/A'}
            </span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-bold">Estado:</span>
            <span className="col-span-3">
              <Badge
                variant={modulo.estado === 'ACTIVO' ? 'success' : 'destructive'}
              >
                {modulo.estado}
              </Badge>
            </span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-bold">Módulo Padre:</span>
            <span className="col-span-3">
              {modulo.modulo ? modulo.modulo.id : 'N/A'}
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
