import { motion } from 'framer-motion'
import { fadeInUp, staggerContainer } from '../../animations/variants'
import educacionYAccion from '../../assets/images/hero/educacion-y-accion.jpg'
import { useT } from '../../contexts/LanguageContext'

const leafPositions = [
  { top: '15%', left: '10%', size: 20, delay: 0, duration: 4 },
  { top: '25%', right: '15%', size: 16, delay: 1.2, duration: 5 },
  { top: '60%', left: '8%', size: 24, delay: 0.6, duration: 4.5 },
  { top: '70%', right: '10%', size: 18, delay: 1.8, duration: 3.8 },
  { top: '40%', left: '85%', size: 14, delay: 0.3, duration: 5.2 },
  { top: '80%', left: '50%', size: 22, delay: 2.0, duration: 4.2 },
]

function Leaf({ style }) {
  return (
    <div
      className="absolute opacity-20"
      style={style}
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="text-green-300">
        <path d="M21.8 2.2c-1.5 1.5-4.3 3.8-7.5 5.1-1.9.8-3.8 1.2-5.3 1.2-1.3 0-2.2-.3-2.2-.3s.3 1 .3 2.3c0 1.5-.4 3.4-1.2 5.3C4.6 18 2.3 20.8.8 22.3c-.4.4-.4 1 0 1.4.2.2.4.3.7.3s.5-.1.7-.3c1.5-1.5 4.3-3.8 7.5-5.1 1.9-.8 3.8-1.2 5.3-1.2 1.3 0 2.2.3 2.2.3s-.3-1-.3-2.3c0-1.5.4-3.4 1.2-5.3 1.3-3.2 3.6-6 5.1-7.5.4-.4.4-1 0-1.4-.4-.4-1-.4-1.4 0z" />
      </svg>
    </div>
  )
}

export default function Hero() {
  const t = useT()

  function ScrollIndicator() {
    return (
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.8 }}
      >
        <span className="text-white/70 text-sm font-light tracking-widest uppercase">
          {t('hero.scroll')}
        </span>
        <motion.div
          className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center pt-2"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            className="w-1.5 h-1.5 bg-white rounded-full"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </motion.div>
    )
  }

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-green-950 via-green-900 to-emerald-800"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(34,197,94,0.15)_0%,_transparent_60%),radial-gradient(ellipse_at_bottom_right,_rgba(22,163,74,0.1)_0%,_transparent_50%)]" />

      <div className="absolute inset-0">
        <img
          src={educacionYAccion}
          alt="Educación y Acción"
          className="w-full h-full object-cover opacity-30"
        />
      </div>

      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      {leafPositions.map((leaf, i) => (
        <Leaf
          key={i}
          style={{
            top: leaf.top,
            left: leaf.left,
            right: leaf.right,
            width: leaf.size,
            height: leaf.size,
            animationDelay: `${leaf.delay}s`,
            animationDuration: `${leaf.duration}s`,
            animationName: 'floatLeaf',
            animationTimingFunction: 'ease-in-out',
            animationIterationCount: 'infinite',
          }}
        />
      ))}

      <motion.div
        className="relative z-10 max-w-4xl mx-auto px-4 text-center"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="inline-block mb-6 px-4 py-1.5 rounded-full border border-green-400/30 bg-green-400/10 backdrop-blur-sm"
          variants={fadeInUp}
          custom={0}
        >
          <span className="text-green-300 text-sm font-medium tracking-wider" aria-label={t('hero.badge')}>
            <svg className="w-4 h-4 inline-block mr-1.5 -mt-0.5 text-green-400" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 008 20c4 0 6-2 9-7 0 0-3 1-5 1s-4-1-4-1c2-3 5-5 9-5z"/>
            </svg>
            {t('hero.badge')}
          </span>
        </motion.div>

        <motion.h1
          className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-4"
          variants={fadeInUp}
          custom={0.2}
        >
          <span className="block">{t('hero.title')}</span>
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-emerald-400 to-green-200">
            Sembrando Huellas Perú
          </span>
        </motion.h1>
        <motion.p
          className="text-xl md:text-2xl lg:text-3xl text-green-200/70 tracking-wide mb-8"
          variants={fadeInUp}
          custom={0.3}
        >
          {t('hero.subtitle')}
        </motion.p>

        <motion.p
          className="text-lg md:text-xl text-green-100/80 max-w-3xl mx-auto mb-10 leading-relaxed uppercase tracking-wider"
          variants={fadeInUp}
          custom={0.4}
        >
          {t('hero.tagline')}
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          variants={fadeInUp}
          custom={0.6}
        >
          <a
            href="#gallery"
            className="group relative inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold text-lg shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transition-all duration-300 hover:scale-105"
          >
            <span>{t('hero.cta_galeria')}</span>
            <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
          <a
            href="#services"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border-2 border-white/40 text-white font-semibold text-lg hover:bg-white/10 hover:border-white/60 transition-all duration-300"
          >
            {t('hero.cta_trabajo')}
          </a>
        </motion.div>
      </motion.div>

      <ScrollIndicator />

      <style>{`
        @keyframes floatLeaf {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.2; }
          25% { transform: translateY(-20px) rotate(5deg); opacity: 0.35; }
          50% { transform: translateY(-10px) rotate(-3deg); opacity: 0.25; }
          75% { transform: translateY(-25px) rotate(4deg); opacity: 0.3; }
        }
      `}</style>
    </section>
  )
}
