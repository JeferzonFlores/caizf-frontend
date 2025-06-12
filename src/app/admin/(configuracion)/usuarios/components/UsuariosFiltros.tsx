import React from 'react'
import { Input } from '@/components/ui/input'
import { MultiSelect } from '@/components/ui/multi-select'
import { Button } from '@/components/ui/button'
import { XIcon } from 'lucide-react'
import { Rol } from '@/app/admin/(configuracion)/usuarios/types'

interface UsuariosFiltrosProps {
  filter: string
  roleFilter: string[]
  roles: Rol[]
  onFilterChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onRoleFilterChange: (selectedRoles: string[]) => void
  onClearFilter: () => void
}

export const UsuariosFiltros: React.FC<UsuariosFiltrosProps> = ({
  filter,
  roleFilter,
  roles,
  onFilterChange,
  onRoleFilterChange,
  onClearFilter,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="relative">
        <Input
          id='inputBusquedaUsuario'
          placeholder="Filtrar por nombre..."
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
      <div className="relative">
        <MultiSelect
          options={roles.map((role) => ({
            value: role.id,
            label: role.nombre,
          }))}
          onValueChange={onRoleFilterChange}
          defaultValue={roleFilter}
          placeholder="Filtrar por roles"
          className="w-full bg-background"
        />
      </div>
    </div>
  )
}
