import React, { useState } from 'react'

// Seed reviews keyed by stop ID — authentic SA pet-travel flavour
const REVIEWS = {
  'parys-pecan': [
    { id: 'r1', author: 'Lerato M.', pet: 'Bella', petEmoji: '🐕', rating: 5, date: '2026-02-14', text: 'Bella absolutely loved the river walk nearby! The farm stall lady even gave her biltong offcuts. Pecan pie is unreal — we stop here every time we drive to Cape Town.', hasPhoto: true },
    { id: 'r2', author: 'Johann vR.', pet: 'Diesel', petEmoji: '🐕‍🦺', rating: 4, date: '2026-01-20', text: 'Big shady terrace, water bowls already out when we arrived. Diesel (boerboel) was a bit much for the other dogs but staff were chilled about it. Great coffee.', hasPhoto: false },
    { id: 'r3', author: 'Sam K.', pet: 'Mochi', petEmoji: '🐈', rating: 3, date: '2025-12-08', text: 'More of a dog spot tbh. Mochi stayed in her carrier on my lap but they were cool about it. The pecan brownies made up for it.', hasPhoto: false },
  ],
  'parys-vaal-walk': [
    { id: 'r4', author: 'Thandi N.', pet: 'Rex & Lola', petEmoji: '🐕🐕', rating: 5, date: '2026-03-01', text: 'Best off-leash spot between Joburg and Bloem! Both dogs went straight into the Vaal. Flat path so even my mom could walk with us. Braai spots too.', hasPhoto: true },
    { id: 'r5', author: 'Mike D.', pet: 'Cooper', petEmoji: '🐕', rating: 4, date: '2026-02-10', text: 'Cooper had the time of his life swimming. Just watch out for the current near the bridge. Parking is easy and it\'s free. Will stop again for sure.', hasPhoto: false },
  ],
  'graaff-reinet-farm': [
    { id: 'r6', author: 'Annika B.', pet: 'Biscuit', petEmoji: '🐕', rating: 5, date: '2026-01-15', text: 'The Karoo lamb pie is next level and Biscuit got her own water and a rusk from the tannie behind the counter. Proper SA hospitality. Don\'t skip this stop.', hasPhoto: true },
    { id: 'r7', author: 'Pieter L.', pet: 'Shadow', petEmoji: '🐕', rating: 4, date: '2025-11-22', text: 'Lovely old Karoo town feel. Shadow slept under the table while we had the best melktert of the trip. Outdoor seating is generous.', hasPhoto: false },
    { id: 'r8', author: 'Zinhle S.', pet: 'Nala', petEmoji: '🐈', rating: 4, date: '2026-02-28', text: 'Stopped for a coffee break. Nala stayed in the car with aircon but they let me bring her water bowl inside. Staff genuinely love animals here.', hasPhoto: false },
  ],
  'graaff-reinet-stay': [
    { id: 'r9', author: 'Ruan & Marelize', pet: 'Bruno', petEmoji: '🐕', rating: 5, date: '2026-02-20', text: 'Bruno slept on the stoep and loved the garden. They even left a dog bed in the room without us asking. R150 pet deposit — totally reasonable. Braai area is lekker.', hasPhoto: true },
    { id: 'r10', author: 'Claire W.', pet: 'Pepper & Salt', petEmoji: '🐕🐕', rating: 4, date: '2026-01-03', text: 'Two-dog household and they were super accommodating. Garden is fenced which is a massive plus. The Karoo stars at night with your dogs next to you — unbeatable.', hasPhoto: false },
  ],
  'dullstroom-farm': [
    { id: 'r11', author: 'Nandi T.', pet: 'Simba', petEmoji: '🐕', rating: 5, date: '2026-03-10', text: 'Simba made friends with the farm cat and I nearly didn\'t get him back in the car. The cheese is incredible — bought a whole wheel. Pet-friendly and proud of it.', hasPhoto: true },
    { id: 'r12', author: 'Jason P.', pet: 'Luna', petEmoji: '🐕', rating: 4, date: '2026-02-05', text: 'Dullstroom is cold even in summer so bring a doggy jersey! Luna loved the fireplace inside. Great trout pate and craft beer. Will be back in winter.', hasPhoto: false },
    { id: 'r13', author: 'Fatima A.', pet: 'Cleo', petEmoji: '🐈', rating: 3, date: '2025-12-18', text: 'More dog-oriented but they didn\'t mind Cleo in her harness on the deck. Beautiful views of the dam. The pancakes are proper thick ones, not crepes.', hasPhoto: false },
  ],
  'nottingham-stay': [
    { id: 'r14', author: 'Grant & Sue', pet: 'Max', petEmoji: '🐕', rating: 5, date: '2026-01-28', text: 'The Midlands is so underrated for pet travel. Max had the whole garden to run in. Walking trails right from the door. Hosts left treats on his bed. 10/10.', hasPhoto: true },
    { id: 'r15', author: 'Priya M.', pet: 'Chai', petEmoji: '🐕', rating: 5, date: '2026-02-22', text: 'Chai is a nervous rescue and they were so patient. Quiet, no other dogs around, fenced garden. Exactly what anxious pups need. Beautiful setting too.', hasPhoto: false },
  ],
  'oudtshoorn-restaurant': [
    { id: 'r16', author: 'Willem J.', pet: 'Boet', petEmoji: '🐕', rating: 4, date: '2026-03-05', text: 'Boet got his own boerewors on the side — the waiter didn\'t even blink. Massive garden area, dogs everywhere. Proper Route 62 vibes. The bobotie was fire.', hasPhoto: false },
    { id: 'r17', author: 'Lindiwe K.', pet: 'Zara', petEmoji: '🐕', rating: 5, date: '2026-02-15', text: 'Best pet-friendly restaurant we\'ve found on the Garden Route stretch. Zara lay under the table like a queen. They have a dog menu — yes, a DOG MENU. Love it.', hasPhoto: true },
  ],
  'midlands-restaurant': [
    { id: 'r18', author: 'Rob H.', pet: 'Scout', petEmoji: '🐕', rating: 4, date: '2026-01-10', text: 'Scout loved watching the ducks from the deck. They have blankets for dogs in winter which is such a nice touch. The roast chicken is excellent. Book ahead on weekends.', hasPhoto: false },
    { id: 'r19', author: 'Ayesha D.', pet: 'Noodle', petEmoji: '🐕', rating: 5, date: '2026-03-18', text: 'Noodle is tiny and the staff fussed over her like she was royalty. High chairs for humans, blankets for dogs. The Midlands Meander is peak pet travel territory.', hasPhoto: true },
    { id: 'r20', author: 'Danie vdM.', pet: 'Thor', petEmoji: '🐕‍🦺', rating: 4, date: '2026-02-01', text: 'Thor (ridgeback) took up half the deck but nobody minded. Real country hospitality. The beer-battered fish is the move. Parking right outside.', hasPhoto: false },
  ],
}

function PawRating({ rating, size = 18, interactive = false, onRate }) {
  return (
    <span style={{ display: 'inline-flex', gap: 2, fontSize: size }}>
      {[1, 2, 3, 4, 5].map(i => (
        <span
          key={i}
          onClick={interactive ? () => onRate(i) : undefined}
          style={{
            opacity: i <= rating ? 1 : 0.25,
            cursor: interactive ? 'pointer' : 'default',
            transition: 'opacity 0.15s, transform 0.15s',
            display: 'inline-block',
          }}
          onMouseEnter={interactive ? e => { e.target.style.transform = 'scale(1.2)' } : undefined}
          onMouseLeave={interactive ? e => { e.target.style.transform = 'scale(1)' } : undefined}
        >
          🐾
        </span>
      ))}
    </span>
  )
}

function ReviewCard({ review, dark }) {
  const cardBg = dark ? 'var(--card-dark)' : 'white'
  const borderColor = dark ? 'var(--border-dark)' : 'rgba(0,0,0,0.06)'
  const textColor = dark ? '#E8DFD4' : '#2C2418'
  const mutedColor = dark ? 'var(--text-muted)' : 'var(--text-secondary)'

  return (
    <div style={{
      padding: 16,
      background: cardBg,
      borderRadius: 'var(--radius-md)',
      border: `1px solid ${borderColor}`,
      marginBottom: 10,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 'var(--radius-full)',
            background: dark ? 'rgba(196,97,59,0.15)' : 'rgba(196,97,59,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16, fontWeight: 700, color: 'var(--terracotta)',
          }}>
            {review.author.charAt(0)}
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14, color: textColor }}>
              {review.author}
            </div>
            <div style={{ fontSize: 12, color: mutedColor }}>
              {review.petEmoji} {review.pet}
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <PawRating rating={review.rating} size={13} />
          <div style={{ fontSize: 11, color: mutedColor, marginTop: 2 }}>
            {new Date(review.date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })}
          </div>
        </div>
      </div>

      <p style={{ fontSize: 13.5, lineHeight: 1.55, color: textColor, margin: 0 }}>
        {review.text}
      </p>

      {review.hasPhoto && (
        <div style={{
          marginTop: 10,
          height: 100,
          borderRadius: 'var(--radius-sm)',
          background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
          border: `1px dashed ${dark ? 'var(--border-dark)' : 'rgba(0,0,0,0.1)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 24, color: mutedColor, gap: 8,
        }}>
          <span>📸</span>
          <span style={{ fontSize: 12 }}>Photo</span>
        </div>
      )}
    </div>
  )
}

export default function CommunityReviews({ stopId, dark }) {
  const [reviews, setReviews] = useState(REVIEWS[stopId] || [])
  const [showForm, setShowForm] = useState(false)
  const [formName, setFormName] = useState('')
  const [formRating, setFormRating] = useState(0)
  const [formText, setFormText] = useState('')

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0
  const count = reviews.length

  const handleSubmit = e => {
    e.preventDefault()
    if (!formName.trim() || !formRating || !formText.trim()) return
    const newReview = {
      id: `user-${Date.now()}`,
      author: formName.trim(),
      pet: 'Your pet',
      petEmoji: '🐾',
      rating: formRating,
      date: new Date().toISOString().split('T')[0],
      text: formText.trim(),
      hasPhoto: false,
    }
    setReviews(prev => [newReview, ...prev])
    setFormName('')
    setFormRating(0)
    setFormText('')
    setShowForm(false)
  }

  const bg = dark ? 'var(--bg-dark)' : 'var(--sand-light)'
  const textColor = dark ? '#E8DFD4' : '#2C2418'
  const mutedColor = dark ? 'var(--text-muted)' : 'var(--text-secondary)'
  const cardBg = dark ? 'var(--card-dark)' : 'white'
  const borderColor = dark ? 'var(--border-dark)' : 'rgba(0,0,0,0.08)'

  if (!count && !REVIEWS[stopId]) {
    return (
      <div style={{
        padding: '20px 0',
        textAlign: 'center',
        color: mutedColor,
        fontSize: 13,
      }}>
        No reviews yet for this stop. Be the first!
        <div style={{ marginTop: 10 }}>
          <button
            onClick={() => setShowForm(true)}
            style={{
              padding: '8px 18px',
              background: 'var(--terracotta)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius-full)',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Write a Review
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '16px 0' }}>
      {/* Header: average rating + count */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: 14,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            fontSize: 26, fontWeight: 700, color: 'var(--terracotta)',
            fontFamily: 'var(--font-display)',
          }}>
            {avgRating}
          </span>
          <div>
            <PawRating rating={Math.round(avgRating)} size={15} />
            <div style={{ fontSize: 12, color: mutedColor }}>
              {count} review{count !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            padding: '8px 16px',
            background: showForm ? 'transparent' : 'var(--terracotta)',
            color: showForm ? 'var(--terracotta)' : 'white',
            border: showForm ? '1.5px solid var(--terracotta)' : 'none',
            borderRadius: 'var(--radius-full)',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          {showForm ? 'Cancel' : '+ Add Review'}
        </button>
      </div>

      {/* Add review form */}
      {showForm && (
        <form onSubmit={handleSubmit} style={{
          padding: 16,
          background: cardBg,
          borderRadius: 'var(--radius-md)',
          border: `1px solid ${borderColor}`,
          marginBottom: 14,
        }}>
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: mutedColor, display: 'block', marginBottom: 4 }}>
              Your name
            </label>
            <input
              type="text"
              value={formName}
              onChange={e => setFormName(e.target.value)}
              placeholder="e.g. Lerato M."
              style={{
                width: '100%',
                padding: '8px 12px',
                border: `1px solid ${borderColor}`,
                borderRadius: 'var(--radius-sm)',
                background: dark ? 'var(--bg-dark)' : 'var(--cream)',
                color: textColor,
                fontSize: 14,
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: mutedColor, display: 'block', marginBottom: 6 }}>
              Rating
            </label>
            <PawRating rating={formRating} size={22} interactive onRate={setFormRating} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: mutedColor, display: 'block', marginBottom: 4 }}>
              Your review
            </label>
            <textarea
              value={formText}
              onChange={e => setFormText(e.target.value)}
              placeholder="Tell us about your furry friend's experience..."
              rows={3}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: `1px solid ${borderColor}`,
                borderRadius: 'var(--radius-sm)',
                background: dark ? 'var(--bg-dark)' : 'var(--cream)',
                color: textColor,
                fontSize: 14,
                outline: 'none',
                resize: 'vertical',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
              }}
            />
          </div>
          <button
            type="submit"
            disabled={!formName.trim() || !formRating || !formText.trim()}
            style={{
              padding: '9px 22px',
              background: (!formName.trim() || !formRating || !formText.trim()) ? (dark ? '#4A3F35' : '#D4C4A0') : 'var(--terracotta)',
              color: (!formName.trim() || !formRating || !formText.trim()) ? mutedColor : 'white',
              border: 'none',
              borderRadius: 'var(--radius-full)',
              fontSize: 13,
              fontWeight: 600,
              cursor: (!formName.trim() || !formRating || !formText.trim()) ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
            }}
          >
            Submit Review
          </button>
        </form>
      )}

      {/* Review list */}
      <div>
        {reviews.map(review => (
          <ReviewCard key={review.id} review={review} dark={dark} />
        ))}
      </div>
    </div>
  )
}
