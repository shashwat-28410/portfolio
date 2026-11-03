import React, { useState, useEffect } from 'react';
import { ambientLoop } from '../hooks/useAmbientLoop';

export function DevToolsBox({ ambient = true, onClick }) {
  const [hovered, setHovered] = useState(false);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (!ambient || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const cleanup = ambientLoop(() => {
      setPulse(true);
      setTimeout(() => setPulse(false), 500);
    }, 6000, 11000);
    return cleanup;
  }, [ambient]);

  return (
    <div
      style={{
        width: '100%',
        height: 'auto',
        cursor: 'pointer',
        transform: hovered ? 'translateY(-4px) scale(1.02)' : pulse ? 'translateY(-2px)' : 'none',
        transition: 'transform 0.22s cubic-bezier(0.2, 0.9, 0.3, 1)'
      }}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label="Open Source SDKs & Developer Tools"
    >
      <svg
        viewBox="0 0 233 223"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: 'auto', display: 'block' }}
      >
        <defs>
          {/* Shadow */}
          <filter id="box-shadow" x="-10%" y="-5%" width="125%" height="120%" filterUnits="userSpaceOnUse">
            <feDropShadow dx="3" dy="7" stdDeviation="3" floodColor="#000" floodOpacity="0.4" />
          </filter>

          {/* Gradients */}
          <linearGradient id="box-body" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="50%" stopColor="#0F172A" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>

          <linearGradient id="handle-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FAC042" />
            <stop offset="100%" stopColor="#E2846A" />
          </linearGradient>

          <linearGradient id="accent-band" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7ECFAE" />
            <stop offset="50%" stopColor="#94D1E4" />
            <stop offset="100%" stopColor="#CFC0E9" />
          </linearGradient>

          <radialGradient id="badge-glow" cx="40%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#AAF0CE" />
            <stop offset="100%" stopColor="#10B981" />
          </radialGradient>
        </defs>

        {/* Ground contact shadow */}
        <ellipse cx="116.5" cy="205" rx="88" ry="12" fill="#000" opacity="0.45" />

        <g filter="url(#box-shadow)">
          {/* Top Leather / Metal Carry Handle */}
          <path
            d="M85 36 C85 18, 148 18, 148 36"
            fill="none"
            stroke="url(#handle-grad)"
            strokeWidth="9"
            strokeLinecap="round"
          />
          {/* Handle metal brackets */}
          <rect x="79" y="32" width="12" height="10" rx="2" fill="#CBD5E1" stroke="#212121" strokeWidth="1.5" />
          <rect x="142" y="32" width="12" height="10" rx="2" fill="#CBD5E1" stroke="#212121" strokeWidth="1.5" />

          {/* Main Developer Toolbox / Crate Body */}
          <rect x="24" y="40" width="185" height="158" rx="14" fill="url(#box-body)" stroke="#212121" strokeWidth="2.5" />

          {/* Top Lid Chamfer Line */}
          <path d="M24 78 L209 78" stroke="#334155" strokeWidth="2" />
          {/* Metal clasps */}
          <rect x="62" y="70" width="16" height="16" rx="3" fill="#E2E8F0" stroke="#1E293B" strokeWidth="1.2" />
          <circle cx="70" cy="78" r="2" fill="#0F172A" />
          <rect x="155" y="70" width="16" height="16" rx="3" fill="#E2E8F0" stroke="#1E293B" strokeWidth="1.2" />
          <circle cx="163" cy="78" r="2" fill="#0F172A" />

          {/* Glowing Rainbow Accent Stripe Across Front */}
          <rect x="25" y="94" width="183" height="6" fill="url(#accent-band)" />

          {/* Center Brand Plate: GITHUB REPOSITORIES */}
          <rect x="36" y="112" width="161" height="42" rx="6" fill="#0A0F1D" stroke="#38BDF8" strokeWidth="1.2" />
          
          <text
            x="116.5"
            y="128"
            textAnchor="middle"
            fill="#FFF"
            fontFamily="var(--font-recoleta), serif"
            fontWeight="700"
            fontSize="12"
            letterSpacing="0.04em"
          >
            GITHUB REPOS
          </text>
          
          <text
            x="116.5"
            y="144"
            textAnchor="middle"
            fill="#AAF0CE"
            fontFamily="var(--font-poppins), monospace"
            fontWeight="600"
            fontSize="8"
            letterSpacing="0.14em"
          >
            @shashwat-28410
          </text>

          {/* Pinned Tag Badges on lower crate */}
          {/* CoupleWatch Tag */}
          <rect x="34" y="162" width="62" height="18" rx="4" fill="#0284C7" stroke="#212121" strokeWidth="0.8" />
          <text x="65" y="174" textAnchor="middle" fill="#FFF" fontFamily="sans-serif" fontWeight="700" fontSize="6.8">
            couple-watch
          </text>

          {/* Mission Copilot Tag */}
          <rect x="100" y="162" width="66" height="18" rx="4" fill="#059669" stroke="#212121" strokeWidth="0.8" />
          <text x="133" y="174" textAnchor="middle" fill="#FFF" fontFamily="monospace" fontWeight="700" fontSize="6.8">
            mission_copilot
          </text>

          {/* WebRTC / AI Tag */}
          <rect x="170" y="162" width="30" height="18" rx="4" fill="#24292E" stroke="#4B5563" strokeWidth="0.8" />
          <text x="185" y="174" textAnchor="middle" fill="#AAF0CE" fontFamily="monospace" fontWeight="700" fontSize="7">
            AI/ML
          </text>

          {/* Corner reinforced steel brackets */}
          <path d="M24 54 V40 H38" stroke="#64748B" strokeWidth="3" fill="none" />
          <path d="M209 54 V40 H195" stroke="#64748B" strokeWidth="3" fill="none" />
          <path d="M24 184 V198 H38" stroke="#64748B" strokeWidth="3" fill="none" />
          <path d="M209 184 V198 H195" stroke="#64748B" strokeWidth="3" fill="none" />
        </g>
      </svg>
    </div>
  );
}
