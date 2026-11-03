import React, { useRef } from 'react';
import { useKeyringRope } from '../hooks/useKeyringRope';

const pin = { x: 70, y: 12 };
const joints = [
  { x: 70, y: 56 },
  { x: 69, y: 97 },
  { x: 66, y: 155 }
];

export function DiscordKeyring({
  label = 'Safe Space Discord',
  style,
  onClick,
  className = 'cdesk__item chome__item--keyring',
  ambient = true,
  src = '/_next/static/media/discord-keyringHome.0lebvd~r_d-m7.svg'
}) {
  const svgRef = useRef(null);
  const ringRef = useRef(null);
  const chainRef = useRef(null);
  const charmRef = useRef(null);
  const wasDraggedRef = useRef(false);

  useKeyringRope({
    svgRef,
    segmentRefs: [ringRef, chainRef, charmRef],
    draggedRef: wasDraggedRef,
    pin,
    joints,
    ambient
  });

  return (
    <button
      type="button"
      className={className}
      style={style}
      aria-label={label}
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
        viewBox="0 0 126 214"
        style={{ overflow: 'visible' }}
        role="img"
        aria-label={label}
      >
        <defs>
          <clipPath id="kh-ring" clipPathUnits="userSpaceOnUse">
            <rect x="0" y="0" width="126" height="56" />
          </clipPath>
          <clipPath id="kh-chain" clipPathUnits="userSpaceOnUse">
            <rect x="0" y="56" width="126" height="41" />
          </clipPath>
          <clipPath id="kh-charm" clipPathUnits="userSpaceOnUse">
            <rect x="0" y="97" width="126" height="117" />
          </clipPath>
          <radialGradient id="kh-pin" cx="0.35" cy="0.32" r="0.8">
            <stop stopColor="#D9F6E7" />
            <stop offset="0.55" stopColor="#94D1E4" />
            <stop offset="1" stopColor="#7FB6D6" />
          </radialGradient>
        </defs>

        {/* Ring segment */}
        <g ref={ringRef}>
          <image href={src} width="126" height="214" clipPath="url(#kh-ring)" />
        </g>

        {/* Chain links segment */}
        <g ref={chainRef}>
          <image href={src} width="126" height="214" clipPath="url(#kh-chain)" />
        </g>

        {/* Mascot / Discord Charm segment */}
        <g ref={charmRef} className="dk-charm" style={{ cursor: 'grab' }}>
          <image href={src} width="126" height="214" clipPath="url(#kh-charm)" />
        </g>

        {/* Metallic pushpin */}
        <circle cx={pin.x} cy={pin.y} r="6" fill="url(#kh-pin)" stroke="#212121" strokeWidth="1" />
      </svg>
      <noscript>
        <img src={src} alt={label} />
      </noscript>
    </button>
  );
}
