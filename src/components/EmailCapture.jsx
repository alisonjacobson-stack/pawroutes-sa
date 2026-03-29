import React, { useState } from 'react'

const SUBS_KEY = 'pawroutes-subscribers'

export default function EmailCapture({ dark }) {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(() => {
    try {
      const subs = JSON.parse(localStorage.getItem(SUBS_KEY) || '[]')
      return subs.length > 0
    } catch { return false }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return

    try {
      const subs = JSON.parse(localStorage.getItem(SUBS_KEY) || '[]')
      if (!subs.includes(email.trim().toLowerCase())) {
        subs.push(email.trim().toLowerCase())
        localStorage.setItem(SUBS_KEY, JSON.stringify(subs))
      }
    } catch { /* ignore */ }

    setSubscribed(true)
  }

  if (subscribed) {
    return (
      <div style={{
        padding: '16px 20px', margin: '12px 0',
        background: dark ? 'rgba(59,107,74,0.12)' : 'rgba(59,107,74,0.06)',
        borderRadius: 'var(--radius-md)',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 20, marginBottom: 4 }}>🎉</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--forest)' }}>
          You're in!
        </div>
        <div style={{ fontSize: 11, color: dark ? 'var(--text-secondary-dark)' : 'var(--text-muted)', marginTop: 2 }}>
          We'll let you know when new routes drop.
        </div>
      </div>
    )
  }

  return (
    <div style={{
      padding: '16px 20px', margin: '12px 0',
      background: dark ? 'var(--card-dark)' : 'var(--sand-light)',
      borderRadius: 'var(--radius-md)',
      border: `1px solid ${dark ? 'var(--border-dark)' : 'var(--border)'}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
        <span style={{ fontSize: 16 }}>🐾</span>
        <span style={{ fontSize: 13, fontWeight: 700 }}>New routes coming soon!</span>
      </div>
      <div style={{
        fontSize: 11, color: dark ? 'var(--text-secondary-dark)' : 'var(--text-muted)',
        lineHeight: 1.5, marginBottom: 10,
      }}>
        Cape Town → Cederberg, Durban → Wild Coast, and more. Get notified.
      </div>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 6 }}>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="your@email.com"
          style={{
            flex: 1, padding: '8px 12px', fontSize: 13,
            background: dark ? 'var(--bg-dark)' : '#FFF',
            border: `1px solid ${dark ? 'var(--border-dark)' : 'var(--border)'}`,
            borderRadius: 'var(--radius-sm)', fontFamily: 'inherit',
            color: 'inherit', outline: 'none', minWidth: 0,
          }}
        />
        <button type="submit" style={{
          padding: '8px 14px', fontSize: 12, fontWeight: 700,
          background: 'var(--terracotta)', color: '#FFF',
          border: 'none', borderRadius: 'var(--radius-sm)',
          cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap',
          transition: 'transform 0.15s',
        }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          Notify me
        </button>
      </form>
    </div>
  )
}
