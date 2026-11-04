import React, { useRef, useEffect } from 'react';
import { ambientLoop, jitter } from '../hooks/useAmbientLoop';

// Chain anchor points and control curves
const chainAnchors = [
  { ax: 175, ay: -70, cx: 185, cy: 340, ex: 480, ey: 632 },
  { ax: 415, ay: -70, cx: 545, cy: 270, ex: 512, ey: 624 }
];

function generateChainLinks(dx, dy) {
  return chainAnchors.flatMap((anchor) => {
    const endX = anchor.ex + dx;
    const endY = anchor.ey + dy;
    const distRatio = Math.hypot(endX - anchor.ax, endY - anchor.ay) / Math.hypot(anchor.ex - anchor.ax, anchor.ey - anchor.ay);
    const stretch = Math.max(0, Math.min(1, (distRatio - 1) / 0.5));
    const ctrlX = anchor.cx + ((anchor.ax + endX) / 2 - anchor.cx) * stretch;
    const ctrlY = anchor.cy + ((anchor.ay + endY) / 2 - anchor.cy) * stretch;
    const radius = 26 * (1 - 0.25 * stretch);
    const segments = [];

    for (let seg = 0; seg < 30; seg++) {
      let fullPath = '';
      let highlightPath = '';
      let shadePath = '';
      let hasHi = false;
      let hasShade = false;

      for (let step = 0; step <= 12; step++) {
        const t = (seg + step / 12) / 30;
        const invT = 1 - t;
        const bx = invT * invT * anchor.ax + 2 * invT * t * ctrlX + t * t * endX;
        const by = invT * invT * anchor.ay + 2 * invT * t * ctrlY + t * t * endY;
        let tangentX = 2 * invT * (ctrlX - anchor.ax) + 2 * t * (endX - ctrlX);
        let tangentY = 2 * invT * (ctrlY - anchor.ay) + 2 * t * (endY - ctrlY);
        const tangentLen = Math.hypot(tangentX, tangentY) || 1;
        tangentX /= tangentLen;
        tangentY /= tangentLen;

        const taper = t > 0.95 ? 1 - ((t - 0.95) / 0.05) * 0.55 : 1;
        const angle = 30 * t * 2 * Math.PI;
        const px = bx + tangentY * radius * taper * Math.cos(angle) + 11 * tangentX * taper * Math.sin(angle);
        const py = by - tangentX * radius * taper * Math.cos(angle) + 11 * tangentY * taper * Math.sin(angle);

        fullPath += (step ? 'L' : 'M') + px.toFixed(1) + ' ' + py.toFixed(1);

        const radialLen = Math.hypot(px - bx, py - by) || 1;
        const lightDot = -((px - bx) / radialLen * 0.45) - ((py - by) / radialLen * 0.89);
        let normalX = tangentY;
        let normalY = -tangentX;
        if (-0.45 * normalX + -0.89 * normalY < 0) {
          normalX = -normalX;
          normalY = -normalY;
        }

        if (lightDot > 0.05) {
          highlightPath += (hasHi ? 'L' : 'M') + (px + 3.2 * normalX).toFixed(1) + ' ' + (py + 3.2 * normalY).toFixed(1);
          hasHi = true;
        } else {
          hasHi = false;
        }

        if (lightDot < -0.2) {
          shadePath += (hasShade ? 'L' : 'M') + (px - 2.6 * normalX).toFixed(1) + ' ' + (py - 2.6 * normalY).toFixed(1);
          hasShade = true;
        } else {
          hasShade = false;
        }
      }

      segments.push({ full: fullPath, hi: highlightPath, shade: shadePath });
    }
    return segments;
  });
}

const initialChain = generateChainLinks(0, 0);

export function MemberBadge({
  blank = false,
  cardFace = '/_next/static/media/membersCard.0_ap4lo7occg3.svg',
  name = 'Rajveer Singh',
  avatar = null,
  paid = true,
  pronouns = 'he/him',
  jobTitle = 'Full-Stack Developer | AI/ML',
  handle = '@shashwat-28410',
  signature = null,
  email = 'rajsingraj234@gmail.com',
  orgName = 'Newton School of Technology',
  owner = true,
  ambient = true,
  onClick
}) {
  const svgRef = useRef(null);
  const chainRef = useRef(null);
  const cardRef = useRef(null);
  const wasDraggedRef = useRef(false);

  const nameParts = (name.trim() || 'Rajveer Singh').split(/\s+/);
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(' ');
  const totalLetters = firstName.length + (lastName ? lastName.length + 1 : 0);
  const fontSize = Math.max(9, Math.min(15.5, 118 / (0.52 * totalLetters)));
  const computedWidth = totalLetters * fontSize * 0.54;

  useEffect(() => {
    const svgEl = svgRef.current;
    const cardEl = cardRef.current;
    const chainEl = chainRef.current;
    if (!svgEl || !cardEl || !chainEl || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let posX = 0;
    let posY = 26.67;
    let velX = 0;
    let velY = 0;
    let isDragging = false;
    let dragOrigin = { x: 0, y: 0 };
    let isAnimating = false;
    let animFrame = 0;
    let lastTime = 0;

    const screenToSvg = (e) => {
      const ctm = svgEl.getScreenCTM();
      if (!ctm) return { x: 0, y: 0 };
      const pt = new DOMPoint(e.clientX, e.clientY).matrixTransform(ctm.inverse());
      return { x: pt.x, y: pt.y };
    };

    const groupPaths = Array.from(chainEl.querySelectorAll('g')).map((g) =>
      Array.from(g.querySelectorAll('path'))
    );
    const loopBack = svgEl.querySelector('.chome__badge-loop-back');

    const updateTransforms = () => {
      const tilt = Math.max(-10, Math.min(10, 0.03 * posX));
      const transform = `translate(${posX} ${posY}) rotate(${tilt} 495 660)`;
      cardEl.setAttribute('transform', transform);
      loopBack?.setAttribute('transform', transform);

      const chainCoords = generateChainLinks(posX, posY);
      for (let i = 0; i < groupPaths.length; i++) {
        const [full, hi, shade, hiAccent] = groupPaths[i];
        if (chainCoords[i]) {
          full.setAttribute('d', chainCoords[i].full);
          hi.setAttribute('d', chainCoords[i].full);
          shade.setAttribute('d', chainCoords[i].shade || 'M0 0');
          hiAccent.setAttribute('d', chainCoords[i].hi || 'M0 0');
        }
      }
    };

    const stepPhysics = (time) => {
      const delta = Math.min(2.5, lastTime ? (time - lastTime) / 16.7 : 1);
      lastTime = time;

      if (!isDragging) {
        velX += (-0.045 * posX - 0.055 * velX) * delta;
        velY += (1.2 - 0.045 * posY - 0.055 * velY) * delta;
        posX += velX * delta;
        posY += velY * delta;
      }

      updateTransforms();

      if (
        !isDragging &&
        Math.abs(posX) < 0.25 &&
        Math.abs(posY - 26.67) < 0.25 &&
        Math.abs(velX) < 0.25 &&
        Math.abs(velY) < 0.25
      ) {
        posX = 0;
        posY = 26.67;
        velX = 0;
        velY = 0;
        updateTransforms();
        svgEl.closest('.chome__item, .cdesk__item')?.classList.remove('chome__item--front');
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
        svgEl.closest('.chome__item, .cdesk__item')?.classList.add('chome__item--front');
        animFrame = requestAnimationFrame(stepPhysics);
      }
    };

    const onPointerDown = (e) => {
      if (e.button !== 0 && e.pointerType === 'mouse') return;
      e.stopPropagation();
      e.preventDefault();
      wasDraggedRef.current = false;
      const pt = screenToSvg(e);
      dragOrigin = { x: pt.x - posX, y: pt.y - posY };
      isDragging = true;
      cardEl.setPointerCapture(e.pointerId);
      wakeAnimation();
    };

    const onPointerMove = (e) => {
      if (!isDragging) return;
      const pt = screenToSvg(e);
      const newX = pt.x - dragOrigin.x;
      const newY = pt.y - dragOrigin.y;
      velX = newX - posX;
      velY = newY - posY;
      posX = newX;
      posY = newY;
      if (Math.hypot(posX, posY - 26.67) > 6) {
        wasDraggedRef.current = true;
      }
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const onPointerEnter = () => {
      if (!isDragging && !isAnimating) {
        velY += 1.3;
        velX += Math.random() < 0.5 ? 0.8 : -0.8;
        wakeAnimation();
      }
    };

    cardEl.addEventListener('pointerdown', onPointerDown);
    cardEl.addEventListener('pointermove', onPointerMove);
    cardEl.addEventListener('pointerup', onPointerUp);
    cardEl.addEventListener('pointercancel', onPointerUp);
    cardEl.addEventListener('pointerenter', onPointerEnter);

    wakeAnimation();

    const cleanupLoop = ambient
      ? ambientLoop(() => {
          if (!isDragging && !isAnimating) {
            velY += 0.9 + 0.9 * Math.random();
            velX += jitter(0.5, 1.1);
            wakeAnimation();
          }
        }, 5000, 13000)
      : null;

    return () => {
      cancelAnimationFrame(animFrame);
      cleanupLoop?.();
      cardEl.removeEventListener('pointerdown', onPointerDown);
      cardEl.removeEventListener('pointermove', onPointerMove);
      cardEl.removeEventListener('pointerup', onPointerUp);
      cardEl.removeEventListener('pointercancel', onPointerUp);
      cardEl.removeEventListener('pointerenter', onPointerEnter);
    };
  }, [ambient]);

  return (
    <span
      className="chome__badge"
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
        ref={svgRef}
        viewBox="0 0 937 1410"
        width={937}
        height={1410}
        aria-hidden="true"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <clipPath id="chome-badge-card" clipPathUnits="userSpaceOnUse">
            <rect x="0" y="641" width="937" height="769" />
            <rect x="471" y="618" width="40" height="23" />
          </clipPath>
          <clipPath id="chome-badge-loop-top" clipPathUnits="userSpaceOnUse">
            <rect x="469" y="596" width="44" height="22" />
          </clipPath>
          <clipPath id="chome-badge-photo">
            <rect x="181" y="66.7" width="38.7" height="64.6" rx="1" />
          </clipPath>
        </defs>

        {/* Lanyard Clip Loop Back */}
        <g className="chome__badge-loop-back">
          <image
            href="/_next/static/media/members-profile.02k5-md-ldto4.png"
            width="937"
            height="1410"
            clipPath="url(#chome-badge-loop-top)"
          />
        </g>

        {/* Dynamic Metallic Ball Chain Links */}
        <g ref={chainRef}>
          {initialChain.map((link, idx) => (
            <g key={idx}>
              <path d={link.full} fill="none" stroke="#8e94a6" strokeWidth="19" strokeLinecap="round" opacity="0.85" />
              <path d={link.full} fill="none" stroke="#ccd1de" strokeWidth="13" strokeLinecap="round" opacity="0.95" />
              <path d={link.shade || 'M0 0'} fill="none" stroke="#737a90" strokeWidth="7" strokeLinecap="round" opacity="0.45" />
              <path d={link.hi || 'M0 0'} fill="none" stroke="#f6f8fc" strokeWidth="4.5" strokeLinecap="round" opacity="0.9" />
            </g>
          ))}
        </g>

        {/* Badge Card Body with realistic tilt & drag */}
        <g ref={cardRef} className="chome__badge-card" style={{ cursor: 'grab' }}>
          {/* Card Sleeve / Holder */}
          <image
            href="/_next/static/media/members-profile.02k5-md-ldto4.png"
            width="937"
            height="1410"
            clipPath="url(#chome-badge-card)"
            style={{ pointerEvents: 'none' }}
          />

          {/* Badge Face Graphics - Original Drool ID Card Look, Made Crisp & Readable */}
          <g transform="rotate(-3.92 468 1140)" style={{ pointerEvents: 'none' }}>
            <image
              href={cardFace}
              x="252"
              y="938"
              width="556"
              height="356"
              preserveAspectRatio="none"
            />

            {!blank && (
              <g transform={`translate(252 938) scale(${556 / 249} ${356 / 166})`}>
                {/* Name - Bold, Crisp Jet Black */}
                <text
                  x={123}
                  y={38.5}
                  textAnchor="middle"
                  fontSize={fontSize + 1.5}
                  fill="#000000"
                  style={{ fontFamily: 'var(--font-recoleta), Georgia, serif' }}
                  {...(computedWidth > 118 ? { textLength: 118, lengthAdjust: 'spacingAndGlyphs' } : {})}
                >
                  <tspan fontWeight={900}>{firstName}</tspan>
                  {lastName && <tspan fontWeight={700}> {lastName}</tspan>}
                </text>

                {/* Job Title - Clean, Unobstructed, Crisp */}
                {jobTitle && (
                  <text
                    x="15"
                    y="52"
                    fontSize="9.8"
                    fill="#000000"
                    style={{ fontFamily: 'var(--font-poppins), sans-serif', fontWeight: 700 }}
                  >
                    {jobTitle}
                  </text>
                )}

                {/* Role / Org */}
                <text
                  x="16"
                  y="64.5"
                  fontSize="8.8"
                  fill="#000000"
                  style={{ fontFamily: 'var(--font-poppins), sans-serif' }}
                >
                  <tspan fontWeight={800}>{orgName}</tspan>
                  <tspan fontWeight={600}> {owner ? 'founder & engineer' : 'team member'}</tspan>
                </text>

                {/* Checkmark icons */}
                <image href="/_next/static/media/tick.0rg2phen5t0pr.svg" x="140" y="79" width="12" height="11.1" />
                <image href="/_next/static/media/tick.0rg2phen5t0pr.svg" x="140" y="98.5" width="12" height="11.1" />

                {/* Subtle soft white backing pill behind handle & email so barcode lines don't obscure text */}
                <rect x="9" y="123" width="144" height="26" rx="4" fill="#FFFFFF" fillOpacity="0.82" />

                {/* Handle & Email - Bold, Crisp, High Contrast */}
                {handle && (
                  <text
                    x="13"
                    y="133.5"
                    fontSize="8.2"
                    fill="#000000"
                    style={{ fontFamily: 'var(--font-poppins), monospace, sans-serif', fontWeight: 800 }}
                  >
                    @{handle.replace(/^@/, '')}
                  </text>
                )}
                {email && (
                  <text
                    x="13"
                    y={handle ? 144.5 : 133.5}
                    fontSize="8.2"
                    fill="#000000"
                    style={{ fontFamily: 'var(--font-poppins), monospace, sans-serif', fontWeight: 800 }}
                  >
                    {email}
                  </text>
                )}

                {/* Avatar Photo if provided */}
                {avatar && (
                  <image
                    href={avatar}
                    x="181"
                    y="66.7"
                    width="38.7"
                    height="64.6"
                    preserveAspectRatio="xMidYMid slice"
                    clipPath="url(#chome-badge-photo)"
                  />
                )}
              </g>
            )}
          </g>

          {/* Transparent hit boxes for easy dragging */}
          <rect x="448" y="641" width="100" height="190" fill="transparent" style={{ pointerEvents: 'all' }} />
          <rect x="204" y="828" width="641" height="520" fill="transparent" style={{ pointerEvents: 'all' }} />
        </g>
      </svg>
    </span>
  );
}
