const LandingSectionWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <section
      className={
        'flex flex-col items-start justify-between overflow-hidden transition-opacity duration-700'
      }
    >
      {children}
    </section>
  )
}

export default LandingSectionWrapper
