import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiMenu, HiX, HiSun, HiMoon, HiGlobeAlt } from 'react-icons/hi'
import { useTheme } from '../../hooks/useTheme'
import { useLanguage, useT, LANGUAGES } from '../../contexts/LanguageContext'
import { NAV_LINKS, SITE_CONFIG } from '../../constants'
import { cn } from '../../utils/cn'

const linkVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.3, ease: 'easeOut' },
  }),
}

const mobileItemVariants = {
  hidden: { x: -40, opacity: 0 },
  visible: (i) => ({
    x: 0,
    opacity: 1,
    transition: { delay: i * 0.08, duration: 0.3, ease: 'easeOut' },
  }),
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
}

const menuVariants = {
  hidden: { x: '100%' },
  visible: {
    x: 0,
    transition: { type: 'spring', stiffness: 300, damping: 30 },
  },
  exit: {
    x: '100%',
    transition: { type: 'spring', stiffness: 300, damping: 30 },
  },
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const langRef = useRef(null)
  const { dark, toggle } = useTheme()
  const { lang, changeLang } = useLanguage()
  const t = useT()

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const handleLinkClick = (href) => {
    setMobileOpen(false)
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg shadow-lg border-b border-white/20 dark:border-gray-700/30'
          : 'bg-transparent'
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <button
            onClick={() => handleLinkClick('#hero')}
            className="flex items-center gap-2 group"
          >
            <span className="text-xl lg:text-2xl font-bold text-green-700 dark:text-green-400 group-hover:text-green-600 dark:group-hover:text-green-300 transition-colors">
              {SITE_CONFIG.shortName}
            </span>
          </button>

          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link, i) => {
              const key = link.href.replace('#', '')
              const translated = t(`nav.${key}`)
              return (
                <motion.button
                  key={link.href}
                  custom={i}
                  variants={linkVariants}
                  initial="hidden"
                  animate="visible"
                  onClick={() => handleLinkClick(link.href)}
                  className={cn(
                    'px-3 xl:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    scrolled
                      ? 'text-gray-700 dark:text-gray-300 hover:text-green-700 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30'
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                  )}
                >
                  {translated !== `nav.${key}` ? translated : link.label}
                </motion.button>
              )
            })}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative" ref={langRef}>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setLangOpen(!langOpen)}
                className={cn(
                  'p-2 rounded-lg transition-colors duration-200 flex items-center gap-1.5 text-sm',
                  scrolled
                    ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                )}
                aria-label="Idioma"
              >
                <HiGlobeAlt className="w-5 h-5" />
                <span className="hidden xl:inline uppercase font-medium">{lang}</span>
              </motion.button>

              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className={cn(
                      'absolute right-0 mt-2 w-48 rounded-xl shadow-xl border py-1 z-50',
                      scrolled
                        ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                        : 'bg-white/90 backdrop-blur-lg dark:bg-gray-800/90 border-white/20'
                    )}
                  >
                    {LANGUAGES.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => { changeLang(l.code); setLangOpen(false) }}
                        className={cn(
                          'w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center gap-3',
                          lang === l.code
                            ? 'text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 font-semibold'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        )}
                      >
                        <span className="w-6 text-center text-xs font-mono opacity-50">{l.code.toUpperCase()}</span>
                        <span>{l.native}</span>
                        {lang === l.code && <span className="ml-auto text-green-500 text-xs">✓</span>}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggle}
              className={cn(
                'p-2 rounded-lg transition-colors duration-200',
                scrolled
                  ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              )}
              aria-label={dark ? 'Activar modo claro' : 'Activar modo oscuro'}
            >
              {dark ? <HiSun className="w-5 h-5" /> : <HiMoon className="w-5 h-5" />}
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileOpen(true)}
              className={cn(
                'lg:hidden p-2 rounded-lg transition-colors duration-200',
                scrolled
                  ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              )}
              aria-label="Abrir menú"
            >
              <HiMenu className="w-6 h-6" />
            </motion.button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-50 lg:hidden"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />

            <motion.div
              className="absolute top-0 right-0 bottom-0 w-72 max-w-[85vw] bg-white dark:bg-gray-900 shadow-2xl"
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <span className="text-lg font-bold text-green-700 dark:text-green-400">
                  {SITE_CONFIG.shortName}
                </span>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label="Cerrar menú"
                >
                  <HiX className="w-6 h-6" />
                </motion.button>
              </div>

              <div className="p-4 space-y-1">
                {NAV_LINKS.map((link, i) => {
                  const key = link.href.replace('#', '')
                  const translated = t(`nav.${key}`)
                  return (
                    <motion.button
                      key={link.href}
                      custom={i}
                      variants={mobileItemVariants}
                      initial="hidden"
                      animate="visible"
                      onClick={() => handleLinkClick(link.href)}
                      className="w-full text-left px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:text-green-700 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 font-medium transition-all duration-200"
                    >
                      {translated !== `nav.${key}` ? translated : link.label}
                    </motion.button>
                  )
                })}
              </div>

              <div className="p-4 space-y-3">
                <div className="flex flex-wrap gap-1.5">
                  {LANGUAGES.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => { changeLang(l.code); setMobileOpen(false) }}
                      className={cn(
                        'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                        lang === l.code
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                      )}
                    >
                      {l.native}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {dark ? 'Modo oscuro' : 'Modo claro'}
                  </span>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={toggle}
                    className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    {dark ? <HiSun className="w-5 h-5" /> : <HiMoon className="w-5 h-5" />}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
