import { useEffect, useState } from 'react'

const PleaseWait = () => {
  const [dots, setDots] = useState<string>('.')
  useEffect(() => {
    const intervalId = setInterval(() => {
      setDots((prevDots) => (prevDots.length === 3 ? '.' : prevDots + '.'))
    }, 1000)
    return () => clearInterval(intervalId)
  }, [])

  return (
    <span className={'text--mono-caps-sm mt-4 text-light/50'}>
      Please wait{dots}
    </span>
  )
}

export default PleaseWait
