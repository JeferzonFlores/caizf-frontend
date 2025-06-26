import { MedidaDatatable } from '@/app/admin/(parametros)/medida/componentes/MedidaDatatable'
import { Metadata } from 'next'
import { siteName } from '@/lib/utilities'

export const metadata: Metadata = {
  title: `Medida - ${siteName()}`,
}

export default function Page() {
  return (
    <div className="container p-1">
      <MedidaDatatable />
    </div>
  )
}
