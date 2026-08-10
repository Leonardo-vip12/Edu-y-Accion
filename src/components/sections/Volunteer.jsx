import { motion } from 'framer-motion'
import { HiOutlineHeart, HiOutlineGift } from 'react-icons/hi'
import { FaHandshake } from 'react-icons/fa'
import { helpCardsData } from '../../data'
import { sectionReveal, staggerContainer, cardHover } from '../../animations/variants'
import { useT, useData } from '../../contexts/LanguageContext'

const iconMap = {
  HiOutlineHeart: HiOutlineHeart,
  HiOutlineGift: HiOutlineGift,
  HiOutlineHandshake: FaHandshake,
}

const actions = [
  () => {
    const subject = encodeURIComponent('Quiero ser voluntario en Sembrando Huellas Perú')
    const body = encodeURIComponent('Hola, me gustaría conocer más sobre las oportunidades de voluntariado.')
    window.location.href = `mailto:sembrandohuellasperu@gmail.com?subject=${subject}&body=${body}`
  },
  () => {
    const subject = encodeURIComponent('Quiero hacer una donación a Sembrando Huellas Perú')
    const body = encodeURIComponent('Hola, me gustaría conocer los medios disponibles para realizar una donación.')
    window.location.href = `mailto:sembrandohuellasperu@gmail.com?subject=${subject}&body=${body}`
  },
  () => {
    const subject = encodeURIComponent('Propuesta de alianza - Sembrando Huellas Perú')
    const body = encodeURIComponent('Hola, represento a una organización interesada en formar una alianza.')
    window.location.href = `mailto:sembrandohuellasperu@gmail.com?subject=${subject}&body=${body}`
  },
]

export default function Volunteer() {
  const t = useT()
  const d = useData()
  return (
    <section id="help" className="py-20 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          className="text-center mb-14"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={sectionReveal}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            {t('volunteer.title')}
          </h2>
          <div className="w-20 h-1 bg-green-500 mx-auto rounded-full" />
          <p className="text-gray-600 dark:text-gray-400 mt-4 max-w-2xl mx-auto">
            {t('volunteer.subtitle')}
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
        >
          {helpCardsData.map((card, index) => {
            const Icon = iconMap[card.icon] || HiOutlineHeart
            const handleAction = actions[index]

            return (
              <motion.div
                key={index}
                variants={cardHover}
                initial="rest"
                whileHover="hover"
                className={`rounded-2xl bg-gradient-to-br ${card.color} p-8 text-white shadow-xl relative overflow-hidden`}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-tr-full" />

                <div className="relative z-10">
                  <div className="w-16 h-16 mb-6 rounded-xl bg-white/20 flex items-center justify-center">
                    <Icon className="text-white text-3xl" />
                  </div>

                  <h3 className="text-2xl font-bold mb-3">{d(`helpCardsData.${index}.title`) || card.title}</h3>
                  <p className="text-white/80 mb-8 leading-relaxed">
                    {d(`helpCardsData.${index}.description`) || card.description}
                  </p>

                  <button
                    onClick={handleAction}
                    className="w-full py-3 px-6 rounded-xl bg-white text-green-700 font-bold hover:bg-green-50 transition-colors shadow-lg cursor-pointer"
                  >
                    {d(`helpCardsData.${index}.action`) || card.action}
                  </button>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
