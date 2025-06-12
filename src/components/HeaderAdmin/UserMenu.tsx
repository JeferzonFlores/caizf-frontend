import React from 'react'
import { useTheme } from 'next-themes'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Laptop, LogOut, Moon, Shield, Sun } from 'lucide-react'
import { Constants } from '@/config/Constants'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { User } from '@/contexts/types/AuthTypes'
import Image from 'next/image'
import { capitalizeFirstLetter } from '@/lib/utilities'
import { useRouter } from 'next/navigation'

interface UserMenuProps {
  user?: User | null
  handleRoleChange: (idRol: string) => void
  handleLogout: () => void
  getInitials: () => string
}

const UserMenu: React.FC<UserMenuProps> = ({
  user,
  handleRoleChange,
  handleLogout,
  getInitials,
}) => {
  const { setTheme, theme } = useTheme()
  const router = useRouter()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar>
            {user?.urlFoto && (
              <Image
                src={`${Constants.baseUrl}${user.urlFoto}`}
                alt={'Foto de perfil'}
                fill
                sizes="100vw"
                style={{
                  objectFit: 'cover',
                }}
              />
            )}
            <AvatarFallback className="text-1xl">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 gap-1" align="end" forceMount>
        <DropdownMenuItem
          className="font-normal"
          onClick={() => {
            router.push('/admin/perfil')
          }}
        >
          <div className="flex flex-row justify-start items-center gap-2">
            <Avatar>
              {user?.urlFoto && (
                <Image
                  src={`${Constants.baseUrl}${user.urlFoto}`}
                  alt={'Foto de perfil'}
                  fill
                  sizes="100vw"
                  style={{
                    objectFit: 'cover',
                  }}
                />
              )}
              <AvatarFallback className="text-1xl">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium ">
                {capitalizeFirstLetter(user?.persona?.nombres ?? '')}{' '}
                {capitalizeFirstLetter(
                  user?.persona?.primerApellido ??
                    user?.persona.segundoApellido ??
                    ''
                )}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {user?.usuario}
              </p>
            </div>
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Tema</DropdownMenuLabel>
        <Tabs value={theme} onValueChange={setTheme} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="light" className="flex items-center">
              <Sun className="mr-2 h-4 w-4" />
              Claro
            </TabsTrigger>
            <TabsTrigger value="dark" className="flex items-center">
              <Moon className="mr-2 h-4 w-4" />
              Oscuro
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center">
              <Laptop className="mr-2 h-4 w-4" />
              Sistema
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Roles</DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={user?.idRol}
          onValueChange={handleRoleChange}
        >
          {user?.roles?.map((role) => (
            <DropdownMenuRadioItem
              key={role.idRol}
              value={role.idRol}
              className="flex items-center justify-between"
            >
              <div className="flex items-center">
                <Shield className="mr-2 h-4 w-4" />
                <span>{role.nombre}</span>
              </div>
              <Badge
                variant={user?.idRol === role.idRol ? 'default' : 'outline'}
                className="ml-2"
              >
                {user?.idRol === role.idRol ? 'Activo' : 'Inactivo'}
              </Badge>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Cerrar sesión</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserMenu
