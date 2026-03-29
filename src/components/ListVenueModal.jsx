import React, { useState, useEffect } from 'react'
import { STOP_CATEGORIES } from '../data/stops'
import { SA_PROVINCES } from '../data/policies'
import { validateVenueSubmission, createVettingRecord, getWhatsAppVerificationLink, getEmailVerificationLink } from '../utils/venueVetting'

const STEPS = ['Venue Basics', 'Pet Policy', 'Contact & Verify', 'Review & Submit']

const DOGS_OPTIONS = ['Yes', 'Some areas', 'No']
const LARGE_DOGS_OPTIONS = ['Yes', 'By arrangement', 'No']
const YES_NO = ['Yes', 'No']

const SPAM_KEY = 'pawroutes_last_submission'
const SPAM_WINDOW = 24 * 60 * 60 * 1000 // 24 hours

function canSubmit() {
  const last = localStorage.getItem(SPAM_KEY)
  if (!last) return true
  return Date.now() - parseInt(last, 10) > SPAM_WINDOW
}

export default function ListVenueModal({ open, onClose, dark, onViewPolicies }) {
  const [step, setStep] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(null)

  // Step 1 — Venue Basics
  const [venueName, setVenueName] = useState('')
  const [category, setCategory] = useState('')
  const [customCategory, setCustomCategory] = useState('')
  const [town, setTown] = useState('')
  const [road, setRoad] = useState('')
  const [province, setProvince] = useState('')

  // Step 2 — Pet Policy
  const [petPolicy, setPetPolicy] = useState('')
  const [dogsAllowed, setDogsAllowed] = useState('')
  const [catsAllowed, setCatsAllowed] = useState('')
  const [maxPets, setMaxPets] = useState('')
  const [largeDogs, setLargeDogs] = useState('')
  const [petFee, setPetFee] = useState('')
  const [offLeash, setOffLeash] = useState('')
  const [waterBowls, setWaterBowls] = useState('')

  // Step 3 — Contact
  const [contactName, setContactName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [sameAsPhone, setSameAsPhone] = useState(false)
  const [website, setWebsite] = useState('')
  const [isOwner, setIsOwner] = useState(false)
  const [consentVerify, setConsentVerify] = useState(false)

  // Step 4 — Review
  const [agreePolicy, setAgreePolicy] = useState(false)

  // Paw animation for success
  const [showPaws, setShowPaws] = useState(false)

  useEffect(() => {
    if (sameAsPhone) setWhatsapp(phone)
  }, [sameAsPhone, phone])

  // Reset on open
  useEffect(() => {
    if (open) {
      setStep(0)
      setSubmitted(false)
      setError(null)
    }
  }, [open])

  if (!open) return null

  const catObj = Object.entries(STOP_CATEGORIES)

  // Validation per step
  const stepValid = [
    () => venueName.trim() && category && (category !== 'other' || customCategory.trim()) && town.trim() && road.trim(),
    () => petPolicy.trim(),
    () => contactName.trim() && phone.trim() && email.trim() && isOwner && consentVerify,
    () => agreePolicy,
  ]

  const canGoNext = stepValid[step]()

  const [vettingRecord, setVettingRecord] = useState(null)

  const handleSubmit = async () => {
    if (!canSubmit()) {
      setError('You recently submitted a listing. Please wait 24 hours before submitting another.')
      return
    }

    setSubmitting(true)
    setError(null)

    const payload = {
      venueName, category: category === 'other' ? customCategory : category, town, road, province,
      petPolicy, dogsAllowed, catsAllowed, maxPets, largeDogs, petFee, offLeash, waterBowls,
      contactName, phone, email, whatsapp: sameAsPhone ? phone : whatsapp, website,
    }

    // Pre-submission validation
    const validation = validateVenueSubmission(payload)
    if (!validation.valid) {
      setError(validation.issues.join('. '))
      setSubmitting(false)
      return
    }

    try {
      // Create vetting record with verification code
      const record = createVettingRecord(payload)
      setVettingRecord(record)

      // Also try to post to Formspree (best-effort, don't block on failure)
      try {
        await fetch('https://formspree.io/f/PLACEHOLDER_ID', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ ...payload, verificationCode: record.verificationCode, vettingId: record.id }),
        })
      } catch (_) { /* Formspree failure is non-blocking */ }

      localStorage.setItem(SPAM_KEY, String(Date.now()))
      setSubmitted(true)
      setShowPaws(true)
    } catch (e) {
      setError('Something went wrong. Please try again or contact us on WhatsApp.')
    } finally {
      setSubmitting(false)
    }
  }

  const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(
    `I just listed ${venueName} on PawRoutes SA! 🐾 Check it out at pawroutes.co.za`
  )}`

  // --- Shared styles ---
  const inputStyle = {
    width: '100%', padding: '10px 14px', fontSize: 14,
    background: dark ? 'var(--card-dark)' : '#FFF',
    color: 'inherit', border: `1px solid ${dark ? 'var(--border-dark)' : 'var(--border)'}`,
    borderRadius: 'var(--radius-sm)', fontFamily: 'inherit',
    outline: 'none',
  }

  const labelStyle = {
    fontSize: 12, fontWeight: 600, textTransform: 'uppercase',
    letterSpacing: '0.04em', color: dark ? 'var(--text-secondary-dark)' : 'var(--text-secondary)',
    marginBottom: 6, display: 'block',
  }

  const chipStyle = (active) => ({
    padding: '7px 14px', fontSize: 13, fontWeight: active ? 600 : 400,
    background: active ? 'var(--terracotta)' : (dark ? 'var(--card-dark)' : 'var(--sand-light)'),
    color: active ? '#FFF' : 'inherit',
    border: `1px solid ${active ? 'transparent' : dark ? 'var(--border-dark)' : 'var(--border)'}`,
    borderRadius: 'var(--radius-full)', cursor: 'pointer', fontFamily: 'inherit',
    transition: 'all 0.15s',
  })

  const checkboxRow = (checked, onChange, label, linkAction) => (
    <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', cursor: 'pointer', fontSize: 14, lineHeight: 1.5 }}>
      <input
        type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)}
        style={{ marginTop: 4, accentColor: 'var(--terracotta)' }}
      />
      <span>
        {label}
        {linkAction && (
          <button
            onClick={(e) => { e.preventDefault(); linkAction() }}
            style={{
              background: 'none', border: 'none', color: 'var(--terracotta)',
              textDecoration: 'underline', cursor: 'pointer', fontFamily: 'inherit',
              fontSize: 14, padding: 0, marginLeft: 4,
            }}
          >
            View Policies
          </button>
        )}
      </span>
    </label>
  )

  const fieldGap = { marginBottom: 16 }

  // --- Step renderers ---
  const renderStep1 = () => (
    <>
      <div style={fieldGap}>
        <label style={labelStyle}>Venue Name *</label>
        <input
          style={inputStyle} value={venueName}
          onChange={e => setVenueName(e.target.value)}
          placeholder="e.g. Pecan Nut Farm Stall"
        />
      </div>

      <div style={fieldGap}>
        <label style={labelStyle}>Category</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
          {catObj.map(([key, { label, icon }]) => (
            <button
              key={key} onClick={() => { setCategory(key); setCustomCategory('') }}
              style={{
                padding: '10px 12px', fontSize: 13, fontWeight: category === key ? 700 : 400,
                background: category === key ? 'var(--terracotta)' : (dark ? 'var(--card-dark)' : 'var(--sand-light)'),
                color: category === key ? '#FFF' : 'inherit',
                border: `1px solid ${category === key ? 'transparent' : dark ? 'var(--border-dark)' : 'var(--border)'}`,
                borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontFamily: 'inherit',
                display: 'flex', alignItems: 'center', gap: 8,
                transition: 'all 0.15s',
              }}
            >
              <span style={{ fontSize: 18 }}>{icon}</span> {label}
            </button>
          ))}
          <button
            onClick={() => setCategory('other')}
            style={{
              padding: '10px 12px', fontSize: 13, fontWeight: category === 'other' ? 700 : 400,
              background: category === 'other' ? 'var(--terracotta)' : (dark ? 'var(--card-dark)' : 'var(--sand-light)'),
              color: category === 'other' ? '#FFF' : 'inherit',
              border: `1px solid ${category === 'other' ? 'transparent' : dark ? 'var(--border-dark)' : 'var(--border)'}`,
              borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', gap: 8,
              transition: 'all 0.15s',
            }}
          >
            <span style={{ fontSize: 18 }}>✨</span> Other
          </button>
        </div>
        {category === 'other' && (
          <input
            style={{ ...inputStyle, marginTop: 8 }}
            value={customCategory}
            onChange={e => setCustomCategory(e.target.value)}
            placeholder="Describe your venue type (e.g. Pet Groomer, Dog Beach, Doggy Daycare)"
          />
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, ...fieldGap }}>
        <div>
          <label style={labelStyle}>Town *</label>
          <input style={inputStyle} value={town} onChange={e => setTown(e.target.value)} placeholder="e.g. Parys" />
        </div>
        <div>
          <label style={labelStyle}>Road / Street *</label>
          <input style={inputStyle} value={road} onChange={e => setRoad(e.target.value)} placeholder="e.g. R59" />
        </div>
      </div>

      <div style={fieldGap}>
        <label style={labelStyle}>Province</label>
        <select
          style={{ ...inputStyle, cursor: 'pointer' }} value={province}
          onChange={e => setProvince(e.target.value)}
        >
          <option value="">Select province...</option>
          {SA_PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>
    </>
  )

  const renderStep2 = () => (
    <>
      <div style={fieldGap}>
        <label style={labelStyle}>Pet Policy Description *</label>
        <textarea
          style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }}
          value={petPolicy} onChange={e => setPetPolicy(e.target.value)}
          placeholder="Describe how you welcome pets — where can they go, what's provided, any restrictions..."
        />
      </div>

      <div style={fieldGap}>
        <label style={labelStyle}>Dogs Allowed?</label>
        <div style={{ display: 'flex', gap: 8 }}>
          {DOGS_OPTIONS.map(opt => (
            <button key={opt} onClick={() => setDogsAllowed(opt)} style={chipStyle(dogsAllowed === opt)}>{opt}</button>
          ))}
        </div>
      </div>

      <div style={fieldGap}>
        <label style={labelStyle}>Cats Allowed?</label>
        <div style={{ display: 'flex', gap: 8 }}>
          {YES_NO.map(opt => (
            <button key={opt} onClick={() => setCatsAllowed(opt)} style={chipStyle(catsAllowed === opt)}>{opt}</button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, ...fieldGap }}>
        <div>
          <label style={labelStyle}>Max Pets Allowed</label>
          <input
            style={inputStyle} type="number" min="1" max="10"
            value={maxPets} onChange={e => setMaxPets(e.target.value)}
            placeholder="e.g. 2"
          />
        </div>
        <div>
          <label style={labelStyle}>Pet Fee</label>
          <input
            style={inputStyle} value={petFee} onChange={e => setPetFee(e.target.value)}
            placeholder="e.g. R150/night or Free"
          />
        </div>
      </div>

      <div style={fieldGap}>
        <label style={labelStyle}>Large Dogs Welcome?</label>
        <div style={{ display: 'flex', gap: 8 }}>
          {LARGE_DOGS_OPTIONS.map(opt => (
            <button key={opt} onClick={() => setLargeDogs(opt)} style={chipStyle(largeDogs === opt)}>{opt}</button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, ...fieldGap }}>
        <div>
          <label style={labelStyle}>Off-Leash Areas?</label>
          <div style={{ display: 'flex', gap: 8 }}>
            {YES_NO.map(opt => (
              <button key={opt} onClick={() => setOffLeash(opt)} style={chipStyle(offLeash === opt)}>{opt}</button>
            ))}
          </div>
        </div>
        <div>
          <label style={labelStyle}>Water Bowls Provided?</label>
          <div style={{ display: 'flex', gap: 8 }}>
            {YES_NO.map(opt => (
              <button key={opt} onClick={() => setWaterBowls(opt)} style={chipStyle(waterBowls === opt)}>{opt}</button>
            ))}
          </div>
        </div>
      </div>
    </>
  )

  const renderStep3 = () => (
    <>
      <div style={fieldGap}>
        <label style={labelStyle}>Contact Person Name *</label>
        <input style={inputStyle} value={contactName} onChange={e => setContactName(e.target.value)} placeholder="Full name" />
      </div>

      <div style={fieldGap}>
        <label style={labelStyle}>Phone Number *</label>
        <input style={inputStyle} value={phone} onChange={e => setPhone(e.target.value)} placeholder="e.g. 082 123 4567" type="tel" />
      </div>

      <div style={fieldGap}>
        <label style={labelStyle}>Email Address *</label>
        <input style={inputStyle} value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.co.za" type="email" />
      </div>

      <div style={fieldGap}>
        <label style={labelStyle}>WhatsApp Number</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <label style={{ fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
            <input
              type="checkbox" checked={sameAsPhone}
              onChange={e => setSameAsPhone(e.target.checked)}
              style={{ accentColor: 'var(--terracotta)' }}
            />
            Same as phone
          </label>
        </div>
        <input
          style={{ ...inputStyle, opacity: sameAsPhone ? 0.5 : 1 }}
          value={sameAsPhone ? phone : whatsapp}
          onChange={e => { if (!sameAsPhone) setWhatsapp(e.target.value) }}
          disabled={sameAsPhone}
          placeholder="e.g. 082 123 4567" type="tel"
        />
      </div>

      <div style={fieldGap}>
        <label style={labelStyle}>Website URL</label>
        <input style={inputStyle} value={website} onChange={e => setWebsite(e.target.value)} placeholder="https://..." type="url" />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}>
        {checkboxRow(isOwner, setIsOwner, 'I am the owner or authorised representative of this venue')}
        {checkboxRow(consentVerify, setConsentVerify, 'I consent to PawRoutes contacting me to verify this listing')}
      </div>
    </>
  )

  const summaryItem = (label, value) => {
    if (!value) return null
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: `1px solid ${dark ? 'var(--border-dark)' : 'var(--border)'}` }}>
        <span style={{ fontSize: 12, color: dark ? 'var(--text-secondary-dark)' : 'var(--text-muted)', fontWeight: 600 }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 500, textAlign: 'right', maxWidth: '60%' }}>{value}</span>
      </div>
    )
  }

  const renderStep4 = () => {
    const catLabel = category === 'other' ? `✨ ${customCategory || 'Other'}` : (category ? `${STOP_CATEGORIES[category]?.icon} ${STOP_CATEGORIES[category]?.label}` : '')

    return (
      <>
        <div style={{
          background: dark ? 'var(--card-dark)' : 'var(--sand-light)',
          borderRadius: 'var(--radius-md)', padding: 16, marginBottom: 16,
        }}>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>
            {venueName}
          </div>
          {summaryItem('Category', catLabel)}
          {summaryItem('Location', `${road}, ${town}${province ? `, ${province}` : ''}`)}
          {summaryItem('Pet Policy', petPolicy.length > 80 ? petPolicy.slice(0, 80) + '...' : petPolicy)}
          {summaryItem('Dogs', dogsAllowed)}
          {summaryItem('Cats', catsAllowed)}
          {summaryItem('Max Pets', maxPets)}
          {summaryItem('Large Dogs', largeDogs)}
          {summaryItem('Pet Fee', petFee)}
          {summaryItem('Off-Leash', offLeash)}
          {summaryItem('Water Bowls', waterBowls)}
          {summaryItem('Contact', contactName)}
          {summaryItem('Phone', phone)}
          {summaryItem('Email', email)}
          {summaryItem('WhatsApp', sameAsPhone ? phone : whatsapp)}
          {summaryItem('Website', website)}
        </div>

        {checkboxRow(
          agreePolicy,
          setAgreePolicy,
          'I agree to the PawRoutes Listing Policies',
          onViewPolicies || null
        )}

        {error && (
          <div style={{
            marginTop: 12, padding: '10px 14px', fontSize: 13,
            background: '#FEE', color: '#C44', borderRadius: 'var(--radius-sm)',
            border: '1px solid #FCC',
          }}>
            {error}
          </div>
        )}
      </>
    )
  }

  // --- Success screen ---
  if (submitted) {
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
            width: '90%', maxWidth: 420, padding: '40px 32px',
            background: dark ? 'var(--bg-dark)' : 'var(--cream)',
            borderRadius: 'var(--radius-lg)', textAlign: 'center',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            animation: 'slideInUp 0.3s var(--ease-out)',
            position: 'relative', overflow: 'hidden',
          }}
        >
          {/* Paw emoji animation */}
          {showPaws && (
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
              {[...Array(8)].map((_, i) => (
                <span
                  key={i}
                  style={{
                    position: 'absolute', fontSize: 24 + Math.random() * 16,
                    left: `${10 + Math.random() * 80}%`,
                    animation: `pawFall ${1.5 + Math.random()}s ease-out forwards`,
                    animationDelay: `${i * 0.15}s`, opacity: 0,
                  }}
                >
                  🐾
                </span>
              ))}
              <style>{`
                @keyframes pawFall {
                  0% { transform: translateY(-40px) rotate(0deg); opacity: 0; }
                  20% { opacity: 0.8; }
                  100% { transform: translateY(350px) rotate(${Math.random() > 0.5 ? '' : '-'}45deg); opacity: 0; }
                }
              `}</style>
            </div>
          )}

          <div style={{ fontSize: 56, marginBottom: 16 }}>🐾</div>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8, fontFamily: 'var(--font-display)' }}>
            Venue Listed!
          </h2>
          <p style={{ fontSize: 15, color: dark ? 'var(--text-secondary-dark)' : 'var(--text-secondary)', marginBottom: 12, lineHeight: 1.6 }}>
            Thanks! <strong>{venueName}</strong> is now in our vetting queue.
          </p>

          {/* Verification section */}
          {vettingRecord && (
            <div style={{
              background: dark ? 'rgba(59,107,74,0.15)' : 'rgba(59,107,74,0.08)',
              borderRadius: 'var(--radius-md)', padding: 16, marginBottom: 20,
              textAlign: 'left',
            }}>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 8, color: 'var(--forest)' }}>
                📋 Verification Required
              </div>
              <p style={{ fontSize: 12, lineHeight: 1.6, marginBottom: 10, color: dark ? 'var(--text-secondary-dark)' : 'var(--text-secondary)' }}>
                To speed up approval, send the verification code to the venue owner. They reply with the code to confirm they're the real owner.
              </p>
              <div style={{
                fontSize: 22, fontWeight: 800, letterSpacing: '0.15em', textAlign: 'center',
                padding: '8px 0', marginBottom: 12, fontFamily: 'monospace',
                color: 'var(--terracotta)',
              }}>
                {vettingRecord.verificationCode}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <a
                  href={getWhatsAppVerificationLink(vettingRecord)}
                  target="_blank" rel="noopener noreferrer"
                  style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    padding: '10px', fontSize: 12, fontWeight: 600,
                    background: '#25D366', color: '#FFF',
                    borderRadius: 'var(--radius-sm)', textDecoration: 'none',
                  }}
                >
                  💬 WhatsApp Owner
                </a>
                <a
                  href={getEmailVerificationLink(vettingRecord)}
                  target="_blank" rel="noopener noreferrer"
                  style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    padding: '10px', fontSize: 12, fontWeight: 600,
                    background: 'var(--terracotta)', color: '#FFF',
                    borderRadius: 'var(--radius-sm)', textDecoration: 'none',
                  }}
                >
                  📧 Email Owner
                </a>
              </div>
            </div>
          )}

          <a
            href={whatsappShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '12px 24px', fontSize: 14, fontWeight: 600,
              background: '#25D366', color: '#FFF',
              borderRadius: 'var(--radius-full)', textDecoration: 'none',
              transition: 'transform 0.15s',
            }}
          >
            <span style={{ fontSize: 18 }}>💬</span> Share on WhatsApp
          </a>

          <button
            onClick={onClose}
            style={{
              display: 'block', width: '100%', marginTop: 16,
              padding: '10px', fontSize: 14, fontWeight: 500,
              background: 'none', border: 'none', color: dark ? 'var(--text-secondary-dark)' : 'var(--text-muted)',
              cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            Close
          </button>
        </div>
      </div>
    )
  }

  // --- Main modal ---
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
          padding: '20px 24px 16px',
          borderBottom: `1px solid ${dark ? 'var(--border-dark)' : 'var(--border)'}`,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>
              📍 List Your Venue
            </h2>
            <button onClick={onClose} style={{
              width: 32, height: 32, borderRadius: 'var(--radius-full)',
              background: dark ? 'var(--card-dark)' : 'var(--sand)',
              border: 'none', cursor: 'pointer', fontSize: 16,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'inherit',
            }}>✕</button>
          </div>

          {/* Step indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
            {STEPS.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: i === step ? 28 : 8, height: 8,
                  borderRadius: 'var(--radius-full)',
                  background: i === step ? 'var(--terracotta)' : i < step ? 'var(--forest)' : (dark ? 'var(--border-dark)' : 'var(--border)'),
                  transition: 'all 0.25s var(--ease-out)',
                }} />
              </div>
            ))}
          </div>
          <div style={{
            textAlign: 'center', fontSize: 12, fontWeight: 600, marginTop: 8,
            color: dark ? 'var(--text-secondary-dark)' : 'var(--text-muted)',
          }}>
            Step {step + 1}: {STEPS[step]}
          </div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflow: 'auto', padding: '20px 24px' }}>
          {step === 0 && renderStep1()}
          {step === 1 && renderStep2()}
          {step === 2 && renderStep3()}
          {step === 3 && renderStep4()}
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 24px',
          borderTop: `1px solid ${dark ? 'var(--border-dark)' : 'var(--border)'}`,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          {step > 0 ? (
            <button
              onClick={() => setStep(step - 1)}
              style={{
                padding: '10px 20px', fontSize: 14, fontWeight: 600,
                background: 'none', border: `1px solid ${dark ? 'var(--border-dark)' : 'var(--border)'}`,
                borderRadius: 'var(--radius-full)', cursor: 'pointer',
                color: 'inherit', fontFamily: 'inherit',
              }}
            >
              Back
            </button>
          ) : <div />}

          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!canGoNext}
              style={{
                padding: '10px 24px', fontSize: 14, fontWeight: 700,
                background: canGoNext ? 'var(--terracotta)' : (dark ? 'var(--card-dark)' : 'var(--sand)'),
                color: canGoNext ? '#FFF' : (dark ? 'var(--text-secondary-dark)' : 'var(--text-muted)'),
                border: 'none', borderRadius: 'var(--radius-full)',
                cursor: canGoNext ? 'pointer' : 'not-allowed',
                fontFamily: 'inherit', transition: 'all 0.15s',
              }}
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!canGoNext || submitting}
              style={{
                padding: '10px 24px', fontSize: 14, fontWeight: 700,
                background: canGoNext && !submitting ? 'var(--forest)' : (dark ? 'var(--card-dark)' : 'var(--sand)'),
                color: canGoNext && !submitting ? '#FFF' : (dark ? 'var(--text-secondary-dark)' : 'var(--text-muted)'),
                border: 'none', borderRadius: 'var(--radius-full)',
                cursor: canGoNext && !submitting ? 'pointer' : 'not-allowed',
                fontFamily: 'inherit', transition: 'all 0.15s',
                minWidth: 120,
              }}
            >
              {submitting ? 'Submitting...' : 'Submit Venue'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
