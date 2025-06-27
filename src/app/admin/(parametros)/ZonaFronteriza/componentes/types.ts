export interface Frontera {
  estado: string
  id: string
  codigo: string
  frontera: string
  region_geografica: string
  descripcion: string
  idPais: number
  idDepartamento: number
}

export interface FronteraResponse {
  finalizado: boolean
  mensaje: string
  datos: {
    total: number
    filas: Frontera[]
  }
}
