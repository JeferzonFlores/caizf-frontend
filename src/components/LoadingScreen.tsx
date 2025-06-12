import { Loader } from 'lucide-react'

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background z-50">
      <div className="animate-fade-in">
        <Loader className="h-10 w-10 animate-spin" />
      </div>
    </div>
  )
}
