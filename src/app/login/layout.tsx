'use client'
import { ReactNode } from 'react'
import HeaderLogin from '@/components/HeaderLogin'

export default function LoginLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <HeaderLogin />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </>
  )
}
