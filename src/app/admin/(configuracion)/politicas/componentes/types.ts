export interface Politica {
  sujeto: string
  objeto: string
  accion: string
  app: string
}

export interface PoliticaResponse {
  finalizado: boolean
  mensaje: string
  datos: {
    total: number
    filas: Politica[]
  }
}
