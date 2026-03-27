import React, { useState } from 'react'

export default function ListVenueCTA({ onClick, dark, variant = 'primary' }) {
  const [hovered, setHovered] = useState(false)

  if (variant === 'inline') {
    return (
      <span
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          fontSize: 12, cursor: 'pointer',
          color: hovered ? 'var(--terracotta)' : (dark ? 'var(--sand)' : 'var(--forest)'),
          textDecoration: hovered ? 'underline' : 'none',
          transition: 'color 0.15s',
          fontFamily: 'inherit',
        }}
      >
        Own a pet-friendly venue? List it here →
      </span>
    )
  }

  if (variant === 'secondary') {
    return (
      <div style={{
        background: dark ? 'var(--card-dark)' : 'var(--sand-light)',
        border: `1px solid ${dark ? 'var(--border-dark)' : 'var(--border, #e0d5c5)'}`,
        borderRadius: 'var(--radius-md)',
        padding: '16px 18px',
        display: 'flex', alignItems: 'center', gap: 14,
      }}>
        <div style={{
          width: 42, height: 42, borderRadius: 'var(--radius-sm)',
          background: dark ? 'rgba(196,120,80,0.12)' : 'rgba(196,120,80,0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 20, flexShrink: 0,
        }}>
          🏠
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 13, fontWeight: 700,
            color: dark ? 'var(--sand)' : 'var(--forest)',
            marginBottom: 2,
          }}>
            Know a pet-friendly spot?
          </div>
          <div style={{
            fontSize: 11, color: dark ? 'var(--sand)' : 'var(--forest)',
            opacity: 0.65, marginBottom: 10,
          }}>
            Help fellow pet owners by adding your venue
          </div>
          <button
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
              padding: '7px 16px', fontSize: 12, fontWeight: 600,
              background: hovered ? 'var(--terracotta)' : (dark ? 'var(--card-dark)' : '#FFF'),
              color: hovered ? '#FFF' : 'var(--terracotta)',
              border: '1.5px solid var(--terracotta)',
              borderRadius: 'var(--radius-full)',
              cursor: 'pointer', fontFamily: 'inherit',
              transition: 'all 0.15s',
            }}
          >
            + Add Venue
          </button>
        </div>
      </div>
    )
  }

  // variant === 'primary'
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '9px 20px',
        fontSize: 13,
        fontWeight: 700,
        fontFamily: 'var(--font-display, inherit)',
        color: '#FFF',
        background: 'linear-gradient(135deg, var(--terracotta), #D4845A)',
        border: 'none',
        borderRadius: 'var(--radius-full)',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        boxShadow: hovered
          ? '0 4px 18px rgba(196,120,80,0.45)'
          : '0 2px 10px rgba(196,120,80,0.25)',
        transform: hovered ? 'scale(1.04)' : 'scale(1)',
        transition: 'all 0.2s ease',
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{ fontSize: 14 }}>🏠</span>
      List Your Venue
      <span style={{
        fontSize: 15, fontWeight: 400, opacity: 0.8,
        marginLeft: 2,
      }}>+</span>
    </button>
  )
}
