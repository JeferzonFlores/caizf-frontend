export interface ZonaFrnteriza {
  estado: string
  id: string
  frontera: string
  region_geografica: string
  descripcion: string
  latitud: number
  longitud: number
  idDepartamento: number
  idPais: number
}

export interface ZonaFrnterizaResponse {
  finalizado: boolean
  mensaje: string
  datos: {
    total: number
    filas: ZonaFrnteriza[]
  }
}
