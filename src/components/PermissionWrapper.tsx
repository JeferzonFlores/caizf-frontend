'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthProvider'
import { print } from '@/lib/print'

interface PermissionWrapperProps {
  children: React.ReactNode
  requiredPermission: string
}

export const PermissionWrapper: React.FC<PermissionWrapperProps> = ({
  children,
  requiredPermission,
}) => {
  const { checkPermission } = useAuth()
  const router = useRouter()
  const [hasPermission, setHasPermission] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const verifyPermission = async () => {
      try {
        const permission = await checkPermission(requiredPermission, 'read')
        setHasPermission(permission)
      } catch (error) {
        print('Error checking permission:', error)
        setHasPermission(false)
      } finally {
        setIsLoading(false)
      }
    }

    verifyPermission().catch(print)
  }, [checkPermission, requiredPermission])

  useEffect(() => {
    if (!isLoading && !hasPermission) {
      router.push('/admin/home')
    }
  }, [hasPermission, isLoading, router])

  if (isLoading) {
    return <div>Cargando...</div>
  }

  if (!hasPermission) {
    return null
  }

  return <>{children}</>
}
