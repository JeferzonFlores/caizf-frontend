import { DepartamentosDatatable } from '@/app/admin/(parametros)/Pais/componentes/PaisDatatable'
import { Metadata } from 'next'
import { siteName } from '@/lib/utilities'

export const metadata: Metadata = {
  title: `Parámetros - ${siteName()}`,
}

export default function Page() {
  return (
    <div className="container p-1">
      <DepartamentosDatatable />
    </div>
  )
}
