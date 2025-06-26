import Link from 'next/link'
import Image from 'next/image';
import { cn } from '@/lib/utils'

const Logo = () => (
  <Link href="/" className="flex items-center space-x-2">
             <img src="/Logo/LogoCAIZF.png" alt="Logo de tu empresa" className="h-8 w-auto" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50px' }} />

    <span className={cn('inline-block font-bold', 'text-foreground')}>
      
    </span>
  </Link>
)

export default Logo
