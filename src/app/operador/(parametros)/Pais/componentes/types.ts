export interface Parametro {
  estado: string
  id: string
  codigo: string
  nombre: string
  grupo: string
  descripcion: string
}

export interface ParametrosResponse {
  finalizado: boolean
  mensaje: string
  datos: {
    total: number
    filas: Parametro[]
  }
}
