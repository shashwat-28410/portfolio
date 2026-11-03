import React, { useRef, useEffect } from 'react';
import { ambientLoop } from '../hooks/useAmbientLoop';

export function Folder({
  ambient = true,
  labelTop = 'PROJECTS',
  labelBottom = 'WORK',
  onClick
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!ambient || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const sheets = containerRef.current?.querySelectorAll('.cdesk__folder-sheet');
    if (!sheets?.length) return;

    let resetTimer = 0;
    const cleanup = ambientLoop(() => {
      const sheet = sheets[Math.floor(Math.random() * sheets.length)];
      if (!sheet.matches(':hover')) {
        sheet.classList.add('is-up');
        resetTimer = window.setTimeout(
          () => sheet.classList.remove('is-up'),
          600 + 400 * Math.random()
        );
      }
    }, 4500, 10000);

    return () => {
      cleanup();
      clearTimeout(resetTimer);
    };
  }, [ambient]);

  return (
    <svg
      ref={containerRef}
      className="cdesk__folder"
      viewBox="0 0 250 148"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ cursor: 'pointer' }}
      onClick={onClick}
    >
      <defs>
        <linearGradient id="folder-body-grad" x1="0" y1="0" x2="250" y2="148" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ECCF96" />
          <stop offset="100%" stopColor="#DBB877" />
        </linearGradient>
        <linearGradient id="folder-front-grad" x1="0" y1="42" x2="250" y2="147" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F5DC9E" />
          <stop offset="100%" stopColor="#E2BD78" />
        </linearGradient>
      </defs>

      {/* Folder Back Tab and Body */}
      <path
        d="M188.784 18.2675V147.101H0.822266V18.2675H27.9411L33.5519 0.5H92.4651L99.9462 18.2675H188.784Z"
        fill="url(#folder-body-grad)"
        stroke="#212121"
        strokeWidth="1.2"
      />
      <text className="cdesk__folder-label" x="63" y="9.6" textAnchor="middle" style={{ fill: '#212121', fontWeight: 700 }}>
        {labelTop}
      </text>
      <text className="cdesk__folder-label" x="63" y="16.9" textAnchor="middle" style={{ fill: '#212121', fontWeight: 700 }}>
        {labelBottom}
      </text>

      {/* Layered Colorful Pastel Project Sheets inside */}
      {/* Sheet 1: Pastel Mint */}
      <g className="cdesk__folder-sheet">
        <rect
          x="5.80371"
          y="22.369"
          width="174.335"
          height="116.199"
          fill="#AAF0CE"
          stroke="#1E1E1E"
          strokeWidth="0.8"
        />
        <line x1="20" y1="36" x2="160" y2="36" stroke="#212121" strokeWidth="1.2" strokeOpacity="0.4" />
        <line x1="20" y1="46" x2="140" y2="46" stroke="#212121" strokeWidth="1" strokeOpacity="0.3" />
      </g>

      {/* Sheet 2: Pastel Sky Blue */}
      <g className="cdesk__folder-sheet">
        <rect
          x="11.2705"
          y="26.8634"
          width="174.335"
          height="108.435"
          fill="#94D1E4"
          stroke="#1E1E1E"
          strokeWidth="0.8"
        />
        <line x1="24" y1="40" x2="150" y2="40" stroke="#212121" strokeWidth="1.2" strokeOpacity="0.4" />
        <line x1="24" y1="50" x2="130" y2="50" stroke="#212121" strokeWidth="1" strokeOpacity="0.3" />
      </g>

      {/* Sheet 3: Soft Lavender */}
      <g className="cdesk__folder-sheet">
        <rect
          x="17.1816"
          y="31.7489"
          width="174.335"
          height="99.6825"
          fill="#CFC0E9"
          stroke="#1E1E1E"
          strokeWidth="0.8"
        />
        <line x1="30" y1="44" x2="160" y2="44" stroke="#212121" strokeWidth="1.2" strokeOpacity="0.4" />
        <line x1="30" y1="54" x2="120" y2="54" stroke="#212121" strokeWidth="1" strokeOpacity="0.3" />
      </g>

      {/* Sheet 4: Warm Peach Coral */}
      <g className="cdesk__folder-sheet">
        <rect
          x="23.75"
          y="37.5326"
          width="174.335"
          height="98.4968"
          fill="#F2C0A1"
          stroke="#1E1E1E"
          strokeWidth="0.8"
        />
        <line x1="36" y1="50" x2="170" y2="50" stroke="#212121" strokeWidth="1.2" strokeOpacity="0.4" />
        <line x1="36" y1="60" x2="140" y2="60" stroke="#212121" strokeWidth="1" strokeOpacity="0.3" />
      </g>

      {/* Folder Front Flap Pocket */}
      <path
        d="M197.705 147.101H0.822266L55.0428 42.5809H248.632L197.705 147.101Z"
        fill="url(#folder-front-grad)"
        stroke="#212121"
        strokeWidth="1.2"
      />
    </svg>
  );
}
