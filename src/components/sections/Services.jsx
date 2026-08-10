import { motion } from 'framer-motion'
import {
  HiOutlineGlobeAlt, HiOutlineAcademicCap, HiOutlineHome, HiOutlineUserGroup,
} from 'react-icons/hi'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { fadeInUp, staggerContainer, cardHover } from '../../animations/variants'
import { enfoqueData } from '../../data'
import { cn } from '../../utils/cn'
import { useT, useData } from '../../contexts/LanguageContext'

const iconMap = {
  HiOutlineGlobeAlt: HiOutlineGlobeAlt,
  HiOutlineAcademicCap: HiOutlineAcademicCap,
  HiOutlineHome: HiOutlineHome,
  HiOutlineUserGroup: HiOutlineUserGroup,
}

function EnfoqueCard({ item, index, d }) {
  const Icon = iconMap[item.icon]

  return (
    <motion.div
      className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-8 cursor-default"
      variants={cardHover}
      initial="rest"
      whileHover="hover"
    >
      <div
        className={cn(
          'absolute top-0 left-0 right-0 h-1 bg-gradient-to-r opacity-60 group-hover:opacity-100 transition-opacity duration-300',
          item.color
        )}
      />

      <div className="relative z-10">
        <div className={cn(
          'w-14 h-14 rounded-xl bg-gradient-to-br flex items-center justify-center mb-6',
          item.color.replace('from-', 'from-/20 ').replace('to-', 'to-/20')
        )}>
          <Icon className="w-7 h-7 text-white" />
        </div>

        <h3 className="text-xl font-bold text-white mb-3">{d(`enfoqueData.${index}.title`) || item.title}</h3>
        <p className="text-green-100/60 leading-relaxed text-sm">{d(`enfoqueData.${index}.description`) || item.description}</p>
      </div>

      <div
        className={cn(
          'absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-gradient-to-r opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500',
          item.color
        )}
      />
    </motion.div>
  )
}

export default function Services() {
  const t = useT()
  const d = useData()
  const [ref, isVisible] = useScrollReveal(0.1)

  return (
    <section
      id="services"
      ref={ref}
      className="relative py-24 md:py-32 overflow-hidden bg-gradient-to-b from-green-deep to-green-950"
    >
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0v40M0 20h40' stroke='%23ffffff' stroke-width='0.5' fill='none'/%3E%3C/svg%3E")`,
      }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          animate={isVisible ? 'visible' : 'hidden'}
          variants={staggerContainer}
        >
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            variants={fadeInUp}
          >
            {t('services.title')}
          </motion.h2>
          <motion.p className="text-green-100/60 max-w-2xl mx-auto text-lg" variants={fadeInUp}>
            {t('services.subtitle')}
          </motion.p>
          <motion.div className="w-20 h-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mx-auto mt-6" variants={fadeInUp} />
        </motion.div>

        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
          variants={staggerContainer}
          initial="hidden"
          animate={isVisible ? 'visible' : 'hidden'}
        >
          {enfoqueData.map((item, index) => (
            <motion.div key={item.title} variants={fadeInUp} custom={index * 0.1}>
              <EnfoqueCard item={item} index={index} d={d} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
