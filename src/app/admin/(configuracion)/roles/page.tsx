import { RolesDatatable } from '@/app/admin/(configuracion)/roles/componentes/RolesDatatable'
import { Metadata } from 'next'
import { siteName } from '@/lib/utilities'

export const metadata: Metadata = {
  title: `Roles - ${siteName()}`,
}

export default function Page() {
  return (
    <div className="container p-1">
      <RolesDatatable />
    </div>
  )
}
