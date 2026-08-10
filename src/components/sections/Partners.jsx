import { motion } from 'framer-motion'
import { HiCheckCircle } from 'react-icons/hi'
import { responsabilidadesData } from '../../data'
import { sectionReveal, staggerContainer, fadeInUp } from '../../animations/variants'
import { useT, useData } from '../../contexts/LanguageContext'

export default function Partners() {
  const t = useT()
  const d = useData()
  return (
    <section id="partners" className="py-20 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          className="text-center mb-14"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={sectionReveal}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            {t('partners.title')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t('partners.subtitle')}
          </p>
          <div className="w-20 h-1 bg-green-500 mx-auto rounded-full mt-6" />
        </motion.div>

        <motion.div
          className="grid md:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
        >
          {responsabilidadesData.map((item, index) => (
            <motion.div
              key={item.role}
              className={`rounded-2xl bg-gradient-to-br ${item.gradient} p-8 text-white shadow-xl relative overflow-hidden`}
              variants={fadeInUp}
              custom={index * 0.1}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-tr-full" />

              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-6">{d(`responsabilidadesData.${index}.role`) || item.role}</h3>
                <ul className="space-y-3">
                  {item.items.map((task, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <HiCheckCircle className="w-5 h-5 mt-0.5 shrink-0 text-white/80" />
                      <span className="text-white/80 text-sm">{d(`responsabilidadesData.${index}.items.${i}`) || task}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
