import { Link, useNavigate } from 'react-router-dom'
import { Plus, FileText, LayoutTemplate } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

export interface CreateProjectCTAProps {
  className?: string
  variant?: 'button' | 'dropdown'
}

export function CreateProjectCTA({
  className,
  variant = 'dropdown',
}: CreateProjectCTAProps) {
  const navigate = useNavigate()

  const handleFromTemplate = () => {
    navigate('/dashboard/projects/new?from=template')
  }

  const handleBlank = () => {
    navigate('/dashboard/projects/new')
  }

  if (variant === 'button') {
    return (
      <Button
        variant="accent"
        size="default"
        className={cn(
          'shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all',
          className
        )}
        asChild
      >
        <Link to="/dashboard/projects/new">
          <Plus className="size-4" />
          Create project
        </Link>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="accent"
          size="default"
          className={cn(
            'shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all',
            className
          )}
        >
          <Plus className="size-4" />
          Create project
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem
          onClick={handleBlank}
          className="cursor-pointer flex items-center gap-2"
        >
          <FileText className="size-4" />
          From blank
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleFromTemplate}
          className="cursor-pointer flex items-center gap-2"
        >
          <LayoutTemplate className="size-4" />
          From template
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
