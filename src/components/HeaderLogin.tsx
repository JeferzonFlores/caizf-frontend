import React from 'react'
import { ThemeSwitcher } from '@/components/theme-switcher'
import { Separator } from '@/components/ui/separator'

const HeaderLogin = () => {
  return (
    <header className="fixed top-0 z-50 w-full border-b bg-background/80 shadow-sm backdrop-blur-sm">
      <div className="h-16 items-center px-5">
        <div className="flex h-14 items-center justify-between">
          <div className="flex items-center space-x-4">
             <img src="/Logo/LogoCAIZF.png" alt="Logo de tu empresa" className="h-8 w-auto" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50px' }} />
          </div>
          <div className="flex items-center space-x-4">
            <ThemeSwitcher />
          </div>
        </div>
      </div>
      <Separator />
    </header>
  )
}

export default HeaderLogin
