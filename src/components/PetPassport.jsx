import React, { useState } from 'react'

const PET_EMOJI = {
  dog: '🐕',
  cat: '🐈',
  rabbit: '🐇',
  bird: '🐦',
  other: '🐾',
}

const VACCINE_LABELS = {
  rabies: 'Rabies Certificate',
  kennelCough: 'Kennel Cough (Bordetella)',
  deworming: 'Deworming',
}

// Validity periods in days
const VACCINE_VALIDITY = {
  rabies: 365,       // Annual
  kennelCough: 365,  // Annual
  deworming: 90,     // Every 3 months
}

function getExpiryStatus(dateStr, validityDays) {
  if (!dateStr) return 'missing'
  const vaccDate = new Date(dateStr)
  const expiry = new Date(vaccDate.getTime() + validityDays * 86400000)
  const now = new Date()
  const daysLeft = Math.floor((expiry - now) / 86400000)
  if (daysLeft < 0) return 'expired'
  if (daysLeft <= 30) return 'warning'
  return 'valid'
}

function StatusDot({ status }) {
  const colors = {
    valid: '#4A7C59',
    warning: '#D4920A',
    expired: '#C45B5B',
    missing: '#999',
  }
  const labels = {
    valid: 'Valid',
    warning: 'Expires soon',
    expired: 'Expired',
    missing: 'Not recorded',
  }
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 600 }}>
      <span style={{
        width: 8, height: 8, borderRadius: 'var(--radius-full)',
        background: colors[status],
        display: 'inline-block',
        boxShadow: status === 'expired' ? '0 0 6px rgba(196,91,91,0.5)' : 'none',
      }} />
      <span style={{ color: colors[status] }}>{labels[status]}</span>
    </span>
  )
}

function PassportCard({ pet, healthData, onUpdate, dark, printMode }) {
  const bg = dark ? 'var(--card-dark)' : 'white'
  const borderColor = dark ? 'var(--border-dark)' : 'rgba(0,0,0,0.08)'
  const textColor = dark ? '#E8DFD4' : '#2C2418'
  const mutedColor = dark ? 'var(--text-muted)' : 'var(--text-secondary)'
  const inputBg = dark ? 'var(--bg-dark)' : 'var(--cream)'
  const emoji = PET_EMOJI[pet.type] || PET_EMOJI.other
  const data = healthData || {}

  const inputStyle = {
    width: '100%',
    padding: '7px 10px',
    border: `1px solid ${borderColor}`,
    borderRadius: 'var(--radius-sm)',
    background: printMode ? 'transparent' : inputBg,
    color: textColor,
    fontSize: 13,
    outline: 'none',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
  }

  const labelStyle = {
    fontSize: 11,
    fontWeight: 600,
    color: mutedColor,
    display: 'block',
    marginBottom: 3,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  }

  const handleField = (field, value) => {
    onUpdate({ ...data, [field]: value })
  }

  const handleVaccine = (vaccine, date) => {
    onUpdate({
      ...data,
      vaccines: { ...(data.vaccines || {}), [vaccine]: date },
    })
  }

  return (
    <div style={{
      background: bg,
      borderRadius: 'var(--radius-lg)',
      border: `2px solid ${borderColor}`,
      overflow: 'hidden',
      marginBottom: 16,
    }}>
      {/* Passport header band */}
      <div style={{
        background: 'var(--forest)',
        padding: '14px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
      }}>
        <div style={{
          width: 48, height: 48,
          borderRadius: 'var(--radius-full)',
          background: 'rgba(255,255,255,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 26,
          border: '2px solid rgba(255,255,255,0.25)',
        }}>
          {emoji}
        </div>
        <div>
          <div style={{
            fontSize: 18, fontWeight: 700, color: 'white',
            fontFamily: 'var(--font-display)',
          }}>
            {pet.name}
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', textTransform: 'capitalize' }}>
            {pet.type || 'Pet'} &middot; Pet Health Passport
          </div>
        </div>
      </div>

      <div style={{ padding: 18 }}>
        {/* Basic info row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          <div>
            <label style={labelStyle}>Microchip Number</label>
            {printMode ? (
              <div style={{ fontSize: 13, color: textColor, padding: '7px 0' }}>{data.microchip || '—'}</div>
            ) : (
              <input
                type="text"
                value={data.microchip || ''}
                onChange={e => handleField('microchip', e.target.value)}
                placeholder="e.g. 900 123 456 789 012"
                style={inputStyle}
              />
            )}
          </div>
          <div>
            <label style={labelStyle}>Vet Name</label>
            {printMode ? (
              <div style={{ fontSize: 13, color: textColor, padding: '7px 0' }}>{data.vetName || '—'}</div>
            ) : (
              <input
                type="text"
                value={data.vetName || ''}
                onChange={e => handleField('vetName', e.target.value)}
                placeholder="e.g. Dr. van der Merwe"
                style={inputStyle}
              />
            )}
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Vet Phone</label>
          {printMode ? (
            <div style={{ fontSize: 13, color: textColor, padding: '7px 0' }}>{data.vetPhone || '—'}</div>
          ) : (
            <input
              type="tel"
              value={data.vetPhone || ''}
              onChange={e => handleField('vetPhone', e.target.value)}
              placeholder="e.g. 011 234 5678"
              style={{ ...inputStyle, maxWidth: 220 }}
            />
          )}
        </div>

        {/* Vaccination records */}
        <div style={{ marginBottom: 16 }}>
          <div style={{
            fontSize: 13, fontWeight: 700, color: textColor, marginBottom: 10,
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <span>💉</span> Vaccination Records
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {Object.entries(VACCINE_LABELS).map(([key, label]) => {
              const dateVal = data.vaccines?.[key] || ''
              const status = getExpiryStatus(dateVal, VACCINE_VALIDITY[key])
              return (
                <div key={key} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '8px 12px',
                  background: dark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                  borderRadius: 'var(--radius-sm)',
                  border: `1px solid ${
                    status === 'expired' ? 'rgba(196,91,91,0.3)' :
                    status === 'warning' ? 'rgba(212,146,10,0.3)' :
                    borderColor
                  }`,
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: textColor }}>
                      {label}
                      {key === 'rabies' && (
                        <span style={{ fontSize: 10, color: 'var(--terracotta)', marginLeft: 6, fontWeight: 700 }}>
                          REQUIRED
                        </span>
                      )}
                    </div>
                    <StatusDot status={status} />
                  </div>
                  <div>
                    {printMode ? (
                      <div style={{ fontSize: 13, color: textColor }}>{dateVal || '—'}</div>
                    ) : (
                      <input
                        type="date"
                        value={dateVal}
                        onChange={e => handleVaccine(key, e.target.value)}
                        style={{
                          ...inputStyle,
                          width: 150,
                          cursor: 'pointer',
                        }}
                      />
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Allergies & Notes */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label style={labelStyle}>Allergies</label>
            {printMode ? (
              <div style={{ fontSize: 13, color: textColor, padding: '7px 0' }}>{data.allergies || 'None recorded'}</div>
            ) : (
              <input
                type="text"
                value={data.allergies || ''}
                onChange={e => handleField('allergies', e.target.value)}
                placeholder="e.g. Chicken, grass"
                style={inputStyle}
              />
            )}
          </div>
          <div>
            <label style={labelStyle}>Special Notes</label>
            {printMode ? (
              <div style={{ fontSize: 13, color: textColor, padding: '7px 0' }}>{data.notes || 'None'}</div>
            ) : (
              <input
                type="text"
                value={data.notes || ''}
                onChange={e => handleField('notes', e.target.value)}
                placeholder="e.g. Anxious in cars, needs meds"
                style={inputStyle}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PetPassport({ pets = [], onUpdatePets, dark, open, onClose }) {
  const [healthData, setHealthData] = useState({})
  const [printMode, setPrintMode] = useState(false)

  if (!open) return null

  const handleUpdateHealth = (petId, data) => {
    setHealthData(prev => ({ ...prev, [petId]: data }))
  }

  const overlayBg = dark ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.45)'
  const modalBg = dark ? 'var(--bg-dark)' : 'var(--sand-light)'
  const textColor = dark ? '#E8DFD4' : '#2C2418'
  const mutedColor = dark ? 'var(--text-muted)' : 'var(--text-secondary)'

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: overlayBg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backdropFilter: 'blur(4px)',
      }}
    >
      <div style={{
        background: modalBg,
        borderRadius: 'var(--radius-lg)',
        width: '100%',
        maxWidth: 560,
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      }}>
        {/* Modal header */}
        <div style={{
          padding: '18px 20px',
          borderBottom: `1px solid ${dark ? 'var(--border-dark)' : 'rgba(0,0,0,0.08)'}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          background: modalBg,
          zIndex: 1,
        }}>
          <div>
            <h2 style={{
              margin: 0, fontSize: 20, fontWeight: 700,
              fontFamily: 'var(--font-display)',
              color: textColor,
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <span>🛂</span> Pet Health Passport
            </h2>
            <div style={{ fontSize: 12, color: mutedColor, marginTop: 2 }}>
              Keep vaccination records handy for reserves and accommodation
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => setPrintMode(!printMode)}
              style={{
                padding: '6px 14px',
                background: printMode ? 'var(--forest)' : 'transparent',
                color: printMode ? 'white' : mutedColor,
                border: `1px solid ${printMode ? 'var(--forest)' : (dark ? 'var(--border-dark)' : 'rgba(0,0,0,0.15)')}`,
                borderRadius: 'var(--radius-full)',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {printMode ? 'Edit Mode' : '🖨️ Print View'}
            </button>
            <button
              onClick={onClose}
              style={{
                width: 32, height: 32,
                background: 'transparent',
                border: 'none',
                fontSize: 18,
                color: mutedColor,
                cursor: 'pointer',
                borderRadius: 'var(--radius-full)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Pet passport cards */}
        <div style={{ padding: 20 }}>
          {pets.length === 0 && (
            <div style={{
              textAlign: 'center', padding: '40px 20px',
              color: mutedColor, fontSize: 14,
            }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🐾</div>
              <div>Add pets to your pack first, then their health records will appear here.</div>
            </div>
          )}

          {pets.map(pet => (
            <PassportCard
              key={pet.id}
              pet={pet}
              healthData={healthData[pet.id]}
              onUpdate={data => handleUpdateHealth(pet.id, data)}
              dark={dark}
              printMode={printMode}
            />
          ))}

          {/* SA-specific tip */}
          {pets.length > 0 && (
            <div style={{
              padding: '12px 16px',
              background: dark ? 'rgba(196,97,59,0.1)' : 'rgba(196,97,59,0.06)',
              borderRadius: 'var(--radius-md)',
              border: `1px solid ${dark ? 'rgba(196,97,59,0.2)' : 'rgba(196,97,59,0.15)'}`,
              display: 'flex',
              gap: 10,
              alignItems: 'flex-start',
            }}>
              <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>💡</span>
              <div style={{ fontSize: 12.5, lineHeight: 1.5, color: textColor }}>
                <strong>SA Travel Tip:</strong> Always carry physical copies of vaccination records when travelling with pets.
                Many game reserves, nature reserves, and pet-friendly accommodation in South Africa require a
                valid <strong>rabies certificate</strong> (issued within 12 months). Some KZN and Mpumalanga reserves
                also require proof of tick & flea treatment.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
