import { useEffect, useRef } from 'react'

const BlurFX = () => {
  const blurRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    setTimeout(() => {
      blurRef.current?.classList.add('bg-dark/10')
      blurRef.current?.classList.add('backdrop-blur-xl')
      blurRef.current?.classList.remove('scale-125')
    }, 425)
    blurRef.current?.classList.add('opacity-100')
    return () => {
      blurRef.current?.classList.remove('bg-dark/10')
      blurRef.current?.classList.remove('opacity-100')
    }
  }, [])
  return (
    <div className={'absolute top-0 left-0 w-screen h-full overflow-hidden'}>
      <div
        ref={blurRef}
        className={
          'rect--mask opacity-0 w-full h-full absolute top-0 left-0 z-[1] scale-125 backdrop-blur-0'
        }
      ></div>
    </div>
  )
}

export default BlurFX
