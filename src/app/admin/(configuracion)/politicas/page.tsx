import { PoliticasDatatable } from '@/app/admin/(configuracion)/politicas/componentes/PoliticasDatatable'
import { Metadata } from 'next'
import { siteName } from '@/lib/utilities'

export const metadata: Metadata = {
  title: `Políticas - ${siteName()}`,
}

export default function Page() {
  return (
    <div className="container p-1">
      <PoliticasDatatable />
    </div>
  )
}
