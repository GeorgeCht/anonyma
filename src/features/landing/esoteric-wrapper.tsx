const EsotericWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className={
        'flex flex-col m-auto items-start justify-center max-w-[468px] min-h-inner -mt-[3px] z-[10]'
      }
    >
      <div
        className={
          'flex flex-col m-auto py-3 items-start text-center justify-between w-[20vw] max-w-[468px] min-w-[298px] h-[80vw] max-h-[33vw] min-h-[490px]'
        }
      >
        {children}
      </div>
    </div>
  )
}

export default EsotericWrapper
