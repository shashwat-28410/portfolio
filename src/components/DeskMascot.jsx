import React, { useState, useRef, useEffect } from 'react';
import { Mascot } from 'page-mascot';

const STORAGE_KEY = 'rajveer_penguin_mascot_pos_v2';

/**
 * Interactive Draggable Desk Mascot Companion
 * - Starts perched directly on the iPod Player
 * - Can be picked up (dragged) and placed anywhere across the desk/workspace
 * - Persists its new position so it stays where you left it
 * - Tracks cursor movement wherever it is placed
 * - Clicks boop the penguin with squashes & expressions
 * - Double-click (or "Reset to iPod" button) returns it back to its starting spot on the iPod
 */
export function DeskMascot({ size = 116 }) {
  const [hovered, setHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Clean up any stale offset from previous versions on mount
  useEffect(() => {
    try {
      localStorage.removeItem('rajveer_penguin_mascot_pos_v1');
    } catch (_) {}
  }, []);

  // Position offset from initial iPod desk coordinate
  const [pos, setPos] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.x === 'number' && typeof parsed.y === 'number') {
          return parsed;
        }
      }
    } catch (_) {}
    return { x: 0, y: 0 };
  });

  const dragRef = useRef({
    active: false,
    startX: 0,
    startY: 0,
    origX: 0,
    origY: 0,
    stageScale: 1,
    hasMoved: false
  });

  const wrapRef = useRef(null);

  const onPointerDown = (e) => {
    // Only accept left clicks on mouse
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    e.stopPropagation();

    const stage = wrapRef.current?.closest('.cdesk__stage, .chome__stage');
    const stageScale = stage ? stage.getBoundingClientRect().width / 1512 : 1;

    dragRef.current = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      origX: pos.x,
      origY: pos.y,
      stageScale: stageScale || 1,
      hasMoved: false
    };

    setIsDragging(true);

    const parent = wrapRef.current?.closest('.cdesk__item');
    if (parent) parent.style.zIndex = '95';

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (_) {}
  };

  const onPointerMove = (e) => {
    if (!dragRef.current.active) return;
    const { startX, startY, origX, origY, stageScale } = dragRef.current;
    const dx = (e.clientX - startX) / stageScale;
    const dy = (e.clientY - startY) / stageScale;

    if (!dragRef.current.hasMoved && Math.hypot(dx, dy) > 4) {
      dragRef.current.hasMoved = true;
    }

    if (dragRef.current.hasMoved) {
      // Clamped within desk canvas bounds (1512x881 stage) from iPod origin
      const nextX = Math.max(-650, Math.min(750, origX + dx));
      const nextY = Math.max(-490, Math.min(300, origY + dy));
      setPos({ x: nextX, y: nextY });
    }
  };

  const onPointerUp = (e) => {
    if (!dragRef.current.active) return;
    const wasMoved = dragRef.current.hasMoved;
    dragRef.current.active = false;
    setIsDragging(false);

    const parent = wrapRef.current?.closest('.cdesk__item');
    const isNowMoved = Math.hypot(pos.x, pos.y) > 15;
    if (parent) parent.style.zIndex = isNowMoved ? '30' : '10';

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (_) {}

    // Persist position if moved
    if (wasMoved) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(pos));
      } catch (_) {}
    }
  };

  const onClickCapture = (e) => {
    // If the user dragged/dropped, swallow the click so boop doesn't misfire
    if (dragRef.current.hasMoved) {
      e.stopPropagation();
      e.preventDefault();
      dragRef.current.hasMoved = false;
    }
  };

  // Reset mascot back to its iPod start point
  const resetToIpod = (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setPos({ x: 0, y: 0 });
    const parent = wrapRef.current?.closest('.cdesk__item');
    if (parent) parent.style.zIndex = '10';
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (_) {}
  };

  const isMoved = Math.hypot(pos.x, pos.y) > 15;

  return (
    <div
      ref={wrapRef}
      className={`cdesk__mascot-wrap${isDragging ? ' is-dragging' : ''}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onClickCapture={onClickCapture}
      onDoubleClick={resetToIpod}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
        touchAction: 'none',
        pointerEvents: 'auto',
        cursor: isDragging ? 'grabbing' : 'grab',
        transform: `translate(${pos.x}px, ${pos.y}px)`,
        transition: isDragging ? 'none' : 'transform 0.42s cubic-bezier(0.175, 0.885, 0.32, 1.25)',
        zIndex: isDragging ? 99 : isMoved ? 30 : 10
      }}
    >
      {/* Speech bubble / helpful interaction tag */}
      <div
        style={{
          position: 'absolute',
          top: '-28px',
          left: '50%',
          transform: `translateX(-50%) translateY(${hovered || isDragging ? '0' : '5px'})`,
          opacity: hovered || isDragging ? 1 : 0,
          pointerEvents: 'none',
          transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          background: isDragging ? '#0284C7' : '#1E293B',
          color: '#FAF5EF',
          fontSize: '9.5px',
          fontWeight: 700,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          padding: '3px 9px',
          borderRadius: '4px',
          whiteSpace: 'nowrap',
          boxShadow: '0 4px 12px rgba(0,0,0,0.35)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          zIndex: 30
        }}
      >
        <span>
          {isDragging
            ? 'Moving penguin... Drop anywhere!'
            : isMoved
            ? 'Double-click to return behind iPod'
            : 'Peeking behind iPod • Drag anywhere'}
        </span>
        {/* Pointer arrow */}
        <div
          style={{
            position: 'absolute',
            bottom: '-4px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '4px solid transparent',
            borderRight: '4px solid transparent',
            borderTop: `4px solid ${isDragging ? '#0284C7' : '#1E293B'}`
          }}
        />
      </div>

      {/* Grounding Contact Shadow (dynamically responds to lifting) */}
      <div
        style={{
          position: 'absolute',
          bottom: '8px',
          width: `${size * 0.74}px`,
          height: `${size * 0.24}px`,
          background: 'radial-gradient(ellipse at center, rgba(15, 23, 42, 0.5) 0%, rgba(15, 23, 42, 0.18) 50%, rgba(0, 0, 0, 0) 75%)',
          borderRadius: '50%',
          pointerEvents: 'none',
          transform: isDragging ? 'translateY(18px) scale(0.85)' : 'translateY(4px) scale(1)',
          opacity: isDragging ? 0.28 : isMoved ? 1 : 0,
          filter: isDragging ? 'blur(2px)' : 'none',
          transition: isDragging ? 'none' : 'transform 0.25s ease, opacity 0.25s ease, filter 0.25s ease'
        }}
      />

      {/* Mascot Container (lifts up during drag) */}
      <div
        style={{
          position: 'relative',
          filter: isDragging
            ? 'drop-shadow(0 14px 20px rgba(0,0,0,0.35))'
            : hovered
            ? 'drop-shadow(0 6px 12px rgba(0,0,0,0.22))'
            : 'drop-shadow(0 4px 6px rgba(0,0,0,0.15))',
          transform: isDragging ? 'translateY(-12px) scale(1.08)' : hovered ? 'scale(1.03)' : 'scale(1)',
          transition: isDragging ? 'none' : 'transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275), filter 0.2s ease',
          pointerEvents: 'auto'
        }}
      >
        <Mascot
          directions="/mascots/penguin-directions.webp"
          reactions="/mascots/penguin-reactions.webp"
          size={size}
          label="Rajveer's Draggable Desk Penguin"
        />
      </div>
    </div>
  );
}
