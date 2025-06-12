'use client'
import React from 'react'
import { useAuth } from '@/contexts/AuthProvider'
import ProfileHeader from '@/app/admin/(principal)/perfil/componentes/ProfileHeader'
import UserInfoCard from '@/app/admin/(principal)/perfil/componentes/UserInfoCard'
import AccountDetailsCard from '@/app/admin/(principal)/perfil/componentes/AccountDetailsCard'
import ProfileActions from '@/app/admin/(principal)/perfil/componentes/ProfileActions'

const ProfileDetail = () => {
  const { user } = useAuth()

  if (!user) {
    return <div>Cargando perfil...</div>
  }

  return (
    <div className="container mx-auto p-6">
      <ProfileHeader />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <UserInfoCard />
        <AccountDetailsCard />
      </div>
      <ProfileActions />
    </div>
  )
}

export default ProfileDetail
