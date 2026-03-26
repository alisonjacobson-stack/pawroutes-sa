import React, { useState } from 'react'
import { PACK_LIST } from '../data/packList'
import { getMultiPetPackExtras } from './MyPackPanel'

export default function PackListModal({ open, onClose, dark, pets = [] }) {
  const [duration, setDuration] = useState('weekend')
  const [petType, setPetType] = useState('dog-medium')
  const [season, setSeason] = useState('summer')
  const [checked, setChecked] = useState({})

  if (!open) return null

  const toggle = (key) => setChecked(prev => ({ ...prev, [key]: !prev[key] }))

  const hasCat = pets.some(p => p.type === 'cat')
  const multiPetExtras = pets.length >= 2 ? getMultiPetPackExtras(pets) : []

  // Multiply essentials by pet count when multi-pet
  const essentials = pets.length >= 2
    ? PACK_LIST.essentials.map(item => ({
        ...item,
        item: item.multiply !== false
          ? `${item.item} (×${pets.length})`
          : item.item,
      }))
    : PACK_LIST.essentials

  const sections = [
    { key: 'essentials', title: pets.length >= 2 ? `Essentials (×${pets.length} pets)` : 'Essentials', items: essentials },
    { key: 'comfort', title: 'Comfort', items: PACK_LIST.comfort },
    { key: 'health', title: 'Health & Safety', items: PACK_LIST.health },
    ...(season === 'summer' ? [{ key: 'summer', title: 'Summer Extras', items: PACK_LIST.summer }] : []),
    ...(season === 'winter' ? [{ key: 'winter', title: 'Winter Extras', items: PACK_LIST.winter }] : []),
    ...(petType === 'cat' || hasCat ? [{ key: 'cat', title: 'Cat-Specific', items: PACK_LIST.cat }] : []),
    ...(multiPetExtras.length > 0 ? [{ key: 'multi-pet', title: `🐾 Multi-Pet Pack (${pets.length} pets)`, items: multiPetExtras }] : []),
  ]

  const totalItems = sections.reduce((acc, s) => acc + s.items.length, 0)
  const checkedCount = Object.values(checked).filter(Boolean).length

  const chipStyle = (active) => ({
    padding: '6px 14px', fontSize: 12, fontWeight: active ? 600 : 400,
    background: active ? 'var(--terracotta)' : (dark ? 'var(--card-dark)' : 'var(--sand-light)'),
    color: active ? '#FFF' : 'inherit',
    border: `1px solid ${active ? 'transparent' : dark ? 'var(--border-dark)' : 'var(--border)'}`,
    borderRadius: 'var(--radius-full)', cursor: 'pointer', fontFamily: 'inherit',
    transition: 'all 0.15s',
  })

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
          animation: 'slideInUp 0.3s var(--ease-out)',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '20px 24px 16px', borderBottom: `1px solid ${dark ? 'var(--border-dark)' : 'var(--border)'}`,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>
                🎒 Pack List
              </h2>
              {pets.length >= 2 && (
                <div style={{ fontSize: 12, color: 'var(--terracotta)', fontWeight: 600, marginTop: 2 }}>
                  Packing for {pets.map(p => p.name).join(', ')}
                </div>
              )}
            </div>
            <button onClick={onClose} style={{
              width: 32, height: 32, borderRadius: 'var(--radius-full)',
              background: dark ? 'var(--card-dark)' : 'var(--sand)',
              border: 'none', cursor: 'pointer', fontSize: 16,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'inherit',
            }}>✕</button>
          </div>

          {/* Filters */}
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: 6 }}>Trip Duration</div>
            <div style={{ display: 'flex', gap: 6 }}>
              {[['day', 'Day Trip'], ['weekend', 'Weekend'], ['week', 'Week+']].map(([k, l]) => (
                <button key={k} onClick={() => setDuration(k)} style={chipStyle(duration === k)}>{l}</button>
              ))}
            </div>
          </div>
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: 6 }}>Pet Type</div>
            <div style={{ display: 'flex', gap: 6 }}>
              {[['dog-small', '🐕 Small Dog'], ['dog-medium', '🦮 Medium Dog'], ['dog-large', '🐕‍🦺 Large Dog'], ['cat', '🐱 Cat']].map(([k, l]) => (
                <button key={k} onClick={() => setPetType(k)} style={chipStyle(petType === k)}>{l}</button>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: 6 }}>Season</div>
            <div style={{ display: 'flex', gap: 6 }}>
              {[['summer', '☀️ Summer'], ['winter', '❄️ Winter'], ['spring', '🌸 Spring/Autumn']].map(([k, l]) => (
                <button key={k} onClick={() => setSeason(k)} style={chipStyle(season === k)}>{l}</button>
              ))}
            </div>
          </div>

          {/* Progress */}
          <div style={{ marginTop: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
              <span style={{ color: 'var(--text-muted)' }}>Packed</span>
              <span style={{ fontWeight: 600, color: 'var(--forest)' }}>{checkedCount}/{totalItems}</span>
            </div>
            <div style={{
              height: 6, borderRadius: 'var(--radius-full)',
              background: dark ? 'var(--card-dark)' : 'var(--sand)',
              overflow: 'hidden',
            }}>
              <div style={{
                height: '100%', borderRadius: 'var(--radius-full)',
                background: checkedCount === totalItems ? 'var(--forest)' : 'var(--terracotta)',
                width: `${(checkedCount / totalItems) * 100}%`,
                transition: 'width 0.3s var(--ease-out)',
              }} />
            </div>
          </div>
        </div>

        {/* Checklist */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px 24px' }}>
          {sections.map(section => (
            <div key={section.key} style={{ marginBottom: 20 }}>
              <h3 style={{
                fontSize: 14, fontWeight: 700, marginBottom: 10,
                textTransform: 'uppercase', letterSpacing: '0.04em',
                color: 'var(--terracotta)',
              }}>{section.title}</h3>
              {section.items.map(item => {
                const key = `${section.key}-${item.item}`
                const isChecked = checked[key]
                return (
                  <label key={key} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '8px 0', cursor: 'pointer',
                    borderBottom: `1px solid ${dark ? 'var(--border-dark)' : 'rgba(0,0,0,0.04)'}`,
                    opacity: isChecked ? 0.5 : 1,
                    transition: 'opacity 0.15s',
                  }}>
                    <div
                      onClick={() => toggle(key)}
                      style={{
                        width: 22, height: 22, borderRadius: 'var(--radius-sm)',
                        border: `2px solid ${isChecked ? 'var(--forest)' : dark ? 'var(--border-dark)' : 'var(--border)'}`,
                        background: isChecked ? 'var(--forest)' : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0, cursor: 'pointer', transition: 'all 0.15s',
                      }}
                    >
                      {isChecked && <span style={{ color: '#FFF', fontSize: 12, fontWeight: 700 }}>✓</span>}
                    </div>
                    <span style={{ fontSize: 15 }}>{item.emoji}</span>
                    <span style={{
                      fontSize: 14, textDecoration: isChecked ? 'line-through' : 'none',
                    }}>{item.item}</span>
                  </label>
                )
              })}
            </div>
          ))}

          {checkedCount === totalItems && totalItems > 0 && (
            <div style={{
              textAlign: 'center', padding: 20,
              fontFamily: 'var(--font-display)', fontSize: 24,
              color: 'var(--forest)',
            }}>
              🎉 All packed! Have an amazing trip! 🐾
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
