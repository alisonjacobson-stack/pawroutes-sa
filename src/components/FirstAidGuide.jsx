import React, { useState, useEffect } from 'react'

const EMERGENCIES = [
  {
    id: 'snake-bite',
    icon: '\ud83d\udc0d',
    title: 'Snake Bite',
    summary: 'Stay calm. Do NOT tourniquet. Keep pet still. Rush to nearest vet.',
    color: '#8B5E3C',
    doList: [
      'Keep your pet as still and calm as possible',
      'Carry them to the car \u2014 don\u2019t let them walk',
      'Note the snake\u2019s appearance if safe to do so',
      'Call the vet while driving so they can prepare antivenom',
      'Keep the bite site below heart level',
    ],
    dontList: [
      'Do NOT apply a tourniquet',
      'Do NOT try to suck out venom',
      'Do NOT ice the bite',
      'Do NOT attempt to catch or kill the snake',
    ],
    rushToVet: 'Immediately \u2014 every minute counts. Puff adder, Cape cobra, and black mamba bites are all potentially fatal.',
    saTip: 'In the Lowveld and bushveld, puff adders are the most common bite. On the Garden Route, watch for berg adders on hiking trails. Keep your dog on-lead in long grass.',
  },
  {
    id: 'tick-bite',
    icon: '\ud83d\udd77\ufe0f',
    title: 'Tick Bite',
    summary: 'Check ears, armpits, between toes. Remove with tick tweezers, twist anti-clockwise. Watch for biliary symptoms.',
    color: '#6B4F3A',
    doList: [
      'Check your pet thoroughly after every walk \u2014 ears, armpits, groin, between toes',
      'Use fine-tipped tick tweezers, grip close to the skin',
      'Twist anti-clockwise and pull steadily',
      'Clean the area with antiseptic',
      'Save the tick in a sealed container (vet may need to identify it)',
      'Monitor for 2 weeks: lethargy, pale gums, dark urine, loss of appetite',
    ],
    dontList: [
      'Do NOT squeeze the tick body',
      'Do NOT use petroleum jelly, alcohol, or a hot match',
      'Do NOT yank \u2014 the mouthparts must come out cleanly',
    ],
    rushToVet: 'If your pet shows pale gums, dark/red urine, fever, or sudden lethargy \u2014 this could be biliary (tick fever), which is fatal if untreated.',
    saTip: 'Biliary (babesiosis) is extremely common in SA, especially KZN, Mpumalanga, and Limpopo. Tick prevention (Bravecto, NexGard, Seresto collar) is essential before any road trip.',
  },
  {
    id: 'heat-stroke',
    icon: '\ud83c\udf21\ufe0f',
    title: 'Heat Stroke',
    summary: 'Signs: excessive panting, drooling, red gums. Move to shade. Wet paws and ears with cool (not cold) water. Drive to vet with windows down.',
    color: '#C45B5B',
    doList: [
      'Move pet to shade or aircon immediately',
      'Wet their paws, ears, and belly with cool (not cold) water',
      'Place wet towels on neck and armpits',
      'Offer small sips of water \u2014 don\u2019t force',
      'Drive to vet with windows down or aircon on',
    ],
    dontList: [
      'Do NOT use ice or very cold water (causes blood vessels to constrict, trapping heat)',
      'Do NOT submerge in cold water',
      'Do NOT leave them in a parked car \u2014 ever, even with windows cracked',
      'Do NOT over-exercise in midday heat',
    ],
    rushToVet: 'If gums turn blue/grey, pet collapses, or has seizures. Heatstroke can cause organ failure within minutes.',
    saTip: 'SA car interiors reach 65\u00b0C+ in summer. Flat-faced breeds (bulldogs, pugs) and huskies are highest risk. On the N1 through the Karoo, rest every 2 hours with water breaks.',
  },
  {
    id: 'broken-bone',
    icon: '\ud83e\uddb4',
    title: 'Broken Bone',
    summary: 'Immobilise. Do not splint yourself. Carry pet on a flat surface. Emergency vet immediately.',
    color: '#5B7C9E',
    doList: [
      'Keep your pet as still as possible',
      'Slide a board, towel, or blanket under them as a stretcher',
      'For small dogs: carry gently in a box or wrapped in a towel',
      'Muzzle gently if needed \u2014 injured pets may bite from pain',
      'Support the injured area without pressing on it',
    ],
    dontList: [
      'Do NOT try to set or splint the bone yourself',
      'Do NOT let them walk on it',
      'Do NOT give human painkillers (ibuprofen and paracetamol are toxic to dogs)',
    ],
    rushToVet: 'Always. Fractures need X-rays and professional splinting or surgery. Internal injuries may not be visible.',
    saTip: 'On gravel roads in the Drakensberg or Cederberg, keep pets secured in the car. Potholes cause sudden jolts that fling unsecured pets around.',
  },
  {
    id: 'poisoning',
    icon: '\ud83e\udd2e',
    title: 'Poisoning',
    summary: 'Common SA poisons: rat bait, snail bait, aloe leaves, macadamia nuts. Do NOT induce vomiting unless vet says so. Call AHEAD.',
    color: '#7B5EA7',
    doList: [
      'Call your vet or Poison Helpline immediately',
      'Note what they ate, how much, and when',
      'Bring the packaging or a photo of the substance',
      'Keep them calm and warm',
      'Collect a sample of vomit if they\u2019ve already been sick',
    ],
    dontList: [
      'Do NOT induce vomiting unless specifically told to by a vet',
      'Do NOT give milk, charcoal, or home remedies',
      'Do NOT wait for symptoms to appear \u2014 some poisons take hours to show',
    ],
    rushToVet: 'Immediately. Call ahead so they can prepare. Time is critical with rat bait (anticoagulant) \u2014 symptoms may only show 2\u20133 days later.',
    saTip: 'Two-step (aldicarb) is extremely common in SA townships \u2014 it\u2019s used maliciously. Macadamia nuts (common in Limpopo/Mpumalanga) cause tremors in dogs. Cycad seeds are also toxic and common in SA gardens.',
  },
  {
    id: 'bleeding',
    icon: '\ud83e\ude78',
    title: 'Bleeding / Wound',
    summary: 'Apply pressure with clean cloth. Elevate if possible. Do NOT remove embedded objects.',
    color: '#C45B5B',
    doList: [
      'Apply firm pressure with a clean cloth, towel, or gauze',
      'Hold for at least 5 minutes without lifting to check',
      'Elevate the wound above heart level if possible',
      'Wrap firmly (not tightly) with a bandage',
      'For minor cuts: clean with saline, apply antiseptic',
    ],
    dontList: [
      'Do NOT remove embedded objects (glass, thorns, wire) \u2014 they may be stemming the bleeding',
      'Do NOT apply a tourniquet unless trained',
      'Do NOT use hydrogen peroxide on deep wounds',
    ],
    rushToVet: 'If bleeding doesn\u2019t stop after 10 minutes of pressure, if the wound is deep, or if caused by barbed wire or a wild animal.',
    saTip: 'Barbed wire fences are everywhere on farm roads. Keep dogs away from farm boundaries. Carry a basic pet first aid kit with gauze, bandage, and saline in your car.',
  },
  {
    id: 'bee-sting',
    icon: '\ud83d\udc1d',
    title: 'Bee / Wasp Sting',
    summary: 'Scrape stinger out (don\u2019t squeeze). Cold compress. Watch for allergic reaction (swelling, difficulty breathing).',
    color: '#D4A843',
    doList: [
      'Scrape the stinger out sideways with a credit card or fingernail',
      'Apply a cold compress (wrapped ice pack) for 10 minutes',
      'Monitor for swelling, especially around face and throat',
      'A single sting is usually manageable \u2014 antihistamine may help (ask vet for dose)',
    ],
    dontList: [
      'Do NOT squeeze the stinger \u2014 it releases more venom',
      'Do NOT apply vinegar or baking soda',
      'Do NOT ignore swelling around the throat or difficulty breathing',
    ],
    rushToVet: 'If face swells significantly, breathing becomes laboured, or multiple stings (10+). Anaphylaxis can be fatal.',
    saTip: 'African honeybees are more aggressive than European bees. If you disturb a hive on a trail, pick up your dog and RUN \u2014 don\u2019t swat. Bees in the fynbos and bushveld are common near water sources.',
  },
  {
    id: 'near-drowning',
    icon: '\ud83c\udf0a',
    title: 'Near Drowning',
    summary: 'Clear airway. Hold upside down briefly for small dogs. CPR: 30 compressions, 2 breaths. Keep warm.',
    color: '#3B7EA1',
    doList: [
      'Pull pet from water and clear any debris from mouth',
      'For small dogs: hold briefly upside down by hind legs to drain water',
      'For larger dogs: lay on side with head lower than body',
      'If not breathing: CPR \u2014 30 chest compressions, 2 breaths into nose (mouth closed)',
      'Wrap in a towel or blanket to prevent hypothermia',
    ],
    dontList: [
      'Do NOT swing large dogs \u2014 you\u2019ll cause injury',
      'Do NOT assume they\u2019re fine once coughing \u2014 secondary drowning can occur hours later',
      'Do NOT leave dogs unsupervised near pools, dams, or rivers with strong currents',
    ],
    rushToVet: 'Always, even if they seem fine. Secondary drowning (fluid in lungs) can develop hours later and is life-threatening.',
    saTip: 'Many SA pools don\u2019t have ramps for dogs to climb out. River currents in the Drakensberg and Tsitsikamma are deceptively strong. Invest in a doggy life jacket for water routes.',
  },
  {
    id: 'porcupine-quills',
    icon: '\u26a1',
    title: 'Porcupine Quills',
    summary: 'Do NOT pull out \u2014 they\u2019re barbed. Sedate at vet only. Common in Kruger/bushveld routes.',
    color: '#8B7355',
    doList: [
      'Keep your pet calm and still \u2014 movement drives quills deeper',
      'Prevent them from pawing at their face',
      'Get to a vet ASAP \u2014 quills must be removed under sedation',
      'Check inside the mouth and throat \u2014 quills can lodge there too',
    ],
    dontList: [
      'Do NOT pull quills out yourself \u2014 they have microscopic barbs that tear tissue',
      'Do NOT cut quills (myth that it \u201creleases pressure\u201d \u2014 it doesn\u2019t)',
      'Do NOT let your dog approach porcupines \u2014 they don\u2019t learn from the first time',
    ],
    rushToVet: 'Always. Quills migrate inward and can puncture organs. Facial quills risk eye damage. Mouth quills can cause infection.',
    saTip: 'Porcupines are nocturnal and common on Kruger, Pilanesberg, and bushveld routes. Keep dogs on-lead after dark. If self-driving in Kruger, dogs aren\u2019t allowed in the park \u2014 plan kennelling at rest camps.',
  },
  {
    id: 'paw-burns',
    icon: '\ud83d\udd25',
    title: 'Paw Burns (Hot Tar)',
    summary: 'Run cool water 10 min. Do NOT apply ice. Wrap loosely. Drive with aircon on.',
    color: '#D4783C',
    doList: [
      'Run cool water over the paws for at least 10 minutes',
      'Wrap loosely in a clean, damp cloth',
      'Carry them to the car \u2014 don\u2019t let them walk on more hot surfaces',
      'Drive with aircon on or windows down to keep paws cool',
      'Apply pet-safe aloe or paw balm once cooled',
    ],
    dontList: [
      'Do NOT apply ice directly \u2014 it damages burnt tissue',
      'Do NOT pop blisters',
      'Do NOT let them lick burnt paws excessively \u2014 use a cone if needed',
    ],
    rushToVet: 'If paw pads are blistered, peeling, or the dog won\u2019t bear weight. Deep burns need professional treatment and pain management.',
    saTip: 'Test the pavement with the back of your hand \u2014 if you can\u2019t hold it for 5 seconds, it\u2019s too hot for paws. Black tar in the Karoo and Free State can exceed 60\u00b0C in summer. Walk early morning or after 6pm.',
  },
]

const STORAGE_KEY = 'pawroutes-firstaid-v1'

export default function FirstAidGuide({ dark, open, onClose }) {
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState(null)

  // Cache to localStorage for offline access
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        data: EMERGENCIES,
        cachedAt: Date.now(),
      }))
    } catch { /* quota exceeded — non-critical */ }
  }, [])

  if (!open) return null

  const q = search.toLowerCase().trim()
  const filtered = q
    ? EMERGENCIES.filter(e =>
        e.title.toLowerCase().includes(q) ||
        e.summary.toLowerCase().includes(q) ||
        e.doList.some(d => d.toLowerCase().includes(q)) ||
        e.dontList.some(d => d.toLowerCase().includes(q)) ||
        e.saTip.toLowerCase().includes(q)
      )
    : EMERGENCIES

  const toggle = (id) => setExpanded(prev => prev === id ? null : id)

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      animation: 'fadeIn 0.2s',
    }} onClick={onClose}>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '90%', maxWidth: 520, maxHeight: '85vh',
          background: dark ? 'var(--bg-dark)' : 'var(--cream)',
          borderRadius: 'var(--radius-lg)', overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
          display: 'flex', flexDirection: 'column',
          animation: 'slideInUp 0.3s var(--ease-out)',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '20px 24px 16px',
          borderBottom: `1px solid ${dark ? 'var(--border-dark)' : 'var(--border)'}`,
          background: dark ? 'rgba(196,91,91,0.15)' : 'rgba(196,91,91,0.08)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h2 style={{
              fontSize: 22, fontWeight: 800, margin: 0,
              fontFamily: 'var(--font-display)',
              color: '#C45B5B',
            }}>
              \ud83c\udfe5 Pet First Aid
            </h2>
            <button onClick={onClose} style={{
              width: 32, height: 32, borderRadius: 'var(--radius-full)',
              background: dark ? 'var(--card-dark)' : 'var(--sand)',
              border: 'none', cursor: 'pointer', fontSize: 16,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'inherit',
            }}>\u2715</button>
          </div>

          {/* Search */}
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search emergencies... (e.g. snake, tick, poison)"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%', padding: '10px 14px 10px 36px',
                borderRadius: 'var(--radius-md)',
                border: `1px solid ${dark ? 'var(--border-dark)' : 'var(--border)'}`,
                background: dark ? 'var(--card-dark)' : '#FFF',
                color: 'inherit', fontSize: 14,
                fontFamily: 'var(--font-body)',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
            <span style={{
              position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
              fontSize: 16, opacity: 0.5, pointerEvents: 'none',
            }}>\ud83d\udd0d</span>
          </div>

          {/* Offline indicator */}
          <div style={{
            marginTop: 10, padding: '6px 10px',
            borderRadius: 'var(--radius-sm)',
            background: dark ? 'rgba(74,124,89,0.2)' : 'rgba(74,124,89,0.1)',
            border: '1px solid rgba(74,124,89,0.25)',
            fontSize: 12, color: 'var(--forest)',
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <span>\ud83d\udce1</span> This guide works offline \u2014 save your route before travelling
          </div>
        </div>

        {/* Emergency cards */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px 24px' }}>
          {filtered.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '40px 20px',
              color: dark ? 'var(--text-secondary-dark)' : 'var(--text-secondary)',
            }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>\ud83d\udd0d</div>
              <p style={{ fontSize: 14, lineHeight: 1.5 }}>
                No emergencies match "{search}". Try a different term.
              </p>
            </div>
          ) : (
            filtered.map(e => {
              const isOpen = expanded === e.id
              return (
                <div key={e.id} style={{
                  marginBottom: 12,
                  borderRadius: 'var(--radius-md)',
                  border: `1px solid ${isOpen ? e.color + '60' : dark ? 'var(--border-dark)' : 'var(--border)'}`,
                  background: dark ? 'var(--card-dark)' : '#FFF',
                  boxShadow: isOpen ? `0 4px 16px ${e.color}20` : '0 2px 8px var(--shadow)',
                  overflow: 'hidden',
                  transition: 'all 0.2s',
                }}>
                  {/* Card header — clickable */}
                  <button
                    onClick={() => toggle(e.id)}
                    style={{
                      width: '100%', padding: '14px 16px',
                      background: 'transparent', border: 'none',
                      cursor: 'pointer', textAlign: 'left',
                      display: 'flex', alignItems: 'flex-start', gap: 12,
                      color: 'inherit', fontFamily: 'inherit',
                    }}
                  >
                    <span style={{
                      fontSize: 28, lineHeight: 1, flexShrink: 0,
                      width: 44, height: 44,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: e.color + '18',
                      borderRadius: 'var(--radius-sm)',
                    }}>{e.icon}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: 16, fontWeight: 700,
                        fontFamily: 'var(--font-display)',
                        marginBottom: 4,
                      }}>{e.title}</div>
                      <div style={{
                        fontSize: 13, lineHeight: 1.4,
                        color: dark ? 'var(--text-secondary-dark)' : 'var(--text-secondary)',
                      }}>{e.summary}</div>
                    </div>
                    <span style={{
                      fontSize: 14, flexShrink: 0, marginTop: 4,
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s',
                    }}>\u25bc</span>
                  </button>

                  {/* Expanded content */}
                  {isOpen && (
                    <div style={{
                      padding: '0 16px 16px',
                      borderTop: `1px solid ${dark ? 'var(--border-dark)' : 'var(--border)'}`,
                    }}>
                      {/* Do list */}
                      <div style={{ marginTop: 14, marginBottom: 14 }}>
                        <div style={{
                          fontSize: 13, fontWeight: 700, marginBottom: 8,
                          color: 'var(--forest)',
                          display: 'flex', alignItems: 'center', gap: 6,
                        }}>
                          \u2705 DO
                        </div>
                        {e.doList.map((item, i) => (
                          <div key={i} style={{
                            fontSize: 13, lineHeight: 1.5, padding: '4px 0 4px 20px',
                            position: 'relative',
                            color: dark ? 'var(--text-secondary-dark)' : 'inherit',
                          }}>
                            <span style={{
                              position: 'absolute', left: 0, top: 4,
                              color: 'var(--forest)', fontSize: 12,
                            }}>\u2713</span>
                            {item}
                          </div>
                        ))}
                      </div>

                      {/* Don't list */}
                      <div style={{ marginBottom: 14 }}>
                        <div style={{
                          fontSize: 13, fontWeight: 700, marginBottom: 8,
                          color: '#C45B5B',
                          display: 'flex', alignItems: 'center', gap: 6,
                        }}>
                          \u274c DON'T
                        </div>
                        {e.dontList.map((item, i) => (
                          <div key={i} style={{
                            fontSize: 13, lineHeight: 1.5, padding: '4px 0 4px 20px',
                            position: 'relative',
                            color: dark ? 'var(--text-secondary-dark)' : 'inherit',
                          }}>
                            <span style={{
                              position: 'absolute', left: 0, top: 4,
                              color: '#C45B5B', fontSize: 12,
                            }}>\u2717</span>
                            {item}
                          </div>
                        ))}
                      </div>

                      {/* When to rush to vet */}
                      <div style={{
                        padding: '12px 14px', marginBottom: 14,
                        borderRadius: 'var(--radius-sm)',
                        background: dark ? 'rgba(196,91,91,0.15)' : 'rgba(196,91,91,0.08)',
                        border: '1px solid rgba(196,91,91,0.25)',
                      }}>
                        <div style={{
                          fontSize: 13, fontWeight: 700, marginBottom: 4,
                          color: '#C45B5B',
                        }}>
                          \ud83d\ude91 When to rush to vet
                        </div>
                        <div style={{
                          fontSize: 13, lineHeight: 1.5,
                          color: dark ? 'var(--text-secondary-dark)' : 'inherit',
                        }}>{e.rushToVet}</div>
                      </div>

                      {/* SA-specific tip */}
                      <div style={{
                        padding: '12px 14px',
                        borderRadius: 'var(--radius-sm)',
                        background: dark ? 'rgba(74,124,89,0.15)' : 'rgba(74,124,89,0.08)',
                        border: '1px solid rgba(74,124,89,0.25)',
                      }}>
                        <div style={{
                          fontSize: 13, fontWeight: 700, marginBottom: 4,
                          color: 'var(--forest)',
                        }}>
                          \ud83c\uddff\ud83c\udde6 SA Tip
                        </div>
                        <div style={{
                          fontSize: 13, lineHeight: 1.5,
                          color: dark ? 'var(--text-secondary-dark)' : 'inherit',
                        }}>{e.saTip}</div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })
          )}

          {/* Vet SOS button */}
          <div style={{
            marginTop: 8, padding: '16px 0',
            borderTop: `1px solid ${dark ? 'var(--border-dark)' : 'var(--border)'}`,
            textAlign: 'center',
          }}>
            <div style={{
              fontSize: 12, marginBottom: 10,
              color: dark ? 'var(--text-secondary-dark)' : 'var(--text-secondary)',
            }}>
              Can't handle it yourself?
            </div>
            <button
              onClick={() => {
                onClose()
                // The parent should open VetSOS — dispatch a custom event
                window.dispatchEvent(new CustomEvent('pawroutes:openVetSOS'))
              }}
              style={{
                padding: '14px 28px',
                background: '#C45B5B', color: '#FFF',
                border: 'none', borderRadius: 'var(--radius-md)',
                fontSize: 16, fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'var(--font-display)',
                boxShadow: '0 4px 12px rgba(196,91,91,0.3)',
                transition: 'transform 0.15s',
              }}
              onMouseEnter={e => e.target.style.transform = 'scale(1.03)'}
              onMouseLeave={e => e.target.style.transform = 'scale(1)'}
            >
              \ud83d\udea8 Find Nearest Vet
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
