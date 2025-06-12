import Link from 'next/link'
import { cn } from '@/lib/utils'

const Logo = () => (
  <Link href="/" className="flex items-center space-x-2">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      className={cn('h-6 w-6', 'text-primary')}
    >
      <rect width="256" height="256" fill="none"></rect>
      <line
        x1="208"
        y1="128"
        x2="128"
        y2="208"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      ></line>
      <line
        x1="192"
        y1="40"
        x2="40"
        y2="192"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      ></line>
    </svg>
    <span className={cn('inline-block font-bold', 'text-foreground')}>
      Frontend Base
    </span>
  </Link>
)

export default Logo
