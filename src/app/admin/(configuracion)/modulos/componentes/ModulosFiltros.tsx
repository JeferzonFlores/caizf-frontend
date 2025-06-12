import { Input } from '@/components/ui/input'
import { X } from 'lucide-react'
import { ChangeEvent } from 'react'

interface ModulosFiltrosProps {
  filter: string
  onFilterChange: (event: ChangeEvent<HTMLInputElement>) => void
  onClearFilter: () => void
}

export function ModulosFiltros({
  filter,
  onFilterChange,
  onClearFilter,
}: ModulosFiltrosProps) {
  return (
    <div className="relative w-full max-w-sm">
      <Input
        id='inputBusquedaModulo'
        placeholder="Buscar módulos..."
        value={filter}
        onChange={onFilterChange}
        className="w-full bg-background"
      />
      {filter && (
        <button
          onClick={onClearFilter}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          aria-label="Limpiar búsqueda"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
