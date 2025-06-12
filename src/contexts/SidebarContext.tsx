import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'

interface SidebarContextType {
  isOpen: boolean
  toggleSidebar: () => void
  openSidebar: () => void
  closeSidebar: () => void
  openSections: string[]
  toggleSection: (section: string) => void
  setBadgeContent: (item: string, content: string) => void
  badgeContents: Record<string, string>
  initializeMenu: (menu: MenuStructureType[]) => void
  menuStructure: MenuStructureType[]
  activeItem: string
  setActive: (section: string) => void
}

interface MenuItemType {
  name: string
  href: string
  iconName: string
}

interface MenuStructureType {
  section: string
  isOpen: boolean
  items: MenuItemType[]
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export const SidebarProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(true)
  const [openSections, setOpenSections] = useState<string[]>([])
  const [badgeContents, setBadgeContents] = useState<Record<string, string>>({})
  const [menuStructure, setMenuStructure] = useState<MenuStructureType[]>([])

  const toggleSidebar = () => setIsOpen((prev) => !prev)
  const openSidebar = () => setIsOpen(true)
  const closeSidebar = () => setIsOpen(false)

  const [activeItem, setActiveItem] = useState<string>('')

  const setActive = (href: string) => {
    setActiveItem(href)
  }

  const toggleSection = (section: string) => {
    setOpenSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    )
  }

  const setBadgeContent = (item: string, content: string) => {
    setBadgeContents((prev) => ({ ...prev, [item]: content }))
  }

  const initializeMenu = (menu: MenuStructureType[]) => {
    setMenuStructure(menu)
    const defaultOpenSections = menu.map((section) => section.section)
    setOpenSections(defaultOpenSections)
  }

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsOpen(false)
      } else {
        setIsOpen(true)
      }
    }

    window.addEventListener('resize', handleResize)
    handleResize() // Call once to set initial state

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <SidebarContext.Provider
      value={{
        isOpen,
        toggleSidebar,
        openSidebar,
        closeSidebar,
        openSections,
        toggleSection,
        setBadgeContent,
        badgeContents,
        initializeMenu,
        menuStructure,
        activeItem,
        setActive,
      }}
    >
      {children}
    </SidebarContext.Provider>
  )
}

export const useSidebar = () => {
  const context = useContext(SidebarContext)
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider')
  }
  return context
}
