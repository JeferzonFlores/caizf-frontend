import React from 'react'
import { useSidebar } from '@/contexts/SidebarContext'
import { cn } from '@/lib/utils'

const MainContent = ({ children }: { children: React.ReactNode }) => {
  const { isOpen } = useSidebar()

  return (
    <div
      id="main-content"
      className={cn(
        'h-full w-full bg-gray-50 dark:bg-gray-900 relative overflow-y-auto transition-all duration-300',
        isOpen && 'lg:ml-64'
      )}
    >
      <main>
        <div className="pt-6 px-4 lg:px-6 pb-6">
          <div className="w-full min-h-[calc(100vh-100px)]">{children}</div>
        </div>
      </main>
    </div>
  )
}

export default MainContent
