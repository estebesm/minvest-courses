import React from 'react';
import {useTime, windowAt} from '../anim';

type Window = [number, number];

type Props = {
  /** Моменты (сек), когда элемент «подпрыгивает», чтобы привлечь внимание */
  pulse?: number[];
  /** Интервалы (сек), когда элемент приглушён — внимание на чём-то другом */
  dim?: Window[];
  children: React.ReactNode;
};

const PULSE_DUR = 0.5;
const DIM_FADE = 0.35;

/**
 * Управление вниманием зрителя: подпрыгнуть на ключевом слове или уйти в тень,
 * пока рассказывают про соседний элемент.
 */
export const Emphasis: React.FC<Props> = ({pulse = [], dim = [], children}) => {
  const t = useTime();

  let scale = 1;
  let rotate = 0;
  for (const at of pulse) {
    const k = (t - at) / PULSE_DUR;
    if (k >= 0 && k <= 1) {
      scale += 0.09 * Math.sin(Math.PI * k) * (1 - k * 0.3);
      rotate += 2.5 * Math.sin(2 * Math.PI * k) * (1 - k);
    }
  }

  let dimAmount = 0;
  for (const [a, b] of dim) {
    const v = windowAt(t, a, b, DIM_FADE);
    dimAmount = Math.max(dimAmount, v);
  }

  return (
    <div
      style={{
        transform: `scale(${scale * (1 - 0.04 * dimAmount)}) rotate(${rotate}deg)`,
        opacity: 1 - 0.6 * dimAmount,
        filter: dimAmount > 0 ? `grayscale(${dimAmount}) blur(${dimAmount * 1.5}px)` : undefined,
      }}
    >
      {children}
    </div>
  );
};
