import React, { useRef, useEffect } from 'react';
import { ambientLoop } from '../hooks/useAmbientLoop';

const minX = -18.3;
const cVal = 131;
const uVal = 30;
const hVal = 309;
const dVal = 24;
const pVal = 306;
const mVal = 176;
const xVal = 129;
const fVal = 170;

function projectScreenCursor(normX, normY) {
  const r = (4 + 155.5 * normX) / 177.5;
  const n = (4 + 119 * normY) / 146;
  const i = cVal + r * (hVal - cVal);
  const s = uVal + r * (dVal - uVal);
  return {
    left: `${(((i + n * (xVal + r * (pVal - xVal) - i)) / 507) * 100).toFixed(3)}%`,
    top: `${(((s + n * (fVal + r * (mVal - fVal) - s)) / 398) * 100).toFixed(3)}%`
  };
}

function normalizeCoords(x, y) {
  return {
    nx: (x - minX) / (44 - minX),
    ny: (y - -14) / 28
  };
}

export function LinksComputer({
  locked = false,
  art = {
    base: '/_next/static/media/computerHome-base.0~sjb.k_7y09l.svg',
    mouse: '/_next/static/media/computerHome-mouse.01b.cihyh-0re.svg'
  },
  cursorSrc = null,
  ambient = true,
  onClick
}) {
  const containerRef = useRef(null);
  const mouseElRef = useRef(null);
  const hitAreaRef = useRef(null);
  const screenCursorRef = useRef(null);
  const coordsRef = useRef({ x: 0, y: 0 });
  const dragStartRef = useRef(null);
  const wasMovedRef = useRef(false);

  const applyPositions = () => {
    const { x, y } = coordsRef.current;
    const transformStr = `translate(${(x / 507) * 100}%, ${(y / 398) * 100}%)`;
    if (mouseElRef.current) mouseElRef.current.style.transform = transformStr;
    if (hitAreaRef.current) hitAreaRef.current.style.transform = transformStr;
    if (screenCursorRef.current) {
      const { nx, ny } = normalizeCoords(x, y);
      const proj = projectScreenCursor(nx, ny);
      screenCursorRef.current.style.left = proj.left;
      screenCursorRef.current.style.top = proj.top;
    }
  };

  const onPointerUp = () => {
    dragStartRef.current = null;
  };

  useEffect(() => {
    if (!ambient || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let animId = 0;

    const cleanupLoop = ambientLoop(() => {
      if (dragStartRef.current) return;
      const start = { ...coordsRef.current };
      const targetY = -14 + 28 * Math.random();
      const targetX = -12 + 0.45 * targetY + Math.random() * (44 - (-12 + 0.45 * targetY));
      const duration = 550 + 450 * Math.random();
      const startTime = performance.now();

      const animateStep = (now) => {
        if (dragStartRef.current) return;
        const progress = Math.min(1, (now - startTime) / duration);
        const ease = progress * progress * (3 - 2 * progress);
        coordsRef.current = {
          x: start.x + (targetX - start.x) * ease,
          y: start.y + (targetY - start.y) * ease
        };
        applyPositions();
        if (progress < 1) {
          animId = requestAnimationFrame(animateStep);
        }
      };

      animId = requestAnimationFrame(animateStep);
    }, 6000, 14000);

    return () => {
      cleanupLoop();
      cancelAnimationFrame(animId);
    };
  }, [ambient]);

  const initialProj = projectScreenCursor(normalizeCoords(0, 0).nx, normalizeCoords(0, 0).ny);

  return (
    <span
      ref={containerRef}
      className="chome__pc"
      onClickCapture={(e) => {
        if (wasMovedRef.current) {
          e.preventDefault();
          e.stopPropagation();
          wasMovedRef.current = false;
        }
      }}
      onClick={onClick}
    >
      {/* Computer CRT base */}
      <img src={art.base} alt="" draggable={false} />

      {/* Screen tint glass if locked */}
      {locked && (
        <svg className="chome__pc-glass" viewBox="0 0 507 398" fill="none" aria-hidden="true">
          <path
            d="M140.699 165.2C128.28 131.723 135.974 65.7574 141.374 36.9595C177.011 31.0199 266.015 34.0346 306.063 36.2844V171.275L140.699 165.2Z"
            fill="#212121"
          />
        </svg>
      )}

      {/* Computer Mouse */}
      <img
        ref={mouseElRef}
        src={art.mouse}
        alt=""
        draggable={false}
        className="chome__pc-mouse"
      />

      {/* Mouse Hit Box for Dragging */}
      <span
        ref={hitAreaRef}
        className="chome__pc-hit"
        style={{
          left: `${(334 / 507) * 100}%`,
          top: `${(346 / 398) * 100}%`,
          width: `${(70 / 507) * 100}%`,
          height: `${(42 / 398) * 100}%`,
          cursor: 'grab'
        }}
        onPointerDown={(e) => {
          if (e.button !== 0 && e.pointerType === 'mouse') return;
          e.stopPropagation();
          e.preventDefault();
          wasMovedRef.current = false;
          dragStartRef.current = {
            px: e.clientX,
            py: e.clientY,
            ox: coordsRef.current.x,
            oy: coordsRef.current.y
          };
          hitAreaRef.current?.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          const start = dragStartRef.current;
          const container = containerRef.current;
          if (!start || !container) return;
          const scale = 507 / container.getBoundingClientRect().width;
          const newY = Math.min(14, Math.max(-14, start.oy + (e.clientY - start.py) * scale));
          const newX = Math.min(44, Math.max(-12 + 0.45 * newY, start.ox + (e.clientX - start.px) * scale));

          if (Math.abs(newX - start.ox) > 2 || Math.abs(newY - start.oy) > 2) {
            wasMovedRef.current = true;
          }
          coordsRef.current = { x: newX, y: newY };
          applyPositions();
        }}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      />

      {/* Real-time CRT Display Cursor */}
      <span
        ref={screenCursorRef}
        className={`chome__pc-cursor${cursorSrc ? ' chome__pc-cursor--star' : ''}`}
        style={{ left: initialProj.left, top: initialProj.top }}
        aria-hidden="true"
      >
        {cursorSrc ? (
          <img src={cursorSrc} alt="" draggable={false} />
        ) : (
          <svg width="13" height="18" viewBox="0 0 13 18">
            <path
              d="M1.5 1.5v12.6l3.4-3 2.2 5 2.4-1-2.2-5 4.5-.4z"
              fill="#fff"
              stroke="#1c1917"
              strokeWidth="1.3"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
    </span>
  );
}
