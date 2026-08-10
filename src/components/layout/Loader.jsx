import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiGlobeAlt } from 'react-icons/hi'
import { useT } from '../../contexts/LanguageContext'

const pulseVariants = {
  initial: { scale: 1, opacity: 0.6 },
  animate: {
    scale: [1, 1.2, 1],
    opacity: [0.6, 1, 0.6],
    transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
  },
}

const ringVariants = {
  initial: { scale: 1, opacity: 0.4 },
  animate: {
    scale: [1, 1.5],
    opacity: [0.4, 0],
    transition: { duration: 1.5, repeat: Infinity, ease: 'easeOut' },
  },
}

export default function Loader() {
  const t = useT()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const handleLoad = () => {
      setTimeout(() => setIsLoading(false), 600)
    }

    if (document.readyState === 'complete') {
      handleLoad()
    } else {
      window.addEventListener('load', handleLoad)
      return () => window.removeEventListener('load', handleLoad)
    }
  }, [])

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5, ease: 'easeInOut' } }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-br from-green-900 via-emerald-800 to-green-900"
        >
          <div className="relative flex items-center justify-center">
            <motion.div
              variants={ringVariants}
              initial="initial"
              animate="animate"
              className="absolute w-20 h-20 rounded-full border-2 border-green-400/30"
            />
            <motion.div
              variants={pulseVariants}
              initial="initial"
              animate="animate"
              className="relative flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20"
            >
              <HiGlobeAlt className="w-8 h-8 text-green-300" />
            </motion.div>
          </div>
          <motion.p
            className="text-green-300/60 text-sm mt-6 tracking-widest uppercase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            {t('loader.loading')}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
