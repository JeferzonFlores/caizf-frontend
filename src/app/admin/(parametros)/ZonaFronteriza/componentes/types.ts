export interface Pais {
  estado: string
  id: string
  codigo: string
  pais: string
  descripcion: string
}

export interface PaisResponse {
  finalizado: boolean
  mensaje: string
  datos: {
    total: number
    filas: Pais[]
  }
}
