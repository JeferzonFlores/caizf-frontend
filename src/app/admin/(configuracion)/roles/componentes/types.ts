export interface Rol {
  estado: string
  id: string
  rol: string
  nombre: string
  descripcion: string
}

export interface RolesResponse {
  finalizado: boolean
  mensaje: string
  datos: {
    total: number
    filas: Rol[]
  }
}
