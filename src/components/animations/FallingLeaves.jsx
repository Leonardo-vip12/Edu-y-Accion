import { useMemo } from 'react'
import { motion } from 'framer-motion'

const leafColors = ['bg-green-light', 'bg-green-leaf', 'bg-green-moss', 'bg-green-deep/60', 'bg-green-pale']
const leafSizes = ['w-3 h-3', 'w-4 h-4', 'w-5 h-5', 'w-3.5 h-3.5', 'w-6 h-6']

function getRandomItems(arr, count) {
  return Array.from({ length: count }, () => arr[Math.floor(Math.random() * arr.length)])
}

export default function FallingLeaves({ count = 6 }) {
  const leaves = useMemo(() => {
    const colors = getRandomItems(leafColors, count)
    const sizes = getRandomItems(leafSizes, count)
    const leftPositions = Array.from({ length: count }, () => Math.random() * 100)
    const delays = Array.from({ length: count }, () => Math.random() * 8)
    const durations = Array.from({ length: count }, () => 8 + Math.random() * 12)
    const rotations = Array.from({ length: count }, () => Math.random() * 360)
    const xDrifts = Array.from({ length: count }, () => Math.random() > 0.5 ? 40 : -40)

    return colors.map((color, i) => ({
      color,
      size: sizes[i],
      left: leftPositions[i],
      delay: delays[i],
      duration: durations[i],
      rotation: rotations[i],
      xDrift: xDrifts[i],
    }))
  }, [count])

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {leaves.map((leaf, i) => (
        <motion.div
          key={i}
          className={`absolute top-0 rounded-bl-full rounded-tr-full ${leaf.color} ${leaf.size}`}
          style={{ left: `${leaf.left}%` }}
          animate={{
            y: ['-5vh', '105vh'],
            x: [0, leaf.xDrift],
            rotate: [leaf.rotation, leaf.rotation + 180],
            opacity: [0, 0.7, 0.5, 0],
          }}
          transition={{
            duration: leaf.duration,
            delay: leaf.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  )
}
