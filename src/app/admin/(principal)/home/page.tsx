import AdminDashboard from '@/app/admin/(principal)/home/componentes/AdminDashboard'
import { Metadata } from 'next'
import { siteName } from '@/lib/utilities'

export const metadata: Metadata = {
  title: `Home - ${siteName()}`,
}

export default function AdminHomePage() {
  return <AdminDashboard />
}
