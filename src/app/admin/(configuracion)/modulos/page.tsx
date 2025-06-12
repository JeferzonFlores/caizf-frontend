import { ModulosDatatable } from '@/app/admin/(configuracion)/modulos/componentes/ModulosDatatable'
import { Metadata } from 'next'
import { siteName } from '@/lib/utilities'

export const metadata: Metadata = {
  title: `Módulos - ${siteName()}`,
}

export default function Page() {
  return (
    <div className="container p-1">
      <ModulosDatatable />
    </div>
  )
}
