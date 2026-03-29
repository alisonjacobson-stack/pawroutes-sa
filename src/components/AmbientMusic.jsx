import React, { useState, useRef, useCallback, useEffect } from 'react'

/**
 * Ambient African-inspired generative music for PawRoutes SA.
 * Uses Web Audio API — no external files, zero copyright issues.
 * Creates a warm, organic soundscape with:
 * - Soft kalimba-like melodic notes (pentatonic scale)
 * - Gentle djembe-style rhythm
 * - Warm pad drone
 * - Nature sounds (wind, birds simulated with oscillators)
 */

// African pentatonic scale frequencies (C major pentatonic, octave spread)
const PENTATONIC = [261.6, 293.7, 329.6, 392.0, 440.0, 523.3, 587.3, 659.3]
const BASS_NOTES = [130.8, 146.8, 164.8, 196.0]

function createAudioEngine() {
  const ctx = new (window.AudioContext || window.webkitAudioContext)()
  const master = ctx.createGain()
  master.gain.value = 0.35
  master.connect(ctx.destination)

  // Reverb via convolver (simple impulse)
  const convolver = ctx.createConvolver()
  const reverbTime = 2
  const sampleRate = ctx.sampleRate
  const length = sampleRate * reverbTime
  const impulse = ctx.createBuffer(2, length, sampleRate)
  for (let ch = 0; ch < 2; ch++) {
    const data = impulse.getChannelData(ch)
    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 1.5)
    }
  }
  convolver.buffer = impulse

  const reverbGain = ctx.createGain()
  reverbGain.gain.value = 0.3
  convolver.connect(reverbGain)
  reverbGain.connect(master)

  const dry = ctx.createGain()
  dry.gain.value = 0.7
  dry.connect(master)

  // --- Kalimba (thumb piano) ---
  function playKalimba() {
    const freq = PENTATONIC[Math.floor(Math.random() * PENTATONIC.length)]
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    const filter = ctx.createBiquadFilter()

    osc.type = 'sine'
    osc.frequency.value = freq

    // Add slight harmonics for metallic kalimba timbre
    const osc2 = ctx.createOscillator()
    osc2.type = 'triangle'
    osc2.frequency.value = freq * 3.01 // slightly detuned 3rd harmonic
    const gain2 = ctx.createGain()
    gain2.gain.value = 0.08

    filter.type = 'bandpass'
    filter.frequency.value = freq * 2
    filter.Q.value = 5

    const vol = 0.12 + Math.random() * 0.08
    gain.gain.setValueAtTime(vol, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.8)

    gain2.gain.setValueAtTime(0.08, ctx.currentTime)
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8)

    osc.connect(filter)
    filter.connect(gain)
    osc2.connect(gain2)
    gain2.connect(gain)
    gain.connect(dry)
    gain.connect(convolver)

    osc.start(ctx.currentTime)
    osc2.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 2)
    osc2.stop(ctx.currentTime + 1)
  }

  // --- Soft djembe (filtered noise burst) ---
  function playDjembe(accent = false) {
    const bufferSize = ctx.sampleRate * 0.15
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 3)
    }

    const source = ctx.createBufferSource()
    source.buffer = buffer

    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = accent ? 400 : 250
    filter.Q.value = 1

    const gain = ctx.createGain()
    gain.gain.value = accent ? 0.15 : 0.08

    source.connect(filter)
    filter.connect(gain)
    gain.connect(dry)

    source.start(ctx.currentTime)
  }

  // --- Warm pad drone ---
  let padOscs = []
  function startPad() {
    const baseFreq = 130.8 // C3
    const freqs = [baseFreq, baseFreq * 1.5, baseFreq * 2, baseFreq * 2.5]
    const padGain = ctx.createGain()
    padGain.gain.value = 0

    freqs.forEach(f => {
      const osc = ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.value = f
      // Slight LFO for warmth
      const lfo = ctx.createOscillator()
      lfo.type = 'sine'
      lfo.frequency.value = 0.3 + Math.random() * 0.4
      const lfoGain = ctx.createGain()
      lfoGain.gain.value = 1.5
      lfo.connect(lfoGain)
      lfoGain.connect(osc.frequency)
      lfo.start()

      const oscGain = ctx.createGain()
      oscGain.gain.value = 0.03
      osc.connect(oscGain)
      oscGain.connect(padGain)
      osc.start()
      padOscs.push({ osc, lfo, oscGain })
    })

    padGain.connect(dry)
    padGain.connect(convolver)

    // Fade in
    padGain.gain.setValueAtTime(0, ctx.currentTime)
    padGain.gain.linearRampToValueAtTime(1, ctx.currentTime + 3)

    return padGain
  }

  // --- Bird chirps (high frequency blips) ---
  function playBird() {
    const freq = 1800 + Math.random() * 1200
    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(freq, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(freq * 0.7, ctx.currentTime + 0.1)

    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.03, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15)

    osc.connect(gain)
    gain.connect(dry)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.2)
  }

  // --- Scheduling ---
  let intervals = []
  let padGainNode = null
  let running = false

  function start() {
    if (running) return
    if (ctx.state === 'suspended') ctx.resume()
    running = true

    padGainNode = startPad()

    // Kalimba: random notes every 1.5-4 seconds
    intervals.push(setInterval(() => {
      if (Math.random() < 0.7) playKalimba()
    }, 1800))

    // Second kalimba voice (slower, higher octave)
    intervals.push(setInterval(() => {
      if (Math.random() < 0.4) playKalimba()
    }, 3200))

    // Djembe rhythm: steady pulse
    intervals.push(setInterval(() => {
      playDjembe(false)
    }, 1200))

    // Djembe accent
    intervals.push(setInterval(() => {
      playDjembe(true)
    }, 2400))

    // Bird chirps: occasional
    intervals.push(setInterval(() => {
      if (Math.random() < 0.3) playBird()
    }, 4000))

    // Bass note change
    intervals.push(setInterval(() => {
      if (padOscs.length > 0) {
        const newBase = BASS_NOTES[Math.floor(Math.random() * BASS_NOTES.length)]
        padOscs[0].osc.frequency.linearRampToValueAtTime(newBase, ctx.currentTime + 2)
        padOscs[1].osc.frequency.linearRampToValueAtTime(newBase * 1.5, ctx.currentTime + 2)
      }
    }, 8000))
  }

  function stop() {
    running = false
    intervals.forEach(clearInterval)
    intervals = []
    if (padGainNode) {
      padGainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 1)
    }
    padOscs.forEach(({ osc, lfo }) => {
      try { osc.stop(ctx.currentTime + 1.5) } catch {}
      try { lfo.stop(ctx.currentTime + 1.5) } catch {}
    })
    padOscs = []
  }

  function setVolume(v) {
    master.gain.linearRampToValueAtTime(v, ctx.currentTime + 0.3)
  }

  return { start, stop, setVolume, ctx }
}

export default function AmbientMusic({ dark }) {
  const [playing, setPlaying] = useState(false)
  const [volume, setVolume] = useState(0.35)
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

  // Cleanup on unmount
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
      background: dark ? 'rgba(26,22,18,0.92)' : 'rgba(255,253,245,0.95)',
      borderRadius: 'var(--radius-full)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
      backdropFilter: 'blur(12px)',
      border: `1px solid ${dark ? 'var(--border-dark)' : 'rgba(0,0,0,0.08)'}`,
      transition: 'all 0.3s var(--ease-out)',
    }}>
      {/* Play/Mute button */}
      <button
        onClick={toggle}
        title={playing ? 'Sound off' : 'Play ambient music'}
        style={{
          width: 36, height: 36, borderRadius: '50%',
          background: playing ? 'var(--terracotta)' : (dark ? 'var(--card-dark)' : 'var(--sand-light)'),
          color: playing ? '#FFF' : 'inherit',
          border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18,
          transition: 'all 0.2s var(--ease-bounce)',
          boxShadow: playing ? '0 2px 8px rgba(196,97,59,0.3)' : 'none',
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        {playing ? '🔊' : '🔇'}
      </button>

      {/* Volume slider — only shown when playing */}
      {playing && (
        <>
          <input
            type="range" min="0" max="0.6" step="0.01"
            value={volume}
            onChange={handleVolume}
            title={`Volume: ${Math.round(volume / 0.6 * 100)}%`}
            style={{
              width: 70, height: 4,
              appearance: 'none', WebkitAppearance: 'none',
              background: `linear-gradient(to right, var(--terracotta) ${volume/0.6*100}%, ${dark ? 'var(--border-dark)' : '#ddd'} ${volume/0.6*100}%)`,
              borderRadius: 2, outline: 'none', cursor: 'pointer',
            }}
          />
          <span style={{
            fontSize: 10, fontWeight: 600,
            color: dark ? 'var(--text-secondary-dark)' : 'var(--text-muted)',
            minWidth: 18, textAlign: 'center',
          }}>
            {Math.round(volume / 0.6 * 100)}%
          </span>
        </>
      )}

      {/* Label */}
      {!playing && (
        <span style={{
          fontSize: 11, fontWeight: 500,
          color: dark ? 'var(--text-secondary-dark)' : 'var(--text-muted)',
        }}>
          Music
        </span>
      )}
    </div>
  )
}
