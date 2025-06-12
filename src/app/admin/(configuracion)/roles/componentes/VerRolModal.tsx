import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Rol } from '@/app/admin/(configuracion)/roles/componentes/types'

interface VerRolModalProps {
  rol: Rol | null
  isOpen: boolean
  onClose: () => void
}

export function VerRolModal({ rol, isOpen, onClose }: VerRolModalProps) {
  if (!rol) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Detalles del Rol</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-bold">ID:</span>
            <span className="col-span-3">{rol.id}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-bold">Rol:</span>
            <span className="col-span-3">{rol.rol}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-bold">Nombre:</span>
            <span className="col-span-3">{rol.nombre}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-bold">Descripción:</span>
            <span className="col-span-3">{rol.descripcion}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-bold">Estado:</span>
            <span className="col-span-3">
              <Badge
                variant={rol.estado === 'ACTIVO' ? 'success' : 'destructive'}
              >
                {rol.estado}
              </Badge>
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
