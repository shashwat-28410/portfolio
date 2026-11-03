import React from 'react';

const perspectiveHorizontals = [
  633.44, 643.01, 654.5, 665.99, 681.32, 699.51, 720.58, 745.48, 771.33, 799.9, 834.17, 870.35
];

export function RoomGrid({ pad = 0 }) {
  const leftBound = -pad;
  const rightBound = 1512 + pad;
  const elements = [];
  let keyIndex = 0;

  // Upper flat grid lines
  for (let y = 21.56; y < 613.4; y += 24.504) {
    elements.push(
      <line key={keyIndex++} x1={leftBound} y1={y} x2={rightBound} y2={y} />
    );
  }

  // Perspective desk edge grid lines
  for (const y of perspectiveHorizontals) {
    elements.push(
      <line key={keyIndex++} x1={leftBound} y1={y} x2={rightBound} y2={y} />
    );
  }

  // Vertical lines on wall & converging lines on floor/desk
  const minCol = Math.floor((leftBound - 17.69) / 25.331);
  const maxCol = Math.ceil((rightBound - 17.69) / 25.331);
  const perspectiveRatio = 0.7581835441099918;

  for (let col = minCol; col <= maxCol; col++) {
    const x = 17.69 + 25.331 * col;
    // Straight line down to desk horizon
    elements.push(
      <line key={keyIndex++} x1={x} y1={0} x2={x} y2={633.4} />
    );
    // Angular projection to floor
    const projectedX = x + (x - 764.94) * perspectiveRatio;
    elements.push(
      <line key={keyIndex++} x1={x} y1={633.4} x2={projectedX} y2={881} />
    );
  }

  return (
    <svg
      className="chome__grid"
      style={{ left: leftBound }}
      width={rightBound - leftBound}
      height={881}
      viewBox={`${leftBound} 0 ${rightBound - leftBound} 881`}
      stroke="#FFFFFF"
      strokeOpacity="0.6"
      strokeWidth="1.15"
      strokeMiterlimit="10"
      aria-hidden="true"
    >
      {elements}
    </svg>
  );
}
