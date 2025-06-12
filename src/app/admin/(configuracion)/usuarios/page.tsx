import { UsuariosDataTable } from '@/app/admin/(configuracion)/usuarios/components/UsuariosDatatable'
import { PermissionWrapper } from '@/components/PermissionWrapper'
import { Metadata } from 'next'
import { siteName } from '@/lib/utilities'

export const metadata: Metadata = {
  title: `Usuarios - ${siteName()}`,
}

const Page = () => {
  return (
    <div className="container p-1">
      <PermissionWrapper requiredPermission="/admin/usuarios">
        <UsuariosDataTable />
      </PermissionWrapper>
    </div>
  )
}

export default Page
