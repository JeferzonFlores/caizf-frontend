import { Mercancia } from '@/app/admin/(parametros)/mercancia/componentes/types'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useAuth } from '@/contexts/AuthProvider'
import { toast } from 'sonner'
import { MessageInterpreter } from '@/lib/messageInterpreter'
import { print } from '@/lib/print'

interface AgregarEditarMercanciaModalProps {
  mercancia: Mercancia | null
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

const formSchema = z.object({
  codigo: z.string().min(1, {
    message: 'El código es obligatorio.',
  }),
  mercancia: z.string().min(1, {
    message: 'El nombre es obligatorio.',
  }),

    idUnidad: z.number().min(1, {
    message: 'La unidad de medida es obligatorio.',
    
  }),

      idInstitucion: z.number().min(1, {
    message: 'La Institucion de medida es obligatorio.',
    
  }),
  descripcion: z.string().optional(),
  grupo: z.string().optional(),
  
})

export function AgregarEditarMercanciaModal({
  mercancia,
  isOpen,
  onClose,
  onSuccess,
}: AgregarEditarMercanciaModalProps) {
  const { sessionRequest } = useAuth()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      codigo: mercancia?.codigo,
      mercancia: mercancia?.mercancia,
      descripcion: mercancia?.descripcion,
      idUnidad: mercancia?.idUnidad,
      idInstitucion: mercancia?.idInstitucion,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (mercancia) {
        const result = await sessionRequest({
          url: `/commodity/${mercancia.id}`,
          method: 'PATCH',
          data: values,
        })
        toast.success('Mercancia actualizado con éxito', {
          description: MessageInterpreter(result?.data),
        })
      } else {
        const respuesta = await sessionRequest({
          url: '/commodity',
          method: 'POST',
          data: values,
        })
        toast.success('Mercancia creado con éxito', {
          description: MessageInterpreter(respuesta?.data),
        })
      }
      onSuccess()
      onClose()
    } catch (error) {
      print('Error al guardar el Mercancia:', error)
      toast.error(
        mercancia
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
            {mercancia ? 'Editar Mercancia' : 'Agregar Mercancia'}
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
              name="mercancia"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mercancia</FormLabel>
                  <FormControl>
                    <Input id='mercancia' {...field} />
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

            <FormField
              control={form.control}
              name="idUnidad" 
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unidad de Medida</FormLabel>
                  <Select onValueChange={field.onChange} >
                    <FormControl>

                      <SelectTrigger className="w-[180px]" id="idUnidad">
                        <SelectValue placeholder="Seleccione una unidad" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
 
                      <SelectItem value="1">Kilogramo (KG)</SelectItem>
                      <SelectItem value="2">Litro (L)</SelectItem>
                      <SelectItem value="3">Unidad (U)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="idInstitucion" 
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Institución</FormLabel>
                  <Select onValueChange={field.onChange} >
                    <FormControl>

                      <SelectTrigger className="w-[180px]" id="idUnidad">
                        <SelectValue placeholder="Seleccione una Institución" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      
                      <SelectItem value="1">MDPyEP</SelectItem>
                      <SelectItem value="2">MAMyA</SelectItem>
                      <SelectItem value="3">EMAPA</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="w-full flex justify-end gap-2">
              <Button type="button" variant={'outline'} onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">
                {mercancia ? 'Actualizar' : 'Crear'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
