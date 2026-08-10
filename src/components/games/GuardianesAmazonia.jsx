import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { playCollect, playHit, playVictory, playLose, playTick } from '../../utils/sounds'

const GOOD = [
  { emoji: '🌱', label: 'Árbol', points: 10 },
  { emoji: '🌿', label: 'Planta', points: 10 },
  { emoji: '🦜', label: 'Guacamayo', points: 15 },
  { emoji: '🐒', label: 'Mono', points: 15 },
  { emoji: '🐢', label: 'Tortuga', points: 15 },
  { emoji: '💧', label: 'Gota de agua', points: 5 },
  { emoji: '♻️', label: 'Reciclaje', points: 10 },
]

const BAD = [
  { emoji: '🗑️', label: 'Basura' },
  { emoji: '🔥', label: 'Fuego' },
  { emoji: '🚬', label: 'Colilla' },
  { emoji: '🛢️', label: 'Petróleo' },
  { emoji: '🪓', label: 'Hacha' },
]

const GAME_DURATION = 60
const MAX_LIVES = 3
const SPAWN_INTERVAL = 1200
const BASE_SPEED = 24
const SPEED_VARIANCE = 10
const MAX_OBJECTS = 8

function random(arr) { return arr[Math.floor(Math.random() * arr.length)] }

function getMedal(score) {
  if (score >= 200) return { emoji: '🥇', title: 'Héroe de la Amazonía', color: 'from-yellow-400 to-amber-600' }
  if (score >= 100) return { emoji: '🥈', title: 'Guardián', color: 'from-gray-300 to-gray-500' }
  return { emoji: '🥉', title: 'Protector', color: 'from-amber-600 to-yellow-800' }
}

function LeafParticle() {
  const left = Math.random() * 100
  const delay = Math.random() * 10
  const dur = 10 + Math.random() * 15
  const size = 8 + Math.random() * 16
  return (
    <motion.div
      className="absolute top-0 pointer-events-none"
      style={{ left: `${left}%` }}
      animate={{
        y: ['-10vh', '110vh'],
        x: [0, (Math.random() > 0.5 ? 1 : -1) * (30 + Math.random() * 40)],
        rotate: [0, 360],
        opacity: [0, 0.5, 0.3, 0],
      }}
      transition={{ duration: dur, delay, repeat: Infinity, ease: 'linear' }}
    >
      <svg width={size} height={size} viewBox="0 0 24 24" fill="#4ade80" opacity={0.5}>
        <path d="M21.8 2.2c-1.5 1.5-4.3 3.8-7.5 5.1-1.9.8-3.8 1.2-5.3 1.2-1.3 0-2.2-.3-2.2-.3s.3 1 .3 2.3c0 1.5-.4 3.4-1.2 5.3-1.3 3.2-3.6 6-5.1 7.5-.4.4-.4 1 0 1.4.2.2.4.3.7.3s.5-.1.7-.3c1.5-1.5 4.3-3.8 7.5-5.1 1.9-.8 3.8-1.2 5.3-1.2 1.3 0 2.2.3 2.2.3s-.3-1-.3-2.3c0-1.5.4-3.4 1.2-5.3 1.3-3.2 3.6-6 5.1-7.5.4-.4.4-1 0-1.4-.4-.4-1-.4-1.4 0z" />
      </svg>
    </motion.div>
  )
}

function FloatingObject({ obj }) {
  const isGood = obj.type === 'good'
  return (
    <motion.div
      className="absolute z-10 select-none pointer-events-none"
      style={{
        left: `${obj.x}%`,
        top: `${obj.y}%`,
        fontSize: `${obj.size}px`,
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: [0, 1.2, 1], opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative">
        <span className="block drop-shadow-lg">{obj.emoji}</span>
        {isGood && (
          <motion.div
            className="absolute -inset-2 rounded-full border-2 border-green-400/40"
            animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.1, 0.4] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )}
      </div>
    </motion.div>
  )
}

function Particle({ p }) {
  return (
    <motion.div
      className="absolute pointer-events-none z-20 text-lg"
      style={{ left: `${p.x}%`, top: `${p.y}%` }}
      animate={{
        y: -80,
        x: p.xDir * 40,
        opacity: [1, 0],
        scale: [1, 0],
      }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {p.emoji}
    </motion.div>
  )
}

export default function GuardianesAmazonia() {
  const [gamePhase, setGamePhase] = useState('menu')
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(MAX_LIVES)
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION)
  const [objects, setObjects] = useState([])
  const [catcherX, setCatcherX] = useState(50)
  const [particles, setParticles] = useState([])
  const [flash, setFlash] = useState(null)

  const areaRef = useRef(null)
  const animRef = useRef(null)
  const lastTimeRef = useRef(0)
  const spawnTimerRef = useRef(0)
  const scoreRef = useRef(0)
  const livesRef = useRef(MAX_LIVES)
  const timeRef = useRef(GAME_DURATION)
  const objectsRef = useRef([])
  const catcherXRef = useRef(50)
  const frameCountRef = useRef(0)
  const difficultyRef = useRef(1)

  const spawnObject = useCallback(() => {
    const isGood = Math.random() < 0.65
    const template = isGood ? random(GOOD) : random(BAD)
    const size = 30 + Math.random() * 16
    const speed = BASE_SPEED + Math.random() * SPEED_VARIANCE + (difficultyRef.current - 1) * 3
    const obj = {
      id: Date.now() + Math.random(),
      emoji: template.emoji,
      label: template.label,
      type: isGood ? 'good' : 'bad',
      points: isGood ? template.points : 0,
      x: 5 + Math.random() * 90,
      y: -8,
      size,
      speed,
    }
    objectsRef.current = [...objectsRef.current, obj]
  }, [])

  const getCatcherBounds = useCallback(() => {
    if (!areaRef.current) return { left: 0, right: 100 }
    const w = areaRef.current.offsetWidth
    const catcherWidthPercent = 16
    const cx = catcherXRef.current
    return {
      left: cx - catcherWidthPercent / 2,
      right: cx + catcherWidthPercent / 2,
      widthPx: w * catcherWidthPercent / 100,
    }
  }, [])

  const checkCollisions = useCallback(() => {
    const catcher = getCatcherBounds()
    const remaining = []
    const newParticles = []
    let hitBad = false
    let collected = false

    for (const obj of objectsRef.current) {
      if (obj.y >= 78 && obj.y <= 96) {
        const objLeft = obj.x - 4
        const objRight = obj.x + 4
        if (objRight > catcher.left && objLeft < catcher.right) {
          if (obj.type === 'good') {
            scoreRef.current += obj.points
            collected = true
            newParticles.push({ x: obj.x, y: obj.y, emoji: '+'+obj.points, xDir: Math.random() > 0.5 ? 1 : -1 })
          } else {
            livesRef.current = Math.max(0, livesRef.current - 1)
            hitBad = true
            newParticles.push({ x: obj.x, y: obj.y, emoji: '💥', xDir: 0 })
          }
          continue
        }
      }
      if (obj.y < 105) remaining.push(obj)
    }

    objectsRef.current = remaining
    if (newParticles.length > 0) setParticles(prev => [...prev, ...newParticles])
    if (collected) { playCollect(); setFlash('green') }
    if (hitBad) { playHit(); setFlash('red') }
    if (hitBad || collected) {
      setScore(scoreRef.current)
      setLives(livesRef.current)
    }
  }, [getCatcherBounds])

  const startGame = useCallback(() => {
    scoreRef.current = 0
    livesRef.current = MAX_LIVES
    timeRef.current = GAME_DURATION
    objectsRef.current = []
    catcherXRef.current = 50
    spawnTimerRef.current = 0
    difficultyRef.current = 1
    frameCountRef.current = 0
    setScore(0)
    setLives(MAX_LIVES)
    setTimeLeft(GAME_DURATION)
    setObjects([])
    setCatcherX(50)
    setParticles([])
    setFlash(null)
    setGamePhase('playing')
  }, [])

  useEffect(() => {
    if (gamePhase !== 'playing') return
    lastTimeRef.current = performance.now()

    const loop = (time) => {
      const dt = (time - lastTimeRef.current) / 1000
      lastTimeRef.current = time
      frameCountRef.current++

      difficultyRef.current = 1 + (GAME_DURATION - timeRef.current) / GAME_DURATION * 0.5

      spawnTimerRef.current += dt * 1000
      const spawnInterval = Math.max(600, SPAWN_INTERVAL - (GAME_DURATION - timeRef.current) * 6)
      if (spawnTimerRef.current >= spawnInterval && objectsRef.current.length < MAX_OBJECTS) {
        spawnTimerRef.current = 0
        spawnObject()
      }

      for (const obj of objectsRef.current) {
        obj.y += obj.speed * dt
      }

      checkCollisions()

      if (frameCountRef.current % 2 === 0) {
        setObjects([...objectsRef.current])
      }

      const prevTime = timeRef.current
      timeRef.current = Math.max(0, timeRef.current - dt)
      if (Math.floor(timeRef.current) !== Math.floor(prevTime)) {
        setTimeLeft(Math.ceil(timeRef.current))
      }

      if (livesRef.current <= 0 || timeRef.current <= 0) {
        if (livesRef.current <= 0) playLose()
        else playVictory()
        setGamePhase('ended')
        return
      }

      animRef.current = requestAnimationFrame(loop)
    }

    animRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(animRef.current)
  }, [gamePhase, spawnObject, checkCollisions])

  useEffect(() => {
    if (gamePhase !== 'playing') return

    const handleMouse = (e) => {
      if (!areaRef.current) return
      const rect = areaRef.current.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 100
      catcherXRef.current = Math.max(5, Math.min(95, x))
      setCatcherX(catcherXRef.current)
    }

    const handleTouch = (e) => {
      if (!areaRef.current || !e.touches[0]) return
      const rect = areaRef.current.getBoundingClientRect()
      const x = ((e.touches[0].clientX - rect.left) / rect.width) * 100
      catcherXRef.current = Math.max(5, Math.min(95, x))
      setCatcherX(catcherXRef.current)
    }

    window.addEventListener('mousemove', handleMouse)
    window.addEventListener('touchmove', handleTouch, { passive: true })
    return () => {
      window.removeEventListener('mousemove', handleMouse)
      window.removeEventListener('touchmove', handleTouch)
    }
  }, [gamePhase])

  useEffect(() => {
    if (gamePhase !== 'playing') return
    if (timeLeft <= 10 && timeLeft > 0) {
      playTick()
    }
  }, [timeLeft, gamePhase])

  const medal = getMedal(score)

  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-b from-green-950 via-emerald-900 to-green-900 rounded-2xl shadow-2xl border border-green-700/30" style={{ minHeight: '600px', height: '80vh', maxHeight: '800px' }}>
      <div className="absolute inset-0 opacity-20">
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-green-900/60 to-transparent" />
        {Array.from({ length: 4 }).map((_, i) => (
          <LeafParticle key={i} />
        ))}
      </div>

      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-green-900/80 to-transparent pointer-events-none z-[5]" />

      {gamePhase === 'menu' && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-6">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="text-center max-w-lg"
          >
            <motion.span
              className="text-7xl block mb-4"
              animate={{ rotate: [0, -5, 5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              🌳
            </motion.span>
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Guardianes de la Amazonía
            </h3>
            <p className="text-green-200/70 mb-6 text-sm">
              Atrapa los elementos positivos 🌱🦜💧 y evita los contaminantes 🗑️🔥🪓
            </p>
            <div className="grid grid-cols-2 gap-2 mb-6 text-xs">
              <div className="bg-white/5 rounded-xl p-3 border border-green-500/20">
                <div className="flex flex-wrap gap-1 mb-1 text-lg justify-center">
                  {GOOD.slice(0, 4).map(g => <span key={g.label}>{g.emoji}</span>)}
                </div>
                <p className="text-green-300/80">Suma puntos</p>
              </div>
              <div className="bg-white/5 rounded-xl p-3 border border-red-500/20">
                <div className="flex flex-wrap gap-1 mb-1 text-lg justify-center">
                  {BAD.slice(0, 3).map(b => <span key={b.label}>{b.emoji}</span>)}
                </div>
                <p className="text-red-300/80">Resta vidas</p>
              </div>
            </div>
            <button
              onClick={startGame}
              className="px-10 py-4 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-lg shadow-xl shadow-green-500/30 hover:shadow-green-500/50 hover:scale-105 active:scale-95 transition-all"
            >
              🌿 Jugar
            </button>
          </motion.div>
        </div>
      )}

      {gamePhase === 'playing' && (
        <>
          <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between px-4 py-3 bg-gradient-to-b from-black/40 to-transparent">
            <div className="flex items-center gap-1.5">
              {Array.from({ length: MAX_LIVES }).map((_, i) => (
                <motion.span
                  key={i}
                  className="text-xl"
                  animate={i >= lives ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {i < lives ? '❤️' : '🖤'}
                </motion.span>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-black/40 backdrop-blur-sm rounded-xl px-4 py-1.5 border border-white/10">
                <span className="text-white font-bold text-lg">{score}</span>
                <span className="text-white/50 text-xs ml-1">pts</span>
              </div>
              <div className={`bg-black/40 backdrop-blur-sm rounded-xl px-4 py-1.5 border border-white/10 ${timeLeft <= 10 ? 'animate-pulse' : ''}`}>
                <span className={`font-bold text-lg ${timeLeft <= 10 ? 'text-red-400' : 'text-white'}`}>
                  {Math.ceil(timeLeft)}s
                </span>
              </div>
            </div>
          </div>

          {flash && (
            <motion.div
              className="absolute inset-0 z-[15] pointer-events-none"
              initial={{ opacity: 0.3 }}
              animate={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{ backgroundColor: flash === 'green' ? 'rgba(74,222,128,0.15)' : 'rgba(248,113,113,0.2)' }}
              onAnimationEnd={() => setFlash(null)}
            />
          )}

          <div ref={areaRef} className="absolute inset-0" style={{ top: 0, bottom: 0 }}>
            <AnimatePresence>
              {objects.map(obj => (
                <FloatingObject key={obj.id} obj={obj} />
              ))}
            </AnimatePresence>

            <AnimatePresence>
              {particles.map((p, i) => (
                <Particle key={`p-${Date.now()}-${i}`} p={p} />
              ))}
            </AnimatePresence>

            <motion.div
              className="absolute bottom-4 z-10 select-none"
              style={{ left: `${catcherX}%`, transform: 'translateX(-50%)' }}
              animate={{ x: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div className="text-center">
                <motion.span
                  className="text-4xl block drop-shadow-xl"
                  animate={{ rotate: [0, -3, 3, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  🧺
                </motion.span>
                <div className="w-16 h-2 mx-auto rounded-full bg-gradient-to-r from-green-400/40 to-emerald-500/40 backdrop-blur-sm" />
              </div>
            </motion.div>
          </div>
        </>
      )}

      {gamePhase === 'ended' && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="text-center p-8"
          >
            <motion.span
              className="text-7xl block mb-2"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              {medal.emoji}
            </motion.span>
            <h3 className="text-3xl font-bold text-white mb-1">{medal.title}</h3>
            <p className="text-green-200/60 text-sm mb-6">
              Puntaje final: <span className="text-white font-bold text-2xl">{score}</span> pts
            </p>

            <div className="bg-white/5 rounded-2xl p-4 mb-6 border border-white/10 inline-block">
              <div className="flex items-center gap-4 text-sm">
                <div className="text-center">
                  <span className="text-green-300 text-xl">{score}</span>
                  <p className="text-green-200/50 text-xs">Puntos</p>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div className="text-center">
                  <span className="text-red-300 text-xl">{MAX_LIVES - lives}</span>
                  <p className="text-green-200/50 text-xs">Fallos</p>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div className="text-center">
                  <span className="text-blue-300 text-xl">{Math.round(score / Math.max(1, GAME_DURATION - timeLeft) * 60)}</span>
                  <p className="text-green-200/50 text-xs">Pts/min</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={startGame}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold shadow-lg shadow-green-500/30 hover:scale-105 active:scale-95 transition-all"
              >
                ♻️ Jugar nuevamente
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
