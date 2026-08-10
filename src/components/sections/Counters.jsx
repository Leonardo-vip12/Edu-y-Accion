import { motion } from 'framer-motion'
import {
  HiOutlineAcademicCap, HiOutlineTrendingUp, HiOutlineUserGroup, HiOutlineFlag,
} from 'react-icons/hi'
import { resultadosData } from '../../data'
import { sectionReveal, staggerContainer, fadeInUp } from '../../animations/variants'
import { cn } from '../../utils/cn'
import { useT, useData } from '../../contexts/LanguageContext'

const iconMap = {
  HiOutlineAcademicCap: HiOutlineAcademicCap,
  HiOutlineTrendingUp: HiOutlineTrendingUp,
  HiOutlineUserGroup: HiOutlineUserGroup,
  HiOutlineFlag: HiOutlineFlag,
}

export default function Counters() {
  const t = useT()
  const d = useData()
  return (
    <section id="counters" className="py-20 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          className="text-center mb-14"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={sectionReveal}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            {t('counters.title')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t('counters.subtitle')}
          </p>
          <div className="w-20 h-1 bg-green-500 mx-auto rounded-full mt-6" />
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
        >
          {resultadosData.map((result, index) => {
            const Icon = iconMap[result.icon] || HiOutlineFlag

            return (
              <motion.div
                key={result.area}
                className="rounded-2xl p-8 border border-gray-200 dark:border-gray-700 dark:bg-gray-900 shadow-sm hover:shadow-xl transition-shadow"
                variants={fadeInUp}
                custom={index * 0.1}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className={cn(
                    'w-14 h-14 rounded-xl bg-gradient-to-br flex items-center justify-center',
                    result.color
                  )}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">{d(`resultadosData.${index}.area`) || result.area}</h3>
                </div>

                <ul className="space-y-3">
                  {result.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-2 h-2 mt-2 rounded-full bg-green-500 shrink-0" />
                      <span className="text-gray-600 dark:text-gray-400 text-sm">{d(`resultadosData.${index}.items.${i}`) || item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
