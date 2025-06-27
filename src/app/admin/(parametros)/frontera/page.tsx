import { FronteraDatatable } from '@/app/admin/(parametros)/frontera/componentes/FronteraDatatable'
import { Metadata } from 'next'
import { siteName } from '@/lib/utilities'

export const metadata: Metadata = {
  title: `Frontera - ${siteName()}`,
}

export default function Page() {
  return (
    <div className="container p-1">
      <FronteraDatatable />
    </div>
  )
}
