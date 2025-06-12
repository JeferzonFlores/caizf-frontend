import { useAuth } from '@/contexts/AuthProvider'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { MessageInterpreter } from '@/lib/messageInterpreter'
import { print } from '@/lib/print'
import { Rol } from '@/app/admin/(configuracion)/roles/componentes/types'

const formSchema = z.object({
  rol: z.string().min(1, { message: 'El rol es requerido' }),
  nombre: z.string().min(1, { message: 'El nombre es requerido' }),
  descripcion: z.string().min(1, { message: 'La descripción es requerida' }),
})

type FormValues = z.infer<typeof formSchema>

interface AgregarEditarRolModalProps {
  rol: Rol | null
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function AgregarEditarRolModal({
  rol,
  isOpen,
  onClose,
  onSuccess,
}: AgregarEditarRolModalProps) {
  const { sessionRequest } = useAuth()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rol: rol?.rol,
      nombre: rol?.nombre,
      descripcion: rol?.descripcion,
    },
  })

  const onSubmit = async (values: FormValues) => {
    try {
      if (rol) {
        const result = await sessionRequest({
          url: `/autorizacion/roles/${rol.id}`,
          method: 'PATCH',
          data: values,
        })
        toast.success('Rol actualizado con éxito', {
          description: MessageInterpreter(result?.data),
        })
      } else {
        const result = await sessionRequest({
          url: '/autorizacion/roles',
          method: 'POST',
          data: values,
        })
        toast.success('Rol creado con éxito', {
          description: MessageInterpreter(result?.data),
        })
      }
      onSuccess()
      onClose()
    } catch (error) {
      print('Error al guardar el rol:', error)
      toast.error('Error', {
        description: MessageInterpreter(error),
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="overflow-y-auto max-h-screen">
        <DialogHeader>
          <DialogTitle>{rol ? 'Editar Rol' : 'Agregar Rol'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="rol"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rol</FormLabel>
                  <FormControl>
                    <Input id='rol' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input id='nombre' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="descripcion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Input id='descripcion' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="w-full flex justify-end gap-2">
              <Button type="button" variant={'outline'} onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">{rol ? 'Actualizar' : 'Crear'}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
