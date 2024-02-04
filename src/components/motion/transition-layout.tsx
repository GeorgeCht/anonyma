'use client'

import { HTMLAttributes, FC } from 'react'
import { motion } from 'framer-motion'

const TransitionLayout: FC<HTMLAttributes<HTMLDivElement>> = ({ children }) => {
  const layoutVariants = {
    initial: { opacity: 0, x: 0 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  }
  return (
    <motion.div
      initial={'exit'}
      animate={'animate'}
      exit={'exit'}
      variants={layoutVariants}
      transition={{
        type: 'spring',
        stiffness: 250,
        damping: 20,
      }}
    >
      {children}
    </motion.div>
  )
}

export default TransitionLayout
