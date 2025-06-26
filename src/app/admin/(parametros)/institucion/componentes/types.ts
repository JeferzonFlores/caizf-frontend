export interface Institucion {
  estado: string
  id: string
  codigo: string
  institucion: string
  logo: string
  direccion: string
}

export interface InstitucionResponse {
  finalizado: boolean
  mensaje: string
  datos: {
    total: number
    filas: Institucion[]
  }
}
