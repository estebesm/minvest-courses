import React from 'react';
import {useTime} from '../anim';
import {color} from '../tokens';

type Props = {
  /** Центр облака искр и радиус разлёта, px */
  x: number;
  y: number;
  radius?: number;
  count?: number;
  at?: number;
  /** Сид — чтобы у разных облаков была разная раскладка */
  seed?: number;
};

const rand = (n: number) => {
  const s = Math.sin(n * 127.1) * 43758.5453;
  return s - Math.floor(s);
};

const Star: React.FC<{size: number; fill: string}> = ({size, fill}) => (
  <svg width={size} height={size} viewBox="-10 -10 20 20" style={{display: 'block'}}>
    <path d="M0 -10 C1 -2 2 -1 10 0 C2 1 1 2 0 10 C-1 2 -2 1 -10 0 C-2 -1 -1 -2 0 -10 Z" fill={fill} />
  </svg>
);

/** Мерцающие искорки вокруг объекта — «блеск», добавляют кадру богатства. */
export const Sparkles: React.FC<Props> = ({x, y, radius = 260, count = 7, at = 0, seed = 1}) => {
  const t = useTime();
  if (t < at) return null;
  return (
    <>
      {Array.from({length: count}).map((_, i) => {
        const a = rand(seed * 10 + i) * Math.PI * 2;
        const r = radius * (0.65 + rand(seed * 20 + i) * 0.45);
        const size = 18 + rand(seed * 30 + i) * 26;
        const period = 1.6 + rand(seed * 40 + i) * 1.4;
        const local = t - at - rand(seed * 50 + i) * 1.2;
        const k = local < 0 ? 0 : Math.max(0, Math.sin((local / period) * Math.PI * 2));
        const fill = i % 3 === 0 ? color.primaryLight : color.gold;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x + Math.cos(a) * r,
              top: y + Math.sin(a) * r,
              transform: `translate(-50%, -50%) scale(${k}) rotate(${local * 40}deg)`,
              opacity: k,
            }}
          >
            <Star size={size} fill={fill} />
          </div>
        );
      })}
    </>
  );
};
