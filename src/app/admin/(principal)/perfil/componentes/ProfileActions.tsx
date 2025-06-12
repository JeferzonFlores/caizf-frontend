import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import ChangePasswordModal from '@/app/admin/(principal)/perfil/componentes/ChangePasswordComponent'
import { useAuth } from '@/contexts/AuthProvider'
import { MoveUpRight } from 'lucide-react'
import { Constants } from '@/config/Constants'
import EditProfileModal from './EditProfileModal'

const ProfileActions = () => {
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [showEditProfile, setShowEditProfile] = useState(false)

  const { user } = useAuth()

  if (!user) {
    return null
  }

  if (user.ciudadaniaDigital) {
    return (
      <>
        <div className="mt-6 flex justify-end">
          <Button
            variant="secondary"
            className="mr-2"
            onClick={() => {
              window.open(Constants.ciudadaniaUrl)
            }}
          >
            Editar perfil en Ciudadanía Digital
            <MoveUpRight />
          </Button>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="mt-6 flex justify-end">
        <Button
          variant="outline"
          className="mr-2"
          onClick={() => setShowEditProfile(true)}
        >
          Editar Perfil
        </Button>
        <Button onClick={() => setShowChangePassword(!showChangePassword)}>
          {showChangePassword ? 'Cancelar' : 'Cambiar Contraseña'}
        </Button>
      </div>
      {showChangePassword && (
        <ChangePasswordModal
          isOpen={showChangePassword}
          onClose={() => setShowChangePassword(false)}
        />
      )}
      <EditProfileModal
        isOpen={showEditProfile}
        onClose={() => setShowEditProfile(false)}
      />
    </>
  )
}

export default ProfileActions
