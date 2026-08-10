import { motion } from 'framer-motion'
import {
  HiClock, HiOutlineClipboardList, HiOutlineBookOpen,
  HiOutlineGlobeAlt, HiOutlineLightningBolt, HiOutlineRss,
} from 'react-icons/hi'
import { circuitoData } from '../../data'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { sectionReveal } from '../../animations/variants'
import { useT, useData } from '../../contexts/LanguageContext'

const iconMap = [
  HiOutlineClipboardList,
  HiOutlineBookOpen,
  HiOutlineGlobeAlt,
  HiOutlineLightningBolt,
  HiOutlineRss,
]

export default function Timeline() {
  const t = useT()
  const d = useData()
  return (
    <section id="timeline" className="py-20 bg-white dark:bg-gray-950">
      <div className="max-w-5xl mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={sectionReveal}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            {t('timeline.title')}
          </h2>
          <p className="text-gray-500 dark:text-gray-400">{d('circuitoData.sede') || circuitoData.sede}</p>
          <p className="text-gray-500 dark:text-gray-400">{d('circuitoData.horario') || circuitoData.horario}</p>
          <div className="w-20 h-1 bg-green-500 mx-auto rounded-full mt-6" />
        </motion.div>

        <div className="relative">
          <div className="absolute left-[18px] md:left-1/2 md:-translate-x-2.5 top-0 bottom-0 w-1 bg-green-200 dark:bg-green-900 rounded-full" />

          <div className="relative flex flex-col gap-12">
            {circuitoData.fases.map((fase, index) => (
              <FaseItem key={fase.titulo} fase={fase} index={index} d={d} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function FaseItem({ fase, index, d }) {
  const [ref, isVisible] = useScrollReveal()
  const isLeft = index % 2 === 0
  const Icon = iconMap[index] || HiClock

  return (
    <div
      ref={ref}
      className={`relative flex items-start gap-6 md:gap-0 ${
        isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
      }`}
    >
      <motion.div
        className={`flex-1 ${
          isLeft ? 'md:text-right md:pr-12' : 'md:text-left md:pl-12'
        }`}
        initial={{ opacity: 0, x: isLeft ? -60 : 60 }}
        animate={isVisible ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div
          className={`inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 px-4 py-1.5 rounded-full text-sm font-bold mb-3 ${
            isLeft ? 'md:ml-auto' : ''
          }`}
        >
          <Icon className="text-base" />
          <span>{fase.tiempo}</span>
        </div>
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">{d(`circuitoData.fases.${index}.titulo`) || fase.titulo}</h3>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{d(`circuitoData.fases.${index}.descripcion`) || fase.descripcion}</p>
      </motion.div>

      <div className="hidden md:flex flex-col items-center flex-shrink-0 relative">
        <div className="w-5 h-5 rounded-full bg-green-500 border-4 border-green-100 dark:border-gray-950 z-10 flex-shrink-0" />
      </div>

      <div className="flex-1 hidden md:block" />
    </div>
  )
}
