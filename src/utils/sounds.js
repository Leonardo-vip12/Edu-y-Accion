const AudioCtx = window.AudioContext || window.webkitAudioContext
let ctx = null

function getCtx() {
  if (!ctx) ctx = new AudioCtx()
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

function playNote(freq, duration, type = 'sine', startTime = 0, volume = 0.15) {
  try {
    const c = getCtx()
    const o = c.createOscillator()
    const g = c.createGain()
    o.connect(g)
    g.connect(c.destination)
    o.type = type
    o.frequency.value = freq
    const t = c.currentTime + startTime
    g.gain.setValueAtTime(volume, t)
    g.gain.exponentialRampToValueAtTime(0.001, t + duration)
    o.start(t)
    o.stop(t + duration)
  } catch {}
}

export function playCollect() {
  playNote(523, 0.1, 'sine', 0, 0.12)
  playNote(659, 0.1, 'sine', 0.06, 0.12)
  playNote(784, 0.15, 'sine', 0.12, 0.12)
}

export function playHit() {
  const c = getCtx()
  if (!c) return
  try {
    const o = c.createOscillator()
    const g = c.createGain()
    o.connect(g)
    g.connect(c.destination)
    o.type = 'sawtooth'
    o.frequency.setValueAtTime(150, c.currentTime)
    o.frequency.exponentialRampToValueAtTime(60, c.currentTime + 0.3)
    g.gain.setValueAtTime(0.15, c.currentTime)
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.3)
    o.start(c.currentTime)
    o.stop(c.currentTime + 0.3)
  } catch {}
}

export function playLose() {
  playNote(392, 0.3, 'sine', 0, 0.12)
  playNote(349, 0.3, 'sine', 0.2, 0.12)
  playNote(330, 0.3, 'sine', 0.4, 0.12)
  playNote(262, 0.5, 'sine', 0.6, 0.12)
}

export function playVictory() {
  playNote(523, 0.15, 'sine', 0, 0.15)
  playNote(659, 0.15, 'sine', 0.12, 0.15)
  playNote(784, 0.15, 'sine', 0.24, 0.15)
  playNote(1047, 0.4, 'sine', 0.36, 0.2)
}

export function playStar() {
  playNote(880, 0.1, 'triangle', 0, 0.1)
  playNote(1100, 0.15, 'triangle', 0.08, 0.1)
}

export function playStationComplete() {
  playNote(660, 0.12, 'triangle', 0, 0.12)
  playNote(880, 0.12, 'triangle', 0.1, 0.12)
  playNote(1100, 0.2, 'triangle', 0.2, 0.12)
}

export function playTick() {
  playNote(1000, 0.05, 'sine', 0, 0.06)
}

export function playError() {
  playNote(200, 0.2, 'square', 0, 0.08)
}

export function playClick() {
  playNote(800, 0.05, 'sine', 0, 0.08)
}

export function playConfetti() {
  for (let i = 0; i < 5; i++) {
    playNote(600 + Math.random() * 400, 0.1, 'sine', i * 0.08, 0.08)
  }
}
