import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Departamento } from '@/app/admin/(parametros)/departamentos/componentes/types'

interface VerDepartamentoModalProps {
  departamento: Departamento | null
  isOpen: boolean
  onClose: () => void
}

export function VerDepartamentoModal({
  departamento,
  isOpen,
  onClose,
}: VerDepartamentoModalProps) {
  if (!departamento) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Detalles del Departamento</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-bold">Código:</span>
            <span className="col-span-3">{departamento.codigo}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-bold">Departamento:</span>
            <span className="col-span-3">{departamento.departamento}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-bold">Descripción:</span>
            <span className="col-span-3">{departamento.descripcion}</span>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-bold">Estado:</span>
            <span className="col-span-3">
              <Badge
                variant={
                  departamento.estado === 'ACTIVO' ? 'success' : 'destructive'
                }
              >
                {departamento.estado}
              </Badge>
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
