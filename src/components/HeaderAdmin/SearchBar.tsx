import React from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { CommandShortcut } from '@/components/ui/command'

interface SearchBarProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  clearSearch: () => void
  handleSearchKeyDown: (event: React.KeyboardEvent) => void
  setIsSearchListOpen: (isOpen: boolean) => void
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  setSearchQuery,
  clearSearch,
  handleSearchKeyDown,
  setIsSearchListOpen,
}) => (
  <div className="relative">
    <Input
      placeholder="Buscar contenido..."
      value={searchQuery}
      onChange={(e) => {
        setSearchQuery(e.target.value)
        setIsSearchListOpen(true)
      }}
      onKeyDown={handleSearchKeyDown}
      className="w-full pr-5 pl-5 py-2 bg-muted/50 focus:ring-0 focus:border-none"
      onClick={() => setIsSearchListOpen(true)}
    />
    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
      <CommandShortcut>⌘K</CommandShortcut>
    </div>
    {searchQuery && (
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-10 top-0 h-full"
        onClick={() => {
          clearSearch()
          setIsSearchListOpen(false)
        }}
      >
        <X className="h-4 w-4" />
      </Button>
    )}
  </div>
)

export default SearchBar
