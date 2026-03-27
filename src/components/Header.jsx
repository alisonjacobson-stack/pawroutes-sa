import React from 'react'

// Disney-quality SVG illustrations — pets & owners on a SA road trip
// Animations use wrapper <g> so CSS transforms don't conflict with SVG positioning
function TravelScene({ dark }) {
  const bg1 = dark ? '#1A1612' : '#FEF3E0'
  const bg2 = dark ? '#252018' : '#FDDCB5'
  const ground1 = dark ? '#2A2318' : '#D4C4A0'
  const ground2 = dark ? '#1E1A14' : '#C4B48A'
  const road1 = dark ? '#3A3228' : '#8A8070'
  const sky1 = dark ? '#6A5A4A' : '#9A8A70'
  const mtn1 = dark ? '#2A2318' : '#C8B898'
  const mtn2 = dark ? '#322A1E' : '#B8A888'

  return (
    <svg viewBox="0 0 1400 200" preserveAspectRatio="xMidYMid slice" fill="none" xmlns="http://www.w3.org/2000/svg"
      className="header-scene"
      style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={bg1} />
          <stop offset="100%" stopColor={bg2} />
        </linearGradient>
        <linearGradient id="sun" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFD166" />
          <stop offset="100%" stopColor="#F4A836" />
        </linearGradient>
        <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={ground1} />
          <stop offset="100%" stopColor={ground2} />
        </linearGradient>
        <linearGradient id="protea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E85A8A" />
          <stop offset="100%" stopColor="#C84070" />
        </linearGradient>
        {/* Glow filter for sun */}
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Sky */}
      <rect width="1400" height="200" fill="url(#sky)" />

      {/* === SUN with face === */}
      <g transform="translate(1250, 32)">
        <g className="scene-sun">
          <circle r="34" fill="url(#sun)" opacity="0.9" filter="url(#glow)" />
          {/* Rays that rotate */}
          <g className="scene-sun-rays">
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((a, i) => (
              <line key={i}
                x1={Math.cos(a * Math.PI / 180) * 38} y1={Math.sin(a * Math.PI / 180) * 38}
                x2={Math.cos(a * Math.PI / 180) * 48} y2={Math.sin(a * Math.PI / 180) * 48}
                stroke="#FFD166" strokeWidth="3" strokeLinecap="round" opacity="0.5"
              />
            ))}
          </g>
          {/* Cute face */}
          <circle cx="-8" cy="-4" r="3" fill="#E8A020" />
          <circle cx="8" cy="-4" r="3" fill="#E8A020" />
          <circle cx="-8" cy="-5" r="1.5" fill="#2C2418" />
          <circle cx="8" cy="-5" r="1.5" fill="#2C2418" />
          <circle cx="-7" cy="-6" r="0.6" fill="white" />
          <circle cx="9" cy="-6" r="0.6" fill="white" />
          <path d="M-8 5 Q0 12 8 5" stroke="#E8A020" strokeWidth="2" fill="none" strokeLinecap="round" />
          <circle cx="-14" cy="2" r="4" fill="#FFE0A0" opacity="0.3" />
          <circle cx="14" cy="2" r="4" fill="#FFE0A0" opacity="0.3" />
        </g>
      </g>

      {/* === CLOUDS (wrapper g for position, inner g for animation) === */}
      {[{x:180,y:28,s:1},{x:500,y:18,s:0.7},{x:850,y:35,s:0.9},{x:1100,y:20,s:0.6}].map((c,i) => (
        <g key={`cloud-${i}`} transform={`translate(${c.x},${c.y}) scale(${c.s})`}>
          <g className="scene-clouds" style={{ animationDelay: `${i * -5}s` }}>
            <ellipse cx="0" cy="0" rx="30" ry="12" fill="white" opacity={dark ? 0.1 : 0.45} />
            <ellipse cx="-18" cy="4" rx="18" ry="10" fill="white" opacity={dark ? 0.1 : 0.45} />
            <ellipse cx="18" cy="4" rx="18" ry="10" fill="white" opacity={dark ? 0.1 : 0.45} />
            <ellipse cx="0" cy="6" rx="28" ry="10" fill="white" opacity={dark ? 0.1 : 0.45} />
          </g>
        </g>
      ))}

      {/* Mountains */}
      <path d="M0 130 L30 80 L80 60 L120 58 L200 58 L240 60 L280 80 L310 100 L350 70 L390 55 L450 52 L500 55 L530 75 L560 110 L600 90 L640 75 L700 72 L740 75 L780 95 L820 110 L860 85 L900 70 L960 68 L1020 72 L1060 90 L1100 78 L1140 70 L1200 68 L1260 72 L1300 85 L1340 100 L1400 110 L1400 200 L0 200Z"
        fill={mtn1} opacity="0.3" />
      <path d="M0 145 L100 115 L200 120 L300 108 L400 118 L500 110 L600 120 L700 112 L800 125 L900 115 L1000 122 L1100 112 L1200 118 L1300 110 L1400 120 L1400 200 L0 200Z"
        fill={mtn2} opacity="0.45" />

      {/* Acacia trees */}
      {[{x:90,y:110,s:1.2},{x:340,y:115,s:0.9},{x:620,y:108,s:1.1},{x:880,y:112,s:1},{x:1150,y:106,s:1.3},{x:1320,y:114,s:0.8}].map((t,i) => (
        <g key={`tree-${i}`} transform={`translate(${t.x},${t.y}) scale(${t.s})`} opacity={0.5 + (i%3)*0.1}>
          <rect x="-2" y="0" width="4" height="22" rx="2" fill={dark ? '#4A3A28' : '#8B7355'} />
          <ellipse cx="0" cy="-2" rx="22" ry="8" fill={dark ? '#3A4A30' : '#7A9A60'} />
          <ellipse cx="-8" cy="0" rx="8" ry="5" fill={dark ? '#324228' : '#6A8A50'} opacity="0.6" />
          <ellipse cx="8" cy="0" rx="8" ry="5" fill={dark ? '#324228' : '#6A8A50'} opacity="0.6" />
        </g>
      ))}

      {/* Protea flowers */}
      {[{x:160,y:138},{x:710,y:132},{x:1050,y:140}].map((p,i) => (
        <g key={`protea-${i}`} transform={`translate(${p.x},${p.y})`}>
          <rect x="-1" y="0" width="2" height="10" fill={dark ? '#4A6A38' : '#5A8A48'} />
          {[-30,-15,0,15,30].map((a,j) => (
            <ellipse key={j} cx={Math.sin(a*Math.PI/180)*6} cy={-5+Math.abs(a)*0.05} rx="3" ry="7"
              fill="url(#protea)" opacity={0.7+j*0.06}
              transform={`rotate(${a})`} />
          ))}
          <circle cx="0" cy="-5" r="3" fill={dark ? '#D84A70' : '#F06090'} />
          <circle cx="0" cy="-5" r="1.5" fill={dark ? '#E8809A' : '#FFB0C0'} />
        </g>
      ))}

      {/* Ground */}
      <rect y="148" width="1400" height="52" fill="url(#ground)" />

      {/* Road */}
      <path d="M-20 178 Q350 170 700 174 Q1050 178 1420 172" stroke={road1} strokeWidth="16" fill="none" />
      {Array.from({length:20},(_, i) => i*72+20).map((x,i) => (
        <rect key={`d-${i}`} x={x} y="172" width="28" height="3" rx="1.5" fill={dark ? '#5A5040' : '#E8DCC0'} opacity="0.7" />
      ))}

      {/* Grass tufts */}
      {[50,220,430,580,760,950,1120,1280,1380].map((x,i) => (
        <g key={`grass-${i}`} transform={`translate(${x},${148 + (i%3)*3})`}>
          <path d="M0 0 Q-2 -6 -1 -10 M0 0 Q0 -7 1 -11 M0 0 Q2 -6 3 -9"
            stroke={dark ? '#4A6A38' : '#8AAA60'} strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.5" />
        </g>
      ))}

      {/* ============================================================
          SCENE 1: Bakkie with boerboel & jack russell
          Position wrapper + animation wrapper separated
          ============================================================ */}
      <g transform="translate(60, 100)">
        <g className="scene-bakkie">
          {/* Bakkie body */}
          <rect x="0" y="32" width="56" height="28" rx="6" fill={dark ? '#4A7A5A' : '#6AAA7A'} />
          <rect x="50" y="18" width="40" height="42" rx="8" fill={dark ? '#4A7A5A' : '#6AAA7A'} />
          <rect x="55" y="22" width="30" height="18" rx="5" fill={dark ? '#4A6B8A' : '#A0D4F0'} opacity="0.85" />
          {/* Driver */}
          <circle cx="72" cy="30" r="7" fill={dark ? '#D4A06A' : '#C4906A'} />
          <circle cx="70" cy="28" r="1.2" fill="#2C2418" />
          <circle cx="75" cy="28" r="1.2" fill="#2C2418" />
          <circle cx="70" cy="27.5" r="0.4" fill="white" />
          <path d="M70 33 Q72.5 35 75 33" stroke="#2C2418" strokeWidth="0.8" fill="none" strokeLinecap="round" />
          {/* Cap */}
          <ellipse cx="72" cy="24" rx="8" ry="2" fill={dark ? '#C4613B' : '#E07040'} />
          <rect x="66" y="19" width="12" height="5" rx="2" fill={dark ? '#C4613B' : '#E07040'} />

          {/* Boerboel (big SA dog) */}
          <ellipse cx="22" cy="24" rx="14" ry="10" fill="#C89060" />
          <circle cx="35" cy="14" r="10" fill="#C89060" />
          <ellipse cx="40" cy="18" rx="6" ry="5" fill="#B07848" />
          <circle cx="33" cy="11" r="2.5" fill="#2C2418" />
          <circle cx="38" cy="11" r="2.5" fill="#2C2418" />
          <circle cx="33" cy="10" r="0.9" fill="white" />
          <circle cx="38" cy="10" r="0.9" fill="white" />
          <ellipse cx="36" cy="16" rx="3" ry="2" fill="#2C2418" />
          {/* Tongue — animated */}
          <g className="scene-tongue">
            <ellipse cx="36" cy="21" rx="3" ry="4" fill="#F08080" />
            <ellipse cx="36" cy="20" rx="2" ry="2.5" fill="#F8A0A0" />
          </g>
          {/* Floppy ears */}
          <ellipse cx="28" cy="14" rx="4" ry="7" fill="#A06838" transform="rotate(-15 28 14)" />
          <ellipse cx="43" cy="12" rx="4" ry="6" fill="#A06838" transform="rotate(10 43 12)" />
          {/* Wagging tail */}
          <g className="scene-tail-wag" style={{ transformOrigin: '8px 20px' }}>
            <path d="M8 20 Q2 10 5 4" stroke="#C89060" strokeWidth="4" fill="none" strokeLinecap="round" />
          </g>
          {/* Collar & tag */}
          <rect x="28" y="22" width="14" height="3" rx="1.5" fill={dark ? '#C4613B' : '#E05040'} />
          <circle cx="35" cy="25" r="1.5" fill="#FFD166" />

          {/* Jack Russell */}
          <ellipse cx="48" cy="28" rx="6" ry="5" fill="white" />
          <circle cx="50" cy="20" r="5" fill="white" />
          <circle cx="52" cy="19" r="3" fill="#C08040" />
          <ellipse cx="46" cy="30" rx="3" ry="2.5" fill="#C08040" />
          <circle cx="49" cy="19" r="1.2" fill="#2C2418" />
          <circle cx="52" cy="19" r="1.2" fill="#2C2418" />
          <circle cx="49" cy="18.5" r="0.4" fill="white" />
          <circle cx="51" cy="21" r="1.2" fill="#2C2418" />
          <path d="M49 22 Q51 23.5 53 22" stroke="#2C2418" strokeWidth="0.6" fill="none" />
          <path d="M47 15 L48 18 L45 17Z" fill="#C08040" />
          <path d="M54 15 L53 18 L56 17Z" fill="#C08040" />

          {/* Wheels — with spinning animation */}
          <g transform="translate(18, 62)">
            <circle r="9" fill={dark ? '#2A2018' : '#3A3028'} />
            <circle r="4" fill={dark ? '#5A4A38' : '#6A5A48'} />
            <g className="scene-wheel-spin">
              {[0,60,120,180,240,300].map((a,i) => (
                <line key={i} x1={Math.cos(a*Math.PI/180)*3} y1={Math.sin(a*Math.PI/180)*3}
                  x2={Math.cos(a*Math.PI/180)*8} y2={Math.sin(a*Math.PI/180)*8}
                  stroke={dark ? '#4A3A28' : '#5A4A38'} strokeWidth="1" />
              ))}
            </g>
            <circle r="1.5" fill={dark ? '#7A6A58' : '#8A7A68'} />
          </g>
          <g transform="translate(72, 62)">
            <circle r="9" fill={dark ? '#2A2018' : '#3A3028'} />
            <circle r="4" fill={dark ? '#5A4A38' : '#6A5A48'} />
            <g className="scene-wheel-spin">
              {[0,60,120,180,240,300].map((a,i) => (
                <line key={i} x1={Math.cos(a*Math.PI/180)*3} y1={Math.sin(a*Math.PI/180)*3}
                  x2={Math.cos(a*Math.PI/180)*8} y2={Math.sin(a*Math.PI/180)*8}
                  stroke={dark ? '#4A3A28' : '#5A4A38'} strokeWidth="1" />
              ))}
            </g>
            <circle r="1.5" fill={dark ? '#7A6A58' : '#8A7A68'} />
          </g>

          {/* Animated dust puffs */}
          <g className="scene-dust">
            <circle cx="-12" cy="60" r="6" fill={ground1} opacity="0.35" />
            <circle cx="-22" cy="56" r="5" fill={ground1} opacity="0.25" />
            <circle cx="-30" cy="59" r="3.5" fill={ground1} opacity="0.15" />
          </g>

          {/* Number plate */}
          <rect x="82" y="48" width="14" height="6" rx="1" fill="white" />
          <text x="89" y="53" fontSize="4" fill="#2C2418" textAnchor="middle" fontWeight="700" fontFamily="monospace">GP</text>
        </g>
      </g>

      {/* ============================================================
          SCENE 2: Kid on bicycle with dachshund in sidecar
          ============================================================ */}
      <g transform="translate(320, 106)">
        <g className="scene-bicycle">
          {/* Sidecar */}
          <ellipse cx="-6" cy="44" rx="14" ry="10" fill={dark ? '#D4A843' : '#F4C870'} />
          <ellipse cx="-6" cy="38" rx="12" ry="3" fill={dark ? '#C49838' : '#E8B850'} />
          <circle cx="-6" cy="56" r="7" fill={dark ? '#2A2018' : '#3A3028'} />
          <circle cx="-6" cy="56" r="3" fill={dark ? '#5A4A38' : '#6A5A48'} />

          {/* Dachshund in sidecar — goggles & scarf! */}
          <ellipse cx="-6" cy="36" rx="10" ry="5" fill="#8B5A30" />
          <circle cx="5" cy="30" r="6" fill="#8B5A30" />
          <circle cx="3" cy="28" r="2" fill="#2C2418" />
          <circle cx="8" cy="28" r="2" fill="#2C2418" />
          <circle cx="3.5" cy="27" r="0.7" fill="white" />
          <circle cx="8.5" cy="27" r="0.7" fill="white" />
          <ellipse cx="9" cy="32" rx="4" ry="2.5" fill="#6A4020" />
          <ellipse cx="11" cy="31" rx="2" ry="1.5" fill="#2C2418" />
          <path d="M7 34 Q9 36 11 34" stroke="#2C2418" strokeWidth="0.6" fill="none" />
          <ellipse cx="-1" cy="30" rx="3" ry="6" fill="#6A4020" transform="rotate(-20 -1 30)" />
          <ellipse cx="9" cy="28" rx="2.5" ry="5" fill="#6A4020" transform="rotate(15 9 28)" />
          {/* Goggles */}
          <ellipse cx="3" cy="28" rx="3" ry="2.5" fill="none" stroke={dark ? '#8B6B42' : '#C4A060'} strokeWidth="1.5" />
          <ellipse cx="8" cy="28" rx="3" ry="2.5" fill="none" stroke={dark ? '#8B6B42' : '#C4A060'} strokeWidth="1.5" />
          <line x1="6" y1="28" x2="5" y2="28" stroke={dark ? '#8B6B42' : '#C4A060'} strokeWidth="1" />
          {/* Flying scarf */}
          <g className="scene-scarf-flutter">
            <path d="M-2 34 Q-10 32 -16 36 Q-20 38 -18 34 Q-14 30 -8 32" fill="#E05040" opacity="0.8" />
          </g>
          {/* Paws on sidecar rim */}
          <ellipse cx="2" cy="38" rx="2.5" ry="1.5" fill="#8B5A30" />
          <ellipse cx="8" cy="38" rx="2.5" ry="1.5" fill="#8B5A30" />

          {/* Bicycle */}
          <g transform="translate(20, 56)">
            <circle r="10" fill="none" stroke={dark ? '#6A5A48' : '#5A4A38'} strokeWidth="2.5" />
            <circle r="2.5" fill={dark ? '#6A5A48' : '#5A4A38'} />
            <g className="scene-wheel-spin">
              {[0,60,120,180,240,300].map((a,i) => (
                <line key={i} x1={Math.cos(a*Math.PI/180)*2} y1={Math.sin(a*Math.PI/180)*2}
                  x2={Math.cos(a*Math.PI/180)*9} y2={Math.sin(a*Math.PI/180)*9}
                  stroke={dark ? '#5A4A38' : '#4A3A28'} strokeWidth="0.8" />
              ))}
            </g>
          </g>
          <g transform="translate(50, 56)">
            <circle r="10" fill="none" stroke={dark ? '#6A5A48' : '#5A4A38'} strokeWidth="2.5" />
            <circle r="2.5" fill={dark ? '#6A5A48' : '#5A4A38'} />
            <g className="scene-wheel-spin">
              {[0,60,120,180,240,300].map((a,i) => (
                <line key={i} x1={Math.cos(a*Math.PI/180)*2} y1={Math.sin(a*Math.PI/180)*2}
                  x2={Math.cos(a*Math.PI/180)*9} y2={Math.sin(a*Math.PI/180)*9}
                  stroke={dark ? '#5A4A38' : '#4A3A28'} strokeWidth="0.8" />
              ))}
            </g>
          </g>
          <path d="M20 56 L32 32 L50 56 M32 32 L48 32 L50 56 M20 56 L32 44 L50 56"
            stroke={dark ? '#C4613B' : '#E07040'} strokeWidth="2.5" fill="none" />
          <path d="M48 28 Q51 24 54 28" stroke={dark ? '#6A5A48' : '#5A4A38'} strokeWidth="2" fill="none" />
          <rect x="29" y="28" width="8" height="4" rx="2" fill={dark ? '#4A3A28' : '#6A5A48'} />
          <line x1="20" y1="56" x2="4" y2="50" stroke={dark ? '#6A5A48' : '#5A4A38'} strokeWidth="2" />

          {/* Kid rider with afro */}
          <circle cx="35" cy="18" r="8" fill={dark ? '#6B4C2C' : '#8B6B42'} />
          <circle cx="35" cy="14" r="9" fill={dark ? '#1A0E04' : '#2C1A08'} />
          <circle cx="33" cy="18" r="1.5" fill="#2C2418" />
          <circle cx="38" cy="18" r="1.5" fill="#2C2418" />
          <circle cx="33" cy="17" r="0.5" fill="white" />
          <circle cx="38" cy="17" r="0.5" fill="white" />
          <path d="M33 22 Q35.5 25 38 22" stroke="#2C2418" strokeWidth="1" fill="none" strokeLinecap="round" />
          <path d="M35 26 L34 38" stroke={dark ? '#4A7C59' : '#5A9A6E'} strokeWidth="4" strokeLinecap="round" />
          <path d="M35 30 L48 30" stroke={dark ? '#6B4C2C' : '#8B6B42'} strokeWidth="2.5" strokeLinecap="round" />
        </g>
      </g>

      {/* ============================================================
          SCENE 3: Meerkats watching (SO South African)
          ============================================================ */}
      <g transform="translate(560, 118)">
        <g className="scene-meerkats">
          {/* Meerkat 1 — standing tall, lookout */}
          <ellipse cx="0" cy="30" rx="5" ry="8" fill="#D4B080" />
          <circle cx="0" cy="18" r="6" fill="#D4B080" />
          <ellipse cx="0" cy="32" rx="4" ry="2" fill="#C4A070" />
          <ellipse cx="0" cy="19" rx="3.5" ry="3" fill="#E0C8A0" />
          <circle cx="-2" cy="17" r="1.8" fill="#2C2418" />
          <circle cx="2" cy="17" r="1.8" fill="#2C2418" />
          <circle cx="-2" cy="16.5" r="0.6" fill="white" />
          <circle cx="2" cy="16.5" r="0.6" fill="white" />
          <ellipse cx="-2" cy="17" rx="2.5" ry="2.2" fill="#8A6A40" opacity="0.4" />
          <ellipse cx="2" cy="17" rx="2.5" ry="2.2" fill="#8A6A40" opacity="0.4" />
          <ellipse cx="0" cy="20" rx="1.5" ry="1" fill="#2C2418" />
          <path d="M-1.5 22 Q0 23.5 1.5 22" stroke="#2C2418" strokeWidth="0.5" fill="none" />
          <circle cx="-4" cy="14" r="1.5" fill="#C4A060" />
          <circle cx="4" cy="14" r="1.5" fill="#C4A060" />
          {/* Arms up (looking around!) */}
          <g className="scene-meerkat-look">
            <path d="M-4 26 L-7 20" stroke="#C4A070" strokeWidth="2" strokeLinecap="round" />
            <path d="M4 26 L7 20" stroke="#C4A070" strokeWidth="2" strokeLinecap="round" />
          </g>
          <ellipse cx="-3" cy="38" rx="3" ry="1.5" fill="#B09060" />
          <ellipse cx="3" cy="38" rx="3" ry="1.5" fill="#B09060" />

          {/* Meerkat 2 — baby, looking up at parent */}
          <g className="scene-meerkat-baby">
            <ellipse cx="14" cy="34" rx="3.5" ry="5" fill="#D4B080" />
            <circle cx="14" cy="26" r="4.5" fill="#D4B080" />
            <ellipse cx="14" cy="27" rx="2.5" ry="2" fill="#E0C8A0" />
            <circle cx="13" cy="25" r="1.2" fill="#2C2418" />
            <circle cx="16" cy="25" r="1.2" fill="#2C2418" />
            <circle cx="13" cy="24.5" r="0.4" fill="white" />
            <circle cx="16" cy="24.5" r="0.4" fill="white" />
            <ellipse cx="14.5" cy="27.5" rx="1" ry="0.7" fill="#2C2418" />
            <circle cx="11.5" cy="23" r="1" fill="#C4A060" />
            <circle cx="17" cy="23" r="1" fill="#C4A060" />
            <ellipse cx="12" cy="39" rx="2" ry="1" fill="#B09060" />
            <ellipse cx="16" cy="39" rx="2" ry="1" fill="#B09060" />
          </g>

          {/* Meerkat 3 — tiny one peeking from burrow */}
          <g className="scene-meerkat-peek">
            <ellipse cx="-12" cy="38" rx="4" ry="3" fill={ground1} />
            <circle cx="-12" cy="32" r="3.5" fill="#D4B080" />
            <ellipse cx="-12" cy="33" rx="2" ry="1.5" fill="#E0C8A0" />
            <circle cx="-13" cy="31" r="0.9" fill="#2C2418" />
            <circle cx="-11" cy="31" r="0.9" fill="#2C2418" />
            <circle cx="-13" cy="30.5" r="0.3" fill="white" />
            <ellipse cx="-12" cy="33.5" rx="0.8" ry="0.5" fill="#2C2418" />
          </g>
        </g>
      </g>

      {/* ============================================================
          SCENE 4: Family hiking — mom with doek, kid, ridgeback + cat backpack
          ============================================================ */}
      <g transform="translate(700, 82)">
        <g className="scene-hikers">
          {/* Mom */}
          <circle cx="10" cy="20" r="9" fill={dark ? '#D4A06A' : '#C4906A'} />
          <path d="M1 16 Q10 6 19 16 Q16 10 10 9 Q4 10 1 16Z" fill={dark ? '#D4A843' : '#E8C060'} />
          <path d="M3 16 Q10 8 17 16" fill={dark ? '#C49838' : '#D4B040'} />
          <circle cx="7" cy="19" r="1.8" fill="#2C2418" />
          <circle cx="13" cy="19" r="1.8" fill="#2C2418" />
          <circle cx="7.5" cy="18" r="0.6" fill="white" />
          <circle cx="13.5" cy="18" r="0.6" fill="white" />
          <path d="M7 24 Q10 27 13 24" stroke="#2C2418" strokeWidth="1" fill="none" strokeLinecap="round" />
          <path d="M10 29 L10 52" stroke={dark ? '#8A4A6A' : '#C06A8A'} strokeWidth="5" strokeLinecap="round" />
          {/* Walking legs — no animation wrapper, legs drawn statically to stay connected */}
          <path d="M10 52 L5 72" stroke={dark ? '#4A6B8A' : '#6A8AA8'} strokeWidth="4" strokeLinecap="round" />
          <path d="M10 52 L17 72" stroke={dark ? '#4A6B8A' : '#6A8AA8'} strokeWidth="4" strokeLinecap="round" />
          <rect x="2" y="70" width="7" height="4" rx="2" fill={dark ? '#6B4C2C' : '#8B6040'} />
          <rect x="14" y="70" width="7" height="4" rx="2" fill={dark ? '#6B4C2C' : '#8B6040'} />
          <line x1="0" y1="34" x2="-5" y2="72" stroke={dark ? '#8B6B42' : '#A08050'} strokeWidth="2.5" strokeLinecap="round" />

          {/* Cat bubble backpack */}
          <rect x="16" y="24" width="18" height="22" rx="5" fill={dark ? '#C4613B' : '#E07040'} />
          <circle cx="25" cy="34" r="7.5" fill={dark ? '#4A6B8A' : '#B0D8F0'} opacity="0.65" />
          <circle cx="25" cy="34" r="7.5" fill="none" stroke={dark ? '#A05030' : '#C05030'} strokeWidth="1.2" />
          {/* Cat with animated blinking eyes */}
          <circle cx="25" cy="32" r="4.5" fill="#A0A0A0" />
          <g className="scene-cat-blink">
            <ellipse cx="23" cy="30.5" rx="1.5" ry="1.8" fill="#50C050" />
            <ellipse cx="27.5" cy="30.5" rx="1.5" ry="1.8" fill="#50C050" />
            <ellipse cx="23" cy="30.5" rx="0.8" ry="1.5" fill="#2C2418" />
            <ellipse cx="27.5" cy="30.5" rx="0.8" ry="1.5" fill="#2C2418" />
            <circle cx="22.5" cy="29.5" r="0.4" fill="white" />
            <circle cx="27" cy="29.5" r="0.4" fill="white" />
          </g>
          <path d="M25 33 L24.5 33.5 L25.5 33.5Z" fill="#FFB0B0" />
          <line x1="20" y1="33" x2="17" y2="32" stroke="#888" strokeWidth="0.5" />
          <line x1="20" y1="34" x2="17" y2="34.5" stroke="#888" strokeWidth="0.5" />
          <line x1="30" y1="33" x2="33" y2="32" stroke="#888" strokeWidth="0.5" />
          <line x1="30" y1="34" x2="33" y2="34.5" stroke="#888" strokeWidth="0.5" />
          <path d="M21 24 L22.5 28 L19 26Z" fill="#A0A0A0" />
          <path d="M29 24 L27.5 28 L31 26Z" fill="#A0A0A0" />
          <path d="M21.5 25 L22.5 27 L20 26Z" fill="#FFB0C0" />
          <path d="M28.5 25 L27.5 27 L30 26Z" fill="#FFB0C0" />
          <path d="M18 26 Q14 32 12 34" stroke={dark ? '#A05030' : '#C05030'} strokeWidth="1.5" fill="none" />

          {/* Kid walking ahead */}
          <circle cx="52" cy="32" r="7" fill={dark ? '#8B6B42' : '#A08050'} />
          <path d="M45 30 Q52 22 59 30" fill={dark ? '#4A7C59' : '#5A9A6E'} />
          <circle cx="52" cy="23" r="2" fill={dark ? '#4A7C59' : '#5A9A6E'} />
          <circle cx="50" cy="32" r="1.3" fill="#2C2418" />
          <circle cx="55" cy="32" r="1.3" fill="#2C2418" />
          <circle cx="50" cy="31.5" r="0.5" fill="white" />
          <path d="M50 36 Q52 38 55 36" stroke="#2C2418" strokeWidth="0.8" fill="none" strokeLinecap="round" />
          <path d="M52 39 L52 54" stroke={dark ? '#D4A843' : '#E8C060'} strokeWidth="4" strokeLinecap="round" />
          <path d="M52 54 L47 72" stroke={dark ? '#4A6B8A' : '#6A8AA8'} strokeWidth="3" strokeLinecap="round" />
          <path d="M52 54 L58 72" stroke={dark ? '#4A6B8A' : '#6A8AA8'} strokeWidth="3" strokeLinecap="round" />
          <rect x="44" y="70" width="6" height="3" rx="1.5" fill={dark ? '#C4613B' : '#E07040'} />
          <rect x="56" y="70" width="6" height="3" rx="1.5" fill={dark ? '#C4613B' : '#E07040'} />

          {/* Ridgeback running ahead — happy & bouncy */}
          <g className="scene-dog-bounce">
            <ellipse cx="82" cy="50" rx="16" ry="10" fill="#C4956A" />
            <circle cx="98" cy="40" r="9" fill="#C4956A" />
            <ellipse cx="104" cy="43" rx="5" ry="3.5" fill="#B08558" />
            <ellipse cx="106" cy="42" rx="2.5" ry="1.8" fill="#2C2418" />
            <circle cx="97" cy="38" r="2" fill="#2C2418" />
            <circle cx="102" cy="37.5" r="2" fill="#2C2418" />
            <circle cx="97.5" cy="37" r="0.7" fill="white" />
            <circle cx="102.5" cy="36.5" r="0.7" fill="white" />
            <path d="M99 46 Q103 50 107 46" stroke="#2C2418" strokeWidth="1" fill="none" strokeLinecap="round" />
            <g className="scene-tongue">
              <ellipse cx="103" cy="48" rx="2.5" ry="3" fill="#F08080" />
            </g>
            <ellipse cx="93" cy="38" rx="3.5" ry="6" fill="#A07548" transform="rotate(-20 93 38)" />
            <ellipse cx="103" cy="35" rx="3" ry="5" fill="#A07548" transform="rotate(15 103 35)" />
            <path d="M72 44 Q76 38 80 44 Q84 38 88 44 Q92 38 96 44" stroke="#A07548" strokeWidth="1.5" fill="none" />
            {/* Animated happy tail */}
            <g className="scene-tail-wag" style={{ transformOrigin: '66px 46px' }}>
              <path d="M66 46 Q60 34 63 28" stroke="#C4956A" strokeWidth="4" fill="none" strokeLinecap="round" />
            </g>
            {/* Legs — drawn from hip to paw, all inside bounce group so they move together */}
            <line x1="74" y1="58" x2="72" y2="72" stroke="#B08558" strokeWidth="3" strokeLinecap="round" />
            <line x1="80" y1="58" x2="82" y2="72" stroke="#B08558" strokeWidth="3" strokeLinecap="round" />
            <line x1="90" y1="56" x2="88" y2="72" stroke="#B08558" strokeWidth="3" strokeLinecap="round" />
            <line x1="95" y1="55" x2="97" y2="72" stroke="#B08558" strokeWidth="3" strokeLinecap="round" />
            {/* Paws */}
            <ellipse cx="72" cy="73" rx="3" ry="1.5" fill="#B08558" />
            <ellipse cx="82" cy="73" rx="3" ry="1.5" fill="#B08558" />
            <ellipse cx="88" cy="73" rx="3" ry="1.5" fill="#B08558" />
            <ellipse cx="97" cy="73" rx="3" ry="1.5" fill="#B08558" />
            <rect x="90" y="47" width="12" height="3" rx="1.5" fill="#E05040" />
          </g>
          <path d="M56 46 Q70 50 76 48" stroke={dark ? '#8B6B42' : '#A08050'} strokeWidth="1.2" fill="none" strokeDasharray="3 2" />
        </g>
      </g>

      {/* ============================================================
          SCENE 5: VW Kombi with surfboard, border collie & parrot
          ============================================================ */}
      <g transform="translate(1050, 96)">
        <g className="scene-kombi">
          {/* Kombi body */}
          <rect x="0" y="14" width="70" height="44" rx="10" fill={dark ? '#4A6B8A' : '#6AA0C8'} />
          <path d="M5 14 Q35 2 65 14" fill={dark ? '#3A5A7A' : '#5A90B8'} />
          <rect x="60" y="20" width="12" height="30" rx="4" fill={dark ? '#4A6B8A' : '#6AA0C8'} />
          <circle cx="35" cy="12" r="5" fill={dark ? '#3A5A7A' : '#5A90B8'} stroke="white" strokeWidth="1" />
          <rect x="5" y="18" width="16" height="14" rx="3" fill={dark ? '#4A6B8A' : '#A0D4F0'} opacity="0.85" />
          <rect x="24" y="18" width="16" height="14" rx="3" fill={dark ? '#4A6B8A' : '#A0D4F0'} opacity="0.85" />
          <rect x="43" y="18" width="16" height="14" rx="3" fill={dark ? '#4A6B8A' : '#A0D4F0'} opacity="0.85" />
          <rect x="61" y="22" width="10" height="16" rx="3" fill={dark ? '#4A6B8A' : '#A0D4F0'} opacity="0.85" />
          <circle cx="72" cy="36" r="3" fill="#FFE080" />
          <rect x="-2" y="54" width="76" height="4" rx="2" fill={dark ? '#5A5040' : '#888'} />
          <rect x="0" y="36" width="60" height="3" rx="1.5" fill="white" opacity="0.4" />

          {/* Driver with shades */}
          <circle cx="65" cy="28" r="5" fill={dark ? '#D4A06A' : '#C4906A'} />
          <circle cx="64" cy="27" r="1" fill="#2C2418" />
          <circle cx="67" cy="27" r="1" fill="#2C2418" />
          <path d="M63 30 Q65 32 67 30" stroke="#2C2418" strokeWidth="0.7" fill="none" />
          <rect x="62" y="25.5" width="3" height="2" rx="1" fill="#2C2418" opacity="0.6" />
          <rect x="66" y="25.5" width="3" height="2" rx="1" fill="#2C2418" opacity="0.6" />

          {/* Parrot on roof — animated wing flap */}
          <g className="scene-parrot-bob">
            <ellipse cx="45" cy="6" rx="5" ry="6" fill="#40B040" />
            <circle cx="48" cy="0" r="4.5" fill="#40B040" />
            <g className="scene-wing-flap">
              <ellipse cx="42" cy="8" rx="4" ry="5" fill="#30A030" transform="rotate(-15 42 8)" />
            </g>
            <circle cx="50" cy="-1" r="1.2" fill="#2C2418" />
            <circle cx="50" cy="-1.5" r="0.4" fill="white" />
            <path d="M52 0 L55 1 L52 2Z" fill="#FFB020" />
            <ellipse cx="47" cy="5" rx="3" ry="3" fill="#E04040" />
            <path d="M40 10 L35 16 M41 10 L37 17 M42 9 L39 16" stroke="#30A030" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M46 -3 Q48 -8 50 -4" fill="#FFD020" />
          </g>

          {/* Surfboard on roof */}
          <rect x="8" y="5" width="38" height="5" rx="2.5" fill={dark ? '#D4A843' : '#F4C870'} />
          <ellipse cx="8" cy="7.5" rx="2" ry="2.5" fill={dark ? '#D4A843' : '#F4C870'} />
          <rect x="14" y="7" width="24" height="1.5" rx="0.75" fill={dark ? '#C4613B' : '#E07040'} opacity="0.6" />

          {/* Border collie head out window */}
          <g className="scene-dog-bounce">
            <circle cx="32" cy="18" r="5" fill="white" />
            <circle cx="28" cy="16" r="3" fill="#2C2418" />
            <circle cx="36" cy="16" r="3" fill="#2C2418" />
            <circle cx="31" cy="17" r="1.3" fill="#2C2418" />
            <circle cx="34" cy="17" r="1.3" fill="#2C2418" />
            <circle cx="31" cy="16.5" r="0.4" fill="white" />
            <circle cx="34" cy="16.5" r="0.4" fill="white" />
            <ellipse cx="32.5" cy="20" rx="1.5" ry="1" fill="#2C2418" />
            <path d="M30 21.5 Q32 23 34 21.5" stroke="#2C2418" strokeWidth="0.5" fill="none" />
            <g className="scene-tongue">
              <ellipse cx="33" cy="23" rx="1.5" ry="2" fill="#F08080" />
            </g>
          </g>

          {/* Wheels with spin */}
          <g transform="translate(16, 62)">
            <circle r="9" fill={dark ? '#2A2018' : '#3A3028'} />
            <circle r="4" fill={dark ? '#5A4A38' : '#6A5A48'} />
            <g className="scene-wheel-spin">
              {[0,60,120,180,240,300].map((a,i) => (
                <line key={i} x1={Math.cos(a*Math.PI/180)*3} y1={Math.sin(a*Math.PI/180)*3}
                  x2={Math.cos(a*Math.PI/180)*8} y2={Math.sin(a*Math.PI/180)*8}
                  stroke={dark ? '#4A3A28' : '#5A4A38'} strokeWidth="1" />
              ))}
            </g>
          </g>
          <g transform="translate(58, 62)">
            <circle r="9" fill={dark ? '#2A2018' : '#3A3028'} />
            <circle r="4" fill={dark ? '#5A4A38' : '#6A5A48'} />
            <g className="scene-wheel-spin">
              {[0,60,120,180,240,300].map((a,i) => (
                <line key={i} x1={Math.cos(a*Math.PI/180)*3} y1={Math.sin(a*Math.PI/180)*3}
                  x2={Math.cos(a*Math.PI/180)*8} y2={Math.sin(a*Math.PI/180)*8}
                  stroke={dark ? '#4A3A28' : '#5A4A38'} strokeWidth="1" />
              ))}
            </g>
          </g>

          {/* Peace sign */}
          <circle cx="12" cy="42" r="4" fill={dark ? '#D4A843' : '#FFD166'} opacity="0.6" />
          <text x="12" y="44" fontSize="5" fill={dark ? '#8B6B42' : '#C4A060'} textAnchor="middle">✌</text>

          {/* Dust */}
          <g className="scene-dust">
            <circle cx="-12" cy="60" r="6" fill={ground1} opacity="0.3" />
            <circle cx="-22" cy="56" r="5" fill={ground1} opacity="0.2" />
            <circle cx="-30" cy="59" r="3.5" fill={ground1} opacity="0.1" />
          </g>
        </g>
      </g>

      {/* Birds */}
      {[{x:280,y:20},{x:290,y:15},{x:300,y:20},{x:295,y:10},{x:310,y:16},{x:960,y:18},{x:970,y:12},{x:980,y:18}].map((b,i) => (
        <g key={`b-${i}`} transform={`translate(${b.x},${b.y})`}>
          <g className="scene-bird-fly" style={{ animationDelay: `${i * 0.3}s` }}>
            <path d={`M-5 0 Q0 -4 5 0`} stroke={sky1} strokeWidth="1.2" fill="none" />
          </g>
        </g>
      ))}

      {/* Paw prints on road */}
      {[180,300,470,640,810,1000,1200].map((x,i) => (
        <g key={`paw-${i}`} transform={`translate(${x},${170 + (i%2)*4}) scale(0.4)`} opacity="0.2">
          <circle cx="0" cy="4" r="4" fill={dark ? '#8A7A68' : '#6A5A48'} />
          <circle cx="-4" cy="-2" r="2.2" fill={dark ? '#8A7A68' : '#6A5A48'} />
          <circle cx="4" cy="-2" r="2.2" fill={dark ? '#8A7A68' : '#6A5A48'} />
          <circle cx="-1" cy="-5" r="2" fill={dark ? '#8A7A68' : '#6A5A48'} />
          <circle cx="1" cy="-5" r="2" fill={dark ? '#8A7A68' : '#6A5A48'} />
        </g>
      ))}
    </svg>
  )
}

const PET_TYPE_ICONS = {
  'dog-small': '🐕', 'dog-medium': '🦮', 'dog-large': '🐕‍🦺',
  'cat': '🐱', 'bird': '🦜', 'rabbit': '🐇',
}

export default function Header({ dark, onToggleDark, panelOpen, onTogglePanel, darkIcon, darkTitle, pets = [] }) {
  return (
    <header style={{
      height: 160, flexShrink: 0,
      position: 'relative',
      overflow: 'hidden',
      borderBottom: `1px solid ${dark ? 'var(--border-dark)' : '#E8DCC0'}`,
      zIndex: 100,
    }}>
      <TravelScene dark={dark} />

      {/* Content overlay */}
      <div style={{
        position: 'relative', zIndex: 2,
        height: '100%',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        padding: '14px 24px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 48, height: 48,
            background: dark ? 'rgba(26,22,18,0.85)' : 'rgba(255,253,245,0.9)',
            borderRadius: 'var(--radius-md)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28,
            boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
            backdropFilter: 'blur(10px)',
          }}>
            🐾
          </div>
          <div style={{
            background: dark ? 'rgba(26,22,18,0.75)' : 'rgba(255,253,245,0.8)',
            padding: '8px 16px',
            borderRadius: 'var(--radius-md)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          }}>
            <h1 style={{
              fontSize: 24, fontWeight: 800, margin: 0, lineHeight: 1.1,
              fontFamily: 'var(--font-body)',
              letterSpacing: '-0.02em',
              color: dark ? 'var(--text-dark)' : 'var(--text)',
            }}>
              PawRoutes
            </h1>
            <span style={{
              fontSize: 10,
              color: dark ? 'var(--text-secondary-dark)' : 'var(--text-secondary)',
              fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase',
            }}>
              South Africa
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={onTogglePanel} className="mobile-toggle" style={{
            display: 'none', width: 40, height: 40, borderRadius: 'var(--radius-md)',
            background: dark ? 'rgba(26,22,18,0.85)' : 'rgba(255,253,245,0.9)',
            border: 'none', cursor: 'pointer', color: dark ? 'var(--text-dark)' : 'var(--text)',
            fontSize: 16, fontWeight: 600, alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(10px)', boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
          }}>
            {panelOpen ? '✕' : '☰'}
          </button>

          {/* Pack avatars in header */}
          {pets.length > 0 && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 2,
              background: dark ? 'rgba(26,22,18,0.8)' : 'rgba(255,253,245,0.88)',
              padding: '4px 12px 4px 6px',
              borderRadius: 'var(--radius-full)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
            }}>
              <span style={{ fontSize: 12, marginRight: 4 }}>🐾</span>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {pets.map((pet, i) => (
                  <div key={pet.id} title={pet.name} style={{
                    width: 32, height: 32, borderRadius: '50%',
                    overflow: 'hidden',
                    border: `2px solid ${dark ? 'var(--card-dark)' : '#FFF'}`,
                    marginLeft: i > 0 ? -8 : 0,
                    zIndex: pets.length - i,
                    position: 'relative',
                    background: pet.photo ? 'none' : (dark ? 'var(--card-dark)' : 'var(--sand-light)'),
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 16,
                    boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
                    transition: 'transform 0.2s var(--ease-bounce)',
                    cursor: 'default',
                  }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.15) translateY(-2px)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    {pet.photo ? (
                      <img src={pet.photo} alt={pet.name} style={{
                        width: '100%', height: '100%', objectFit: 'cover',
                      }} />
                    ) : (
                      PET_TYPE_ICONS[pet.type] || '🐾'
                    )}
                  </div>
                ))}
              </div>
              <span style={{
                fontSize: 11, fontWeight: 600, marginLeft: 6,
                color: dark ? 'var(--text-secondary-dark)' : 'var(--text-secondary)',
              }}>
                {pets.length === 1 ? pets[0].name : `${pets.length} pack`}
              </span>
            </div>
          )}

          <span style={{
            fontSize: 14, fontWeight: 500,
            color: dark ? 'var(--text-secondary-dark)' : 'var(--text-secondary)',
            fontFamily: 'var(--font-display)',
            background: dark ? 'rgba(26,22,18,0.75)' : 'rgba(255,253,245,0.8)',
            padding: '6px 16px', borderRadius: 'var(--radius-full)',
            backdropFilter: 'blur(10px)', boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          }}>
            Toll-free travel with your best friend 🇿🇦
          </span>

          <button onClick={onToggleDark} style={{
            width: 40, height: 40, borderRadius: 'var(--radius-md)',
            background: dark ? 'rgba(26,22,18,0.85)' : 'rgba(255,253,245,0.9)',
            border: 'none', cursor: 'pointer', color: dark ? 'var(--text-dark)' : 'var(--text)',
            fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'transform 0.2s var(--ease-bounce)',
            backdropFilter: 'blur(10px)', boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
          }}
            title={darkTitle || (dark ? 'Light mode' : 'Dark mode')}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            {darkIcon || (dark ? '☀️' : '🌙')}
          </button>
        </div>
      </div>
    </header>
  )
}
