import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDebounce } from 'use-debounce'
import { Button } from '@/components/ui/button'
import { Menu, Search } from 'lucide-react'
import { useSidebar } from '@/contexts/SidebarContext'
import { useAuth } from '@/contexts/AuthProvider'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { delay } from '@/lib/utilities'
import { print } from '@/lib/print'
import Logo from './HeaderAdmin/Logo'
import SearchBar from './HeaderAdmin/SearchBar'
import SearchResults from './HeaderAdmin/SearchResults'
import UserMenu from './HeaderAdmin/UserMenu'
import { MobileSearch } from './HeaderAdmin/MobileSearch'
import { LogoutDialog } from './HeaderAdmin/LogoutDialog'
import { ThemeSwitcher } from '@/components/theme-switcher'

const HeaderAdmin = () => {
  const { toggleSidebar } = useSidebar()
  const { user, logout, changeRole } = useAuth()
  const router = useRouter()

  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300)
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const [isSearchListOpen, setIsSearchListOpen] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const commandRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 768)
    checkIfMobile()
    window.addEventListener('resize', checkIfMobile)
    return () => window.removeEventListener('resize', checkIfMobile)
  }, [])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        openSearch()
      } else if (event.key === 'Escape') {
        closeSearch()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const getInitials = () => {
    if (user && user.persona) {
      const { nombres, primerApellido, segundoApellido } = user.persona
      const inicialNombre = nombres ? nombres[0] : ''
      const inicialPrimerApellido = primerApellido
        ? primerApellido[0]
        : undefined
      const inicialSegundoApellido = segundoApellido
        ? segundoApellido[0]
        : undefined
      const inicialApellidos =
        inicialPrimerApellido ?? inicialSegundoApellido ?? ''
      return `${inicialNombre}${inicialApellidos}`
    }
    return ''
  }

  const handleRoleChange = async (idRol: string) => {
    try {
      await changeRole(idRol)
    } catch (error) {
      print('Error changing role:', error)
    }
  }

  const removeAccents = (str: string) => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  }

  const allSubmodules = useMemo(() => {
    if (!user || !user.roles || !Array.isArray(user.roles)) return []
    const currentRole = user.roles.find((role) => role.idRol === user.idRol)
    return currentRole?.modulos?.flatMap((modulo) => modulo.subModulo) || []
  }, [user])

  const filteredSubmodules = useMemo(() => {
    const normalizedQuery = removeAccents(debouncedSearchQuery.toLowerCase())
    return allSubmodules.filter(
      (submodule) =>
        removeAccents(submodule.label.toLowerCase()).includes(
          normalizedQuery
        ) ||
        removeAccents(submodule.propiedades.descripcion.toLowerCase()).includes(
          normalizedQuery
        )
    )
  }, [allSubmodules, debouncedSearchQuery])

  const handleSubmoduleClick = (url: string) => {
    router.push(url)
    closeSearch()
  }

  const clearSearch = () => setSearchQuery('')

  const handleLogout = () => {
    setShowLogoutDialog(true)
  }

  const confirmLogout = async () => {
    setShowLogoutDialog(false)
    await delay(300)
    await logout()
  }

  const openSearch = () => {
    setIsSearchOpen(true)
    setIsSearchListOpen(true)
    if (searchInputRef.current) {
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus()
        }
      }, 0)
    }
  }

  const closeSearch = () => {
    setIsSearchOpen(false)
    setIsSearchListOpen(false)
    setSearchQuery('')
  }

  const handleSearchKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      commandRef.current?.focus()
    }
  }

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-background/80 shadow-sm backdrop-blur-sm">
        <div className="flex h-16 items-center justify-between px-5">
          <div className="flex items-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" onClick={toggleSidebar}>
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Toggle Sidebar</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Logo />
          </div>
          <div className="flex-1 flex justify-center mx-4">
            {!isMobile && (
              <div className="w-full max-w-lg relative">
                <SearchBar
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  clearSearch={clearSearch}
                  handleSearchKeyDown={handleSearchKeyDown}
                  setIsSearchListOpen={setIsSearchListOpen}
                />
                {isSearchListOpen && (
                  <SearchResults
                    filteredSubmodules={filteredSubmodules}
                    handleSubmoduleClick={handleSubmoduleClick}
                  />
                )}
              </div>
            )}
          </div>
          <div className="flex items-center space-x-4">
            {isMobile && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsSearchOpen(true)}
              >
                <Search className="h-4 w-4" />
              </Button>
            )}
            <ThemeSwitcher />
            <UserMenu
              user={user}
              handleRoleChange={handleRoleChange}
              handleLogout={handleLogout}
              getInitials={getInitials}
            />
          </div>
        </div>
      </header>

      {isMobile && isSearchOpen && (
        <MobileSearch
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          clearSearch={clearSearch}
          setIsSearchOpen={setIsSearchOpen}
          filteredSubmodules={filteredSubmodules}
          handleSubmoduleClick={handleSubmoduleClick}
        />
      )}

      <LogoutDialog
        showLogoutDialog={showLogoutDialog}
        setShowLogoutDialog={setShowLogoutDialog}
        confirmLogout={confirmLogout}
      />
    </>
  )
}

export default HeaderAdmin
