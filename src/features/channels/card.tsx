import Badge from '../../components/ui/elements/badge'
import Link from 'next/link'
import clsx from 'clsx'
import { joinTagsAndTrim } from '@/lib/utils'

const ChannelCard = ({
  theme = 'dark',
  variant = 'sm',
  title,
  tags,
}: {
  theme?: 'dark' | 'light' | 'accent'
  variant?: 'sm' | 'lg'
  title: string
  tags: Array<string>
}) => {
  const { trimmedTags } = joinTagsAndTrim(tags, 28)

  return (
    <Link
      className={clsx(
        theme === 'accent' &&
          'bg-gradient-to-tl from-accent-primary to-accent-secondary mt-[1px]',
        theme === 'light' && 'bg-light border-transparent border',
        theme === 'dark' &&
          'bg-gray border-light/10 border hover:border-light/15',
        'block p-[8px] rounded-md transition-colors'
      )}
      href={`/c/${title.toLowerCase()}`}
    >
      <h3
        className={clsx(
          theme === 'accent' && 'text-dark',
          theme === 'light' && 'text-dark',
          theme === 'dark' && 'text-light',
          variant === 'lg' && 'pt-[23.333vw] sm:pt-24',
          variant === 'sm' && 'pt-8 sm:pt-12',
          'text--body-2xl max-w-[218px] w-[218px]'
        )}
      >
        /{title.toLowerCase()}
      </h3>
      <div className={'flex flex-row gap-1 mt-2'}>
        {trimmedTags.map((tag, index) => (
          <Badge
            key={index}
            variant={theme === 'accent' || theme === 'light' ? 'dark' : 'light'}
          >
            {tag}
          </Badge>
        ))}
      </div>
    </Link>
  )
}

export default ChannelCard
