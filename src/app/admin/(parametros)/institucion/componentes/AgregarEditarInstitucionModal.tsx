import { Institucion } from '@/app/admin/(parametros)/institucion/componentes/types'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useAuth } from '@/contexts/AuthProvider'
import { toast } from 'sonner'
import { MessageInterpreter } from '@/lib/messageInterpreter'
import { print } from '@/lib/print'

interface AgregarEditarInstitucionModalProps {
  institucion: Institucion | null
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

const formSchema = z.object({
  codigo: z.string().min(1, {
    message: 'El código es obligatorio.',
  }),
  institucion: z.string().min(1, {
    message: 'El nombre es obligatorio.',
  }),

  logo: z.string().optional(),
  direccion: z.string().optional(),
})

export function AgregarEditarInstitucionModal({
  institucion,
  isOpen,
  onClose,
  onSuccess,
}: AgregarEditarInstitucionModalProps) {
  const { sessionRequest } = useAuth()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      codigo: institucion?.codigo,
      institucion: institucion?.institucion,
      logo: institucion?.logo,
      direccion: institucion?.direccion,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (institucion) {
        const result = await sessionRequest({
          url: `/institution/${institucion.id}`,
          method: 'PATCH',
          data: values,
        })
        toast.success('Institución actualizado con éxito', {
          description: MessageInterpreter(result?.data),
        })
      } else {
        const respuesta = await sessionRequest({
          url: '/institution',
          method: 'POST',
          data: values,
        })
        toast.success('Institución creado con éxito', {
          description: MessageInterpreter(respuesta?.data),
        })
      }
      onSuccess()
      onClose()
    } catch (error) {
      print('Error al guardar el parámetro:', error)
      toast.error(
        institucion
          ? 'Error al actualizar parámetro'
          : 'Error al guardar nuevo parámetro',
        {
          description: MessageInterpreter(error),
        }
      )
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="overflow-y-auto max-h-screen">
        <DialogHeader>
          <DialogTitle>
            {institucion ? 'Editar Institución' : 'Agregar Institución'}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="codigo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código</FormLabel>
                  <FormControl>
                    <Input id='codigo' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="institucion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Institucion</FormLabel>
                  <FormControl>
                    <Input id='institucion' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="direccion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea id='ddireccion' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
 
            <div className="w-full flex justify-end gap-2">
              <Button type="button" variant={'outline'} onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">
                {institucion ? 'Actualizar' : 'Crear'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
