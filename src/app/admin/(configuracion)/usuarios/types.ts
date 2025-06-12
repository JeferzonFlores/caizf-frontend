export interface Usuario {
  estado: string
  id: string
  usuario: string
  ciudadaniaDigital: boolean
  correoElectronico: string
  usuarioRol: {
    estado: string
    transaccion: string
    usuarioCreacion: string
    fechaCreacion: string
    usuarioModificacion: string | null
    fechaModificacion: string
    id: string
    idRol: string
    idUsuario: string
    rol: {
      id: string
      rol: string
    }
  }[]
  persona: {
    nombres: string
    primerApellido: string
    segundoApellido: string
    tipoDocumento: string
    nroDocumento: string
    fechaNacimiento: string
  }
}

export interface UsuariosResponse {
  finalizado: boolean
  mensaje: string
  datos: {
    total: number
    filas: Usuario[]
  }
}

export interface RolResponse {
  finalizado: boolean
  mensaje: string
  datos: Rol[]
}

export interface Rol {
  id: string
  rol: string
  nombre: string
  descripcion: string
  estado: string
}
