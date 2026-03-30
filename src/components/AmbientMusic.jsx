import React, { useState, useRef, useCallback, useEffect } from 'react'

/**
 * Upbeat African-inspired generative music for PawRoutes SA.
 * Web Audio API — no external files, zero copyright.
 * Feel-good road trip energy: bouncy marimba melody,
 * driving djembe rhythm, funky bass, and bright shakers.
 * Think Hakuna Matata meets a Joburg taxi ride.
 */

// Major pentatonic in C — happy, bright, no sad notes
const MELODY = [523.3, 587.3, 659.3, 784.0, 880.0, 1047, 1175] // C5-D6
const BASS = [130.8, 164.8, 196.0, 220.0] // C3 E3 G3 A3
const CHORD_PROG = [
  [261.6, 329.6, 392.0], // C major
  [220.0, 277.2, 329.6], // A minor (relative)
  [349.2, 440.0, 523.3], // F major
  [392.0, 493.9, 587.3], // G major (dominant)
]

function createAudioEngine() {
  const ctx = new (window.AudioContext || window.webkitAudioContext)()
  const master = ctx.createGain()
  master.gain.value = 0.3
  master.connect(ctx.destination)

  // Compressor for punchiness
  const compressor = ctx.createDynamicsCompressor()
  compressor.threshold.value = -18
  compressor.ratio.value = 4
  compressor.connect(master)

  // Short reverb
  const convolver = ctx.createConvolver()
  const len = ctx.sampleRate * 0.8
  const impulse = ctx.createBuffer(2, len, ctx.sampleRate)
  for (let ch = 0; ch < 2; ch++) {
    const d = impulse.getChannelData(ch)
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.5)
  }
  convolver.buffer = impulse
  const reverbSend = ctx.createGain()
  reverbSend.gain.value = 0.2
  convolver.connect(reverbSend)
  reverbSend.connect(compressor)

  const dry = ctx.createGain()
  dry.gain.value = 0.8
  dry.connect(compressor)

  // --- Marimba (bright, percussive, happy) ---
  function playMarimba(freq, time = 0, vel = 0.15) {
    const t = ctx.currentTime + time
    // Fundamental
    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.value = freq
    // 4th harmonic (marimba character)
    const osc2 = ctx.createOscillator()
    osc2.type = 'sine'
    osc2.frequency.value = freq * 4.01
    const g2 = ctx.createGain()
    g2.gain.setValueAtTime(vel * 0.3, t)
    g2.gain.exponentialRampToValueAtTime(0.001, t + 0.15)
    osc2.connect(g2)

    const gain = ctx.createGain()
    gain.gain.setValueAtTime(vel, t)
    gain.gain.exponentialRampToValueAtTime(vel * 0.3, t + 0.08)
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6)

    osc.connect(gain)
    g2.connect(gain)
    gain.connect(dry)
    gain.connect(convolver)
    osc.start(t)
    osc2.start(t)
    osc.stop(t + 0.7)
    osc2.stop(t + 0.2)
  }

  // --- Funky bass (bouncy, syncopated) ---
  function playBass(freq, time = 0) {
    const t = ctx.currentTime + time
    const osc = ctx.createOscillator()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(freq, t)
    osc.frequency.exponentialRampToValueAtTime(freq * 0.98, t + 0.2)

    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.18, t)
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35)

    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 300

    osc.connect(filter)
    filter.connect(gain)
    gain.connect(dry)
    osc.start(t)
    osc.stop(t + 0.4)
  }

  // --- Djembe (punchy, driving) ---
  function playDjembe(type = 'bass', time = 0) {
    const t = ctx.currentTime + time
    const len = type === 'slap' ? 0.06 : 0.12
    const buf = ctx.createBuffer(1, ctx.sampleRate * len, ctx.sampleRate)
    const d = buf.getChannelData(0)
    for (let i = 0; i < d.length; i++) {
      d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, type === 'slap' ? 6 : 3)
    }
    const src = ctx.createBufferSource()
    src.buffer = buf

    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.value = type === 'slap' ? 800 : type === 'tone' ? 350 : 180
    filter.Q.value = type === 'slap' ? 2 : 1

    const gain = ctx.createGain()
    gain.gain.value = type === 'slap' ? 0.12 : type === 'tone' ? 0.1 : 0.15

    src.connect(filter)
    filter.connect(gain)
    gain.connect(dry)
    src.start(t)
  }

  // --- Shaker (bright, driving 16ths) ---
  function playShaker(time = 0, accent = false) {
    const t = ctx.currentTime + time
    const len = 0.03
    const buf = ctx.createBuffer(1, ctx.sampleRate * len, ctx.sampleRate)
    const d = buf.getChannelData(0)
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 4)
    const src = ctx.createBufferSource()
    src.buffer = buf

    const hp = ctx.createBiquadFilter()
    hp.type = 'highpass'
    hp.frequency.value = 6000

    const gain = ctx.createGain()
    gain.gain.value = accent ? 0.06 : 0.03

    src.connect(hp)
    hp.connect(gain)
    gain.connect(dry)
    src.start(t)
  }

  // --- Chord stab (warm, rhythmic) ---
  function playChord(freqs, time = 0) {
    const t = ctx.currentTime + time
    freqs.forEach(f => {
      const osc = ctx.createOscillator()
      osc.type = 'triangle'
      osc.frequency.value = f
      const gain = ctx.createGain()
      gain.gain.setValueAtTime(0.04, t)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4)
      osc.connect(gain)
      gain.connect(dry)
      gain.connect(convolver)
      osc.start(t)
      osc.stop(t + 0.5)
    })
  }

  // --- Pattern sequencer ---
  let running = false
  let timerId = null
  let beat = 0
  let chordIdx = 0
  const BPM = 116 // upbeat, feel-good tempo
  const beatTime = 60 / BPM / 4 // 16th note

  function tick() {
    if (!running) return
    const b = beat % 16 // 16 steps per bar

    // Shaker on every 16th (accent on 1, 5, 9, 13)
    playShaker(0, b % 4 === 0)

    // Djembe pattern: classic 4/4 with syncopation
    if (b === 0) playDjembe('bass')
    if (b === 4) playDjembe('tone')
    if (b === 6) playDjembe('slap')
    if (b === 8) playDjembe('bass')
    if (b === 10) playDjembe('tone')
    if (b === 13) playDjembe('slap')

    // Bass on 1 and syncopated hits
    if (b === 0) playBass(BASS[chordIdx % BASS.length])
    if (b === 6) playBass(BASS[(chordIdx + 1) % BASS.length])
    if (b === 12) playBass(BASS[chordIdx % BASS.length] * 1.5)

    // Marimba melody — bouncy pattern, different each bar
    if (b === 0) playMarimba(MELODY[Math.floor(Math.random() * 4)], 0, 0.18)
    if (b === 3) playMarimba(MELODY[Math.floor(Math.random() * 5)], 0, 0.12)
    if (b === 4) playMarimba(MELODY[Math.floor(Math.random() * 5) + 1], 0, 0.15)
    if (b === 7) playMarimba(MELODY[Math.floor(Math.random() * 4) + 2], 0, 0.1)
    if (b === 8) playMarimba(MELODY[Math.floor(Math.random() * 3) + 3], 0, 0.16)
    if (b === 11) playMarimba(MELODY[Math.floor(Math.random() * 5)], 0, 0.13)
    if (b === 14) playMarimba(MELODY[Math.floor(Math.random() * 4) + 1], 0, 0.1)

    // Second marimba voice — higher, call-and-response
    if (b === 2 && Math.random() > 0.3) playMarimba(MELODY[4 + Math.floor(Math.random() * 3)], 0, 0.08)
    if (b === 10 && Math.random() > 0.4) playMarimba(MELODY[5 + Math.floor(Math.random() * 2)], 0, 0.07)

    // Chord stab on beat 1 of every 2nd bar
    if (b === 0 && beat % 32 === 0) {
      playChord(CHORD_PROG[chordIdx % CHORD_PROG.length])
      chordIdx++
    }

    beat++
    timerId = setTimeout(tick, beatTime * 1000)
  }

  function start() {
    if (running) return
    if (ctx.state === 'suspended') ctx.resume()
    running = true
    beat = 0
    chordIdx = 0
    tick()
  }

  function stop() {
    running = false
    if (timerId) clearTimeout(timerId)
    timerId = null
  }

  function setVolume(v) {
    master.gain.linearRampToValueAtTime(v, ctx.currentTime + 0.3)
  }

  return { start, stop, setVolume, ctx }
}

export default function AmbientMusic({ dark }) {
  const [playing, setPlaying] = useState(false)
  const [volume, setVolume] = useState(0.3)
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
      position: 'fixed', bottom: 16, right: 16, zIndex: 200,
      display: 'flex', alignItems: 'center', gap: 8,
      padding: playing ? '8px 14px' : '8px 12px',
      background: dark ? 'rgba(20,18,16,0.94)' : 'rgba(253,250,243,0.96)',
      borderRadius: 'var(--radius-full)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
      backdropFilter: 'blur(12px)',
      border: `1px solid ${dark ? 'var(--border-dark)' : 'rgba(0,0,0,0.06)'}`,
      transition: 'all 0.3s var(--ease-out)',
    }}>
      <button
        onClick={toggle}
        title={playing ? 'Sound off' : 'Play road trip vibes'}
        style={{
          width: 36, height: 36, borderRadius: '50%',
          background: playing ? 'var(--terracotta)' : (dark ? 'var(--card-dark)' : 'var(--sand-light)'),
          color: playing ? '#FFF' : 'inherit',
          border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18,
          transition: 'all 0.2s var(--ease-out)',
          boxShadow: playing ? '0 2px 8px rgba(191,91,58,0.3)' : 'none',
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        {playing ? '🔊' : '🔇'}
      </button>

      {playing && (
        <>
          <input
            type="range" min="0" max="0.5" step="0.01"
            value={volume}
            onChange={handleVolume}
            title={`Volume: ${Math.round(volume / 0.5 * 100)}%`}
            style={{
              width: 70, height: 3,
              appearance: 'none', WebkitAppearance: 'none',
              background: `linear-gradient(to right, var(--terracotta) ${volume/0.5*100}%, ${dark ? 'var(--border-dark)' : '#ddd'} ${volume/0.5*100}%)`,
              borderRadius: 2, outline: 'none', cursor: 'pointer',
            }}
          />
          <span style={{
            fontSize: 10, fontWeight: 600,
            color: dark ? 'var(--text-secondary-dark)' : 'var(--text-muted)',
            minWidth: 18, textAlign: 'center',
          }}>
            {Math.round(volume / 0.5 * 100)}%
          </span>
        </>
      )}

      {!playing && (
        <span style={{
          fontSize: 11, fontWeight: 500,
          color: dark ? 'var(--text-secondary-dark)' : 'var(--text-muted)',
          letterSpacing: '0.02em',
        }}>
          Vibes
        </span>
      )}
    </div>
  )
}
