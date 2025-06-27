export interface Mercancia {
  estado: string
  id: string
  codigo: string
  mercancia: string
  descripcion: string
  resolucion: string
  idUnidad: number
  idInstitucion: number
}

export interface MercanciaResponse {
  finalizado: boolean
  mensaje: string
  datos: {
    total: number
    filas: Mercancia[]
  }
}
