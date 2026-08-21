import { motion, AnimatePresence } from 'framer-motion'
import { HiCheckCircle, HiExclamationCircle, HiInformationCircle, HiX } from 'react-icons/hi'

export default function Toast({ message, type = 'success', onClose }) {
  if (!message) return null

  const isSuccess = type === 'success'
  const isError = type === 'error'

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        role="alert"
        aria-live="assertive"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl backdrop-blur-md border border-white/20 text-white min-w-[300px] max-w-md bg-gray-900/90 dark:bg-gray-800/95"
      >
        <div className="flex-shrink-0">
          {isSuccess && <HiCheckCircle className="w-6 h-6 text-green-400" />}
          {isError && <HiExclamationCircle className="w-6 h-6 text-red-400" />}
          {!isSuccess && !isError && <HiInformationCircle className="w-6 h-6 text-blue-400" />}
        </div>

        <div className="flex-1 text-sm font-medium leading-snug">
          {message}
        </div>

        <button
          onClick={onClose}
          aria-label="Cerrar notificación"
          className="flex-shrink-0 p-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
        >
          <HiX className="w-5 h-5" />
        </button>
      </motion.div>
    </AnimatePresence>
  )
}
