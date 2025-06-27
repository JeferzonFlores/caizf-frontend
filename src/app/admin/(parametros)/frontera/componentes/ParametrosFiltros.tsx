import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { XIcon } from 'lucide-react'
import React from 'react'

interface ParametrosFiltrosProps {
  filter: string
  onFilterChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onClearFilter: () => void
}

export function ParametrosFiltros({
  filter,
  onFilterChange,
  onClearFilter,
}: ParametrosFiltrosProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="relative">
        <Input
          id="inputBusquedaParametro"
          placeholder="Buscar por código o nombre"
          value={filter}
          onChange={onFilterChange}
          className="w-full bg-background"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          onClick={onClearFilter}
        >
          <XIcon className="h-4 w-4" />
          <span className="sr-only">Clear</span>
        </Button>
      </div>
    </div>
  )
}
