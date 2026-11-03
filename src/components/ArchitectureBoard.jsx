import React, { useRef, useEffect } from 'react';
import { ambientLoop, jitter } from '../hooks/useAmbientLoop';

export function ArchitectureBoard({
  pivotX = 45.98,
  pivotY = 3.07,
  ambient = true,
  onClick
}) {
  const elRef = useRef(null);
  const wasDraggedRef = useRef(false);

  useEffect(() => {
    const el = elRef.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let angle = 0;
    let velocity = 0;
    let targetAngle = 0;
    let dragStartOffset = 0;
    let isDragging = false;
    let isAnimating = false;
    let animFrame = 0;
    let lastTime = 0;

    const computePointerAngle = (e) => {
      const parent = el.parentElement || el;
      const rect = parent.getBoundingClientRect();
      const originX = rect.left + (rect.width * pivotX) / 100;
      const originY = rect.top + (rect.height * pivotY) / 100;
      return (180 * Math.atan2(e.clientY - originY, e.clientX - originX)) / Math.PI;
    };

    const stepPhysics = (time) => {
      const delta = Math.min(2.5, lastTime ? (time - lastTime) / 16.7 : 1);
      lastTime = time;

      if (isDragging) {
        const prevAngle = angle;
        angle += (targetAngle - angle) * Math.min(1, 0.35 * delta);
        velocity = (angle - prevAngle) / delta;
      } else {
        velocity += (-0.0035 * angle - 0.045 * velocity) * delta;
        angle += velocity * delta;
      }

      el.style.transform = `rotate(${angle}deg)`;

      if (!isDragging && Math.abs(angle) < 0.04 && Math.abs(velocity) < 0.02) {
        angle = 0;
        velocity = 0;
        el.style.transform = '';
        isAnimating = false;
        lastTime = 0;
        return;
      }

      animFrame = requestAnimationFrame(stepPhysics);
    };

    const wakeAnimation = () => {
      if (!isAnimating) {
        isAnimating = true;
        lastTime = 0;
        animFrame = requestAnimationFrame(stepPhysics);
      }
    };

    const onPointerDown = (e) => {
      if (e.button !== 0 && e.pointerType === 'mouse') return;
      e.stopPropagation();
      wasDraggedRef.current = false;
      dragStartOffset = computePointerAngle(e) - angle;
      targetAngle = angle;
      isDragging = true;
      el.setPointerCapture(e.pointerId);
      wakeAnimation();
    };

    const onPointerMove = (e) => {
      if (!isDragging) return;
      let rawDiff = computePointerAngle(e) - dragStartOffset;
      let normalized = ((rawDiff + 540) % 360) - 180;
      let excess = Math.abs(normalized) - 18;
      targetAngle = excess > 0 ? Math.sign(normalized) * (18 + 0.12 * excess) : normalized;
      if (Math.abs(targetAngle) > 2) {
        wasDraggedRef.current = true;
      }
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const onPointerEnter = () => {
      if (!isDragging && !isAnimating) {
        velocity = Math.random() < 0.5 ? 0.35 : -0.35;
        wakeAnimation();
      }
    };

    el.addEventListener('pointerdown', onPointerDown);
    el.addEventListener('pointermove', onPointerMove);
    el.addEventListener('pointerup', onPointerUp);
    el.addEventListener('pointercancel', onPointerUp);
    el.addEventListener('pointerenter', onPointerEnter);

    const cleanupLoop = ambient
      ? ambientLoop(() => {
          if (!isDragging && !isAnimating) {
            velocity = jitter(0.25, 0.6);
            wakeAnimation();
          }
        }, 5000, 12000)
      : null;

    return () => {
      cancelAnimationFrame(animFrame);
      cleanupLoop?.();
      el.removeEventListener('pointerdown', onPointerDown);
      el.removeEventListener('pointermove', onPointerMove);
      el.removeEventListener('pointerup', onPointerUp);
      el.removeEventListener('pointercancel', onPointerUp);
      el.removeEventListener('pointerenter', onPointerEnter);
    };
  }, [pivotX, pivotY, ambient]);

  return (
    <span
      ref={elRef}
      className="chome__board"
      style={{
        transformOrigin: `${pivotX}% ${pivotY}%`,
        touchAction: 'none',
        display: 'block',
        width: '100%',
        height: 'auto',
        cursor: 'grab'
      }}
      onClickCapture={(e) => {
        if (wasDraggedRef.current) {
          e.preventDefault();
          e.stopPropagation();
          wasDraggedRef.current = false;
        }
      }}
      onClick={onClick}
    >
      <svg
        viewBox="0 0 293 322"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: 'auto', display: 'block' }}
        aria-label="System Architecture & Engineering Blueprints"
      >
        <defs>
          {/* Subtle drop shadow */}
          <filter id="arch-shadow" x="-8%" y="-5%" width="120%" height="116%" filterUnits="userSpaceOnUse">
            <feDropShadow dx="4" dy="6" stdDeviation="2" floodColor="#000" floodOpacity="0.45" />
          </filter>

          {/* Blueprint pin gradients */}
          <radialGradient id="pin-cyan" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#C6F8E5" />
            <stop offset="50%" stopColor="#7ECFAE" />
            <stop offset="100%" stopColor="#307A5E" />
          </radialGradient>
          <radialGradient id="pin-orange" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#FED7AA" />
            <stop offset="50%" stopColor="#F97316" />
            <stop offset="100%" stopColor="#9A3412" />
          </radialGradient>
          <radialGradient id="pin-purple" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#E9D5FF" />
            <stop offset="50%" stopColor="#A855F7" />
            <stop offset="100%" stopColor="#6B21A8" />
          </radialGradient>

          {/* Suspension nail metal gradient */}
          <radialGradient id="arch-nail" cx="40%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#FFF" />
            <stop offset="60%" stopColor="#FAC042" />
            <stop offset="100%" stopColor="#855B14" />
          </radialGradient>
        </defs>

        {/* Hanging suspension cord */}
        <path d="M89.3 52.2L134.7 10L140 10.5L188.3 49.8" stroke="#FFFFFF" strokeWidth="2.2" strokeMiterlimit="10" strokeDasharray="3 2" opacity="0.85" />

        {/* Suspension Wall Nail */}
        <circle cx="134.7" cy="10" r="7.5" fill="url(#arch-nail)" stroke="#111" strokeWidth="1.2" />
        <circle cx="134.7" cy="10" r="3" fill="#212121" />

        {/* Board Shadow & Main Body */}
        <g filter="url(#arch-shadow)">
          {/* Outer cork / warm studio drafting board */}
          <rect x="9.5" y="44" width="276" height="268" rx="6" fill="#F4EADB" stroke="#212121" strokeWidth="2.5" />
          {/* Inner drafting border */}
          <rect x="18" y="52" width="259" height="252" rx="4" fill="#EFE3D0" stroke="#C5B193" strokeWidth="1" />

          {/* Board Header Bar */}
          <rect x="24" y="58" width="247" height="30" rx="3" fill="#212121" />
          <text
            x="147.5"
            y="78"
            textAnchor="middle"
            fill="#AAF0CE"
            fontFamily="var(--font-poppins), sans-serif"
            fontWeight="700"
            fontSize="9"
            letterSpacing="0.08em"
          >
            SYSTEM ARCHITECTURE &amp; PROJECTS
          </text>

          {/* Pinned Blueprint Sheet 1 (Top Left): CoupleWatch WebRTC Architecture */}
          <g transform="rotate(-2.5 75 145)">
            <rect x="25" y="96" width="115" height="92" rx="3" fill="#1E293B" stroke="#212121" strokeWidth="1.2" />
            <rect x="27" y="98" width="111" height="88" fill="none" stroke="#334155" strokeWidth="0.8" strokeDasharray="4 4" />
            
            {/* Title */}
            <text x="32" y="112" fill="#38BDF8" fontFamily="var(--font-poppins), monospace" fontWeight="700" fontSize="8.5">
              COUPLEWATCH SYNC
            </text>
            <text x="32" y="122" fill="#94A3B8" fontFamily="var(--font-poppins), sans-serif" fontSize="6.5">
              WebRTC • Supabase Realtime
            </text>

            {/* Architecture node flow */}
            <rect x="32" y="130" width="30" height="15" rx="2" fill="#0284C7" />
            <text x="47" y="141" textAnchor="middle" fill="#FFF" fontSize="5.5" fontWeight="600">PEER A</text>

            <path d="M62 137.5 H74" stroke="#38BDF8" strokeWidth="1.2" strokeDasharray="2 1" />
            
            <rect x="74" y="130" width="30" height="15" rx="2" fill="#0D9488" />
            <text x="89" y="141" textAnchor="middle" fill="#FFF" fontSize="5.5" fontWeight="600">WEBRTC</text>

            <path d="M104 137.5 H112" stroke="#38BDF8" strokeWidth="1.2" />
            
            <circle cx="120" cy="137.5" r="7" fill="#10B981" />
            <text x="120" y="140" textAnchor="middle" fill="#FFF" fontSize="5" fontWeight="700">&lt;50ms</text>

            <text x="32" y="160" fill="#E2E8F0" fontSize="6.5" fontFamily="monospace">
              couplewatch.in (Live)
            </text>
            <polygon points="33 166 30 171 32.5 171 31.5 175.5 35.5 170.5 33 170.5 33 166" fill="#38BDF8" />
            <text x="38" y="172" fill="#38BDF8" fontSize="6.5" fontWeight="600">
              Lockstep Video Playback
            </text>

            {/* Cyan Push Pin */}
            <circle cx="82.5" cy="98" r="4.5" fill="url(#pin-cyan)" stroke="#111" strokeWidth="0.8" />
            <circle cx="82.5" cy="98" r="1.5" fill="#FFF" />
          </g>

          {/* Pinned Blueprint Sheet 2 (Top Right): Mission Copilot (SIH Finalist) */}
          <g transform="rotate(3.2 210 148)">
            <rect x="150" y="95" width="116" height="96" rx="3" fill="#FAF5EF" stroke="#212121" strokeWidth="1.2" />
            {/* Header tab */}
            <rect x="150" y="95" width="116" height="18" rx="3" fill="#7ECFAE" stroke="#212121" strokeWidth="0.8" />
            <text x="208" y="108" textAnchor="middle" fill="#1C1917" fontFamily="var(--font-poppins), sans-serif" fontWeight="700" fontSize="7.5">
              MISSION COPILOT (SIH)
            </text>

            {/* Pipeline schematic */}
            <text x="158" y="125" fill="#1C1917" fontSize="6.5" fontWeight="600">
              [Telemetry] → Lunar Sensors
            </text>
            <text x="158" y="137" fill="#6B7280" fontSize="6.5">
              ↳ Fuel • O2 • Power Telemetry
            </text>
            <text x="158" y="149" fill="#10B981" fontSize="6.5" fontWeight="700">
              ↳ OpenAI Risk Analysis Model
            </text>

            <rect x="158" y="156" width="100" height="24" rx="2" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="0.6" />
            <text x="162" y="167" fill="#334155" fontSize="6" fontFamily="monospace">
              SIH Finalist Dashboard
            </text>
            <text x="162" y="176" fill="#0284C7" fontSize="6" fontFamily="monospace">
              AI-assisted Mission Support
            </text>

            {/* Orange Push Pin */}
            <circle cx="208" cy="97" r="4.5" fill="url(#pin-orange)" stroke="#111" strokeWidth="0.8" />
            <circle cx="208" cy="97" r="1.5" fill="#FFF" />
          </g>

          {/* Pinned Card 3 (Bottom Center): Full-Stack Node, Express & Supabase */}
          <g transform="rotate(-1 150 240)">
            <rect x="34" y="202" width="227" height="88" rx="3" fill="#18181B" stroke="#212121" strokeWidth="1.2" />
            
            {/* Title row */}
            <text x="44" y="218" fill="#F472B6" fontFamily="var(--font-poppins), sans-serif" fontWeight="700" fontSize="8.5">
              FULL-STACK ARCHITECTURE &amp; DB
            </text>
            <text x="195" y="218" fill="#AAF0CE" fontFamily="monospace" fontSize="7" fontWeight="600">
              [SUPABASE + REST]
            </text>

            {/* Shader preview graphic box */}
            <rect x="44" y="226" width="68" height="54" rx="2" fill="#09090B" stroke="#27272A" strokeWidth="0.8" />
            
            {/* Visual database node diagram */}
            <rect x="50" y="232" width="24" height="12" rx="2" fill="#0284C7" />
            <text x="62" y="240" textAnchor="middle" fill="#FFF" fontSize="5" fontWeight="600">REACT</text>
            <path d="M74 238 H84" stroke="#38BDF8" strokeWidth="1" />
            <rect x="84" y="232" width="24" height="12" rx="2" fill="#059669" />
            <text x="96" y="240" textAnchor="middle" fill="#FFF" fontSize="5" fontWeight="600">NODE</text>
            <path d="M74 258 H84" stroke="#AAF0CE" strokeWidth="1" />
            <rect x="62" y="254" width="46" height="18" rx="2" fill="#1E293B" stroke="#38BDF8" strokeWidth="0.8" />
            <text x="85" y="265" textAnchor="middle" fill="#AAF0CE" fontSize="5.5" fontWeight="700">POSTGRES RLS</text>

            {/* Spec breakdown text */}
            <text x="120" y="238" fill="#F1F5F9" fontSize="7" fontWeight="600">
              • Node.js &amp; Express RESTful API backends
            </text>
            <text x="120" y="250" fill="#94A3B8" fontSize="6.5">
              • PostgreSQL Schemas with Supabase Auth &amp; RLS
            </text>
            <text x="120" y="262" fill="#94A3B8" fontSize="6.5">
              • OpenAI API &amp; Web Speech API Integration
            </text>
            <polyline points="120 271 123 274 127 268" fill="none" stroke="#38BDF8" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
            <text x="131" y="274" fill="#38BDF8" fontSize="6.8" fontWeight="700">
              Production Deployed on Vercel &amp; Render
            </text>

            {/* Purple Push Pin */}
            <circle cx="147.5" cy="204" r="4.5" fill="url(#pin-purple)" stroke="#111" strokeWidth="0.8" />
            <circle cx="147.5" cy="204" r="1.5" fill="#FFF" />
          </g>
        </g>
      </svg>
    </span>
  );
}
