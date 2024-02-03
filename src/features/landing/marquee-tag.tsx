import clsx from 'clsx'

const MarqueeTag = ({
  innerText,
  className,
}: {
  innerText: string
  className?: string
}) => {
  return (
    <span
      className={clsx(
        'text--body-lg text-light border border-light rounded-2xl px-2 py-1',
        className
      )}
    >
      /{innerText}
    </span>
  )
}

export default MarqueeTag
