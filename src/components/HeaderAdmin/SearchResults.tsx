import React from 'react'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import DynamicIcon from '@/components/Icon'

interface SearchResultsProps {
  filteredSubmodules: any[]
  handleSubmoduleClick: (url: string) => void
}

const SearchResults: React.FC<SearchResultsProps> = ({
  filteredSubmodules,
  handleSubmoduleClick,
}) => (
  <div className="absolute mt-2 w-full min-w-[300px] rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in fade-in-0 zoom-in-95 z-50">
    <Command shouldFilter={false}>
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
)

export default SearchResults
