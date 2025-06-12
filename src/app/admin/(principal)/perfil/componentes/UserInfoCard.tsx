import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Camera, Mail } from 'lucide-react'
import { useAuth } from '@/contexts/AuthProvider'
import { Button } from '@/components/ui/button'
import ProfilePhotoDialog from './ProfilePhotoDialog'
import { Constants } from '@/config/Constants'
import Image from 'next/image'

const UserInfoCard: React.FC = () => {
  const { user } = useAuth()
  const [isPhotoDialogOpen, setIsPhotoDialogOpen] = useState(false)
  const [avatarKey, setAvatarKey] = useState(0)

  useEffect(() => {
    // Forzar la actualización del avatar cuando cambie la URL de la foto
    setAvatarKey((prevKey) => prevKey + 1)
  }, [user?.urlFoto])

  if (!user) {
    return null
  }

  const getInitials = () => {
    if (user.persona) {
      const { nombres, primerApellido, segundoApellido } = user.persona
      const inicialNombre = nombres ? nombres[0] : ''
      const inicialPrimerApellido = primerApellido
        ? primerApellido[0]
        : undefined
      const inicialSegundoApellido = segundoApellido
        ? segundoApellido[0]
        : undefined
      const inicialApellidos =
        inicialPrimerApellido ?? inicialSegundoApellido ?? ''
      return `${inicialNombre}${inicialApellidos}`
    }
    return ''
  }

  return (
    <Card className="col-span-1">
      <CardContent className="flex flex-col items-center pt-5">
        <div className="relative">
          <Avatar className="w-32 h-32 mb-4">
            {user?.urlFoto && (
              <Image
                key={avatarKey}
                src={`${Constants.baseUrl}${user.urlFoto}`}
                alt={'Foto de perfil'}
                fill
                sizes="100vw"
                style={{
                  objectFit: 'cover',
                }}
              />
            )}
            <AvatarFallback className="text-3xl">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          <Button
            size="sm"
            className="absolute bottom-0 right-0 rounded-full"
            onClick={() => setIsPhotoDialogOpen(true)}
          >
            <Camera className="h-4 w-4" />
          </Button>
        </div>
        <h2 className="text-2xl font-semibold text-center mb-1">
          {`${user.persona?.nombres} ${user.persona?.primerApellido} ${user.persona?.segundoApellido || ''}`}
        </h2>
        <p className="text-gray-500 dark:text-gray-400">{user.usuario}</p>
        <div className="mt-4 flex items-center">
          <Mail className="mr-2" />
          <div>{user.correoElectronico}</div>
        </div>
        <ProfilePhotoDialog
          isOpen={isPhotoDialogOpen}
          onClose={() => setIsPhotoDialogOpen(false)}
        />
      </CardContent>
    </Card>
  )
}

export default UserInfoCard
