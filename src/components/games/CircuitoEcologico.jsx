import { useState, useCallback, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { playStationComplete, playStar, playVictory, playError, playConfetti } from '../../utils/sounds'

const STATIONS = [
  {
    id: 'animales',
    title: 'Identificar Animales',
    icon: '🦜',
    description: '¿Conoces la fauna amazónica? Elige el animal correcto.',
  },
  {
    id: 'sembrar',
    title: 'Sembrar un Árbol',
    icon: '🌱',
    description: 'Ayuda a reforestar la Amazonía plantando un árbol.',
  },
  {
    id: 'biohuerto',
    title: 'Construir un Biohuerto',
    icon: '🥬',
    description: 'Arma tu biohuerto con los elementos correctos.',
  },
  {
    id: 'residuos',
    title: 'Separar Residuos',
    icon: '♻️',
    description: 'Clasifica los residuos en los contenedores correctos.',
  },
  {
    id: 'pregunta',
    title: 'Pregunta Ambiental',
    icon: '💡',
    description: 'Demuestra tus conocimientos sobre la Amazonía.',
  },
]

const ANIMAL_QUESTIONS = [
  { animal: '🦜', nombre: 'Guacamayo', datos: 'Vive en la Amazonía y tiene plumas de colores brillantes.' },
  { animal: '🐒', nombre: 'Mono', datos: 'Es un primate que salta entre los árboles de la selva.' },
  { animal: '🐢', nombre: 'Tortuga', datos: 'Reptil de caparazón duro que vive en ríos amazónicos.' },
  { animal: '🐆', nombre: 'Jaguar', datos: 'El felino más grande de América, vive en la Amazonía.' },
  { animal: '🦦', nombre: 'Nutria', datos: 'Mamífero acuático que habita en los ríos de la selva.' },
]

const ANIMAL_CHOICES = ['🦜', '🐒', '🐢', '🐆', '🦦', '🐊', '🦋', '🐸']

const TREE_STAGES = ['🌱', '🌿', '🌳']

const GARDEN_ITEMS = [
  { emoji: '🥬', label: 'Lechuga', correct: true },
  { emoji: '🥕', label: 'Zanahoria', correct: true },
  { emoji: '🍅', label: 'Tomate', correct: true },
  { emoji: '🌶️', label: 'Ají', correct: true },
  { emoji: '🥦', label: 'Brócoli', correct: true },
  { emoji: '🗑️', label: 'Basura', correct: false },
  { emoji: '🪨', label: 'Piedra', correct: false },
  { emoji: '🚬', label: 'Colilla', correct: false },
]

const WASTE_ITEMS = [
  { emoji: '🥫', label: 'Lata', type: 'metal' },
  { emoji: '📰', label: 'Periódico', type: 'papel' },
  { emoji: '🍾', label: 'Botella', type: 'vidrio' },
  { emoji: '🥤', label: 'Plástico', type: 'plastico' },
  { emoji: '🍌', label: 'Cáscara', type: 'organico' },
  { emoji: '📦', label: 'Caja', type: 'papel' },
]

const BINS = [
  { type: 'papel', emoji: '📋', label: 'Papel', color: 'bg-blue-500' },
  { type: 'plastico', emoji: '🥤', label: 'Plástico', color: 'bg-yellow-500' },
  { type: 'vidrio', emoji: '🍾', label: 'Vidrio', color: 'bg-green-500' },
  { type: 'metal', emoji: '🥫', label: 'Metal', color: 'bg-gray-500' },
  { type: 'organico', emoji: '🌱', label: 'Orgánico', color: 'bg-brown-500' },
]

const QUESTIONS = [
  {
    pregunta: '¿Cuál es la selva tropical más grande del mundo?',
    opciones: ['Amazonía', 'Congo', 'Bosque Atlántico', 'Daintree'],
    correcta: 0,
  },
  {
    pregunta: '¿Qué gas absorben los árboles para ayudarnos a respirar?',
    opciones: ['Oxígeno', 'CO₂', 'Nitrógeno', 'Hidrógeno'],
    correcta: 1,
  },
  {
    pregunta: '¿Cuánto tiempo tarda en degradarse una botella de plástico?',
    opciones: ['10 años', '50 años', '450 años', '5 años'],
    correcta: 2,
  },
  {
    pregunta: '¿Qué departamento del Perú alberga la mayor parte de la Amazonía?',
    opciones: ['Loreto', 'Ucayali', 'Madre de Dios', 'Amazonas'],
    correcta: 0,
  },
  {
    pregunta: '¿Qué significa "Sembrando Huellas Perú"?',
    opciones: [
      'Una organización ambiental que educa para conservar la Amazonía',
      'Una empresa maderera',
      'Un zoológico',
      'Una escuela',
    ],
    correcta: 0,
  },
]

function ProgressBar({ current, total, score }) {
  const pct = ((current) / total) * 100
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2 text-sm">
        <span className="text-white/70 font-medium">
          Estación {Math.min(current + 1, total)} / {total}
        </span>
        <span className="text-yellow-300 font-bold">
          {'⭐'.repeat(Math.min(3, score))}
          {'☆'.repeat(Math.max(0, 3 - score))}
        </span>
      </div>
      <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-green-400 to-emerald-500"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}

function StationBadge({ icon, title, stars, active }) {
  return (
    <motion.div
      className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
        active ? 'bg-green-500/20 border border-green-400/30 scale-110' : 'bg-white/5 border border-white/10 opacity-50'
      }`}
      animate={active ? { scale: 1.1 } : { scale: 1 }}
    >
      <span className="text-2xl">{icon}</span>
      <span className="text-[10px] text-white/70 text-center leading-tight">{title}</span>
      {stars > 0 && <span className="text-xs">{'⭐'.repeat(stars)}</span>}
    </motion.div>
  )
}

function StationAnimales({ onComplete }) {
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const correctRef = useRef(0)

  const q = ANIMAL_QUESTIONS[current]

  const [shuffled] = useState(() => ANIMAL_CHOICES.sort(() => Math.random() - 0.5).slice(0, 6))

  const handleSelect = (animal) => {
    if (feedback) return
    setSelected(animal)
    if (animal === q.animal) {
      correctRef.current += 1
      setFeedback(true)
      playStar()
    } else {
      setFeedback(false)
      playError()
    }
    setTimeout(() => {
      if (current < ANIMAL_QUESTIONS.length - 1) {
        setSelected(null)
        setFeedback(null)
        setCurrent(c => c + 1)
      } else {
        const stars = correctRef.current >= 4 ? 3 : correctRef.current >= 2 ? 2 : 1
        playStationComplete()
        onComplete(stars)
      }
    }, 800)
  }

  return (
    <div className="text-center">
      <motion.p className="text-green-200/70 text-sm mb-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {current + 1} / {ANIMAL_QUESTIONS.length}
      </motion.p>
      <motion.p
        key={current}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-white text-base mb-4"
      >
        {q.datos}
      </motion.p>
      <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto">
        {shuffled.map(animal => (
          <motion.button
            key={animal}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleSelect(animal)}
            className={`text-4xl p-3 rounded-xl border-2 transition-all ${
              selected === animal
                ? feedback
                  ? 'border-green-400 bg-green-500/20'
                  : 'border-red-400 bg-red-500/20'
                : 'border-white/10 bg-white/5 hover:border-green-400/30'
            }`}
            disabled={!!feedback}
          >
            {animal}
          </motion.button>
        ))}
      </div>
      {feedback !== null && (
        <motion.p
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={`mt-3 font-bold text-sm ${feedback ? 'text-green-300' : 'text-red-300'}`}
        >
          {feedback ? '✅ ¡Correcto!' : `❌ Era ${q.animal}`}
        </motion.p>
      )}
    </div>
  )
}

function StationSembrar({ onComplete }) {
  const [stage, setStage] = useState(0)
  const [waterCount, setWaterCount] = useState(0)
  const [completed, setCompleted] = useState(false)

  useEffect(() => {
    if (stage >= 2 && waterCount >= 3 && !completed) {
      setCompleted(true)
      playStationComplete()
      onComplete(3)
    }
  }, [stage, waterCount, completed, onComplete])

  const handleClick = () => {
    if (stage < 2) {
      setStage(s => s + 1)
      playStar()
    } else if (waterCount < 3) {
      setWaterCount(c => c + 1)
      playStar()
    }
  }

  return (
    <div className="text-center">
      <motion.div className="text-8xl mb-4" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
        {TREE_STAGES[Math.min(stage, 2)]}
      </motion.div>
      {stage < 3 && (
        <>
          <p className="text-white mb-3">
            {stage === 0 ? 'Haz clic para plantar la semilla 🌱' :
             stage === 1 ? '¡Sigue regando para que crezca! 💧' :
             '¡Un poco más de agua! 💧'}
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleClick}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold shadow-lg"
          >
            {stage < 2 ? '🌱 Plantar' : '💧 Regar'}
          </motion.button>
        </>
      )}
      {stage >= 2 && waterCount >= 3 && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mt-4">
          <p className="text-green-300 font-bold text-lg">🌳 ¡Árbol sembrado!</p>
        </motion.div>
      )}
      <div className="flex justify-center gap-1 mt-3">
        {[0, 1, 2].map(i => (
          <span key={i} className={`text-xl ${i <= stage ? 'opacity-100' : 'opacity-30'}`}>
            {TREE_STAGES[i]}
          </span>
        ))}
      </div>
    </div>
  )
}

function StationBiohuerto({ onComplete }) {
  const [placed, setPlaced] = useState([])
  const [selected, setSelected] = useState(null)
  const errorsRef = useRef(0)
  const placedRef = useRef([])

  const handleItemClick = (item, index) => {
    if (placed.includes(index)) return
    setSelected(index)
    if (item.correct) {
      playStar()
      const newPlaced = [...placedRef.current, index]
      placedRef.current = newPlaced
      setPlaced(newPlaced)
      if (placedRef.current.length >= 5) {
        const s = errorsRef.current === 0 ? 3 : errorsRef.current <= 1 ? 2 : 1
        playStationComplete()
        onComplete(s)
      }
      setTimeout(() => setSelected(null), 200)
    } else {
      playError()
      errorsRef.current += 1
      setTimeout(() => setSelected(null), 400)
    }
  }

  return (
    <div className="text-center">
      <p className="text-white/80 text-sm mb-4">
        Selecciona los elementos correctos para tu biohuerto
      </p>
      <div className="grid grid-cols-4 gap-2 max-w-sm mx-auto mb-4">
        {GARDEN_ITEMS.map((item, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleItemClick(item, i)}
            className={`text-3xl p-2 rounded-xl border-2 transition-all ${
              placed.includes(i)
                ? 'border-green-400 bg-green-500/20 opacity-60'
                : selected === i && !item.correct
                  ? 'border-red-400 bg-red-500/20'
                  : 'border-white/10 bg-white/5 hover:border-green-400/30'
            }`}
            disabled={placed.includes(i)}
          >
            {item.emoji}
          </motion.button>
        ))}
      </div>
      <div className="flex flex-wrap justify-center gap-1 text-2xl">
        {GARDEN_ITEMS.filter((_, i) => placed.includes(i) && GARDEN_ITEMS[i].correct).map((item, i) => (
          <motion.span key={i} initial={{ scale: 0 }} animate={{ scale: 1 }}>{item.emoji}</motion.span>
        ))}
      </div>
      {placed.length > 0 && (
        <p className="text-green-200/60 text-xs mt-2">
          {placed.filter(i => GARDEN_ITEMS[i].correct).length} / 5 elementos correctos
        </p>
      )}
    </div>
  )
}

function StationResiduos({ onComplete }) {
  const [current, setCurrent] = useState(0)
  const [feedback, setFeedback] = useState(null)
  const correctRef = useRef(0)

  const item = WASTE_ITEMS[current]

  const handleBin = (type) => {
    if (feedback) return
    if (type === item.type) {
      correctRef.current += 1
      setFeedback(true)
      playStar()
    } else {
      setFeedback(false)
      playError()
    }
    setTimeout(() => {
      if (current < WASTE_ITEMS.length - 1) {
        setFeedback(null)
        setCurrent(c => c + 1)
      } else {
        const stars = correctRef.current >= 5 ? 3 : correctRef.current >= 3 ? 2 : 1
        playStationComplete()
        onComplete(stars)
      }
    }, 700)
  }

  return (
    <div className="text-center">
      <p className="text-white/80 text-sm mb-1">¿Dónde va este residuo?</p>
      <motion.div
        key={current}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="text-6xl mb-4"
      >
        {item.emoji}
      </motion.div>
      <p className="text-white/50 text-xs mb-3">{item.label}</p>
      <div className="grid grid-cols-5 gap-2 max-w-md mx-auto">
        {BINS.map(bin => (
          <motion.button
            key={bin.type}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleBin(bin.type)}
            className={`p-2 rounded-xl border-2 text-center transition-all ${
              feedback !== null && bin.type === item.type
                ? 'border-green-400 bg-green-500/20'
                : feedback === false && bin.type !== item.type
                  ? 'border-white/10'
                  : 'border-white/10 bg-white/5 hover:border-green-400/30'
            }`}
            disabled={feedback !== null}
          >
            <span className="text-2xl block">{bin.emoji}</span>
            <span className="text-[10px] text-white/60">{bin.label}</span>
          </motion.button>
        ))}
      </div>
      {feedback !== null && (
        <motion.p
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={`mt-2 font-bold text-sm ${feedback ? 'text-green-300' : 'text-red-300'}`}
        >
          {feedback ? '✅ ¡Bien!' : `❌ Era: ${BINS.find(b => b.type === item.type).label}`}
        </motion.p>
      )}
      <p className="text-white/30 text-xs mt-2">
        {current + 1} / {WASTE_ITEMS.length}
      </p>
    </div>
  )
}

function StationPregunta({ onComplete }) {
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [correct, setCorrect] = useState(0)
  const [feedback, setFeedback] = useState(null)

  const q = QUESTIONS[current]

  const handleAnswer = (idx) => {
    if (feedback) return
    setSelected(idx)
    if (idx === q.correcta) {
      setFeedback(true)
      playStar()
      setCorrect(c => c + 1)
    } else {
      setFeedback(false)
      playError()
    }
    setTimeout(() => {
      if (current < QUESTIONS.length - 1) {
        setSelected(null)
        setFeedback(null)
        setCurrent(c => c + 1)
      } else {
        const stars = correct >= 4 ? 3 : correct >= 2 ? 2 : 1
        playStationComplete()
        onComplete(stars)
      }
    }, 1000)
  }

  return (
    <div className="text-center max-w-md mx-auto">
      <p className="text-white/70 text-xs mb-1">{current + 1} / {QUESTIONS.length}</p>
      <motion.p
        key={current}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-white font-medium text-base mb-4"
      >
        {q.pregunta}
      </motion.p>
      <div className="space-y-2">
        {q.opciones.map((opcion, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleAnswer(i)}
            className={`w-full text-left p-3 rounded-xl border-2 transition-all text-sm ${
              selected === i
                ? feedback
                  ? 'border-green-400 bg-green-500/20 text-green-100'
                  : 'border-red-400 bg-red-500/20 text-red-100'
                : 'border-white/10 bg-white/5 text-white/80 hover:border-green-400/30'
            }`}
            disabled={feedback !== null}
          >
            {opcion}
          </motion.button>
        ))}
      </div>
      {feedback !== null && (
        <motion.p
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={`mt-2 font-bold text-sm ${feedback ? 'text-green-300' : 'text-red-300'}`}
        >
          {feedback ? '✅ ¡Correcto!' : `❌ Respuesta: ${q.opciones[q.correcta]}`}
        </motion.p>
      )}
    </div>
  )
}

function Confetti() {
  const colors = ['#22c55e', '#4ade80', '#facc15', '#f97316', '#a78bfa', '#f472b6']
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {Array.from({ length: 50 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-sm"
          style={{
            left: `${Math.random() * 100}%`,
            top: '-10px',
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
          }}
          animate={{
            y: ['0vh', '110vh'],
            x: [0, (Math.random() > 0.5 ? 1 : -1) * (50 + Math.random() * 80)],
            rotate: [0, 720],
            opacity: [1, 0.8, 0],
          }}
          transition={{
            duration: 2 + Math.random() * 3,
            delay: Math.random() * 2,
            ease: 'easeIn',
            repeat: 0,
          }}
        />
      ))}
    </div>
  )
}

export default function CircuitoEcologico() {
  const [currentStation, setCurrentStation] = useState(0)
  const [stars, setStars] = useState([0, 0, 0, 0, 0])
  const [totalStars, setTotalStars] = useState(0)
  const [completed, setCompleted] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  const handleStationComplete = useCallback((stationStars) => {
    const newStars = [...stars]
    newStars[currentStation] = stationStars
    setStars(newStars)
    const total = newStars.reduce((a, b) => a + b, 0)
    setTotalStars(total)

    if (currentStation < STATIONS.length - 1) {
      setTimeout(() => setCurrentStation(s => s + 1), 500)
    } else {
      playVictory()
      setCompleted(true)
      if (total >= 10) {
        setTimeout(() => {
          setShowConfetti(true)
          playConfetti()
        }, 300)
      }
    }
  }, [currentStation, stars])

  const restart = () => {
    setCurrentStation(0)
    setStars([0, 0, 0, 0, 0])
    setTotalStars(0)
    setCompleted(false)
    setShowConfetti(false)
  }

  if (completed) {
    return (
      <div className="relative w-full overflow-hidden bg-gradient-to-b from-green-950 via-emerald-900 to-green-900 rounded-2xl shadow-2xl border border-green-700/30 p-8 flex flex-col items-center justify-center" style={{ minHeight: '600px', height: '80vh', maxHeight: '800px' }}>
        {showConfetti && <Confetti />}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="text-center max-w-md"
        >
          <motion.span
            className="text-7xl block mb-4"
            animate={{ rotate: [0, -5, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🏆
          </motion.span>
          <motion.h3
            className="text-3xl md:text-4xl font-bold text-white mb-2"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            ¡Felicitaciones!
          </motion.h3>
          <motion.p
            className="text-green-200/80 text-lg mb-4 font-bold"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Embajador Ambiental de
            <br />
            <span className="text-green-300">Sembrando Huellas Perú</span>
          </motion.p>
          <motion.div
            className="text-4xl mb-3"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.7, type: 'spring' }}
          >
            {Array.from({ length: totalStars }).map((_, i) => (
              <motion.span
                key={i}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.8 + i * 0.15, type: 'spring' }}
                className="inline-block"
              >
                ⭐
              </motion.span>
            ))}
          </motion.div>
          <motion.p
            className="text-green-200/60 text-sm mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            {totalStars} / 15 estrellas obtenidas
          </motion.p>
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.4 }}
            onClick={restart}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold shadow-lg shadow-green-500/30 hover:scale-105 active:scale-95 transition-all"
          >
            🌿 Jugar nuevamente
          </motion.button>
        </motion.div>
      </div>
    )
  }

  const station = STATIONS[currentStation]

  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-b from-green-950 via-emerald-900 to-green-900 rounded-2xl shadow-2xl border border-green-700/30" style={{ minHeight: '600px', height: '80vh', maxHeight: '800px' }}>
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-64 h-64 bg-green-500 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-emerald-400 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 h-full flex flex-col p-4 md:p-6">
        <ProgressBar current={currentStation} total={STATIONS.length} score={totalStars} />

        <div className="flex justify-center gap-1.5 mt-3 mb-4">
          {STATIONS.map((s, i) => (
            <StationBadge
              key={s.id}
              icon={s.icon}
              title={s.title}
              stars={stars[i]}
              active={i === currentStation}
            />
          ))}
        </div>

        <motion.div
          key={station.id}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="flex-1 flex flex-col items-center justify-center"
        >
          <motion.span
            className="text-5xl mb-2"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {station.icon}
          </motion.span>
          <h3 className="text-xl md:text-2xl font-bold text-white mb-1">
            {station.title}
          </h3>
          <p className="text-green-200/60 text-sm mb-6">
            {station.description}
          </p>

          {station.id === 'animales' && <StationAnimales onComplete={handleStationComplete} />}
          {station.id === 'sembrar' && <StationSembrar onComplete={handleStationComplete} />}
          {station.id === 'biohuerto' && <StationBiohuerto onComplete={handleStationComplete} />}
          {station.id === 'residuos' && <StationResiduos onComplete={handleStationComplete} />}
          {station.id === 'pregunta' && <StationPregunta onComplete={handleStationComplete} />}
        </motion.div>
      </div>
    </div>
  )
}
