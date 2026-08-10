import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiX, HiChevronLeft, HiChevronRight, HiPlay, HiPhotograph, HiFilm } from 'react-icons/hi'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, A11y } from 'swiper/modules'
import 'swiper/css'
import { galleryImages } from '../../data'
import { useT } from '../../contexts/LanguageContext'



function LeafDecoration() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <motion.svg className="absolute -top-10 -left-10 w-40 h-40 text-green-200/20" viewBox="0 0 100 100" fill="currentColor"
        animate={{ rotate: [0, 5, 0, -5, 0] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}>
        <path d="M50 0C50 0 70 15 75 35C80 55 70 75 50 85C30 75 20 55 25 35C30 15 50 0 50 0Z" />
      </motion.svg>
      <motion.svg className="absolute top-20 right-10 w-24 h-24 text-green-300/15" viewBox="0 0 100 100" fill="currentColor"
        style={{ rotate: 45 }} animate={{ y: [0, -8, 0], rotate: [45, 50, 45] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}>
        <path d="M50 0C50 0 70 15 75 35C80 55 70 75 50 85C30 75 20 55 25 35C30 15 50 0 50 0Z" />
      </motion.svg>
      <motion.svg className="absolute bottom-32 left-1/4 w-32 h-32 text-emerald-200/10" viewBox="0 0 100 100" fill="currentColor"
        style={{ rotate: -12 }} animate={{ rotate: [-12, -5, -12], x: [0, 4, 0] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 2 }}>
        <path d="M50 0C50 0 70 15 75 35C80 55 70 75 50 85C30 75 20 55 25 35C30 15 50 0 50 0Z" />
      </motion.svg>
      <motion.svg className="absolute -bottom-5 right-1/3 w-28 h-28 text-green-200/15" viewBox="0 0 100 100" fill="currentColor"
        style={{ rotate: 60 }} animate={{ rotate: [60, 68, 60], scale: [1, 1.05, 1] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}>
        <path d="M50 0C50 0 70 15 75 35C80 55 70 75 50 85C30 75 20 55 25 35C30 15 50 0 50 0Z" />
      </motion.svg>
    </div>
  )
}

function VideoThumbnail({ videoSrc, poster }) {
  const [thumbnail, setThumbnail] = useState(poster || null)
  const [capturing, setCapturing] = useState(!poster)
  const ref = useRef(null)

  useEffect(() => {
    if (poster) { setThumbnail(poster); setCapturing(false); return }
    if (!videoSrc) return

    let video = null
    let cancelled = false
    let observer = null

    const capture = () => {
      video = document.createElement('video')
      video.preload = 'metadata'; video.muted = true; video.crossOrigin = 'anonymous'; video.playsInline = true
      video.onloadeddata = () => { if (!cancelled) video.currentTime = Math.min(0.5, (video.duration || 1) / 2) }
      video.onseeked = () => {
        if (cancelled) return
        try {
          const canvas = document.createElement('canvas')
          canvas.width = 640; canvas.height = 480
          canvas.getContext('2d').drawImage(video, 0, 0, 640, 480)
          setThumbnail(canvas.toDataURL('image/jpeg', 0.8))
          setCapturing(false)
        } catch {}
        video.remove()
      }
      video.onerror = () => { if (!cancelled) setCapturing(false); video.remove() }
      video.src = videoSrc; video.load()
    }

    if ('IntersectionObserver' in window && ref.current) {
      observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect()
          capture()
        }
      }, { rootMargin: '300px' })
      observer.observe(ref.current)
    } else {
      capture()
    }

    return () => {
      cancelled = true
      if (observer) observer.disconnect()
      if (video) video.remove()
    }
  }, [videoSrc, poster])

  return (
    <div ref={ref} className="absolute inset-0">
      {capturing ? (
        <div className="absolute inset-0 bg-gray-800 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-white/30 border-t-white/80 rounded-full animate-spin" />
        </div>
      ) : thumbnail ? (
        <img src={thumbnail} alt="" className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
          <HiPlay className="text-white/20 text-6xl" />
        </div>
      )}
    </div>
  )
}

function MediaCard({ item, layout: cardLayout, onClick }) {
  const t = useT()
  const isVideo = item.video || item.youtubeId
  const categoryLabel = item.category === 'Lanzamiento de proyecto' ? t('gallery.lanzamiento')
    : item.category === 'Impactos en medios de comunicación digitales' ? t('gallery.digitales') : t('gallery.televisivos')
  const aspect = cardLayout?.aspect || 'aspect-[4/3]'

  return (
    <motion.div layout className="group relative rounded-[20px] overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-lg hover:shadow-2xl transition-shadow duration-500 cursor-pointer h-full" onClick={onClick}
      whileHover={{ y: -4, scale: 1.01 }} transition={{ duration: 0.35, ease: 'easeOut' }}>
      <div className={`relative ${aspect} overflow-hidden`}>
        {isVideo ? (
          <>
            <VideoThumbnail videoSrc={item.video} poster={item.poster} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-lg border border-white/40 flex items-center justify-center shadow-xl"
                whileHover={{ scale: 1.15 }} transition={{ duration: 0.25 }}>
                <div className="w-0 h-0 border-l-[16px] border-l-white border-y-[10px] border-y-transparent ml-1" />
              </motion.div>
            </div>
          </>
        ) : (
          <>
            <img src={item.src} alt={item.alt} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" loading="lazy" />
          </>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

        <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 text-white text-[11px] font-medium leading-none">
          {categoryLabel}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 z-10 translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <h4 className="text-white text-sm font-bold drop-shadow-lg leading-tight line-clamp-1">{item.title || item.alt}</h4>
          {item.date && <p className="text-white/70 text-xs mt-0.5 font-medium drop-shadow">{item.date}</p>}
          {item.desc && <p className="text-white/50 text-xs mt-1 line-clamp-2 drop-shadow">{item.desc}</p>}
        </div>
      </div>
    </motion.div>
  )
}

function getGridLayout(index) {
  if (index === 0) return { cols: 'md:col-span-2 md:row-span-2', aspect: 'aspect-[4/3] md:aspect-[16/9]', priority: true }
  if (index % 7 === 0) return { cols: 'md:col-span-2', aspect: 'aspect-[16/9]' }
  if (index % 5 === 0) return { cols: 'md:col-span-1', aspect: 'aspect-[1/1]' }
  if (index % 3 === 0) return { cols: 'md:col-span-1', aspect: 'aspect-[3/2]' }
  return { cols: 'md:col-span-1', aspect: 'aspect-[4/3]' }
}

function HeroSection({ item, onOpen }) {
  if (!item) return null
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7 }}
      className="relative w-full rounded-[24px] overflow-hidden cursor-pointer mb-16 shadow-xl group"
      onClick={onOpen}
    >
      <div className="aspect-[21/9] md:aspect-[3/1] relative overflow-hidden">
        <img src={item.src} alt={item.alt} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <span className="text-green-300 text-xs font-semibold uppercase tracking-widest">{item.category}</span>
          <h3 className="text-white text-2xl md:text-4xl font-bold mt-2 max-w-2xl leading-tight">{item.title || item.alt}</h3>
          {item.desc && <p className="text-white/60 text-sm md:text-base mt-3 max-w-xl line-clamp-2">{item.desc}</p>}
          {item.date && <p className="text-white/40 text-xs mt-2">{item.date}</p>}
        </div>
        <div className="absolute top-5 right-5 w-12 h-12 rounded-full bg-white/20 backdrop-blur-lg border border-white/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg">
          <HiPhotograph className="text-white text-xl" />
        </div>
      </div>
    </motion.div>
  )
}

function Modal({ items, index, onClose, onIndexChange }) {
  const current = items[index]
  const [videoError, setVideoError] = useState(false)
  const [zoomed, setZoomed] = useState(false)
  const isVideo = current?.video
  const isYoutube = current?.youtubeId

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft' && index > 0) onIndexChange(index - 1)
      if (e.key === 'ArrowRight' && index < items.length - 1) onIndexChange(index + 1)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose, index, items.length, onIndexChange])

  useEffect(() => { setZoomed(false); setVideoError(false) }, [index])

  if (!current) return null

  const youtubeUrl = isYoutube ? `https://www.youtube.com/embed/${current.youtubeId}?autoplay=1&rel=0&modestbranding=1` : null

  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-2xl p-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div className="relative w-full max-w-6xl max-h-[90vh] rounded-2xl overflow-hidden bg-black shadow-2xl shadow-black/50"
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-black/80 transition-colors shadow-lg">
          <HiX className="text-xl" />
        </button>

        {index > 0 && (
          <button onClick={() => onIndexChange(index - 1)} className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/50 backdrop-blur-lg border border-white/20 text-white flex items-center justify-center hover:bg-black/70 transition-colors shadow-lg" aria-label="Anterior">
            <HiChevronLeft className="text-xl" />
          </button>
        )}
        {index < items.length - 1 && (
          <button onClick={() => onIndexChange(index + 1)} className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/50 backdrop-blur-lg border border-white/20 text-white flex items-center justify-center hover:bg-black/70 transition-colors shadow-lg" aria-label="Siguiente">
            <HiChevronRight className="text-xl" />
          </button>
        )}

        {youtubeUrl ? (
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe src={youtubeUrl} title={current.title || current.alt} className="absolute inset-0 w-full h-full" allow="autoplay; encrypted-media" allowFullScreen />
          </div>
        ) : isVideo && !videoError ? (
          <video controls autoPlay preload="metadata" className="w-full max-h-[85vh] bg-black mx-auto" poster={current.poster || undefined} onError={() => setVideoError(true)}>
            <source src={current.video} type="video/mp4" />
          </video>
        ) : current.src ? (
          <div className="flex items-center justify-center overflow-auto max-h-[85vh]">
            <img src={current.src} alt={current.alt}
              className={`transition-all duration-300 ease-out cursor-zoom-in ${zoomed ? 'scale-150 cursor-zoom-out' : 'scale-100'}`}
              onClick={() => setZoomed(!zoomed)} />
          </div>
        ) : (
          <div className="w-full aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
            <HiPlay className="text-white/20 text-8xl" />
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 z-20 p-6 bg-gradient-to-t from-black/90 via-black/60 to-transparent pointer-events-none">
          <p className="text-white text-lg font-semibold">{current.title || current.alt}</p>
          <p className="text-white/50 text-sm mt-1">{current.category}</p>
          {current.desc && <p className="text-white/40 text-sm mt-2 max-w-2xl">{current.desc}</p>}
        </div>

        <div className="absolute top-4 left-4 z-30 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white text-xs font-medium">
          {index + 1} / {items.length}
        </div>
      </motion.div>
    </motion.div>
  )
}

function NetflixCarousel({ items, onOpen }) {
  const swiperRef = useRef(null)
  if (items.length === 0) return null

  return (
    <div className="relative group/carousel">
      <Swiper modules={[Autoplay, A11y]} onSwiper={(s) => { swiperRef.current = s }}
        autoplay={{ delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true }}
        slidesPerView="auto" spaceBetween={12} speed={600} className="!overflow-visible !px-1">
        {items.map((item, i) => (
          <SwiperSlide key={item.alt} className="!w-[260px] md:!w-[300px]">
            <MediaCard item={item} onClick={() => onOpen(i)} />
          </SwiperSlide>
        ))}
      </Swiper>

      <button onClick={() => swiperRef.current?.slidePrev()}
        className="absolute left-0 top-0 bottom-0 z-20 w-14 opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-black/40 to-transparent flex items-center justify-start pl-2">
        <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors">
          <HiChevronLeft className="text-white text-xl" />
        </div>
      </button>

      <button onClick={() => swiperRef.current?.slideNext()}
        className="absolute right-0 top-0 bottom-0 z-20 w-14 opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300 bg-gradient-to-l from-black/40 to-transparent flex items-center justify-end pr-2">
        <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors">
          <HiChevronRight className="text-white text-xl" />
        </div>
      </button>
    </div>
  )
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.04 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
}

export default function Gallery() {
  const t = useT()

  const categories = [
    { id: 'lanzamiento', title: t('gallery.lanzamiento'), category: 'Lanzamiento de proyecto' },
    { id: 'digitales', title: t('gallery.digitales'), category: 'Impactos en medios de comunicación digitales' },
    { id: 'televisivos', title: t('gallery.televisivos'), category: 'Impactos en medios de comunicación televisivos' },
  ]
  const [modalOpen, setModalOpen] = useState(false)
  const [modalIndex, setModalIndex] = useState(0)
  const [modalItems, setModalItems] = useState([])
  const [activeFilter, setActiveFilter] = useState(null)

  const sectionRefs = useRef({})

  const openModal = useCallback((items, index) => {
    setModalItems(items); setModalIndex(index); setModalOpen(true)
  }, [])

  const closeModal = useCallback(() => setModalOpen(false), [])

  const handleIndexChange = useCallback((newIndex) => {
    setModalIndex(newIndex)
  }, [])

  const getItems = useCallback((category) => {
    return galleryImages.filter((img) => img.category === category)
  }, [])

  const handleFilterClick = useCallback((btn) => {
    setActiveFilter(btn.category)
    if (btn.category) {
      setTimeout(() => {
        const el = sectionRefs.current[btn.category]
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    }
  }, [])

  const filterButtons = [
    { label: t('gallery.todos'), category: null },
    { label: t('gallery.lanzamiento'), category: 'Lanzamiento de proyecto' },
    { label: t('gallery.digitales'), category: 'Impactos en medios de comunicación digitales' },
    { label: t('gallery.televisivos'), category: 'Impactos en medios de comunicación televisivos' },
  ]

  const currentItems = activeFilter === null ? galleryImages.slice(0, 8) : getItems(activeFilter)
  const showGrid = activeFilter === null

  const totalFotos = galleryImages.filter(i => i.src && !i.video && !i.youtubeId).length
  const totalVideos = galleryImages.filter(i => i.video || i.youtubeId).length

  return (
    <section id="gallery" className="relative py-28 md:py-36 overflow-hidden bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <LeafDecoration />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div className="text-center mb-14"
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.6 }}>
          <h2 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-gray-100 leading-tight">{t('gallery.title')}</h2>
          <div className="w-[100px] h-1 bg-green-500 mx-auto rounded-full mt-5" />
        </motion.div>

        <HeroSection
          item={galleryImages[0]}
          onOpen={() => openModal(galleryImages, 0)}
        />

        <motion.div className="text-center mb-6"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <p className="text-gray-400 text-sm flex items-center justify-center gap-4">
            <span className="flex items-center gap-1.5"><HiPhotograph className="text-green-500" /> {totalFotos} {t('gallery.fotos')}</span>
            <span className="w-1 h-1 rounded-full bg-gray-300" />
            <span className="flex items-center gap-1.5"><HiFilm className="text-green-500" /> {totalVideos} {t('gallery.videos')}</span>
          </p>
        </motion.div>

        <motion.div className="flex flex-wrap justify-center gap-3 mb-14"
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.5, delay: 0.2 }}>
          {filterButtons.map((btn) => (
            <button key={btn.label} onClick={() => handleFilterClick(btn)}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                activeFilter === btn.category
                  ? 'bg-green-600 text-white shadow-md shadow-green-200 scale-105'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-green-300 hover:text-green-700'
              }`}>
              {btn.label}
            </button>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          {showGrid ? (
            <motion.div key="todos" variants={containerVariants} initial="hidden" animate="visible" exit="exit"
              className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {currentItems.map((item, i) => {
                const layout = getGridLayout(i)
                return (
                  <motion.div key={item.alt} variants={itemVariants} className={`${layout.cols}`}>
                    <MediaCard item={item} layout={layout} onClick={() => openModal(currentItems, i)} />
                  </motion.div>
                )
              })}
            </motion.div>
          ) : (
            <motion.div key={activeFilter} variants={containerVariants} initial="hidden" animate="visible" exit="exit">
              {categories.filter((s) => s.category === activeFilter).map((section) => {
                const items = getItems(section.category)
                if (items.length === 0) return null
                return (
                  <div key={section.id} ref={(el) => { sectionRefs.current[section.category] = el }} className="scroll-mt-24">
                    <div className="flex items-end gap-4 mb-6">
                      <div>
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">{section.title}</h3>
                        <div className="w-12 h-0.5 bg-green-500 mt-2 rounded-full" />
                      </div>
                    </div>
                    {items.length > 4 ? (
                      <NetflixCarousel items={items} onOpen={(i) => openModal(items, i)} />
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {items.map((item, i) => (
                          <MediaCard key={item.alt} item={item} onClick={() => openModal(items, i)} />
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {modalOpen && (
          <Modal items={modalItems} index={modalIndex} onClose={closeModal} onIndexChange={handleIndexChange} />
        )}
      </AnimatePresence>
    </section>
  )
}
