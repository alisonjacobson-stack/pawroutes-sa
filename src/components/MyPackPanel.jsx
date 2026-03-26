import React, { useState } from 'react'

const PET_TYPES = [
  { key: 'dog-small', icon: '🐕', label: 'Small Dog', examples: 'Jack Russell, Dachshund, Yorkie', maxPerStop: 3 },
  { key: 'dog-medium', icon: '🦮', label: 'Medium Dog', examples: 'Border Collie, Boerboel, Ridgeback', maxPerStop: 2 },
  { key: 'dog-large', icon: '🐕‍🦺', label: 'Large Dog', examples: 'Great Dane, Boerboel, Rottweiler', maxPerStop: 1 },
  { key: 'cat', icon: '🐱', label: 'Cat', examples: 'Indoor, Outdoor, Kitten', maxPerStop: 2 },
  { key: 'bird', icon: '🦜', label: 'Bird', examples: 'Parrot, Budgie, Cockatiel', maxPerStop: 2 },
  { key: 'rabbit', icon: '🐇', label: 'Rabbit/Small', examples: 'Rabbit, Guinea Pig, Hamster', maxPerStop: 2 },
]

const SPECIAL_NEEDS = [
  { key: 'senior', icon: '👴', label: 'Senior pet', tip: 'More frequent rest stops needed' },
  { key: 'anxious', icon: '😰', label: 'Travel anxiety', tip: 'Avoid busy stops, prefer quiet routes' },
  { key: 'reactive', icon: '⚡', label: 'Reactive/leash-only', tip: 'Avoid off-leash dog parks' },
  { key: 'medical', icon: '💊', label: 'On medication', tip: 'Note vet stops along route' },
  { key: 'puppy', icon: '🍼', label: 'Puppy/kitten', tip: 'Shorter drive intervals, more breaks' },
  { key: 'carsick', icon: '🤢', label: 'Gets carsick', tip: 'Frequent stops, slower roads preferred' },
]

const VEHICLE_TYPES = [
  { key: 'sedan', icon: '🚗', label: 'Sedan', petCapacity: 2 },
  { key: 'suv', icon: '🚙', label: 'SUV / Bakkie', petCapacity: 3 },
  { key: 'van', icon: '🚐', label: 'Kombi / Van', petCapacity: 5 },
  { key: 'trailer', icon: '🏕️', label: 'With trailer/caravan', petCapacity: 6 },
]

let _nextId = 1

export function getPackAlerts(pets) {
  const alerts = []
  if (pets.length >= 2) {
    const hasCat = pets.some(p => p.type === 'cat')
    const hasDog = pets.some(p => p.type.startsWith('dog'))
    if (hasCat && hasDog) {
      alerts.push({ icon: '⚠️', text: 'Travelling with cats & dogs — keep separate in vehicle. Use crate or barrier.', severity: 'medium' })
    }
  }
  if (pets.length >= 3) {
    alerts.push({ icon: '🚗', text: `${pets.length} pets — consider an SUV or van for comfort. Ensure ventilation.`, severity: 'low' })
  }
  if (pets.some(p => p.needs.includes('senior')) && pets.some(p => p.needs.includes('puppy'))) {
    alerts.push({ icon: '💡', text: 'Senior + puppy combo — the puppy may stress the senior. Separate if possible.', severity: 'medium' })
  }
  if (pets.some(p => p.needs.includes('reactive'))) {
    alerts.push({ icon: '⚡', text: 'Reactive pet in pack — plan quiet rest stops, avoid peak hours at popular stops.', severity: 'medium' })
  }
  if (pets.some(p => p.needs.includes('carsick'))) {
    alerts.push({ icon: '🛑', text: 'Carsick pet — stop every 45-60min. Keep windows slightly open. No food 2hrs before.', severity: 'low' })
  }
  if (pets.filter(p => p.type === 'dog-large').length >= 2) {
    alerts.push({ icon: '🏋️', text: '2+ large dogs — check accommodation pet size limits. Some B&Bs limit to 1 large dog.', severity: 'medium' })
  }
  return alerts
}

export function getMultiPetStopScore(stop, pets) {
  if (!stop.petCapacity) return { fits: true, score: 1, note: null }
  const totalPets = pets.length
  const largeDogs = pets.filter(p => p.type === 'dog-large').length
  const cats = pets.filter(p => p.type === 'cat').length
  const cap = stop.petCapacity

  if (cap.maxPets && totalPets > cap.maxPets) {
    return { fits: false, score: 0, note: `Max ${cap.maxPets} pets allowed` }
  }
  if (cap.maxLargeDogs && largeDogs > cap.maxLargeDogs) {
    return { fits: false, score: 0, note: `Max ${cap.maxLargeDogs} large dog${cap.maxLargeDogs > 1 ? 's' : ''}` }
  }
  if (cap.noCats && cats > 0) {
    return { fits: false, score: 0, note: 'No cats allowed' }
  }
  return { fits: true, score: 1, note: null }
}

export function getRecommendedStopInterval(pets) {
  let interval = 180 // default 3 hours
  if (pets.some(p => p.needs.includes('senior'))) interval = Math.min(interval, 90)
  if (pets.some(p => p.needs.includes('puppy'))) interval = Math.min(interval, 60)
  if (pets.some(p => p.needs.includes('carsick'))) interval = Math.min(interval, 45)
  if (pets.some(p => p.type === 'cat')) interval = Math.min(interval, 120)
  if (pets.length >= 3) interval = Math.min(interval, 90)
  return interval
}

export function getMultiPetPackExtras(pets) {
  const extras = []
  if (pets.length >= 2) {
    extras.push({ emoji: '🚧', item: `Car barrier/divider for ${pets.length} pets`, category: 'multi-pet' })
    extras.push({ emoji: '🏷️', item: `${pets.length}x ID tags with your trip phone number`, category: 'multi-pet' })
    extras.push({ emoji: '📋', item: 'Pet register sheet (names, microchip #s, vet contact)', category: 'multi-pet' })
  }
  if (pets.length >= 3) {
    extras.push({ emoji: '💧', item: `${pets.length}x water bowls (one per pet to avoid fights)`, category: 'multi-pet' })
    extras.push({ emoji: '🍽️', item: `Separate feeding stations — ${pets.length} bowls, measured food portions`, category: 'multi-pet' })
  }

  const hasCat = pets.some(p => p.type === 'cat')
  const hasDog = pets.some(p => p.type.startsWith('dog'))
  if (hasCat && hasDog) {
    extras.push({ emoji: '📦', item: 'Cat carrier/crate — keep separate from dogs in vehicle', category: 'multi-pet' })
    extras.push({ emoji: '🧴', item: 'Feliway spray for cat carrier (calming)', category: 'multi-pet' })
  }
  if (pets.some(p => p.type === 'bird')) {
    extras.push({ emoji: '🪶', item: 'Bird travel cage with cover (dark = calm)', category: 'multi-pet' })
    extras.push({ emoji: '🌡️', item: 'Avoid aircon blowing directly on bird cage', category: 'multi-pet' })
  }
  if (pets.some(p => p.type === 'rabbit')) {
    extras.push({ emoji: '🥕', item: 'Hay & fresh greens for rabbit — travels better with nibbles', category: 'multi-pet' })
    extras.push({ emoji: '📦', item: 'Small pet carrier lined with towel (grip for rabbit)', category: 'multi-pet' })
  }

  const crates = pets.filter(p => p.needs.includes('anxious') || p.needs.includes('reactive')).length
  if (crates > 0) {
    extras.push({ emoji: '🏠', item: `${crates}x crate/carrier for anxious/reactive pet${crates > 1 ? 's' : ''}`, category: 'multi-pet' })
  }
  if (pets.some(p => p.needs.includes('medical'))) {
    extras.push({ emoji: '💊', item: 'Medication schedule printed — with vet emergency number', category: 'multi-pet' })
  }
  if (pets.some(p => p.needs.includes('senior'))) {
    extras.push({ emoji: '🛏️', item: 'Orthopaedic travel bed for senior pet', category: 'multi-pet' })
  }

  return extras
}

export default function MyPackPanel({ pets, onUpdatePets, dark, collapsed, onToggleCollapsed }) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [vehicle, setVehicle] = useState('suv')

  const addPet = (pet) => {
    onUpdatePets([...pets, { ...pet, id: _nextId++ }])
    setShowAddForm(false)
  }

  const removePet = (id) => {
    onUpdatePets(pets.filter(p => p.id !== id))
  }

  const updatePet = (id, changes) => {
    onUpdatePets(pets.map(p => p.id === id ? { ...p, ...changes } : p))
    setEditingId(null)
  }

  const alerts = getPackAlerts(pets)
  const stopInterval = getRecommendedStopInterval(pets)
  const vehicleInfo = VEHICLE_TYPES.find(v => v.key === vehicle)
  const overCapacity = vehicleInfo && pets.length > vehicleInfo.petCapacity

  return (
    <div style={{
      borderBottom: `1px solid ${dark ? 'var(--border-dark)' : 'var(--border)'}`,
      background: dark ? 'rgba(26,22,18,0.5)' : 'rgba(255,248,235,0.6)',
    }}>
      {/* Collapsible header */}
      <button
        onClick={onToggleCollapsed}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 16px', background: 'none', border: 'none', cursor: 'pointer',
          fontFamily: 'inherit', color: 'inherit',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 18 }}>🐾</span>
          <span style={{ fontWeight: 700, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            My Pack
          </span>
          {pets.length > 0 && (
            <span style={{
              fontSize: 11, fontWeight: 700, padding: '2px 8px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--terracotta)', color: '#FFF',
            }}>
              {pets.length} pet{pets.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        <span style={{ fontSize: 12, transition: 'transform 0.2s', transform: collapsed ? 'rotate(0deg)' : 'rotate(180deg)' }}>▼</span>
      </button>

      {/* Collapsed pet avatars */}
      {collapsed && pets.length > 0 && (
        <div style={{ display: 'flex', gap: 4, padding: '0 16px 10px', flexWrap: 'wrap' }}>
          {pets.map(p => {
            const typeInfo = PET_TYPES.find(t => t.key === p.type)
            return (
              <span key={p.id} title={p.name} style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                padding: p.photo ? '2px 8px 2px 2px' : '3px 8px', fontSize: 11, fontWeight: 500,
                background: dark ? 'var(--card-dark)' : '#FFF',
                border: `1px solid ${dark ? 'var(--border-dark)' : 'var(--border)'}`,
                borderRadius: 'var(--radius-full)',
              }}>
                {p.photo ? (
                  <img src={p.photo} alt={p.name} style={{
                    width: 20, height: 20, borderRadius: '50%', objectFit: 'cover',
                  }} />
                ) : typeInfo?.icon} {p.name}
              </span>
            )
          })}
        </div>
      )}

      {/* Expanded content */}
      {!collapsed && (
        <div style={{ padding: '0 16px 14px' }}>
          {/* Pet list */}
          {pets.length === 0 && !showAddForm && (
            <div style={{
              textAlign: 'center', padding: '16px 0',
              fontSize: 13, color: dark ? 'var(--text-secondary-dark)' : 'var(--text-muted)',
              lineHeight: 1.5,
            }}>
              <div style={{ fontSize: 32, marginBottom: 6 }}>🐶🐱🦜</div>
              Add your pets to get personalised route scoring, multi-pet pack lists, and stop compatibility checks.
            </div>
          )}

          {pets.map(pet => (
            <PetCard key={pet.id} pet={pet} dark={dark}
              editing={editingId === pet.id}
              onEdit={() => setEditingId(pet.id)}
              onSave={(changes) => updatePet(pet.id, changes)}
              onRemove={() => removePet(pet.id)}
              onCancel={() => setEditingId(null)}
            />
          ))}

          {/* Pack alerts */}
          {alerts.length > 0 && (
            <div style={{ marginTop: 10 }}>
              {alerts.map((a, i) => (
                <div key={i} style={{
                  display: 'flex', gap: 8, alignItems: 'flex-start',
                  padding: '8px 10px', marginBottom: 4,
                  background: a.severity === 'medium'
                    ? (dark ? 'rgba(196,97,59,0.12)' : 'rgba(196,97,59,0.08)')
                    : (dark ? 'rgba(59,107,74,0.12)' : 'rgba(59,107,74,0.06)'),
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 12, lineHeight: 1.4,
                }}>
                  <span style={{ flexShrink: 0 }}>{a.icon}</span>
                  <span>{a.text}</span>
                </div>
              ))}
            </div>
          )}

          {/* Stop interval recommendation */}
          {pets.length > 0 && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 10px', marginTop: 8,
              background: dark ? 'var(--card-dark)' : 'var(--sand-light)',
              borderRadius: 'var(--radius-sm)',
              fontSize: 12,
            }}>
              <span>⏱️</span>
              <span>
                <strong>Recommended stop interval:</strong> Every {stopInterval} min
                {stopInterval < 180 && <span style={{ color: 'var(--terracotta)', marginLeft: 4 }}>
                  (adjusted for your pack)
                </span>}
              </span>
            </div>
          )}

          {/* Vehicle picker */}
          {pets.length >= 2 && (
            <div style={{ marginTop: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: 6 }}>
                Your Vehicle
              </div>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {VEHICLE_TYPES.map(v => (
                  <button key={v.key} onClick={() => setVehicle(v.key)} style={{
                    padding: '5px 10px', fontSize: 11, fontWeight: vehicle === v.key ? 600 : 400,
                    background: vehicle === v.key ? 'var(--terracotta)' : (dark ? 'var(--card-dark)' : '#FFF'),
                    color: vehicle === v.key ? '#FFF' : 'inherit',
                    border: `1px solid ${vehicle === v.key ? 'transparent' : dark ? 'var(--border-dark)' : 'var(--border)'}`,
                    borderRadius: 'var(--radius-full)', cursor: 'pointer', fontFamily: 'inherit',
                  }}>
                    {v.icon} {v.label}
                  </button>
                ))}
              </div>
              {overCapacity && (
                <div style={{
                  marginTop: 6, padding: '6px 10px', fontSize: 11,
                  background: dark ? 'rgba(196,97,59,0.15)' : 'rgba(196,97,59,0.1)',
                  borderRadius: 'var(--radius-sm)', color: 'var(--terracotta)', fontWeight: 500,
                }}>
                  ⚠️ {pets.length} pets may be tight in a {vehicleInfo.label.toLowerCase()} (comfort capacity: {vehicleInfo.petCapacity})
                </div>
              )}
            </div>
          )}

          {/* Add button */}
          {showAddForm ? (
            <AddPetForm dark={dark} onAdd={addPet} onCancel={() => setShowAddForm(false)} />
          ) : (
            <button
              onClick={() => setShowAddForm(true)}
              style={{
                width: '100%', padding: '10px', marginTop: 10,
                background: dark ? 'var(--card-dark)' : '#FFF',
                border: `2px dashed ${dark ? 'var(--border-dark)' : 'var(--border)'}`,
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer', fontFamily: 'inherit',
                color: 'var(--terracotta)', fontWeight: 600, fontSize: 13,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                transition: 'border-color 0.15s',
              }}
            >
              + Add a pet
            </button>
          )}
        </div>
      )}
    </div>
  )
}

// Reusable photo upload widget
function PhotoUpload({ photo, onPhotoChange, dark, size = 56 }) {
  const fileRef = React.useRef(null)

  const handleFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = () => onPhotoChange(reader.result)
    reader.readAsDataURL(file)
  }

  return (
    <div style={{ position: 'relative', flexShrink: 0 }}>
      <div
        onClick={() => fileRef.current?.click()}
        style={{
          width: size, height: size, borderRadius: '50%',
          overflow: 'hidden', cursor: 'pointer',
          background: photo ? 'none' : (dark ? 'var(--bg-dark)' : 'var(--sand-light)'),
          border: `2px dashed ${photo ? 'transparent' : (dark ? 'var(--border-dark)' : 'var(--border)')}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'border-color 0.15s, transform 0.15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.borderColor = 'var(--terracotta)' }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.borderColor = photo ? 'transparent' : (dark ? 'var(--border-dark)' : 'var(--border)') }}
        title={photo ? 'Change photo' : 'Add photo'}
      >
        {photo ? (
          <img src={photo} alt="Pet" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ textAlign: 'center', lineHeight: 1.2 }}>
            <div style={{ fontSize: size * 0.32 }}>📷</div>
            <div style={{ fontSize: Math.max(8, size * 0.14), color: 'var(--text-muted)', fontWeight: 500 }}>Photo</div>
          </div>
        )}
      </div>
      {photo && (
        <button onClick={(e) => { e.stopPropagation(); onPhotoChange(null) }} style={{
          position: 'absolute', top: -4, right: -4,
          width: 18, height: 18, borderRadius: '50%',
          background: 'var(--terracotta)', color: '#FFF',
          border: 'none', cursor: 'pointer', fontSize: 10, fontWeight: 700,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
        }}>✕</button>
      )}
      <input ref={fileRef} type="file" accept="image/*" onChange={handleFile}
        style={{ display: 'none' }} />
    </div>
  )
}

// Pet avatar (photo or emoji fallback)
function PetAvatar({ pet, size = 36 }) {
  const typeInfo = PET_TYPES.find(t => t.key === pet.type)
  if (pet.photo) {
    return (
      <img src={pet.photo} alt={pet.name} style={{
        width: size, height: size, borderRadius: '50%',
        objectFit: 'cover', flexShrink: 0,
        border: '2px solid var(--terracotta)',
        boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
      }} />
    )
  }
  return <span style={{ fontSize: size * 0.6, flexShrink: 0 }}>{typeInfo?.icon}</span>
}

function PetCard({ pet, dark, editing, onEdit, onSave, onRemove, onCancel }) {
  const [name, setName] = useState(pet.name)
  const [type, setType] = useState(pet.type)
  const [needs, setNeeds] = useState(pet.needs || [])
  const [photo, setPhoto] = useState(pet.photo || null)
  const typeInfo = PET_TYPES.find(t => t.key === pet.type)

  const toggleNeed = (key) => setNeeds(p => p.includes(key) ? p.filter(k => k !== key) : [...p, key])

  if (editing) {
    return (
      <div style={{
        padding: 12, marginBottom: 6,
        background: dark ? 'var(--card-dark)' : '#FFF',
        border: `1px solid ${dark ? 'var(--border-dark)' : 'var(--border)'}`,
        borderRadius: 'var(--radius-md)',
      }}>
        {/* Photo + Name row */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
          <PhotoUpload photo={photo} onPhotoChange={setPhoto} dark={dark} size={52} />
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Pet name"
            style={{
              flex: 1, padding: '8px 10px',
              background: dark ? 'var(--bg-dark)' : 'var(--sand-light)',
              border: `1px solid ${dark ? 'var(--border-dark)' : 'var(--border)'}`,
              borderRadius: 'var(--radius-sm)', fontFamily: 'inherit', fontSize: 13,
              color: 'inherit', outline: 'none',
            }}
          />
        </div>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 8 }}>
          {PET_TYPES.map(t => (
            <button key={t.key} onClick={() => setType(t.key)} style={{
              padding: '4px 8px', fontSize: 11,
              background: type === t.key ? 'var(--forest)' : (dark ? 'var(--bg-dark)' : 'var(--sand-light)'),
              color: type === t.key ? '#FFF' : 'inherit',
              border: `1px solid ${type === t.key ? 'transparent' : dark ? 'var(--border-dark)' : 'var(--border)'}`,
              borderRadius: 'var(--radius-full)', cursor: 'pointer', fontFamily: 'inherit',
            }}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>
        <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 4, color: 'var(--text-muted)' }}>Special needs</div>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 10 }}>
          {SPECIAL_NEEDS.map(n => (
            <button key={n.key} onClick={() => toggleNeed(n.key)} style={{
              padding: '3px 8px', fontSize: 10,
              background: needs.includes(n.key) ? 'var(--ochre)' : (dark ? 'var(--bg-dark)' : 'var(--sand-light)'),
              color: needs.includes(n.key) ? '#FFF' : 'inherit',
              border: `1px solid ${needs.includes(n.key) ? 'transparent' : dark ? 'var(--border-dark)' : 'var(--border)'}`,
              borderRadius: 'var(--radius-full)', cursor: 'pointer', fontFamily: 'inherit',
            }}>
              {n.icon} {n.label}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={() => onSave({ name, type, needs, photo })} style={{
            flex: 1, padding: '7px', background: 'var(--forest)', color: '#FFF',
            border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600, fontSize: 12,
          }}>Save</button>
          <button onClick={onCancel} style={{
            padding: '7px 12px', background: 'none', color: 'inherit',
            border: `1px solid ${dark ? 'var(--border-dark)' : 'var(--border)'}`,
            borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12,
          }}>Cancel</button>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '10px 12px', marginBottom: 4,
      background: dark ? 'var(--card-dark)' : '#FFF',
      border: `1px solid ${dark ? 'var(--border-dark)' : 'var(--border)'}`,
      borderRadius: 'var(--radius-md)',
    }}>
      <PetAvatar pet={pet} size={36} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: 14, lineHeight: 1.2 }}>{pet.name}</div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 2 }}>
          <span>{typeInfo?.label}</span>
          {pet.needs?.map(n => {
            const info = SPECIAL_NEEDS.find(s => s.key === n)
            return info ? <span key={n} title={info.tip} style={{
              padding: '0 4px', background: dark ? 'rgba(196,157,59,0.15)' : 'rgba(196,157,59,0.1)',
              borderRadius: 'var(--radius-sm)', fontSize: 10,
            }}>{info.icon}</span> : null
          })}
        </div>
      </div>
      <button onClick={onEdit} style={{
        width: 26, height: 26, borderRadius: 'var(--radius-sm)',
        background: dark ? 'var(--bg-dark)' : 'var(--sand-light)',
        border: 'none', cursor: 'pointer', fontSize: 12, color: 'inherit',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>✏️</button>
      <button onClick={onRemove} style={{
        width: 26, height: 26, borderRadius: 'var(--radius-sm)',
        background: dark ? 'var(--bg-dark)' : 'var(--sand-light)',
        border: 'none', cursor: 'pointer', fontSize: 12, color: 'inherit',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>✕</button>
    </div>
  )
}

function AddPetForm({ dark, onAdd, onCancel }) {
  const [name, setName] = useState('')
  const [type, setType] = useState('dog-medium')
  const [needs, setNeeds] = useState([])
  const [photo, setPhoto] = useState(null)

  const toggleNeed = (key) => setNeeds(p => p.includes(key) ? p.filter(k => k !== key) : [...p, key])

  return (
    <div style={{
      padding: 12, marginTop: 10,
      background: dark ? 'var(--card-dark)' : '#FFF',
      border: `2px solid var(--terracotta)`,
      borderRadius: 'var(--radius-md)',
    }}>
      <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 10, color: 'var(--terracotta)' }}>
        🐾 Add to your pack
      </div>

      {/* Photo + Name row */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
        <PhotoUpload photo={photo} onPhotoChange={setPhoto} dark={dark} size={60} />
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Pet name (e.g. Bella, Simba)"
          autoFocus
          style={{
            flex: 1, padding: '8px 10px',
            background: dark ? 'var(--bg-dark)' : 'var(--sand-light)',
            border: `1px solid ${dark ? 'var(--border-dark)' : 'var(--border)'}`,
            borderRadius: 'var(--radius-sm)', fontFamily: 'inherit', fontSize: 13,
            color: 'inherit', outline: 'none', boxSizing: 'border-box',
          }}
        />
      </div>

      <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: 6 }}>
        Pet type
      </div>
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 10 }}>
        {PET_TYPES.map(t => (
          <button key={t.key} onClick={() => setType(t.key)} style={{
            padding: '5px 10px', fontSize: 11,
            background: type === t.key ? 'var(--forest)' : (dark ? 'var(--bg-dark)' : 'var(--sand-light)'),
            color: type === t.key ? '#FFF' : 'inherit',
            border: `1px solid ${type === t.key ? 'transparent' : dark ? 'var(--border-dark)' : 'var(--border)'}`,
            borderRadius: 'var(--radius-full)', cursor: 'pointer', fontFamily: 'inherit',
          }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: 6 }}>
        Special needs (optional)
      </div>
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 12 }}>
        {SPECIAL_NEEDS.map(n => (
          <button key={n.key} onClick={() => toggleNeed(n.key)} title={n.tip} style={{
            padding: '4px 8px', fontSize: 10,
            background: needs.includes(n.key) ? 'var(--ochre)' : (dark ? 'var(--bg-dark)' : 'var(--sand-light)'),
            color: needs.includes(n.key) ? '#FFF' : 'inherit',
            border: `1px solid ${needs.includes(n.key) ? 'transparent' : dark ? 'var(--border-dark)' : 'var(--border)'}`,
            borderRadius: 'var(--radius-full)', cursor: 'pointer', fontFamily: 'inherit',
          }}>
            {n.icon} {n.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 6 }}>
        <button
          onClick={() => name.trim() && onAdd({ name: name.trim(), type, needs, photo })}
          disabled={!name.trim()}
          style={{
            flex: 1, padding: '9px', background: name.trim() ? 'var(--terracotta)' : 'var(--sand)',
            color: name.trim() ? '#FFF' : 'var(--text-muted)',
            border: 'none', borderRadius: 'var(--radius-sm)', cursor: name.trim() ? 'pointer' : 'default',
            fontFamily: 'inherit', fontWeight: 600, fontSize: 13,
          }}
        >
          Add {name.trim() || 'pet'} to pack
        </button>
        <button onClick={onCancel} style={{
          padding: '9px 14px', background: 'none', color: 'inherit',
          border: `1px solid ${dark ? 'var(--border-dark)' : 'var(--border)'}`,
          borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13,
        }}>
          Cancel
        </button>
      </div>
    </div>
  )
}
