import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Rol, Usuario } from '../types'
import { useAuth } from '@/contexts/AuthProvider'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import { MessageInterpreter } from '@/lib/messageInterpreter'
import { validateDateFormat } from '@/lib/dates'
import { print } from '@/lib/print'

interface AgregarEditarUsuarioModalProps {
  usuario: Usuario | null
  roles: Rol[]
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

const formSchema = z.object({
  nombres: z.string().min(2, {
    message: 'El nombre debe tener al menos 2 caracteres.',
  }),
  primerApellido: z.string().min(2, {
    message: 'El primer apellido debe tener al menos 2 caracteres.',
  }),
  segundoApellido: z.string().optional(),
  nroDocumento: z.string().min(5, {
    message: 'El número de documento debe tener al menos 5 caracteres.',
  }),
  fechaNacimiento: z.string().refine(
    (date) => {
      return validateDateFormat(date, 'YYYY-MM-DD')
    },
    {
      message: 'Fecha de nacimiento inválida',
    }
  ),
  correoElectronico: z.string().email({
    message: 'Debe ser un correo electrónico válido.',
  }),
  roles: z.array(z.string()).min(1, {
    message: 'Debe seleccionar al menos un rol.',
  }),
})

export function AgregarEditarUsuarioModal({
  usuario,
  roles,
  isOpen,
  onClose,
  onSuccess,
}: AgregarEditarUsuarioModalProps) {
  const { sessionRequest } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: usuario
      ? {
        nombres: usuario.persona.nombres,
        primerApellido: usuario.persona.primerApellido,
        segundoApellido: usuario.persona.segundoApellido,
        nroDocumento: usuario.persona.nroDocumento,
        fechaNacimiento: usuario.persona.fechaNacimiento,
        correoElectronico: usuario.correoElectronico,
        roles: usuario.usuarioRol.map((value) => value.rol.id),
      }
      : {
        nombres: '',
        primerApellido: '',
        segundoApellido: '',
        nroDocumento: '',
        fechaNacimiento: '',
        correoElectronico: '',
        roles: [],
      },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      const url = usuario ? `/usuarios/${usuario.id}` : '/usuarios'
      const method = usuario ? 'patch' : 'post'

      const result = await sessionRequest({
        url,
        method,
        data: {
          ...values,
          persona: {
            nombres: values.nombres,
            primerApellido: values.primerApellido,
            segundoApellido: values.segundoApellido,
            nroDocumento: values.nroDocumento,
            fechaNacimiento: values.fechaNacimiento,
          },
        },
      })

      toast.success(usuario ? 'Usuario actualizado' : 'Usuario creado', {
        description: MessageInterpreter(result?.data),
      })

      onSuccess()
      onClose()
    } catch (error) {
      print('Error saving user:', error)
      toast.error(
        usuario ? 'Error actualizando usuario' : 'Error creando usuario',
        {
          description: MessageInterpreter(error),
        }
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="overflow-y-auto max-h-screen">
        <DialogHeader>
          <DialogTitle>
            {usuario ? 'Editar Usuario' : 'Agregar Usuario'}
          </DialogTitle>
          <DialogDescription>
            {usuario
              ? 'Modifica los datos del usuario y guarda los cambios cuando hayas terminado.'
              : 'Ingresa los datos del nuevo usuario y haz clic en Guardar para crear la cuenta.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            onError={(event) => print(event)}
            className="space-y-8"
          >
            <FormField
              control={form.control}
              name="nombres"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombres</FormLabel>
                  <FormControl>
                    <Input id='nombres' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="primerApellido"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Primer Apellido</FormLabel>
                  <FormControl>
                    <Input id='primerApellido' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="segundoApellido"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Segundo Apellido</FormLabel>
                  <FormControl>
                    <Input id='segundoApellido' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nroDocumento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nro. Documento</FormLabel>
                  <FormControl>
                    <Input id='nroDocumento' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fechaNacimiento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha de Nacimiento</FormLabel>
                  <FormControl>
                    <Input id='fechaNacimiento' type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="correoElectronico"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correo Electrónico</FormLabel>
                  <FormControl>
                    <Input id='correoElectronico' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="roles"
              render={() => (
                <FormItem>
                  <FormLabel>Roles</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      {roles.map((role) => (
                        <div
                          key={role.id}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={role.id}
                            checked={form.watch('roles').includes(role.id)}
                            onCheckedChange={(checked) => {
                              const currentRoles = form.watch('roles')
                              if (checked) {
                                form.setValue('roles', [
                                  ...currentRoles,
                                  role.id,
                                ])
                              } else {
                                form.setValue(
                                  'roles',
                                  currentRoles.filter((id) => id !== role.id)
                                )
                              }
                            }}
                          />
                          <label htmlFor={role.id}>{role.nombre}</label>
                        </div>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="w-full flex justify-end gap-2">
              <Button
                type="button"
                variant={'outline'}
                onClick={onClose}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Guardando...' : usuario ? 'Actualizar' : 'Crear'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
