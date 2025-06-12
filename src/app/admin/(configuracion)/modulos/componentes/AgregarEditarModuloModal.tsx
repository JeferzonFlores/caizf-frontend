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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Switch } from '@/components/ui/switch'
import DynamicIcon from '@/components/Icon'
import { MessageInterpreter } from '@/lib/messageInterpreter'
import { print } from '@/lib/print'
import { Modulo } from '@/app/admin/(configuracion)/modulos/componentes/types'

const formSchema = z.object({
  label: z.string().min(1, { message: 'La etiqueta es requerida' }),
  url: z.string().min(1, { message: 'La URL es requerida' }),
  nombre: z.string().min(1, { message: 'El nombre es requerido' }),
  orden: z.coerce.number(),
  descripcion: z.string(),
  icono: z.string().optional(),
  moduloPadreId: z.string().nullable(),
  esSeccion: z.boolean(),
})

type FormValues = z.infer<typeof formSchema>

interface AgregarEditarModuloModalProps {
  modulo: Modulo | null
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  secciones: Modulo[]
}

export function AgregarEditarModuloModal({
  modulo,
  isOpen,
  onClose,
  onSuccess,
  secciones,
}: AgregarEditarModuloModalProps) {
  const { sessionRequest } = useAuth()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      label: modulo?.label,
      url: modulo?.url,
      nombre: modulo?.nombre,
      orden: modulo?.propiedades.orden,
      descripcion: modulo?.propiedades.descripcion,
      icono: modulo?.propiedades.icono || '',
      moduloPadreId: modulo?.modulo?.id || null,
      esSeccion: !modulo?.modulo,
    },
  })

  const onSubmit = async (values: FormValues) => {
    try {
      const submitData = {
        label: values.label,
        url: values.url,
        nombre: values.nombre,
        propiedades: {
          orden: values.orden,
          descripcion: values.descripcion,
          icono: values.esSeccion ? undefined : values.icono,
        },
        idModulo: values.esSeccion
          ? null
          : values.moduloPadreId
      }

      if (modulo) {
        const result = await sessionRequest({
          url: `/autorizacion/modulos/${modulo.id}`,
          method: 'PATCH',
          data: submitData,
        })
        toast.success('Módulo actualizado con éxito', {
          description: MessageInterpreter(result?.data),
        })
      } else {
        const result = await sessionRequest({
          url: '/autorizacion/modulos',
          method: 'POST',
          data: submitData,
        })
        toast.success('Módulo creado con éxito', {
          description: MessageInterpreter(result?.data),
        })
      }
      onSuccess()
      onClose()
    } catch (error) {
      print('Error al guardar el módulo:', error)
      toast.error('Error', {
        description: MessageInterpreter(error),
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="overflow-y-auto max-h-screen">
        <DialogHeader>
          <DialogTitle>
            {modulo ? 'Editar Módulo' : 'Agregar Módulo'}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="esSeccion"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      {field.value ? 'Sección' : 'Módulo'}
                    </FormLabel>
                    <FormDescription>
                      {field.value
                        ? 'Este elemento será una sección'
                        : 'Este elemento será un módulo'}
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      id='tipo'
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Etiqueta</FormLabel>
                  <FormControl>
                    <Input id='etiqueta' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL</FormLabel>
                  <FormControl>
                    <Input id='url' {...field} />
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
              name="orden"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Orden</FormLabel>
                  <FormControl>
                    <Input id='orden' {...field} type="number" />
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
            {!form.watch('esSeccion') && (
              <>
                <FormField
                  control={form.control}
                  name="icono"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ícono</FormLabel>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <Input id='icono' {...field} />
                          {field.value && (
                            <DynamicIcon name={field.value} size={24} />
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="moduloPadreId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Módulo Padre</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(value || null)}
                        value={field.value || undefined}
                      >
                        <FormControl>
                          <SelectTrigger id='moduloPadre'>
                            <SelectValue placeholder="Seleccione un módulo padre" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="null">Ninguno</SelectItem>
                          {secciones.map((moduloPadre) => (
                            <SelectItem
                              key={moduloPadre.id}
                              value={moduloPadre.id}
                            >
                              {moduloPadre.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            <div className="w-full flex justify-end gap-2">
              <Button type="button" variant={'outline'} onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">{modulo ? 'Actualizar' : 'Crear'}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
