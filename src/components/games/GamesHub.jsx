import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiVolumeUp, HiVolumeOff } from 'react-icons/hi'
import GuardianesAmazonia from './GuardianesAmazonia'
import CircuitoEcologico from './CircuitoEcologico'
import { isAudioMuted, toggleAudioMuted } from '../../utils/sounds'

const GAMES = [
  {
    id: 'guardianes',
    title: 'Guardianes de la Amazonía',
    emoji: '🌳',
    description: 'Atrapa elementos positivos y evita los contaminantes en este juego de reflejos. ¡Protege la selva!',
    tags: ['Reflejos', 'Puntaje', '60 seg'],
    gradient: 'from-green-600 to-emerald-700',
  },
  {
    id: 'circuito',
    title: 'Circuito Ecológico Amazónico',
    emoji: '🏆',
    description: 'Recorre 5 estaciones educativas: identifica animales, siembra árboles, construye biohuertos, separa residuos y responde preguntas.',
    tags: ['Educativo', 'Estrellas', '5 Estaciones'],
    gradient: 'from-blue-600 to-cyan-700',
  },
]

export default function GamesHub() {
  const [activeGame, setActiveGame] = useState(null)
  const [muted, setMuted] = useState(() => isAudioMuted())

  const handleToggleMute = () => {
    const newState = toggleAudioMuted()
    setMuted(newState)
  }

  if (activeGame) {
    return (
      <section id="games" className="py-12 md:py-16 px-4 bg-gradient-to-b from-green-950 via-emerald-950 to-green-900">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setActiveGame(null)}
              className="flex items-center gap-2 text-green-300 hover:text-green-200 transition-colors text-sm font-medium"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Volver a juegos
            </button>

            <button
              onClick={handleToggleMute}
              aria-label={muted ? 'Activar sonido' : 'Silenciar sonido'}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-medium transition-colors"
            >
              {muted ? <HiVolumeOff className="w-4 h-4 text-red-400" /> : <HiVolumeUp className="w-4 h-4 text-green-400" />}
              <span>{muted ? 'Sonido desactivado' : 'Sonido activado'}</span>
            </button>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeGame}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeGame === 'guardianes' && <GuardianesAmazonia />}
              {activeGame === 'circuito' && <CircuitoEcologico />}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    )
  }

  return (
    <section id="games" className="py-16 md:py-24 px-4 bg-gradient-to-b from-green-950 via-emerald-950 to-green-900">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.span
            className="text-5xl block mb-3"
            animate={{ rotate: [0, -5, 5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            🎮
          </motion.span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-3">
            Minijuegos Educativos
          </h2>
          <p className="text-green-200/60 max-w-xl mx-auto mb-4">
            Aprende sobre la Amazonía mientras te diviertes. Elige un juego y comienza la aventura.
          </p>

          <button
            onClick={handleToggleMute}
            aria-label={muted ? 'Activar sonido' : 'Silenciar sonido'}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-medium transition-colors"
          >
            {muted ? <HiVolumeOff className="w-4 h-4 text-red-400" /> : <HiVolumeUp className="w-4 h-4 text-green-400" />}
            <span>{muted ? 'Sonido de juegos desactivado' : 'Sonido de juegos activado'}</span>
          </button>

          <div className="w-20 h-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mx-auto mt-4" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {GAMES.map((game, i) => (
            <motion.button
              key={game.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveGame(game.id)}
              className="text-left relative overflow-hidden rounded-2xl shadow-2xl border border-white/10 group"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${game.gradient} opacity-90`} />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.1)_0%,_transparent_50%)]" />
              <div className="relative z-10 p-6 md:p-8">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <motion.span
                      className="text-5xl block mb-2"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {game.emoji}
                    </motion.span>
                  </div>
                  <svg className="w-8 h-8 text-white/30 group-hover:text-white/60 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{game.title}</h3>
                <p className="text-white/70 text-sm leading-relaxed mb-4">
                  {game.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {game.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full bg-white/10 text-white/80 text-xs font-medium border border-white/10"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  )
}
