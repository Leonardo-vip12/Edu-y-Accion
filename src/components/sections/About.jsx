import { motion } from 'framer-motion'
import { HiOfficeBuilding, HiAcademicCap, HiUserGroup } from 'react-icons/hi'
import { FaHandshake } from 'react-icons/fa'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { fadeInUp, staggerContainer } from '../../animations/variants'
import { projectData } from '../../data'
import { useT, useData } from '../../contexts/LanguageContext'

export default function About() {
  const t = useT()
  const d = useData()
  const [ref, isVisible] = useScrollReveal(0.1)

  const infoCards = [
    { icon: HiOfficeBuilding, label: 'Entidad Responsable', value: d('projectData.entity') || projectData.entity },
    { icon: HiAcademicCap, label: 'Entidad Supervisora', value: d('projectData.supervisor') || projectData.supervisor },
    { icon: FaHandshake, label: 'Aliado Estratégico', value: d('projectData.ally') || projectData.ally },
    { icon: HiUserGroup, label: 'Beneficiarios', value: d('projectData.beneficiaries') || projectData.beneficiaries },
  ]

  return (
    <section
      id="about"
      ref={ref}
      className="relative py-24 md:py-32 overflow-hidden bg-green-deep"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(34,197,94,0.08)_0%,_transparent_50%),radial-gradient(ellipse_at_bottom_left,_rgba(22,163,74,0.05)_0%,_transparent_50%)]" />

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
            {t('about.title')}
          </motion.h2>
          <motion.p className="text-green-100/60 max-w-2xl mx-auto text-lg" variants={fadeInUp}>
            {d('projectData.subtitle') || projectData.subtitle}
          </motion.p>
          <motion.div className="w-20 h-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mx-auto mt-6" variants={fadeInUp} />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {infoCards.map((card, i) => (
            <motion.div
              key={card.label}
              className="flex items-start gap-4 p-6 rounded-2xl backdrop-blur-md bg-white/5 border border-white/10"
              variants={fadeInUp}
              custom={i * 0.1}
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400/20 to-emerald-600/20 flex items-center justify-center shrink-0">
                <card.icon className="w-6 h-6 text-green-300" />
              </div>
              <div>
                <p className="text-green-100/50 text-sm">{card.label}</p>
                <p className="text-white font-medium">{card.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          className="text-green-100/70 leading-relaxed text-base md:text-lg max-w-4xl mx-auto text-center"
          variants={fadeInUp}
        >
          {d('projectData.description') || projectData.description}
        </motion.p>
      </div>
    </section>
  )
}
