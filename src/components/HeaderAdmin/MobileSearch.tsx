import React from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import {
  Command,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command'
import DynamicIcon from '@/components/Icon'

interface MobileSearchProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  clearSearch: () => void
  setIsSearchOpen: (isOpen: boolean) => void
  filteredSubmodules: any[]
  handleSubmoduleClick: (url: string) => void
}

export const MobileSearch: React.FC<MobileSearchProps> = ({
  searchQuery,
  setSearchQuery,
  clearSearch,
  setIsSearchOpen,
  filteredSubmodules,
  handleSubmoduleClick,
}) => (
  <div className="fixed inset-0 bg-background z-50 flex flex-col">
    <div className="flex items-center justify-between p-4 border-b">
      <div className="relative w-full">
        <Input
          type="search"
          placeholder="Buscar contenido..."
          className="w-full pr-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          autoFocus
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full"
            onClick={clearSearch}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsSearchOpen(false)}
        className="ml-2"
      >
        <X className="h-5 w-5" />
      </Button>
    </div>
    <div className="flex-1 overflow-auto p-4">
      <Command>
        <CommandList>
          {filteredSubmodules.length === 0 ? (
            <CommandEmpty>No se encontraron resultados</CommandEmpty>
          ) : (
            <CommandGroup heading="Submódulos">
              {filteredSubmodules.map((submodule) => (
                <CommandItem
                  key={submodule.id}
                  onSelect={() => handleSubmoduleClick(submodule.url)}
                  className="flex items-center px-4 py-2 hover:bg-accent hover:text-accent-foreground cursor-pointer"
                >
                  <DynamicIcon
                    name={submodule.propiedades.icono}
                    size="20"
                    className="mr-2 flex-shrink-0"
                  />
                  <div className="flex flex-col">
                    <span className="font-medium">{submodule.label}</span>
                    <span className="text-xs text-muted-foreground">
                      {submodule.propiedades.descripcion}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </Command>
    </div>
  </div>
)
