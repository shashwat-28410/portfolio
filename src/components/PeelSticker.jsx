import React, { useRef, useEffect } from 'react';

export function PeelSticker({
  src = '/images/dev-sticker.svg',
  alt = 'Developer Sticky Note'
}) {
  const elRef = useRef(null);
  const posRef = useRef({ x: 0, y: 0 });
  const curRotRef = useRef({ rx: 0, ry: 0, rz: 0, s: 1 });
  const targetRotRef = useRef({ rx: 0, ry: 0, rz: 0, s: 1 });
  const stateRef = useRef('rest'); // 'rest' | 'peeling' | 'held' | 'settling'
  const peelScaleRef = useRef(1);
  const dragStartRef = useRef({ px: 0, py: 0, ox: 0, oy: 0, s: 1, t: 0 });
  const velocityRef = useRef({ t: 0, x: 0, y: 0 });
  const animFrameRef = useRef(0);
  const lastTimeRef = useRef(0);
  const prefersReducedMotion = useRef(false);

  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return () => cancelAnimationFrame(animFrameRef.current);
  }, []);

  const updateTransform = () => {
    const el = elRef.current;
    if (!el) return;
    const { rx, ry, rz, s } = curRotRef.current;
    el.style.transform = `translate(${posRef.current.x}px, ${posRef.current.y}px) perspective(650px) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg) scale(${s})`;
  };

  const stepPhysics = (time) => {
    const delta = Math.min(2.5, lastTimeRef.current ? (time - lastTimeRef.current) / 16.7 : 1);
    lastTimeRef.current = time;

    if (stateRef.current === 'peeling' && time - dragStartRef.current.t > 170) {
      stateRef.current = 'held';
      targetRotRef.current.rx = 7 * peelScaleRef.current;
      targetRotRef.current.s = 1.06;
    }

    if (stateRef.current === 'held' && time - velocityRef.current.t > 90) {
      targetRotRef.current.ry = 0;
      targetRotRef.current.rx = 7 * peelScaleRef.current;
    }

    const cur = curRotRef.current;
    const tgt = targetRotRef.current;
    const factor = 0.22 * delta;

    cur.rx += (tgt.rx - cur.rx) * factor;
    cur.ry += (tgt.ry - cur.ry) * factor;
    cur.rz += (tgt.rz - cur.rz) * factor;
    cur.s += (tgt.s - cur.s) * factor;

    updateTransform();

    const isSettled =
      Math.abs(tgt.rx - cur.rx) < 0.08 &&
      Math.abs(tgt.ry - cur.ry) < 0.08 &&
      Math.abs(tgt.rz - cur.rz) < 0.08 &&
      Math.abs(tgt.s - cur.s) < 0.002;

    if (stateRef.current === 'settling' && isSettled) {
      stateRef.current = 'rest';
      Object.assign(cur, tgt);
      updateTransform();
      lastTimeRef.current = 0;
      return;
    }

    animFrameRef.current = requestAnimationFrame(stepPhysics);
  };

  const kickPhysics = () => {
    cancelAnimationFrame(animFrameRef.current);
    lastTimeRef.current = 0;
    animFrameRef.current = requestAnimationFrame(stepPhysics);
  };

  const handlePointerUp = () => {
    if (stateRef.current !== 'peeling' && stateRef.current !== 'held') return;
    const el = elRef.current;
    if (!el) return;
    stateRef.current = 'settling';

    const stage = el.closest('.cdesk__stage, .chome__stage');
    let isFarDown = false;
    if (stage) {
      const stageRect = stage.getBoundingClientRect();
      isFarDown = (el.getBoundingClientRect().top - stageRect.top) / (stageRect.width / 1512) > 593;
    }

    targetRotRef.current.rx = isFarDown ? 52 : 0;
    targetRotRef.current.ry = 0;
    targetRotRef.current.s = 1;
    targetRotRef.current.rz = Math.max(-6, Math.min(6, curRotRef.current.rz + 0.3 * targetRotRef.current.rz));

    el.classList.remove('is-peeling');
    el.closest('.chome__item, .cdesk__item')?.classList.remove('chome__item--front');
    kickPhysics();
  };

  return (
    <img
      ref={elRef}
      className="cdesk__sticker"
      src={src}
      alt={alt}
      draggable={false}
      style={{ cursor: 'grab' }}
      onPointerDown={(e) => {
        if (e.button !== 0 && e.pointerType === 'mouse') return;
        e.stopPropagation();
        e.preventDefault();
        const el = elRef.current;
        if (!el) return;
        const stage = el.closest('.cdesk__stage, .chome__stage');
        const stageScale = stage ? stage.getBoundingClientRect().width / 1512 : 1;

        dragStartRef.current = {
          px: e.clientX,
          py: e.clientY,
          ox: posRef.current.x,
          oy: posRef.current.y,
          s: stageScale,
          t: performance.now()
        };
        velocityRef.current = { t: 0, x: e.clientX, y: e.clientY };
        stateRef.current = 'peeling';
        targetRotRef.current.rx = prefersReducedMotion.current ? 0 : 38 * peelScaleRef.current;
        targetRotRef.current.ry = 0;
        targetRotRef.current.s = 1.03;

        el.classList.add('is-peeling');
        el.closest('.chome__item, .cdesk__item')?.classList.add('chome__item--front');
        el.setPointerCapture(e.pointerId);
        kickPhysics();
      }}
      onPointerMove={(e) => {
        if (stateRef.current !== 'peeling' && stateRef.current !== 'held') return;
        const start = dragStartRef.current;
        posRef.current = {
          x: start.ox + (e.clientX - start.px) / start.s,
          y: start.oy + (e.clientY - start.py) / start.s
        };

        if (!prefersReducedMotion.current && stateRef.current === 'held') {
          const now = performance.now();
          const dt = Math.max(8, now - (velocityRef.current.t || now - 16));
          const vx = ((e.clientX - velocityRef.current.x) / dt) * 16.7;
          const vy = ((e.clientY - velocityRef.current.y) / dt) * 16.7;

          targetRotRef.current.ry = Math.max(-14, Math.min(14, 1.4 * vx));
          targetRotRef.current.rx = 7 * peelScaleRef.current + Math.max(-14, Math.min(14, -(1.4 * vy)));
          targetRotRef.current.rz = Math.max(-10, Math.min(10, 0.8 * vx));
          velocityRef.current = { t: now, x: e.clientX, y: e.clientY };
        }
        updateTransform();
      }}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    />
  );
}
