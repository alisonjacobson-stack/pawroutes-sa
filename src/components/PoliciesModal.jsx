import React, { useState } from 'react'
import { POLICIES } from '../data/policies'

export default function PoliciesModal({ open, onClose, dark }) {
  const [expanded, setExpanded] = useState(0) // first policy expanded by default

  if (!open) return null

  const toggle = (i) => setExpanded(prev => prev === i ? -1 : i)

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      animation: 'fadeIn 0.2s',
    }} onClick={onClose}>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '90%', maxWidth: 520, maxHeight: '85vh',
          background: dark ? 'var(--bg-dark)' : 'var(--cream)',
          borderRadius: 'var(--radius-lg)', overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          display: 'flex', flexDirection: 'column',
          animation: 'slideInUp 0.3s var(--ease-out, ease-out)',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '20px 24px 16px',
          borderBottom: `1px solid ${dark ? 'var(--border-dark)' : 'var(--border, #e0d5c5)'}`,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h2 style={{
                fontSize: 20, fontWeight: 800, margin: 0,
                fontFamily: 'var(--font-display, inherit)',
              }}>
                📋 PawRoutes Listing Policies
              </h2>
              <div style={{
                fontSize: 12, marginTop: 4,
                color: dark ? 'var(--sand)' : 'var(--forest)',
                opacity: 0.6,
              }}>
                Our standards for pet-friendly venues in South Africa
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                width: 30, height: 30, borderRadius: 'var(--radius-full)',
                background: dark ? 'var(--card-dark)' : 'var(--sand-light)',
                border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, color: dark ? 'var(--sand)' : 'var(--forest)',
                flexShrink: 0, marginLeft: 8,
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Policies list */}
        <div style={{
          flex: 1, overflowY: 'auto', padding: '8px 0',
        }}>
          {POLICIES.map((policy, i) => {
            const isOpen = expanded === i
            return (
              <div key={i} style={{
                borderBottom: i < POLICIES.length - 1
                  ? `1px solid ${dark ? 'var(--border-dark)' : 'var(--border, #e0d5c5)'}`
                  : 'none',
              }}>
                {/* Policy header */}
                <button
                  onClick={() => toggle(i)}
                  style={{
                    width: '100%', padding: '14px 24px',
                    display: 'flex', alignItems: 'center', gap: 10,
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontFamily: 'inherit', textAlign: 'left',
                    color: dark ? 'var(--sand)' : 'var(--forest)',
                  }}
                >
                  <span style={{ fontSize: 18, flexShrink: 0 }}>{policy.icon}</span>
                  <span style={{ flex: 1, fontSize: 14, fontWeight: 600 }}>
                    {policy.title}
                  </span>
                  <span style={{
                    fontSize: 12, transition: 'transform 0.2s',
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    opacity: 0.5,
                  }}>
                    ▼
                  </span>
                </button>

                {/* Policy content */}
                {isOpen && (
                  <div style={{
                    padding: '0 24px 16px 52px',
                    animation: 'fadeIn 0.15s',
                  }}>
                    {policy.paragraphs.map((p, j) => (
                      <p key={j} style={{
                        fontSize: 13, lineHeight: 1.6,
                        color: dark ? 'var(--sand)' : 'var(--forest)',
                        opacity: 0.75, margin: j === 0 ? 0 : '10px 0 0',
                      }}>
                        {p}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div style={{
          padding: '14px 24px',
          borderTop: `1px solid ${dark ? 'var(--border-dark)' : 'var(--border, #e0d5c5)'}`,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: 6,
        }}>
          <span style={{
            fontSize: 11, opacity: 0.5,
            color: dark ? 'var(--sand)' : 'var(--forest)',
          }}>
            Last updated: March 2026
          </span>
          <span style={{
            fontSize: 11, opacity: 0.5,
            color: dark ? 'var(--sand)' : 'var(--forest)',
          }}>
            Questions? Contact us at pawroutes@gmail.com
          </span>
        </div>
      </div>
    </div>
  )
}
