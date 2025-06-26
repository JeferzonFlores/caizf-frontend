export interface Medida {
  estado: string
  id: string
  codigo: string
  unidad: string
  descripcion: string
}

export interface MedidaResponse {
  finalizado: boolean
  mensaje: string
  datos: {
    total: number
    filas: Medida[]
  }
}
