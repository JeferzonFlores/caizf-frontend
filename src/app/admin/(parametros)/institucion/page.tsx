import { InstitucionDatatable } from '@/app/admin/(parametros)/institucion/componentes/InstitucionDatatable'
import { Metadata } from 'next'
import { siteName } from '@/lib/utilities'

export const metadata: Metadata = {
  title: `Institucion - ${siteName()}`,
}

export default function Page() {
  return (
    <div className="container p-1">
      <InstitucionDatatable />
    </div>
  )
}
