import { useEffect } from 'react';
import { ambientLoop, jitter } from './useAmbientLoop';

const angleBetween = (p1, p2) => Math.atan2(p2.y - p1.y, p2.x - p1.x);

export function useKeyringRope({
  svgRef,
  segmentRefs,
  draggedRef,
  pin = { x: 70, y: 12 },
  joints = [{ x: 70, y: 56 }, { x: 69, y: 97 }, { x: 66, y: 155 }],
  ambient = true
}) {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const svgEl = svgRef.current;
    const segments = segmentRefs.map((r) => r.current);
    const charmEl = segments[segments.length - 1];
    if (!svgEl || segments.some((s) => !s) || !charmEl) return;

    const lengths = joints.map((j, idx) =>
      idx === 0 ? Math.hypot(j.x - pin.x, j.y - pin.y) : Math.hypot(j.x - joints[idx - 1].x, j.y - joints[idx - 1].y)
    );
    const totalLength = lengths.reduce((acc, l) => acc + l, 0);
    const baseAngles = joints.map((j, idx) =>
      idx === 0 ? angleBetween(pin, j) : angleBetween(joints[idx - 1], j)
    );

    const particles = joints.map((j) => ({ x: j.x, y: j.y, px: j.x, py: j.y }));
    let animId = 0;
    let isAnimating = false;
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };
    let pointerPos = { x: 0, y: 0 };
    let lastTime = 0;
    const lastJointIdx = particles.length - 1;

    const screenToSvg = (e) => {
      const ctm = svgEl.getScreenCTM();
      if (!ctm) return { x: 0, y: 0 };
      const pt = new DOMPoint(e.clientX, e.clientY).matrixTransform(ctm.inverse());
      return { x: pt.x, y: pt.y };
    };

    const constrainDistance = (p1, p2, targetDist, fixP1, fixP2) => {
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const dist = Math.hypot(dx, dy) || 1e-4;
      const diff = (dist - targetDist) / dist;
      if (fixP1) {
        p2.x -= dx * diff;
        p2.y -= dy * diff;
      } else if (fixP2) {
        p1.x += dx * diff;
        p1.y += dy * diff;
      } else {
        p1.x += dx * diff * 0.5;
        p1.y += dy * diff * 0.5;
        p2.x -= dx * diff * 0.5;
        p2.y -= dy * diff * 0.5;
      }
    };

    const clampRopeReach = (pt) => {
      const dx = pt.x - pin.x;
      const dy = pt.y - pin.y;
      const dist = Math.hypot(dx, dy);
      if (dist <= totalLength) return pt;
      return {
        x: pin.x + (dx / dist) * totalLength,
        y: pin.y + (dy / dist) * totalLength
      };
    };

    const stepSimulation = (time) => {
      const delta = Math.min(2, lastTime ? (time - lastTime) / 16.7 : 1);
      lastTime = time;
      const subSteps = Math.max(1, Math.min(4, Math.round(2 * delta)));

      for (let s = 0; s < subSteps; s++) {
        // Verlet step
        for (const p of particles) {
          let vx = (p.x - p.px) * 0.985;
          let vy = (p.y - p.py) * 0.985;
          const vMag = Math.hypot(vx, vy);
          if (vMag > 9) {
            vx *= 9 / vMag;
            vy *= 9 / vMag;
          }
          p.px = p.x;
          p.py = p.y;
          p.x += vx;
          p.y += vy + 0.1375; // gravity
        }

        // Apply mouse drag constraint
        if (isDragging) {
          const clamped = clampRopeReach({
            x: pointerPos.x + dragOffset.x,
            y: pointerPos.y + dragOffset.y
          });
          particles[lastJointIdx].x = clamped.x;
          particles[lastJointIdx].y = clamped.y;
        }

        // Distance relaxation
        for (let iter = 0; iter < 8; iter++) {
          constrainDistance(pin, particles[0], lengths[0], true, false);
          for (let i = 1; i < particles.length; i++) {
            constrainDistance(particles[i - 1], particles[i], lengths[i], false, i === lastJointIdx && isDragging);
          }
        }
      }

      // Update SVG segment transforms
      const radToDeg = (r) => (180 * r) / Math.PI;
      segments.forEach((seg, idx) => {
        if (!seg) return;
        if (idx === 0) {
          const deg = radToDeg(angleBetween(pin, particles[0]) - baseAngles[0]);
          seg.setAttribute('transform', `rotate(${deg} ${pin.x} ${pin.y})`);
        } else {
          const deg = radToDeg(angleBetween(particles[idx - 1], particles[idx]) - baseAngles[idx]);
          const baseJoint = joints[idx - 1];
          seg.setAttribute(
            'transform',
            `translate(${particles[idx - 1].x - baseJoint.x} ${particles[idx - 1].y - baseJoint.y}) rotate(${deg} ${baseJoint.x} ${baseJoint.y})`
          );
        }
      });

      // Check kinetic energy to sleep
      const maxMotion = particles.reduce((m, p) => Math.max(m, Math.hypot(p.x - p.px, p.y - p.py)), 0);
      if (!isDragging && maxMotion < 0.6) {
        for (const p of particles) {
          p.px = p.x + (p.px - p.x) * 0.9;
          p.py = p.y + (p.py - p.y) * 0.9;
        }
      }

      if (!isDragging && maxMotion < 0.02) {
        isAnimating = false;
        lastTime = 0;
        return;
      }

      animId = requestAnimationFrame(stepSimulation);
    };

    const wakeSimulation = () => {
      if (!isAnimating) {
        isAnimating = true;
        lastTime = 0;
        animId = requestAnimationFrame(stepSimulation);
      }
    };

    const onPointerDown = (e) => {
      if (e.button !== 0 && e.pointerType === 'mouse') return;
      e.stopPropagation();
      e.preventDefault();
      if (draggedRef) draggedRef.current = false;
      const pt = screenToSvg(e);
      dragOffset = { x: particles[lastJointIdx].x - pt.x, y: particles[lastJointIdx].y - pt.y };
      pointerPos = pt;
      isDragging = true;
      charmEl.setPointerCapture(e.pointerId);
      wakeSimulation();
    };

    const onPointerMove = (e) => {
      if (!isDragging) return;
      const pt = screenToSvg(e);
      if (Math.hypot(pt.x - pointerPos.x, pt.y - pointerPos.y) > 2 && draggedRef) {
        draggedRef.current = true;
      }
      pointerPos = pt;
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const onPointerEnter = () => {
      if (!isDragging && !isAnimating) {
        particles[lastJointIdx].px = particles[lastJointIdx].x + (Math.random() < 0.5 ? 1.6 : -1.6);
        wakeSimulation();
      }
    };

    charmEl.addEventListener('pointerdown', onPointerDown);
    charmEl.addEventListener('pointermove', onPointerMove);
    charmEl.addEventListener('pointerup', onPointerUp);
    charmEl.addEventListener('pointercancel', onPointerUp);
    charmEl.addEventListener('pointerenter', onPointerEnter);

    const cleanupLoop = ambient
      ? ambientLoop(() => {
          if (!isDragging && !isAnimating) {
            particles[lastJointIdx].px = particles[lastJointIdx].x + jitter(1.2, 2.4);
            particles[lastJointIdx].py = particles[lastJointIdx].y + 0.8 * Math.random();
            wakeSimulation();
          }
        }, 4000, 10000)
      : null;

    return () => {
      cancelAnimationFrame(animId);
      cleanupLoop?.();
      charmEl.removeEventListener('pointerdown', onPointerDown);
      charmEl.removeEventListener('pointermove', onPointerMove);
      charmEl.removeEventListener('pointerup', onPointerUp);
      charmEl.removeEventListener('pointercancel', onPointerUp);
      charmEl.removeEventListener('pointerenter', onPointerEnter);
    };
  }, [ambient]);
}
