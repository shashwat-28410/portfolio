import { useRef } from 'react';

export function useWinDrag() {
  const pos = useRef({ x: 0, y: 0 });
  const elRef = useRef(null);

  const applyPos = () => {
    if (elRef.current) {
      elRef.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px)`;
    }
  };

  const onBarPointerDown = (e) => {
    if (window.innerWidth <= 900 || e.target.closest('button, a') || (e.button !== 0 && e.pointerType === 'mouse')) {
      return;
    }
    e.preventDefault();
    const bar = e.currentTarget;
    const start = {
      px: e.clientX,
      py: e.clientY,
      ox: pos.current.x,
      oy: pos.current.y
    };

    const onPointerMove = (moveEvent) => {
      const el = elRef.current;
      if (!el) return;
      let nextX = start.ox + moveEvent.clientX - start.px;
      let nextY = start.oy + moveEvent.clientY - start.py;
      const rect = el.getBoundingClientRect();
      const originX = rect.left - pos.current.x;
      const originTop = rect.top - pos.current.y;

      pos.current = {
        x: Math.min(Math.max(nextX, 90 - originX - rect.width), window.innerWidth - 90 - originX),
        y: Math.min(Math.max(nextY, -originTop), window.innerHeight - 48 - originTop)
      };
      applyPos();
    };

    const onPointerUp = () => {
      bar.removeEventListener('pointermove', onPointerMove);
    };

    bar.setPointerCapture(e.pointerId);
    bar.addEventListener('pointermove', onPointerMove);
    bar.addEventListener('pointerup', onPointerUp, { once: true });
    bar.addEventListener('pointercancel', onPointerUp, { once: true });
  };

  return {
    setEl: (el) => {
      elRef.current = el;
      if (el) applyPos();
    },
    onBarPointerDown,
    elRef,
    reset: () => {
      pos.current = { x: 0, y: 0 };
      applyPos();
    },
    pos
  };
}
