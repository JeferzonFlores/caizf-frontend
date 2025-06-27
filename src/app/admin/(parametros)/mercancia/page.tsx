import { MercanciaDatatable } from '@/app/admin/(parametros)/mercancia/componentes/MercanciaDatatable'
import { Metadata } from 'next'
import { siteName } from '@/lib/utilities'

export const metadata: Metadata = {
  title: `Mercancia - ${siteName()}`,
}

export default function Page() {
  return (
    <div className="container p-1">
      <MercanciaDatatable />
    </div>
  )
}
