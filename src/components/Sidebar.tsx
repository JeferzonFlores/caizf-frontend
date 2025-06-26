import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image';
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import DynamicIcon from './Icon'
import { useSidebar } from '@/contexts/SidebarContext'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import * as VisuallyHidden from '@radix-ui/react-visually-hidden'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useAuth } from '@/contexts/AuthProvider'
import { versionNumber } from '@/lib/utilities'

const VersionDisplay = () => (
  <div className="text-xs text-muted-foreground text-center py-2 border-t">
    v{versionNumber()}
  </div>
)

const Sidebar: React.FC = () => {
  const pathname = usePathname()
  const { isOpen, openSidebar, closeSidebar, toggleSection, badgeContents } =
    useSidebar()
  const { user } = useAuth()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (!user) return null

  const selectedRole = user.roles.find((role) => role.idRol === user.idRol)
  if (!selectedRole) return null

  const menuStructure = selectedRole.modulos.map((modulo) => ({
    section: modulo.label,
    isOpen: true,
    items: modulo.subModulo.map((sub) => ({
      name: sub.label,
      href: sub.url,
      desc: sub.propiedades.descripcion,
      iconName: sub.propiedades.icono,
    })),
  }))

  const initialOpenSections = menuStructure.map((section) => section.section)

  const renderSidebarContent = () => (
    <>
      <ScrollArea className="flex-1">
        <nav className="flex flex-col p-4">
                  <div className="hidden bg-muted lg:block" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50%' }}>
                    <Image
                      src="/Logo/mdpyep-vertical.png"
                      alt="Image"
                      width="180"
                      height="300"
                      priority={false}
                      className="object-cover"
                    />
                  </div>
          <Accordion type="multiple" defaultValue={initialOpenSections}>
            {menuStructure.map((section) => (
              <AccordionItem key={section.section} value={section.section}>
                <AccordionTrigger
                  onClick={() => toggleSection(section.section)}
                  className="text-sm  font-medium text-muted-foreground px-4 pb-2 max-w-[248px] truncate"
                >
                  {section.section}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-1 mt-2">
                    {section.items.map((item) => {
                      const isActive = pathname === item.href
                      return (
                        <TooltipProvider key={item.href}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                asChild
                                variant={isActive ? 'secondary' : 'ghost'}
                                className={cn(
                                  'w-full justify-start transition-colors duration-200 relative',
                                  isActive &&
                                  'bg-primary/15 text-primary font-semibold'
                                )}
                              >
                                <Link
                                  id={item.href}
                                  href={item.href}
                                  onClick={() => {
                                    isMobile ? closeSidebar() : undefined
                                  }}
                                >
                                  <DynamicIcon
                                    name={item.iconName}
                                    size="20"
                                    className={cn(
                                      'mr-2',
                                      isActive
                                        ? 'text-primary'
                                        : 'text-foreground'
                                    )}
                                  />
                                  <span className={'mr-1'}>{item.name}</span>
                                  {badgeContents[item.name] && (
                                    <span className="ml-auto bg-primary text-primary-foreground text-xs font-medium px-2.5 py-0.5 rounded">
                                      {badgeContents[item.name]}
                                    </span>
                                  )}
                                </Link>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="right">
                              {item.desc}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </nav>
      </ScrollArea>
      <VersionDisplay />
    </>
  )

  return (
    <>
      {isOpen && !isMobile && (
        <aside
          className="hidden lg:flex fixed z-20 h-full top-0 left-0 pt-16 flex-col w-64 border-r bg-card transition-all duration-600"
          aria-label="Sidebar"
        >
          {renderSidebarContent()}
        </aside>
      )}

      {isMobile && (
        <Sheet
          open={isOpen}
          onOpenChange={(open) => (open ? openSidebar() : closeSidebar())}
        >
          <SheetContent
            side={'left'}
            className="w-[256px] sm:max-w-[256px] p-0"
          >
            <SheetTitle className="px-4 py-2 border-0">
              <VisuallyHidden.Root>Menu</VisuallyHidden.Root>
            </SheetTitle>
            {renderSidebarContent()}
          </SheetContent>
        </Sheet>
      )}
    </>
  )
}

export default Sidebar
