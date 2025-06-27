import { Frontera } from '@/app/admin/(parametros)/frontera/componentes/types'
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

interface AgregarEditarFronteraModalProps {
  frontera: Frontera | null
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

const formSchema = z.object({
  codigo: z.string().min(1, {
    message: 'El código es obligatorio.',
  }),
  unidad: z.string().min(1, {
    message: 'El nombre es obligatorio.',
  }),
  descripcion: z.string().optional(),
  grupo: z.string().optional(),
})

export function AgregarEditarFronteraModal({
  frontera,
  isOpen,
  onClose,
  onSuccess,
}: AgregarEditarFronteraModalProps) {
  const { sessionRequest } = useAuth()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      codigo: frontera?.codigo,
      unidad: frontera?.frontera,
      descripcion: frontera?.descripcion,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (frontera) {
        const result = await sessionRequest({
          url: `/border/${frontera.id}`,
          method: 'PATCH',
          data: values,
        })
        toast.success('Parámetro actualizado con éxito', {
          description: MessageInterpreter(result?.data),
        })
      } else {
        const respuesta = await sessionRequest({
          url: '/border',
          method: 'POST',
          data: values,
        })
        toast.success('Parámetro creado con éxito', {
          description: MessageInterpreter(respuesta?.data),
        })
      }
      onSuccess()
      onClose()
    } catch (error) {
      print('Error al guardar el parámetro:', error)
      toast.error(
        frontera
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
            {frontera ? 'Editar U./Frontera' : 'Agregar U./Frontera'}
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
              name="unidad"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unidad de Frontera</FormLabel>
                  <FormControl>
                    <Input id='unidad' {...field} />
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
                    <Textarea id='descripcion' {...field} />
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
                {frontera ? 'Actualizar' : 'Crear'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
