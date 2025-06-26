export interface Departamento {
  estado: string
  id: string
  codigo: string
  departamento: string
  descripcion: string
}

export interface DepartamentosResponse {
  finalizado: boolean
  mensaje: string
  datos: {
    total: number
    filas: Departamento[]
  }
}
