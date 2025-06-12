import React, { useState, useCallback, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthProvider'
import Image from 'next/image'
import { print } from '@/lib/print'
import { Constants } from '@/config/Constants'
import { useDropzone } from 'react-dropzone'
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface ProfilePhotoDialogProps {
  isOpen: boolean
  onClose: () => void
}

const ProfilePhotoDialog: React.FC<ProfilePhotoDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const { user, sessionRequest, updateProfile } = useAuth()
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showConfirmation, setShowConfirmation] = useState(false)

  useEffect(() => {
    if (user?.urlFoto) {
      setPreviewUrl(`${Constants.baseUrl}${user.urlFoto}`)
    }
  }, [user?.urlFoto])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      setSelectedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
      setError(null)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
  })

  const handleSave = () => {
    if (selectedFile) {
      setShowConfirmation(true)
    }
  }

  const confirmSave = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append('foto', selectedFile!)

      await sessionRequest({
        url: `${Constants.baseUrl}/usuarios/cuenta/foto`,
        method: 'PATCH',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      await updateProfile()
      onClose()
    } catch (error) {
      print('Error updating profile photo:', error)
      setError(
        'Error al actualizar la foto de perfil. Por favor, inténtalo de nuevo.'
      )
    } finally {
      setIsLoading(false)
      setShowConfirmation(false)
    }
  }

  const handleDelete = () => {
    setIsDeleting(true)
  }

  const confirmDelete = async () => {
    setIsLoading(true)
    setError(null)
    try {
      await sessionRequest({
        url: `${Constants.baseUrl}/usuarios/cuenta/foto`,
        method: 'DELETE',
      })

      await updateProfile()
      setPreviewUrl(null)
      setSelectedFile(null)
      onClose()
    } catch (error) {
      print('Error deleting profile photo:', error)
      setError(
        'Error al eliminar la foto de perfil. Por favor, inténtalo de nuevo.'
      )
    } finally {
      setIsLoading(false)
      setIsDeleting(false)
    }
  }

  const resetState = () => {
    setPreviewUrl(user?.urlFoto ? `${Constants.baseUrl}${user.urlFoto}` : null)
    setSelectedFile(null)
    setIsDeleting(false)
    setError(null)
  }

  return (
    <>
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          if (!open) {
            resetState()
          }
          onClose()
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Cambiar foto de perfil</DialogTitle>
            <DialogDescription>
              Arrastra y suelta una imagen aquí o haz clic para seleccionar una.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-md p-4 text-center cursor-pointer ${
                isDragActive ? 'border-primary' : 'border-gray-300'
              }`}
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <p>Suelta la imagen aquí ...</p>
              ) : (
                <p>
                  Arrastra y suelta una imagen aquí, o haz clic para seleccionar
                </p>
              )}
            </div>
            {previewUrl && (
              <div className="flex justify-center">
                <div
                  style={{
                    width: '200px',
                    height: 'auto',
                    position: 'relative',
                  }}
                >
                  <Image
                    src={previewUrl}
                    alt="Vista previa"
                    width={200}
                    height={200}
                    style={{
                      width: '100%',
                      height: 'auto',
                      objectFit: 'contain',
                    }}
                  />
                </div>
              </div>
            )}
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <DialogFooter className="flex-col space-y-2 sm:space-y-0 sm:flex-row sm:justify-end sm:space-x-2">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
            {user?.urlFoto && (
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isLoading}
                className="w-full sm:w-auto"
              >
                Eliminar foto
              </Button>
            )}
            {selectedFile && (
              <Button
                onClick={handleSave}
                disabled={isLoading}
                className="w-full sm:w-auto"
              >
                Guardar
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción actualizará tu foto de perfil. ¿Deseas continuar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSave}>
              Continuar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isDeleting} onOpenChange={setIsDeleting}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar eliminación</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que quieres eliminar tu foto de perfil?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default ProfilePhotoDialog
