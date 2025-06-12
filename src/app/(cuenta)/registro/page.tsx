'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useRouter } from 'next/navigation'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Loader2,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  CheckCircle,
  IdCard,
} from 'lucide-react'
import { toast } from 'sonner'
import { useApi } from '@/lib/useApi'
import { encodeBase64, securityPassword, siteName } from '@/lib/utilities'

import PasswordStrengthIndicator from '@/components/PasswordStrengthIndicator'
import { MessageInterpreter } from '@/lib/messageInterpreter'
import { validateDateFormat } from '@/lib/dates'

const registroSchema = z
  .object({
    nroDocumento: z.string().min(5, {
      message: 'El número de documento debe tener al menos 5 caracteres.',
    }),
    nombres: z
      .string()
      .min(2, { message: 'El nombre debe tener al menos 2 caracteres.' }),
    primerApellido: z.string().min(2, {
      message: 'El primer apellido debe tener al menos 2 caracteres.',
    }),
    segundoApellido: z.string().optional(),
    fechaNacimiento: z.string().refine(
      (date) => {
        return validateDateFormat(date, 'YYYY-MM-DD')
      },
      {
        message: 'Fecha de nacimiento inválida',
      }
    ),
    correoElectronico: z.string().email('Ingrese un correo electrónico válido'),
    contrasenaNueva: z
      .string()
      .min(8, 'La contraseña debe tener al menos 8 caracteres'),
    confirmacionContrasena: z
      .string()
      .min(8, 'La contraseña debe tener al menos 8 caracteres'),
  })
  .refine((data) => data.contrasenaNueva === data.confirmacionContrasena, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmacionContrasena'],
  })

export default function RegistroPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()

  const { request } = useApi()

  const form = useForm<z.infer<typeof registroSchema>>({
    resolver: zodResolver(registroSchema),
    defaultValues: {
      nroDocumento: '',
      nombres: '',
      primerApellido: '',
      segundoApellido: '',
      fechaNacimiento: '',
      correoElectronico: '',
      contrasenaNueva: '',
      confirmacionContrasena: '',
    },
  })

  const onSubmit = async (data: z.infer<typeof registroSchema>) => {
    if (passwordStrength < 3) {
      form.setError('contrasenaNueva', {
        message: 'La contraseña no es lo suficientemente segura.',
      })
      return
    }

    setIsLoading(true)
    try {
      await request({
        url: '/usuarios/crear-cuenta',
        method: 'POST',
        data: {
          correoElectronico: data.correoElectronico,
          contrasenaNueva: encodeBase64(encodeURI(data.contrasenaNueva)),
          persona: {
            nombres: data.nombres,
            primerApellido: data.primerApellido,
            segundoApellido: data.segundoApellido,
            nroDocumento: data.nroDocumento,
            fechaNacimiento: data.fechaNacimiento,
          },
        },
      })
      setIsSuccess(true)
    } catch (error) {
      toast.error('Error en creación de cuenta', {
        description: MessageInterpreter(error),
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="container flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex justify-center">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <CardTitle className="text-2xl font-bold text-center">
              Registro Exitoso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-600">
              Tu cuenta ha sido creada con éxito. Por favor, revisa tu correo
              electrónico para encontrar el enlace de activación.
            </p>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => router.push('/login')}>
              Ir al inicio de sesión
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <>
      <title>{`Registro - ${siteName()}`}</title>
      <div className="container flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-xl">
          <CardHeader className="space-y-1">
            <div className="flex justify-center">
              <UserPlus className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold text-center">
              Crea tu cuenta
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 "
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <FormLabel>DATOS PERSONALES</FormLabel>
                  </div>
                  <FormField
                    control={form.control}
                    name="nroDocumento"
                    render={({ field }) => (
                      <FormItem className="col-span-2 md:col-span-1">
                        <FormLabel>Nro. Documento</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <IdCard
                              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                              size={18}
                            />
                            <Input
                              id='nroDocumento'
                              className="pl-10"
                              placeholder="Ingrese Cedula de Identidad"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="nombres"
                    render={({ field }) => (
                      <FormItem className="col-span-2 md:col-span-1">
                        <FormLabel>Nombres</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User
                              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                              size={18}
                            />
                            <Input
                              id='nombres'
                              className="pl-10"
                              placeholder="Ingrese sus nombres"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="primerApellido"
                    render={({ field }) => (
                      <FormItem className="col-span-2 md:col-span-1">
                        <FormLabel>Primer Apellido</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User
                              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                              size={18}
                            />
                            <Input
                              id='primerApellido'
                              className="pl-10"
                              placeholder="Ingrese su primer apellido"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="segundoApellido"
                    render={({ field }) => (
                      <FormItem className="col-span-2 md:col-span-1">
                        <FormLabel>Segundo Apellido</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User
                              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                              size={18}
                            />
                            <Input
                              id='segundoApellido'
                              className="pl-10"
                              placeholder="Ingrese su segundo apellido"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="fechaNacimiento"
                    render={({ field }) => (
                      <FormItem className="col-span-2 md:col-span-1">
                        <FormLabel>Fecha Nacimiento</FormLabel>
                        <FormControl>
                          <Input
                            id='fechaNacimiento'
                            placeholder="Ingrese su fecha de nacimiento"
                            type="date"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="col-span-2 pt-4">
                    <FormLabel>DATOS DEL USUARIO</FormLabel>
                  </div>
                  <FormField
                    control={form.control}
                    name="correoElectronico"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Correo electrónico</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail
                              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                              size={18}
                            />
                            <Input
                              id='correoElectronico'
                              className="pl-10"
                              placeholder="tu@email.com"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="contrasenaNueva"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Contraseña</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock
                              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                              size={18}
                            />
                            <Input
                              id='password'
                              className="pl-10 pr-10"
                              type={showPassword ? 'text' : 'password'}
                              placeholder="Ingrese su contraseña"
                              {...field}
                              onChange={(e) => {
                                field.onChange(e)
                                securityPassword(e.target.value).then(
                                  (result) => {
                                    setPasswordStrength(result.score)
                                  }
                                )
                              }}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </FormControl>

                        {passwordStrength > 0 && (
                          <PasswordStrengthIndicator
                            strength={passwordStrength}
                          />
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmacionContrasena"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Confirmar Contraseña</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock
                              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                              size={18}
                            />
                            <Input
                              id='confirmarPassword'
                              className="pl-10 pr-10"
                              type={showConfirmPassword ? 'text' : 'password'}
                              placeholder="Confirme su contraseña"
                              {...field}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Registrarse
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-center w-full">
              ¿Ya tienes una cuenta?{' '}
              <a href="/login" className="text-primary hover:underline">
                Inicia sesión
              </a>
            </p>
          </CardFooter>
        </Card>
      </div>
    </>
  )
}
