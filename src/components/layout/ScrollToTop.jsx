import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiArrowUp } from 'react-icons/hi'
import { cn } from '../../utils/cn'

const buttonVariants = {
  hidden: { opacity: 0, scale: 0.5, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 20 },
  },
  exit: {
    opacity: 0,
    scale: 0.5,
    y: 20,
    transition: { duration: 0.2 },
  },
}

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 300)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          variants={buttonVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={scrollToTop}
          className={cn(
            'fixed bottom-6 right-6 z-40 p-3 rounded-full',
            'bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-900/30',
            'hover:shadow-xl hover:shadow-green-900/40 hover:-translate-y-1',
            'transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900'
          )}
          aria-label="Volver arriba"
        >
          <HiArrowUp className="w-5 h-5" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
