import React from 'react';
import {useBounce} from '../anim';
import {color, radius, type, weight} from '../tokens';

/** Штамп, который «шлёпается» сверху: ДОЛГ, ОПЛАЧЕНО, РИСК… */
export const Stamp: React.FC<{text: string; at: number; rotate?: number; tone?: string}> = ({
  text,
  at,
  rotate = -14,
  tone = color.primary,
}) => {
  const p = useBounce(at, 'strong');
  if (p <= 0.001) return null;
  return (
    <div
      style={{
        transform: `scale(${2.2 - 1.2 * p}) rotate(${rotate}deg)`,
        opacity: Math.min(1, p * 3),
        border: `8px solid ${tone}`,
        color: tone,
        borderRadius: radius.md,
        padding: '8px 28px',
        fontSize: type.h2,
        fontWeight: weight.black,
        letterSpacing: 4,
        background: 'rgba(255,255,255,0.85)',
        whiteSpace: 'nowrap',
      }}
    >
      {text}
    </div>
  );
};
