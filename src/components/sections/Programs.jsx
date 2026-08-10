import { motion } from 'framer-motion'
import {
  HiOutlineSparkles, HiOutlineBookOpen, HiOutlineTrendingUp,
  HiOutlineCheckCircle,
} from 'react-icons/hi'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { fadeInUp, staggerContainer } from '../../animations/variants'
import { nivelesData } from '../../data'
import { useT, useData } from '../../contexts/LanguageContext'

const iconMap = {
  HiOutlineSparkles: HiOutlineSparkles,
  HiOutlineBookOpen: HiOutlineBookOpen,
  HiOutlineTrendingUp: HiOutlineTrendingUp,
}

function NivelCard({ nivel, index, d }) {
  const Icon = iconMap[nivel.icon] || HiOutlineSparkles

  return (
    <motion.div
      className={`rounded-2xl bg-gradient-to-br ${nivel.gradient} p-8 text-white shadow-xl relative overflow-hidden`}
      variants={fadeInUp}
      custom={index * 0.15}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-tr-full" />

      <div className="relative z-10">
        <div className="w-14 h-14 mb-6 rounded-xl bg-white/20 flex items-center justify-center">
          <Icon className="text-white text-3xl" />
        </div>

        <div className="flex items-center gap-3 mb-2">
          <h3 className="text-2xl font-bold">{d(`nivelesData.${index}.nivel`) || nivel.nivel}</h3>
          <span className="text-sm bg-white/20 px-3 py-1 rounded-full">{d(`nivelesData.${index}.subtitle`) || nivel.subtitle}</span>
        </div>

        <p className="text-white/80 mb-6 leading-relaxed">{d(`nivelesData.${index}.objetivoGeneral`) || nivel.objetivoGeneral}</p>

        <ul className="space-y-3">
          {nivel.objetivos.map((obj, i) => (
            <li key={i} className="flex items-start gap-3">
              <HiOutlineCheckCircle className="w-5 h-5 mt-0.5 shrink-0 text-white/80" />
              <span className="text-white/70 text-sm">{d(`nivelesData.${index}.objetivos.${i}`) || obj}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  )
}

export default function Programs() {
  const t = useT()
  const d = useData()
  const [ref, isVisible] = useScrollReveal(0.1)

  return (
    <section
      id="programs"
      ref={ref}
      className="relative py-24 md:py-32 overflow-hidden bg-gradient-to-br from-green-950 via-emerald-950 to-green-900"
    >
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: `radial-gradient(circle at 20% 50%, rgba(34,197,94,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(236,72,153,0.2) 0%, transparent 50%)`,
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
            {t('programs.title')}
          </motion.h2>
          <motion.p className="text-green-100/60 max-w-2xl mx-auto text-lg" variants={fadeInUp}>
            {t('programs.subtitle')}
          </motion.p>
          <motion.div className="w-20 h-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mx-auto mt-6" variants={fadeInUp} />
        </motion.div>

        <motion.div
          className="grid md:grid-cols-3 gap-8"
          initial="hidden"
          animate={isVisible ? 'visible' : 'hidden'}
          variants={staggerContainer}
        >
          {nivelesData.map((nivel, index) => (
            <NivelCard key={nivel.nivel} nivel={nivel} index={index} d={d} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
