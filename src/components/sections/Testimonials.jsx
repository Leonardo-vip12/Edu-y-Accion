import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiUser, HiChevronLeft, HiChevronRight, HiStar } from 'react-icons/hi'
import { testimonialsData } from '../../data'
import { sectionReveal } from '../../animations/variants'
import { useT, useData } from '../../contexts/LanguageContext'

const quoteGradients = [
  'from-green-500 to-emerald-600',
  'from-blue-500 to-cyan-600',
  'from-amber-500 to-orange-600',
  'from-purple-500 to-pink-600',
  'from-red-500 to-rose-600',
]

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
  }),
}

export default function Testimonials() {
  const t = useT()
  const d = useData()
  const [[currentIndex, direction], setCurrent] = useState([0, 0])

  const goTo = useCallback(
    (index, dir = 0) => {
      const total = testimonialsData.length
      const next = ((index % total) + total) % total
      setCurrent([next, dir])
    },
    []
  )

  const next = useCallback(() => {
    setCurrent(([curr]) => [(curr + 1) % testimonialsData.length, 1])
  }, [])

  const prev = useCallback(() => {
    setCurrent(([curr]) => [(curr - 1 + testimonialsData.length) % testimonialsData.length, -1])
  }, [])

  useEffect(() => {
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [next])

  const testimonial = testimonialsData[currentIndex]
  const gradient = quoteGradients[currentIndex % quoteGradients.length]

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          className="text-center mb-14"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={sectionReveal}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            {t('testimonials.title')}
          </h2>
          <div className="w-20 h-1 bg-green-500 mx-auto rounded-full" />
        </motion.div>

        <div className="relative">
          <button
            onClick={prev}
            aria-label="Testimonio anterior"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors"
          >
            <HiChevronLeft className="text-xl" />
          </button>

          <button
            onClick={next}
            aria-label="Testimonio siguiente"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors"
          >
            <HiChevronRight className="text-xl" />
          </button>

          <div className="overflow-hidden px-4">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 md:p-10 text-center"
              >
                <div
                  className={`w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center`}
                >
                  {testimonial.image ? (
                    <img
                      src={testimonial.image}
                      alt={d(`testimonialsData.${currentIndex}.name`) || testimonial.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <HiUser className="text-white text-3xl" />
                  )}
                </div>

                <svg
                  className="w-8 h-8 mx-auto mb-4 text-green-300"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.433.917-3.995 3.638-3.995 5.849h4v10H0z" />
                </svg>

                <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-6 italic">
                  {d(`testimonialsData.${currentIndex}.text`) || testimonial.text}
                </p>

                <div className="flex justify-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <HiStar key={i} className="text-yellow-400 text-lg" />
                  ))}
                </div>

                <h4 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                  {d(`testimonialsData.${currentIndex}.name`) || testimonial.name}
                </h4>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{d(`testimonialsData.${currentIndex}.role`) || testimonial.role}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex justify-center gap-2 mt-6">
            {testimonialsData.map((_, index) => (
              <button
                key={index}
                onClick={() => goTo(index, index > currentIndex ? 1 : -1)}
                aria-label={`Ir al testimonio ${index + 1}`}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-green-500 scale-125'
                    : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
