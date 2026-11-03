import React, { useState, useEffect } from 'react';
import { ambientLoop } from '../hooks/useAmbientLoop';

export function ProjectShipLog({ ambient = true, onClick }) {
  const [hovered, setHovered] = useState(false);
  const [activePage, setActivePage] = useState(0);

  useEffect(() => {
    if (!ambient || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const cleanup = ambientLoop(() => {
      setActivePage((prev) => (prev + 1) % 2);
    }, 5500, 10000);
    return cleanup;
  }, [ambient]);

  return (
    <div
      style={{
        width: '100%',
        height: 'auto',
        cursor: 'pointer',
        transform: hovered ? 'translateY(-3px)' : 'none',
        transition: 'transform 0.2s ease'
      }}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label="Engineering Ship Log & Milestones"
    >
      <svg
        viewBox="0 0 389 287"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: 'auto', display: 'block' }}
      >
        <defs>
          <filter id="cal-shadow" x="-6%" y="-5%" width="115%" height="116%" filterUnits="userSpaceOnUse">
            <feDropShadow dx="4" dy="7" stdDeviation="3" floodColor="#000" floodOpacity="0.45" />
          </filter>

          <linearGradient id="cal-header-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#C62E47" />
            <stop offset="100%" stopColor="#E78BA0" />
          </linearGradient>

          <linearGradient id="ring-metal" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF" />
            <stop offset="50%" stopColor="#94A3B8" />
            <stop offset="100%" stopColor="#334155" />
          </linearGradient>

          <linearGradient id="status-live" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7ECFAE" />
            <stop offset="100%" stopColor="#AAF0CE" />
          </linearGradient>
        </defs>

        {/* Desk Contact Shadow */}
        <ellipse cx="194.5" cy="275" rx="165" ry="10" fill="#000" opacity="0.45" />

        <g filter="url(#cal-shadow)">
          {/* Calendar Stand Backing Card */}
          <rect x="22" y="24" width="345" height="248" rx="8" fill="#F4EADB" stroke="#212121" strokeWidth="2.5" />
          
          {/* Folded stand bottom lip */}
          <path d="M22 254 L367 254 L355 272 L34 272 Z" fill="#E2BD78" stroke="#212121" strokeWidth="2" />

          {/* Calendar Top Header Banner */}
          <path d="M22 24 H367 V74 H22 Z" fill="url(#cal-header-grad)" />
          <path d="M22 74 H367" stroke="#212121" strokeWidth="2" />

          {/* Calendar Spiral Wire Rings (7 Rings) */}
          {[55, 100, 145, 190, 235, 280, 325].map((rx, idx) => (
            <g key={idx}>
              <rect x={rx - 4} y="12" width="8" height="24" rx="4" fill="url(#ring-metal)" stroke="#212121" strokeWidth="1.2" />
              <ellipse cx={rx} cy="24" rx="2.5" ry="1" fill="#1E293B" />
            </g>
          ))}

          {/* Header Typography */}
          <text
            x="194.5"
            y="51"
            textAnchor="middle"
            fill="#FFF"
            fontFamily="var(--font-recoleta), serif"
            fontWeight="700"
            fontSize="13.5"
            letterSpacing="0.06em"
          >
            ENGINEERING SHIP LOG
          </text>
          
          <text
            x="194.5"
            y="65"
            textAnchor="middle"
            fill="#FFF"
            fontFamily="var(--font-poppins), sans-serif"
            fontWeight="600"
            fontSize="7.2"
            letterSpacing="0.12em"
            opacity="0.9"
          >
            PRODUCTION RELEASES &amp; MILESTONES
          </text>

          {/* Calendar Inner Page Body */}
          <rect x="36" y="86" width="317" height="156" rx="4" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />

          {/* Milestone Row 1: SIH Finalist Mission Copilot */}
          <rect x="46" y="96" width="297" height="30" rx="4" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="0.8" />
          <rect x="46" y="96" width="5" height="30" rx="2" fill="#10B981" />
          <text x="58" y="109.5" fill="#0F172A" fontFamily="var(--font-poppins), sans-serif" fontWeight="700" fontSize="8.8">
            Mission Copilot (SIH Finalist)
          </text>
          <text x="58" y="120" fill="#64748B" fontFamily="var(--font-poppins), sans-serif" fontSize="6.8">
            AI lunar telemetry &amp; predictive risk model
          </text>
          <rect x="272" y="103" width="62" height="16" rx="8" fill="#AAF0CE" stroke="#10B981" strokeWidth="0.8" />
          <path d="M280 106.5 L281.2 110.2 L285 110.2 L282 112.3 L283.1 116 L280 113.8 L276.9 116 L278 112.3 L275 110.2 L278.8 110.2 Z" fill="#064E3B" />
          <text x="305" y="114" textAnchor="middle" fill="#064E3B" fontSize="6.8" fontWeight="800">SIH FINAL</text>

          {/* Milestone Row 2: couplewatch.in */}
          <rect x="46" y="132" width="297" height="30" rx="4" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="0.8" />
          <rect x="46" y="132" width="5" height="30" rx="2" fill="#38BDF8" />
          <text x="58" y="145.5" fill="#0F172A" fontFamily="var(--font-poppins), sans-serif" fontWeight="700" fontSize="8.8">
            CoupleWatch (couplewatch.in)
          </text>
          <text x="58" y="156" fill="#64748B" fontFamily="var(--font-poppins), sans-serif" fontSize="6.8">
            Realtime watch-party &amp; WebRTC video sync
          </text>
          <rect x="272" y="139" width="62" height="16" rx="8" fill="#BAE6FD" stroke="#0284C7" strokeWidth="0.8" />
          <polygon points="280 142 276 148 279 148 278 153 283 147 280 147 280 142" fill="#0C4A6E" />
          <text x="305" y="150" textAnchor="middle" fill="#0C4A6E" fontSize="6.8" fontWeight="800">LIVE PROD</text>

          {/* Milestone Row 3: S-VYASA University & Leadership */}
          <rect x="46" y="168" width="297" height="30" rx="4" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="0.8" />
          <rect x="46" y="168" width="5" height="30" rx="2" fill="#A855F7" />
          <text x="58" y="181.5" fill="#0F172A" fontFamily="var(--font-poppins), sans-serif" fontWeight="700" fontSize="8.8">
            S-VYASA University (Bengaluru)
          </text>
          <text x="58" y="192" fill="#64748B" fontFamily="var(--font-poppins), sans-serif" fontSize="6.8">
            Computer Science • Sports President &amp; Lead
          </text>
          <rect x="272" y="175" width="62" height="16" rx="8" fill="#E9D5FF" stroke="#9333EA" strokeWidth="0.8" />
          <path d="M280 178 L285 180.5 L280 183 L275 180.5 Z M277 183.5 V186 C277 187 283 187 283 186 V183.5" fill="#581C87" />
          <text x="305" y="186" textAnchor="middle" fill="#581C87" fontSize="6.8" fontWeight="800">CS DEGREE</text>

          {/* Bottom Availability Status Banner */}
          <rect x="46" y="204" width="297" height="26" rx="5" fill="#0F172A" stroke="#1E293B" strokeWidth="1" />
          <circle cx="59" cy="217" r="3.5" fill="#10B981" />
          <text x="68" y="220" fill="#AAF0CE" fontFamily="var(--font-poppins), sans-serif" fontWeight="700" fontSize="7" letterSpacing="0.04em">
            STATUS: OPEN FOR INTERNSHIPS &amp; FREELANCE
          </text>
        </g>
      </svg>
    </div>
  );
}
