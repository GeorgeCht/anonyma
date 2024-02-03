import clsx from 'clsx'

const MainHeading = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <h1
      className={clsx(
        'text--body-4xl text-light truncate leading-[1.4em] cursor-default',
        className
      )}
    >
      {children}
    </h1>
  )
}

export default MainHeading
