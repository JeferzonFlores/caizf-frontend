import { useState } from 'react'
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Checkbox } from '@/components/ui/checkbox'
import { PlusCircle, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { MessageInterpreter } from '@/lib/messageInterpreter'
import { print } from '@/lib/print'
import { Politica } from '@/app/admin/(configuracion)/politicas/componentes/types'

const formSchema = z.object({
  sujeto: z.string().min(1, { message: 'El sujeto es requerido' }),
  objeto: z.string().min(1, { message: 'El objeto es requerido' }),
  acciones: z
    .array(z.string())
    .min(1, { message: 'Al menos una acción es requerida' }),
  app: z.enum(['frontend', 'backend']),
})

type FormValues = z.infer<typeof formSchema>

const frontendActions = ['read', 'create', 'update', 'delete']
const backendActions = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']

interface AgregarEditarPoliticaModalProps {
  politica: Politica | null
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function AgregarEditarPoliticaModal({
  politica,
  isOpen,
  onClose,
  onSuccess,
}: AgregarEditarPoliticaModalProps) {
  const { sessionRequest } = useAuth()
  const [availableActions, setAvailableActions] = useState(frontendActions)
  const [customAction, setCustomAction] = useState('')

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sujeto: politica?.sujeto,
      objeto: politica?.objeto,
      acciones: politica?.accion.split('|') ?? [],
      app: politica?.app as 'frontend' | 'backend',
    },
  })

  const onSubmit = async (values: FormValues) => {
    try {
      const submitData = {
        ...values,
        accion: values.acciones.join('|'),
      }
      if (politica) {
        const result = await sessionRequest({
          url: `/autorizacion/politicas`,
          method: 'PATCH',
          data: submitData,
          params: {
            sujeto: politica.sujeto,
            objeto: politica.objeto,
            accion: politica.accion,
            app: politica.app,
          }
        })
        toast.success('Política actualizada con éxito', {
          description: MessageInterpreter(result?.data),
        })
      } else {
        const result = await sessionRequest({
          url: '/autorizacion/politicas',
          method: 'POST',
          data: submitData,
        })
        toast.success('Política creada con éxito', {
          description: MessageInterpreter(result?.data),
        })
      }
      onSuccess()
      onClose()
    } catch (error) {
      print('Error al guardar la política:', error)
      toast.error('Error', {
        description: MessageInterpreter(error),
      })
    }
  }

  const handleAddCustomAction = () => {
    if (customAction && !form.getValues().acciones.includes(customAction)) {
      form.setValue('acciones', [...form.getValues().acciones, customAction])
      setCustomAction('')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="overflow-y-auto max-h-screen">
        <DialogHeader>
          <DialogTitle>
            {politica ? 'Editar Política' : 'Agregar Política'}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="sujeto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sujeto</FormLabel>
                  <FormControl>
                    <Input id='sujeto' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="objeto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Objeto</FormLabel>
                  <FormControl>
                    <Input id='objeto' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="app"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>App</FormLabel>
                  <Select
                    onValueChange={(value: 'frontend' | 'backend') => {
                      field.onChange(value)
                      setAvailableActions(
                        value === 'frontend' ? frontendActions : backendActions
                      )
                      form.setValue('acciones', [])
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger id='app'>
                        <SelectValue placeholder="Seleccione una app" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="frontend">Frontend</SelectItem>
                      <SelectItem value="backend">Backend</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="acciones"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Acciones</FormLabel>
                  <div className="space-y-2">
                    {availableActions.map((item) => (
                      <FormItem
                        key={item}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(item)}
                            onCheckedChange={(checked) => {
                              const updatedValue = checked
                                ? [...field.value, item]
                                : field.value?.filter((value) => value !== item)
                              form.setValue('acciones', updatedValue)
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">{item}</FormLabel>
                      </FormItem>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {field.value
                      .filter((action) => !availableActions.includes(action))
                      .map((action) => (
                        <Badge key={action} variant="secondary">
                          {action}
                          <button
                            type="button"
                            className="ml-1"
                            onClick={() => {
                              const updatedValue = field.value.filter(
                                (a) => a !== action
                              )
                              form.setValue('acciones', updatedValue)
                            }}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    <Input
                      value={customAction}
                      onChange={(e) => setCustomAction(e.target.value)}
                      placeholder="Nueva acción personalizada"
                    />
                    <Button type="button" onClick={handleAddCustomAction}>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Agregar
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="w-full flex justify-end gap-2">
              <Button type="button" variant={'outline'} onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">{politica ? 'Actualizar' : 'Crear'}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
