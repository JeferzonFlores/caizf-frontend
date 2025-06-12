import { useAuth } from '@/contexts/AuthProvider'
import { capitalizeFirstLetter } from '@/lib/utilities'

interface DashboardHeaderProps {}

export default function DashboardHeader({}: DashboardHeaderProps) {
  const { user } = useAuth()
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Buenos días'
    if (hour < 18) return 'Buenas tardes'
    return 'Buenas noches'
  }

  return (
    <>
      <h1 className="text-2xl font-bold mb-1 text-gray-800 dark:text-gray-200">
        {getGreeting()},{' '}
        {capitalizeFirstLetter(user?.persona.nombres?.toLowerCase() ?? '')}
      </h1>
      <p className="text mb-6 text-gray-600 dark:text-gray-400">
        Bienvenido de vuelta al panel de administración.
      </p>
    </>
  )
}
