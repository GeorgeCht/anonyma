import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/shadcn/tooltip'
import { HelpCircle } from 'lucide-react'

const Clarification = ({
  text,
  side = 'right',
}: {
  text: string
  side?: 'right' | 'top' | 'bottom' | 'left' | undefined
}) => {
  return (
    <div className={'flex items-center'}>
      <Tooltip delayDuration={250}>
        <TooltipTrigger
          asChild
          aria-label={'clarification'}
          className={'cursor-help'}
        >
          <HelpCircle strokeWidth={1.5} className={'w-3.5 h-3.5'} />
        </TooltipTrigger>
        <TooltipContent
          side={side}
          className={
            'flex flex-col gap-3 py-2 bg-dark/60 backdrop-blur-md border border-light/10 cursor-default'
          }
        >
          <p className={'text--body-tooltip text-light'}>{text}</p>
        </TooltipContent>
      </Tooltip>
    </div>
  )
}

export default Clarification
