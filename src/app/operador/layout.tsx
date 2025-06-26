'use client'
import { ReactNode, useEffect } from 'react'
import HeaderAdmin from '@/components/HeaderAdmin'
import MainContent from '@/components/Maincontents'
import Sidebar from '@/components/Sidebar'
import { SidebarProvider } from '@/contexts/SidebarContext'
import { useAuth } from '@/contexts/AuthProvider'
import { useLoading } from '@/contexts/LoadingProvider'
import { print } from '@/lib/print'

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, isAuthLoading } = useAuth()
  const { showLoading, hideLoading } = useLoading()

  useEffect(() => {
    if (isAuthLoading) {
      showLoading('Cargando panel de administración...')
    } else {
      hideLoading()
    }

    print(`layout admin: isAuthLoading=${isAuthLoading}, user=${!!user}`)

    return () => {
      hideLoading()
    }
  }, [isAuthLoading, user, showLoading, hideLoading])

  if (isAuthLoading || !user) {
    return null
  }

  return (
    <SidebarProvider>
      <HeaderAdmin />
      <div className="flex overflow-hidden">
        <Sidebar />
        <MainContent>{children}</MainContent>
      </div>
    </SidebarProvider>
  )
}
