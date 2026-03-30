import React, { useState, useRef, useCallback, useEffect } from 'react'

/**
 * Disney-inspired orchestral generative music for PawRoutes SA.
 * Web Audio API — no files, zero copyright.
 * Rich layered composition: strings pad, flute melody, pizzicato,
 * warm French horn, harp arpeggios, light percussion.
 * Inspired by Up, Lion King, and Pixar scores.
 */

// D major scale — bright, cinematic, adventurous
const SCALE = {
  D4: 293.7, E4: 329.6, Fs4: 370.0, G4: 392.0, A4: 440.0, B4: 493.9,
  D5: 587.3, E5: 659.3, Fs5: 740.0, G5: 784.0, A5: 880.0, B5: 987.8,
  D6: 1175,
}

// Chord progressions — cinematic, uplifting
const PROGRESSIONS = [
  // I - V - vi - IV (classic uplift)
  [[293.7, 370.0, 440.0], [440.0, 554.4, 659.3], [493.9, 587.3, 740.0], [392.0, 493.9, 587.3]],
  // I - iii - IV - V (adventurous)
  [[293.7, 370.0, 440.0], [370.0, 440.0, 554.4], [392.0, 493.9, 587.3], [440.0, 554.4, 659.3]],
]

// Melody phrases — pre-composed motifs that sound composed, not random
const MELODIES = [
  // Soaring adventure theme
  [
    { note: 'D5', dur: 0.5 }, { note: 'E5', dur: 0.25 }, { note: 'Fs5', dur: 0.25 },
    { note: 'A5', dur: 1.0 }, { note: 'G5', dur: 0.5 }, { note: 'Fs5', dur: 0.5 },
    { note: 'E5', dur: 1.0 }, { note: null, dur: 1.0 },
  ],
  // Gentle wandering
  [
    { note: 'A5', dur: 0.75 }, { note: 'G5', dur: 0.25 }, { note: 'Fs5', dur: 0.5 },
    { note: 'D5', dur: 0.5 }, { note: 'E5', dur: 1.0 },
    { note: 'Fs5', dur: 0.5 }, { note: 'G5', dur: 0.5 }, { note: 'A5', dur: 1.0 },
    { note: null, dur: 0.5 },
  ],
  // Playful skip
  [
    { note: 'D5', dur: 0.25 }, { note: 'Fs5', dur: 0.25 }, { note: 'A5', dur: 0.5 },
    { note: 'B5', dur: 0.25 }, { note: 'A5', dur: 0.25 }, { note: 'G5', dur: 0.5 },
    { note: 'Fs5', dur: 0.5 }, { note: 'E5', dur: 0.5 }, { note: 'D5', dur: 1.0 },
    { note: null, dur: 0.5 },
  ],
  // Sweeping resolution
  [
    { note: 'Fs5', dur: 0.5 }, { note: 'G5', dur: 0.5 }, { note: 'A5', dur: 0.5 },
    { note: 'D6', dur: 1.5 }, { note: 'B5', dur: 0.5 },
    { note: 'A5', dur: 0.5 }, { note: 'G5', dur: 0.5 }, { note: 'Fs5', dur: 1.0 },
    { note: null, dur: 0.5 },
  ],
]

// Harp arpeggio patterns
const HARP_PATTERNS = [
  ['D4', 'Fs4', 'A4', 'D5', 'A4', 'Fs4'],
  ['G4', 'B4', 'D5', 'G5', 'D5', 'B4'],
  ['A4', 'D5', 'Fs5', 'A5', 'Fs5', 'D5'],
  ['E4', 'A4', 'B4', 'E5', 'B4', 'A4'],
]

function createAudioEngine() {
  const ctx = new (window.AudioContext || window.webkitAudioContext)()
  const master = ctx.createGain()
  master.gain.value = 0.25
  master.connect(ctx.destination)

  // Rich reverb
  const convolver = ctx.createConvolver()
  const revLen = ctx.sampleRate * 2.5
  const impulse = ctx.createBuffer(2, revLen, ctx.sampleRate)
  for (let ch = 0; ch < 2; ch++) {
    const d = impulse.getChannelData(ch)
    for (let i = 0; i < revLen; i++) {
      d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / revLen, 1.8) * 0.5
    }
  }
  convolver.buffer = impulse
  const reverbGain = ctx.createGain()
  reverbGain.gain.value = 0.35
  convolver.connect(reverbGain)
  reverbGain.connect(master)

  const dry = ctx.createGain()
  dry.gain.value = 0.65
  dry.connect(master)

  // === STRINGS PAD (warm, cinematic) ===
  let stringNodes = []
  function playStrings(freqs, duration = 4) {
    const t = ctx.currentTime
    const padGain = ctx.createGain()
    padGain.gain.setValueAtTime(0, t)
    padGain.gain.linearRampToValueAtTime(0.06, t + 0.8)
    padGain.gain.setValueAtTime(0.06, t + duration - 1)
    padGain.gain.linearRampToValueAtTime(0, t + duration)

    freqs.forEach(f => {
      // Layer saw + sine for warm string timbre
      const saw = ctx.createOscillator()
      saw.type = 'sawtooth'
      saw.frequency.value = f
      const sawGain = ctx.createGain()
      sawGain.gain.value = 0.012
      // Slight vibrato
      const vib = ctx.createOscillator()
      vib.frequency.value = 4.5 + Math.random() * 1
      const vibGain = ctx.createGain()
      vibGain.gain.value = 2
      vib.connect(vibGain)
      vibGain.connect(saw.frequency)
      vib.start(t)

      const lp = ctx.createBiquadFilter()
      lp.type = 'lowpass'
      lp.frequency.value = 2000
      lp.Q.value = 0.5

      saw.connect(sawGain)
      sawGain.connect(lp)

      const sin = ctx.createOscillator()
      sin.type = 'sine'
      sin.frequency.value = f
      const sinGain = ctx.createGain()
      sinGain.gain.value = 0.025
      sin.connect(sinGain)

      lp.connect(padGain)
      sinGain.connect(padGain)

      saw.start(t)
      sin.start(t)
      saw.stop(t + duration + 0.5)
      sin.stop(t + duration + 0.5)
      vib.stop(t + duration + 0.5)
      stringNodes.push(saw, sin, vib)
    })

    padGain.connect(dry)
    padGain.connect(convolver)
  }

  // === FLUTE MELODY (warm, singing) ===
  function playFlute(freq, duration, time = 0) {
    const t = ctx.currentTime + time
    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.value = freq

    // Breath noise
    const noise = ctx.createOscillator()
    noise.type = 'triangle'
    noise.frequency.value = freq * 2.01
    const noiseGain = ctx.createGain()
    noiseGain.gain.value = 0.008

    // Vibrato (slow, musical)
    const vib = ctx.createOscillator()
    vib.frequency.value = 5
    const vibGain = ctx.createGain()
    vibGain.gain.value = 3
    vib.connect(vibGain)
    vibGain.connect(osc.frequency)

    const gain = ctx.createGain()
    const attack = Math.min(0.12, duration * 0.15)
    gain.gain.setValueAtTime(0, t)
    gain.gain.linearRampToValueAtTime(0.09, t + attack)
    gain.gain.setValueAtTime(0.09, t + duration * 0.7)
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration)

    osc.connect(gain)
    noise.connect(noiseGain)
    noiseGain.connect(gain)
    gain.connect(dry)
    gain.connect(convolver)

    osc.start(t)
    noise.start(t)
    vib.start(t)
    osc.stop(t + duration + 0.1)
    noise.stop(t + duration + 0.1)
    vib.stop(t + duration + 0.1)
  }

  // === PIZZICATO (plucky strings, like Up theme) ===
  function playPizz(freq, time = 0) {
    const t = ctx.currentTime + time
    const osc = ctx.createOscillator()
    osc.type = 'triangle'
    osc.frequency.value = freq

    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.12, t)
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3)

    osc.connect(gain)
    gain.connect(dry)
    gain.connect(convolver)
    osc.start(t)
    osc.stop(t + 0.4)
  }

  // === HARP ARPEGGIO ===
  function playHarpArpeggio(pattern, time = 0) {
    pattern.forEach((noteName, i) => {
      const freq = SCALE[noteName]
      if (!freq) return
      const t = ctx.currentTime + time + i * 0.12
      const osc = ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.value = freq

      const h2 = ctx.createOscillator()
      h2.type = 'sine'
      h2.frequency.value = freq * 2
      const h2g = ctx.createGain()
      h2g.gain.value = 0.015

      const gain = ctx.createGain()
      gain.gain.setValueAtTime(0.06, t)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.8)

      osc.connect(gain)
      h2.connect(h2g)
      h2g.connect(gain)
      gain.connect(dry)
      gain.connect(convolver)
      osc.start(t)
      h2.start(t)
      osc.stop(t + 1)
      h2.stop(t + 0.5)
    })
  }

  // === WARM HORN (French horn swell) ===
  function playHorn(freq, duration, time = 0) {
    const t = ctx.currentTime + time
    const osc = ctx.createOscillator()
    osc.type = 'sawtooth'
    osc.frequency.value = freq

    const lp = ctx.createBiquadFilter()
    lp.type = 'lowpass'
    lp.frequency.setValueAtTime(400, t)
    lp.frequency.linearRampToValueAtTime(1200, t + duration * 0.4)
    lp.frequency.linearRampToValueAtTime(600, t + duration)

    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0, t)
    gain.gain.linearRampToValueAtTime(0.04, t + duration * 0.3)
    gain.gain.setValueAtTime(0.04, t + duration * 0.6)
    gain.gain.linearRampToValueAtTime(0, t + duration)

    osc.connect(lp)
    lp.connect(gain)
    gain.connect(dry)
    gain.connect(convolver)
    osc.start(t)
    osc.stop(t + duration + 0.2)
  }

  // === GENTLE PERCUSSION (triangle, soft) ===
  function playTriangleHit(time = 0) {
    const t = ctx.currentTime + time
    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.value = 4200
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.02, t)
    gain.gain.exponentialRampToValueAtTime(0.001, t + 1.5)
    osc.connect(gain)
    gain.connect(dry)
    gain.connect(convolver)
    osc.start(t)
    osc.stop(t + 1.6)
  }

  // === ORCHESTRAL SEQUENCER ===
  let running = false
  let timerId = null
  let bar = 0
  let progIdx = 0

  const BPM = 80 // cinematic, not rushed
  const barDuration = 60 / BPM * 4 // 4 beats per bar in seconds

  function playBar() {
    if (!running) return

    const prog = PROGRESSIONS[progIdx % PROGRESSIONS.length]
    const chordIdx = bar % 4
    const chord = prog[chordIdx]

    // Strings pad — every bar, crossfading
    playStrings(chord, barDuration + 0.5)

    // Melody — play a phrase every 2 bars
    if (bar % 2 === 0) {
      const phrase = MELODIES[Math.floor(Math.random() * MELODIES.length)]
      let offset = 0
      const beatDur = 60 / BPM
      phrase.forEach(({ note, dur }) => {
        if (note && SCALE[note]) {
          playFlute(SCALE[note], dur * beatDur * 0.9, offset)
        }
        offset += dur * beatDur
      })
    }

    // Pizzicato on beats 1 and 3
    playPizz(chord[0] / 2, 0) // bass pizz
    playPizz(chord[0] / 2, barDuration / 2) // beat 3

    // Harp arpeggio — every 4th bar
    if (bar % 4 === 0) {
      const pattern = HARP_PATTERNS[Math.floor(Math.random() * HARP_PATTERNS.length)]
      playHarpArpeggio(pattern, barDuration * 0.5)
    }

    // Horn swell — every 8 bars (the big moment)
    if (bar % 8 === 0 && bar > 0) {
      playHorn(chord[0] / 2, barDuration * 2, 0)
    }

    // Triangle on beat 1 of every other bar
    if (bar % 2 === 0) {
      playTriangleHit(0)
    }

    // Change progression every 16 bars
    if (bar % 16 === 15) {
      progIdx++
    }

    bar++
    timerId = setTimeout(playBar, barDuration * 1000)
  }

  function start() {
    if (running) return
    if (ctx.state === 'suspended') ctx.resume()
    running = true
    bar = 0
    progIdx = 0
    playBar()
  }

  function stop() {
    running = false
    if (timerId) clearTimeout(timerId)
  }

  function setVolume(v) {
    master.gain.linearRampToValueAtTime(v, ctx.currentTime + 0.5)
  }

  return { start, stop, setVolume, ctx }
}

export default function AmbientMusic({ dark }) {
  const [playing, setPlaying] = useState(false)
  const [volume, setVolume] = useState(0.25)
  const engineRef = useRef(null)

  const toggle = useCallback(() => {
    if (!engineRef.current) {
      engineRef.current = createAudioEngine()
    }
    if (playing) {
      engineRef.current.stop()
      setPlaying(false)
    } else {
      engineRef.current.start()
      setPlaying(true)
    }
  }, [playing])

  const handleVolume = useCallback((e) => {
    const v = parseFloat(e.target.value)
    setVolume(v)
    if (engineRef.current) engineRef.current.setVolume(v)
  }, [])

  useEffect(() => {
    return () => {
      if (engineRef.current) {
        engineRef.current.stop()
        try { engineRef.current.ctx.close() } catch {}
      }
    }
  }, [])

  return (
    <div style={{
      position: 'fixed', bottom: 16, left: 16, zIndex: 200,
      display: 'flex', alignItems: 'center', gap: 8,
      padding: playing ? '6px 12px' : '6px 10px',
      background: dark ? 'rgba(20,18,16,0.92)' : 'rgba(253,250,243,0.94)',
      borderRadius: 'var(--radius-full)',
      boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
      backdropFilter: 'blur(12px)',
      border: `1px solid ${dark ? 'var(--border-dark)' : 'rgba(0,0,0,0.05)'}`,
      transition: 'all 0.3s var(--ease-out)',
    }}>
      <button
        onClick={toggle}
        title={playing ? 'Sound off' : 'Play soundtrack'}
        style={{
          width: 32, height: 32, borderRadius: '50%',
          background: playing ? 'var(--terracotta)' : (dark ? 'var(--card-dark)' : 'var(--sand-light)'),
          color: playing ? '#FFF' : 'inherit',
          border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 15,
          transition: 'all 0.2s var(--ease-out)',
          boxShadow: playing ? '0 2px 6px rgba(191,91,58,0.25)' : 'none',
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.06)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        {playing ? '♪' : '♪'}
      </button>

      {playing && (
        <input
          type="range" min="0" max="0.5" step="0.01"
          value={volume}
          onChange={handleVolume}
          style={{
            width: 56, height: 3,
            appearance: 'none', WebkitAppearance: 'none',
            background: `linear-gradient(to right, var(--terracotta) ${volume/0.5*100}%, ${dark ? 'var(--border-dark)' : '#ddd'} ${volume/0.5*100}%)`,
            borderRadius: 2, outline: 'none', cursor: 'pointer',
          }}
        />
      )}

      {!playing && (
        <span style={{
          fontSize: 10, fontWeight: 500, letterSpacing: '0.03em',
          color: dark ? 'var(--text-secondary-dark)' : 'var(--text-muted)',
        }}>
          Soundtrack
        </span>
      )}
    </div>
  )
}
