import React from 'react';
import {easeAt, springAt, useClock} from '../anim';

type Props = {
  at?: number;
  /** Когда убрать элемент, сек */
  out?: number;
  /** Мягкое парение после появления */
  float?: boolean;
  phase?: number;
  bounce?: 'soft' | 'medium' | 'strong';
  opacity?: number;
  rotate?: number;
  children: React.ReactNode;
};

/** Универсальное «выпрыгивание» любого элемента: появился с пружинкой, парит, при `out` — уходит. */
export const Pop: React.FC<Props> = ({at = 0, out, float = false, phase = 0, bounce = 'medium', opacity = 1, rotate = 0, children}) => {
  const {frame, fps, t} = useClock();
  const p = springAt(frame, fps, at, bounce);
  const po = out === undefined ? 0 : easeAt(t, out, 0.35);
  const fl = float && t > at ? Math.sin((t - at) * 1.4 + phase) * 9 : 0;
  const tilt = float && t > at ? Math.sin((t - at) * 0.9 + phase) * 2.5 : 0;
  return (
    <div
      style={{
        opacity: Math.min(1, Math.max(0, p) * 2.5) * (1 - po) * opacity,
        transform: `translate3d(0, ${(1 - p) * 30 + fl}px, 0) scale(${(0.4 + 0.6 * p) * (1 - 0.5 * po)}) rotate(${rotate + tilt + (1 - p) * -10}deg)`,
      }}
    >
      {children}
    </div>
  );
};
