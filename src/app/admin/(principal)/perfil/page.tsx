import { Metadata } from 'next'
import { siteName } from '@/lib/utilities'
import ProfileDetail from '@/app/admin/(principal)/perfil/componentes/ProfileDetail'

export const metadata: Metadata = {
  title: `Perfil - ${siteName()}`,
}

export default function ProfilePage() {
  return <ProfileDetail />
}
