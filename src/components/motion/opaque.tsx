'use client'

import { HTMLAttributes, FC } from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'

interface OpaqueProps extends HTMLAttributes<HTMLDivElement> {
  absolute?: boolean
  fullWidth?: boolean
}

const Opaque: FC<OpaqueProps> = ({
  children,
  absolute = true,
  fullWidth = true,
}) => {
  const layoutVariants = {
    initial: { opacity: 0 },
    intro: { opacity: 1 },
    outro: { opacity: 0 },
  }
  return (
    <motion.div
      initial={'initial'}
      animate={'intro'}
      exit={'outro'}
      variants={layoutVariants}
      transition={{
        type: 'spring',
        stiffness: 150,
        damping: 20,
        staggerChildren: -0.5,
      }}
      className={clsx(absolute && 'absolute', fullWidth && 'w-full')}
    >
      {children}
    </motion.div>
  )
}

export default Opaque
