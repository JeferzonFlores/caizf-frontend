import { Button } from '@/components/ui/button'
import { ArrowUp, ArrowDown } from 'lucide-react'

export function SortableHeader({ column, title }: { column: any; title: string }) {
  return (
    <Button
      variant="ghost"
      onClick={() => {
        const currentSortingState = column.getIsSorted()
        if (currentSortingState === false) {
          column.toggleSorting(true) // Set to descending
        } else if (currentSortingState === 'desc') {
          column.toggleSorting(false) // Set to ascending
        } else {
          column.clearSorting() // Clear sorting
        }
      }}
    >
      {title}
      <span className="ml-2">
        {column.getIsSorted() === 'desc' ? (
          <ArrowDown className="h-4 w-4" />
        ) : column.getIsSorted() === 'asc' ? (
          <ArrowUp className="h-4 w-4" />
        ) : null}
      </span>
    </Button>
  )
}