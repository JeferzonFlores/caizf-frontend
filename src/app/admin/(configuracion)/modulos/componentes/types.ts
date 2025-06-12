export interface Modulo {
  estado: string
  id: string
  label: string
  url: string
  nombre: string
  propiedades: {
    orden: number
    descripcion: string
    icono?: string
  }
  modulo: { id: string } | null
}

export interface ModulosResponse {
  finalizado: boolean
  mensaje: string
  datos: {
    total: number
    filas: Modulo[]
  }
}
