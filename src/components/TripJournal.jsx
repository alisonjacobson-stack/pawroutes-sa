import React, { useState, useEffect, useRef } from 'react'

const STORAGE_KEY = 'pawroutes-journal'

const PET_EMOJI = {
  dog: '\u{1F9AE}', 'dog-small': '\u{1F436}', 'dog-medium': '\u{1F9AE}', 'dog-large': '\u{1F9AE}',
  cat: '\u{1F431}', bird: '\u{1F99C}', rabbit: '\u{1F430}',
}

function petEmoji(type) {
  return PET_EMOJI[type] || '\u{1F43E}'
}

function StarRating({ value, onChange, readOnly = false, size = 22 }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1, 2, 3, 4, 5].map(star => (
        <span
          key={star}
          onClick={() => !readOnly && onChange?.(star)}
          style={{
            fontSize: size, cursor: readOnly ? 'default' : 'pointer',
            color: star <= value ? '#F5A623' : '#D1C7B7',
            transition: 'color 0.15s',
          }}
        >
          {'\u2605'}
        </span>
      ))}
    </div>
  )
}

// Scrapbook photo rotations for visual variety
const PHOTO_ROTATIONS = ['-2deg', '1.5deg', '-1deg', '2.5deg']
const TAPE_POSITIONS = ['left', 'right', 'center', 'left']

function ScrapbookPhoto({ src, idx, dark }) {
  const rotation = PHOTO_ROTATIONS[idx % PHOTO_ROTATIONS.length]
  const tapePos = TAPE_POSITIONS[idx % TAPE_POSITIONS.length]

  const tapeStyle = {
    position: 'absolute', top: -6, zIndex: 2,
    width: 40, height: 14,
    background: 'rgba(200, 180, 140, 0.7)',
    borderRadius: 2,
    ...(tapePos === 'left' ? { left: 10 } : tapePos === 'right' ? { right: 10 } : { left: '50%', transform: 'translateX(-50%)' }),
  }

  return (
    <div style={{
      position: 'relative',
      transform: `rotate(${rotation})`,
      transition: 'transform 0.2s',
      flexShrink: 0,
    }}>
      {/* Tape decoration */}
      <div style={tapeStyle} />
      <div style={{
        width: 100, height: 100,
        borderRadius: 4,
        overflow: 'hidden',
        border: '3px solid #fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        background: dark ? 'var(--card-dark)' : '#f5f0e8',
      }}>
        <img
          src={src}
          alt={`Trip photo ${idx + 1}`}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      </div>
    </div>
  )
}

export default function TripJournal({ routes = [], completedRoutes = [], pets = [], dark, open, onClose }) {
  const [entries, setEntries] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [formRoute, setFormRoute] = useState('')
  const [formMemory, setFormMemory] = useState('')
  const [formPhotos, setFormPhotos] = useState([])
  const [formFavStop, setFormFavStop] = useState('')
  const [formRating, setFormRating] = useState(0)
  const [formDate, setFormDate] = useState(new Date().toISOString().slice(0, 10))
  const [storageWarning, setStorageWarning] = useState(false)
  const fileRef = useRef(null)

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
      setEntries(stored)
    } catch { setEntries([]) }
  }, [open])

  if (!open) return null

  const saveEntries = (updated) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      setStorageWarning(false)
    } catch (e) {
      if (e.name === 'QuotaExceededError' || e.code === 22) {
        setStorageWarning(true)
      }
    }
    setEntries(updated)
  }

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return
    const remaining = 4 - formPhotos.length
    const toProcess = files.slice(0, remaining)

    toProcess.forEach(file => {
      const reader = new FileReader()
      reader.onload = (ev) => {
        setFormPhotos(prev => {
          if (prev.length >= 4) return prev
          return [...prev, ev.target.result]
        })
      }
      reader.readAsDataURL(file)
    })
    // Reset file input
    if (fileRef.current) fileRef.current.value = ''
  }

  const removePhoto = (idx) => {
    setFormPhotos(prev => prev.filter((_, i) => i !== idx))
  }

  const submitEntry = () => {
    if (!formRoute) return
    const route = routes.find(r => r.id === formRoute)
    const entry = {
      id: Date.now().toString(),
      routeId: formRoute,
      routeName: route?.name || formRoute,
      date: formDate,
      memory: formMemory.trim(),
      photos: formPhotos,
      favouriteStop: formFavStop.trim(),
      rating: formRating,
      petNames: pets.map(p => p.name),
      createdAt: new Date().toISOString(),
    }
    const updated = [entry, ...entries]
    saveEntries(updated)
    // Reset form
    setFormRoute('')
    setFormMemory('')
    setFormPhotos([])
    setFormFavStop('')
    setFormRating(0)
    setFormDate(new Date().toISOString().slice(0, 10))
    setShowForm(false)
  }

  const deleteEntry = (id) => {
    const updated = entries.filter(e => e.id !== id)
    saveEntries(updated)
  }

  const shareEntry = (entry) => {
    const petList = (entry.petNames || []).join(' & ')
    let text = `\u{1F43E} Trip Memory: ${entry.routeName}\n`
    text += `\u{1F4C5} ${new Date(entry.date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })}\n`
    if (petList) text += `\u{1F9AE} Travelling with ${petList}\n`
    if (entry.rating > 0) text += `${'$\u2B50'.repeat(entry.rating)} ${entry.rating}/5\n`
    if (entry.memory) text += `\n"${entry.memory}"\n`
    if (entry.favouriteStop) text += `\n\u2764\uFE0F Favourite stop: ${entry.favouriteStop}\n`
    text += `\n\u2B50 Remembered with PawRoutes SA \u{1F1FF}\u{1F1E6}`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
  }

  // Available routes for the form — either completed routes or all routes
  const availableRoutes = completedRoutes.length > 0
    ? routes.filter(r => completedRoutes.includes(r.id))
    : routes

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
          animation: 'slideInUp 0.3s ease-out',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '20px 24px 16px',
          borderBottom: `1px solid ${dark ? 'var(--border-dark)' : '#e0d5c5'}`,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 800, margin: 0, fontFamily: 'var(--font-display)' }}>
                {'\u{1F4D6}'} Trip Journal
              </h2>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
                Your pet travel scrapbook
              </div>
            </div>
            <button onClick={onClose} style={{
              background: 'none', border: 'none', fontSize: 22, cursor: 'pointer',
              color: 'var(--text-muted)', padding: '4px 8px', lineHeight: 1,
            }}>{'\u2715'}</button>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '16px 24px', overflowY: 'auto', flex: 1 }}>

          {/* Storage warning */}
          {storageWarning && (
            <div style={{
              padding: '10px 14px', marginBottom: 12, borderRadius: 'var(--radius-sm)',
              background: 'rgba(196, 91, 91, 0.1)', border: '1px solid rgba(196, 91, 91, 0.3)',
              fontSize: 12, color: '#C45B5B',
            }}>
              {'\u26A0\uFE0F'} Storage is nearly full. Photos are stored locally as base64 and take up significant space. Consider removing older entries to free up room.
            </div>
          )}

          {/* Add Entry button / form toggle */}
          {!showForm ? (
            <button onClick={() => setShowForm(true)} style={{
              width: '100%', padding: '12px 16px', fontSize: 14, fontWeight: 700,
              background: 'var(--terracotta)', color: '#fff', border: 'none',
              borderRadius: 'var(--radius-md)', cursor: 'pointer',
              fontFamily: 'var(--font-body)', marginBottom: 16,
              transition: 'all 0.15s',
            }}>
              + Add Journal Entry
            </button>
          ) : (
            /* Add Entry Form */
            <div style={{
              background: dark ? 'var(--card-dark)' : 'var(--sand-light)',
              borderRadius: 'var(--radius-md)',
              border: `1px solid ${dark ? 'var(--border-dark)' : '#e0d5c5'}`,
              padding: 16, marginBottom: 16,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>New Entry</div>
                <button onClick={() => setShowForm(false)} style={{
                  background: 'none', border: 'none', fontSize: 14, cursor: 'pointer',
                  color: 'var(--text-muted)', padding: '2px 6px',
                }}>{'\u2715'}</button>
              </div>

              {/* Route select */}
              <select
                value={formRoute}
                onChange={e => setFormRoute(e.target.value)}
                style={{
                  width: '100%', padding: '8px 12px', fontSize: 13,
                  background: dark ? 'var(--bg-dark)' : '#fff',
                  border: `1px solid ${dark ? 'var(--border-dark)' : '#e0d5c5'}`,
                  borderRadius: 'var(--radius-sm)', color: 'inherit',
                  fontFamily: 'var(--font-body)', marginBottom: 10,
                  boxSizing: 'border-box',
                }}
              >
                <option value="">Select route...</option>
                {availableRoutes.map(r => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>

              {/* Date */}
              <input
                type="date"
                value={formDate}
                onChange={e => setFormDate(e.target.value)}
                style={{
                  width: '100%', padding: '8px 12px', fontSize: 13,
                  background: dark ? 'var(--bg-dark)' : '#fff',
                  border: `1px solid ${dark ? 'var(--border-dark)' : '#e0d5c5'}`,
                  borderRadius: 'var(--radius-sm)', color: 'inherit',
                  fontFamily: 'var(--font-body)', marginBottom: 10,
                  boxSizing: 'border-box',
                }}
              />

              {/* Photos */}
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--text-muted)', marginBottom: 6 }}>
                  Photos ({formPhotos.length}/4)
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
                  {formPhotos.map((photo, idx) => (
                    <div key={idx} style={{ position: 'relative' }}>
                      <div style={{
                        width: 64, height: 64, borderRadius: 'var(--radius-sm)',
                        overflow: 'hidden', border: '2px solid #fff',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
                      }}>
                        <img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <button onClick={() => removePhoto(idx)} style={{
                        position: 'absolute', top: -6, right: -6, width: 18, height: 18,
                        borderRadius: '50%', background: '#C45B5B', color: '#fff',
                        border: 'none', fontSize: 10, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        lineHeight: 1,
                      }}>{'\u2715'}</button>
                    </div>
                  ))}
                  {formPhotos.length < 4 && (
                    <button onClick={() => fileRef.current?.click()} style={{
                      width: 64, height: 64, borderRadius: 'var(--radius-sm)',
                      border: `2px dashed ${dark ? 'var(--border-dark)' : '#d4c5b0'}`,
                      background: 'transparent', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 22, color: 'var(--text-muted)',
                    }}>+</button>
                  )}
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoUpload}
                  style={{ display: 'none' }}
                />
              </div>

              {/* Memory text */}
              <textarea
                value={formMemory}
                onChange={e => setFormMemory(e.target.value)}
                placeholder="Write a memory... (e.g. Bella loved the river at Parys!)"
                rows={3}
                style={{
                  width: '100%', padding: '10px 12px', fontSize: 13,
                  background: dark ? 'var(--bg-dark)' : '#fff',
                  border: `1px solid ${dark ? 'var(--border-dark)' : '#e0d5c5'}`,
                  borderRadius: 'var(--radius-sm)', color: 'inherit',
                  fontFamily: 'var(--font-body)', resize: 'vertical', marginBottom: 10,
                  boxSizing: 'border-box',
                }}
              />

              {/* Favourite stop */}
              <input
                type="text"
                value={formFavStop}
                onChange={e => setFormFavStop(e.target.value)}
                placeholder="Favourite stop on this trip"
                style={{
                  width: '100%', padding: '8px 12px', fontSize: 13,
                  background: dark ? 'var(--bg-dark)' : '#fff',
                  border: `1px solid ${dark ? 'var(--border-dark)' : '#e0d5c5'}`,
                  borderRadius: 'var(--radius-sm)', color: 'inherit',
                  fontFamily: 'var(--font-body)', marginBottom: 10,
                  boxSizing: 'border-box',
                }}
              />

              {/* Rating */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>Rating:</span>
                <StarRating value={formRating} onChange={setFormRating} />
              </div>

              {/* Submit */}
              <button
                onClick={submitEntry}
                disabled={!formRoute}
                style={{
                  width: '100%', padding: '10px 16px', fontSize: 14, fontWeight: 700,
                  background: formRoute ? 'var(--forest)' : (dark ? 'var(--border-dark)' : '#d4c5b0'),
                  color: formRoute ? '#fff' : 'var(--text-muted)',
                  border: 'none', borderRadius: 'var(--radius-md)',
                  cursor: formRoute ? 'pointer' : 'default',
                  fontFamily: 'var(--font-body)', transition: 'all 0.15s',
                }}
              >
                {'\u{1F4BE}'} Save Entry
              </button>
            </div>
          )}

          {/* Empty state */}
          {entries.length === 0 && !showForm && (
            <div style={{
              textAlign: 'center', padding: '32px 16px',
              color: 'var(--text-muted)',
            }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>{'\u{1F4D6}'}</div>
              <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 6, color: dark ? '#fff' : '#333' }}>
                Complete your first route to start your journal!
              </div>
              <div style={{ fontSize: 13 }}>
                Your adventures deserve to be remembered.
              </div>
            </div>
          )}

          {/* Timeline of entries */}
          {entries.length > 0 && (
            <div>
              <div style={{
                fontSize: 11, fontWeight: 600, textTransform: 'uppercase',
                letterSpacing: 1, color: 'var(--text-muted)', marginBottom: 12,
              }}>
                Your Adventures ({entries.length})
              </div>

              {entries.map(entry => (
                <div key={entry.id} style={{
                  background: dark ? 'var(--card-dark)' : '#fff',
                  borderRadius: 'var(--radius-md)',
                  border: `1px solid ${dark ? 'var(--border-dark)' : '#e0d5c5'}`,
                  padding: 16, marginBottom: 14,
                  position: 'relative',
                }}>
                  {/* Route badge */}
                  <div style={{
                    display: 'inline-block', padding: '3px 10px',
                    background: dark ? 'rgba(196,91,59,0.15)' : 'rgba(196,91,59,0.1)',
                    color: 'var(--terracotta)', fontSize: 11, fontWeight: 700,
                    borderRadius: 'var(--radius-full)', marginBottom: 10,
                  }}>
                    {'\u{1F697}'} {entry.routeName}
                  </div>

                  {/* Date */}
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10 }}>
                    {'\u{1F4C5}'} {new Date(entry.date).toLocaleDateString('en-ZA', {
                      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
                    })}
                  </div>

                  {/* Photos in scrapbook style */}
                  {entry.photos && entry.photos.length > 0 && (
                    <div style={{
                      display: 'flex', gap: 10, marginBottom: 12,
                      padding: '10px 6px',
                      justifyContent: 'center', flexWrap: 'wrap',
                    }}>
                      {entry.photos.map((photo, idx) => (
                        <ScrapbookPhoto key={idx} src={photo} idx={idx} dark={dark} />
                      ))}
                    </div>
                  )}

                  {/* Memory text */}
                  {entry.memory && (
                    <div style={{
                      fontSize: 14, lineHeight: 1.5, marginBottom: 10,
                      fontStyle: 'italic', color: dark ? '#e0d5c5' : '#5a4a3a',
                      padding: '8px 12px',
                      borderLeft: `3px solid var(--terracotta)`,
                      background: dark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                      borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
                    }}>
                      "{entry.memory}"
                    </div>
                  )}

                  {/* Favourite stop */}
                  {entry.favouriteStop && (
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 }}>
                      {'\u2764\uFE0F'} Favourite stop: <strong>{entry.favouriteStop}</strong>
                    </div>
                  )}

                  {/* Rating */}
                  {entry.rating > 0 && (
                    <div style={{ marginBottom: 10 }}>
                      <StarRating value={entry.rating} readOnly size={16} />
                    </div>
                  )}

                  {/* Pet names */}
                  {entry.petNames && entry.petNames.length > 0 && (
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 10 }}>
                      {'\u{1F43E}'} With {entry.petNames.join(', ')}
                    </div>
                  )}

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => shareEntry(entry)} style={{
                      padding: '6px 12px', fontSize: 11, fontWeight: 600,
                      background: '#25D366', color: '#fff', border: 'none',
                      borderRadius: 'var(--radius-full)', cursor: 'pointer',
                      fontFamily: 'var(--font-body)',
                    }}>
                      {'\u{1F4AC}'} Share
                    </button>
                    <button onClick={() => deleteEntry(entry.id)} style={{
                      padding: '6px 12px', fontSize: 11, fontWeight: 600,
                      background: 'transparent', color: 'var(--text-muted)',
                      border: `1px solid ${dark ? 'var(--border-dark)' : '#e0d5c5'}`,
                      borderRadius: 'var(--radius-full)', cursor: 'pointer',
                      fontFamily: 'var(--font-body)',
                    }}>
                      {'\u{1F5D1}\uFE0F'} Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
