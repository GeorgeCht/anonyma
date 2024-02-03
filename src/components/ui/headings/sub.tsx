import clsx from 'clsx'

const SubHeading = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <h2
      className={clsx(
        'text--body-xl text-light mt-2 mb-3 cursor-default',
        className
      )}
    >
      {children}
    </h2>
  )
}

export default SubHeading
