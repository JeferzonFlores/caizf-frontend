import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Usuario } from '../types'
import { formatDate } from '@/lib/dates'

interface VerUsuarioModalProps {
  usuario: Usuario | null
  isOpen: boolean
  onClose: () => void
}

export function VerUsuarioModal({
  usuario,
  isOpen,
  onClose,
}: VerUsuarioModalProps) {
  if (!usuario) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Detalles del Usuario</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <h3 className="font-semibold">Nombre:</h3>
            <p>{`${usuario.persona.nombres} ${usuario.persona.primerApellido} ${usuario.persona.segundoApellido}`}</p>
          </div>
          <div>
            <h3 className="font-semibold">Nro. Documento:</h3>
            <p>{usuario.persona.nroDocumento}</p>
          </div>
          <div>
            <h3 className="font-semibold">Fecha de nacimiento:</h3>
            <p>{formatDate(usuario.persona.fechaNacimiento, 'YYYY-MM-DD')}</p>
          </div>
          <div>
            <h3 className="font-semibold">Usuario:</h3>
            <p>{usuario.usuario}</p>
          </div>
          <div>
            <h3 className="font-semibold">Correo Electrónico:</h3>
            <p>{usuario.correoElectronico}</p>
          </div>
          <div>
            <h3 className="font-semibold">Roles:</h3>
            <p>{usuario.usuarioRol.map((ur) => ur.rol.rol).join(', ')}</p>
          </div>
          <div>
            <h3 className="font-semibold">Estado:</h3>
            <p>{usuario.estado}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
