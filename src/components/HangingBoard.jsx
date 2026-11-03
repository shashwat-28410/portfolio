import React, { useRef, useEffect } from 'react';
import { ambientLoop, jitter } from '../hooks/useAmbientLoop';

export function HangingBoard({
  src,
  alt = '',
  pivotX = 50,
  pivotY = 0,
  locked = false,
  ambient = true,
  onClick
}) {
  const elRef = useRef(null);
  const baseOffset = 6.5 * (locked ? 1 : 0);
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

      el.style.transform = `rotate(${baseOffset + angle}deg)`;

      if (!isDragging && Math.abs(angle) < 0.04 && Math.abs(velocity) < 0.02) {
        angle = 0;
        velocity = 0;
        el.style.transform = baseOffset ? `rotate(${baseOffset}deg)` : '';
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
  }, [pivotX, pivotY, baseOffset, ambient]);

  return (
    <span
      ref={elRef}
      className={`chome__board${locked ? ' chome__board--locked' : ''}`}
      style={{
        transformOrigin: `${pivotX}% ${pivotY}%`,
        touchAction: 'none',
        transform: baseOffset ? `rotate(${baseOffset}deg)` : undefined
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
      <img src={src} alt={alt} draggable={false} />
      {locked && (
        <svg className="chome__board-note" viewBox="0 0 293 322" aria-hidden="true">
          <g transform="rotate(-4 138 172)">
            <rect x="72" y="132" width="132" height="80" rx="3" className="chome__board-note-paper" />
            <text x="138" y="178" textAnchor="middle" className="chome__board-note-title">
              CLOSED
            </text>
            <text x="138" y="198" textAnchor="middle" className="chome__board-note-msg">
              MEMBERS ONLY
            </text>
            <rect x="118" y="123" width="40" height="15" rx="1" transform="rotate(-3 138 130)" className="chome__board-note-tape" />
          </g>
        </svg>
      )}
    </span>
  );
}
