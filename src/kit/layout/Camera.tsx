import React from 'react';
import {Easing, interpolate} from 'remotion';
import {useTime} from '../anim';
import {stage} from '../tokens';

export type CameraShot = {
  /** Когда начать движение камеры, сек */
  at: number;
  /** Куда смотреть — точка области сцены (по умолчанию центр) */
  x?: number;
  y?: number;
  /** Приближение: 1 — весь кадр, 1.5 — в полтора раза ближе */
  zoom?: number;
  /** Сколько длится переезд, сек */
  duration?: number;
};

type Props = {
  /** Начальное положение камеры */
  start?: Omit<CameraShot, 'at' | 'duration'>;
  /** Переезды камеры по ходу сцены */
  shots?: CameraShot[];
  /** Дополнительный медленный наезд (лёгкий наезд уже есть у каждой Scene) */
  drift?: boolean;
  children: React.ReactNode;
};

const CENTER = {x: stage.width / 2, y: stage.height / 2, zoom: 1};

/**
 * Виртуальная камера: наезды, отъезды и переезды к нужному элементу.
 * Всё, что внутри, двигается вместе; фон и субтитры — нет.
 */
export const Camera: React.FC<Props> = ({start, shots = [], drift = false, children}) => {
  const t = useTime();
  let s = {...CENTER, ...start};

  for (const shot of shots) {
    const p = interpolate(t, [shot.at, shot.at + (shot.duration ?? 1.2)], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.bezier(0.65, 0, 0.35, 1),
    });
    const target = {x: shot.x ?? CENTER.x, y: shot.y ?? CENTER.y, zoom: shot.zoom ?? 1};
    s = {x: s.x + (target.x - s.x) * p, y: s.y + (target.y - s.y) * p, zoom: s.zoom + (target.zoom - s.zoom) * p};
  }

  const zoom = s.zoom * (drift ? 1 + t * 0.01 : 1);
  const tx = stage.width / 2 - s.x * zoom;
  const ty = stage.height / 2 - s.y * zoom;

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: stage.width,
        height: stage.height,
        transformOrigin: '0 0',
        transform: `translate(${tx}px, ${ty}px) scale(${zoom})`,
      }}
    >
      {children}
    </div>
  );
};
