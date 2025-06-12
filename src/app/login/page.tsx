'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthProvider'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { useApi } from '@/lib/useApi'
import { Constants } from '@/config/Constants'
import { MessageInterpreter } from '@/lib/messageInterpreter'
import { print } from '@/lib/print'
import { Lock, User, Loader2 } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import LoadingScreen from '@/components/LoadingScreen'

const formSchema = z.object({
  usuario: z.string().min(3, {
    message: 'El nombre de usuario debe tener al menos 3 caracteres',
  }),
  contrasena: z
    .string()
    .min(3, { message: 'La contraseña debe tener al menos 3 caracteres' }),
})

export default function Login() {
  const { login } = useAuth()
  const { request } = useApi()
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      usuario: '',
      contrasena: '',
    },
  })

  const { isLoading: isCheckingServerState, error: serverStateError } =
    useQuery({
      queryKey: ['serverState'],
      queryFn: () => request<any>({ url: '/estado', method: 'get' }),
    })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoggingIn(true)
    try {
      await login(values.usuario, values.contrasena)
    } catch (error) {
      print('Login error:', error)
      toast.error('Error de inicio de sesión', {
        description: `${MessageInterpreter(error)}`,
      })
    } finally {
      setIsLoggingIn(false)
    }
  }

  // Manejo de errores
  if (serverStateError) {
    print('Error checking server state:', serverStateError)
  }

  if (isCheckingServerState) {
    return <LoadingScreen />
  }

  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="hidden bg-muted lg:block">
        <Image
          src="/placeholder.svg"
          alt="Image"
          width="1920"
          height="1080"
          priority={false}
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
      <div className="flex h-screen items-center justify-center bg-background dark:bg-gray-900">
        <div className="mx-auto w-[350px] space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold text-foreground dark:text-gray-100">
              Inicio de sesión
            </h1>
            <p className="text-balance text-muted-foreground dark:text-gray-400 pt-2">
              Ingresa tus credenciales para iniciar sesión
            </p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="usuario"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="dark:text-gray-300">
                      Usuario
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          size={18}
                        />
                        <Input
                          id="usuario"
                          {...field}
                          disabled={isLoggingIn}
                          className="pl-10 dark:bg-gray-800 dark:text-gray-100"
                          placeholder="Ingrese su usuario"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contrasena"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="dark:text-gray-300">
                      Contraseña
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          size={18}
                        />
                        <Input
                          id="contrasena"
                          type="password"
                          {...field}
                          disabled={isLoggingIn}
                          className="pl-10 dark:bg-gray-800 dark:text-gray-100"
                          placeholder="Ingrese su contraseña"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Link
                href="/recuperacion"
                className={`inline-block text-sm underline dark:text-gray-300 hover:text-primary dark:hover:text-gray-100 ${
                  isLoggingIn ? 'pointer-events-none opacity-50' : ''
                }`}
              >
                ¿Olvidaste tu contraseña?
              </Link>
              <Button type="submit" className="w-full" disabled={isLoggingIn}>
                {isLoggingIn ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Ingresando...
                  </span>
                ) : (
                  'Ingresar'
                )}
              </Button>
            </form>
          </Form>
          <Button
            variant="outline"
            className="w-full dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
            disabled={isLoggingIn}
            onClick={() => {
              window.location.href = `${Constants.baseUrl}/ciudadania-auth`
            }}
          >
            Ingresa con Ciudadanía Digital
          </Button>
          <div className="mt-4 text-center text-sm dark:text-gray-300">
            No tienes una cuenta?{' '}
            <Link
              href="/registro"
              className={`underline hover:text-primary dark:hover:text-gray-100 ${
                isLoggingIn ? 'pointer-events-none opacity-50' : ''
              }`}
            >
              Regístrate
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
