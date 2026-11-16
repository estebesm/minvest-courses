import React from 'react';
import {Img, staticFile} from 'remotion';
import {useBounce, useTime} from '../anim';
import {color} from '../tokens';

/** 3D-иллюстрации в стиле minvest.kg (public/illustrations, исходники — assets-src/illustrations) */
export type IllustrationName =
  | 'bond'
  | 'wallet'
  | 'building'
  | 'coin-dollar'
  | 'coin-percent'
  | 'pie'
  | 'shield'
  | 'growth'
  | 'hand-coin';

type Props = {
  name: IllustrationName;
  size?: number;
  at?: number;
  /** Подложка: soft — лиловый круг, brand — насыщенный фиолетовый, none — без */
  backdrop?: 'soft' | 'brand' | 'none';
  /** Мягкое парение после появления */
  float?: boolean;
  /** Сдвиг фазы парения, чтобы соседние объекты не качались синхронно */
  phase?: number;
};

/**
 * Объёмная иллюстрация: «выпрыгивает» с лёгким поворотом, потом плавно парит;
 * под ней — мягкая тень, которая дышит вместе с парением.
 */
export const Illustration: React.FC<Props> = ({name, size = 420, at = 0, backdrop = 'soft', float = true, phase = 0}) => {
  const p = useBounce(at, 'medium');
  const pBg = useBounce(at - 0.08, 'soft');
  const t = useTime();
  const k = float && t > at ? Math.sin((t - at) * 1.3 + phase) : 0;
  const lift = k * size * 0.025;
  const tilt = Math.sin((t - at) * 0.9 + phase) * (float ? 2 : 0);

  const circle = size * 0.92;
  const bg =
    backdrop === 'brand'
      ? `radial-gradient(circle at 35% 30%, ${color.primaryLight} 0%, ${color.primary} 70%)`
      : backdrop === 'soft'
        ? color.primarySoft
        : 'transparent';

  return (
    <div style={{position: 'relative', width: size, height: size}}>
      {backdrop !== 'none' ? (
        <div
          style={{
            position: 'absolute',
            left: (size - circle) / 2,
            top: (size - circle) / 2,
            width: circle,
            height: circle,
            borderRadius: '50%',
            background: bg,
            transform: `scale(${pBg})`,
          }}
        />
      ) : null}
      {/* тень под объектом */}
      <div
        style={{
          position: 'absolute',
          left: size * 0.22,
          right: size * 0.22,
          bottom: size * 0.04,
          height: size * 0.07,
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(23,0,72,0.22) 0%, transparent 70%)',
          opacity: Math.min(1, p) * (backdrop === 'brand' ? 0.5 : 1),
          transform: `scale(${1 - k * 0.08})`,
        }}
      />
      <Img
        src={staticFile(`illustrations/${name}.png`)}
        style={{
          position: 'absolute',
          inset: 0,
          width: size,
          height: size,
          opacity: Math.min(1, p * 2),
          transform: `translate3d(0, ${-lift + (1 - p) * size * 0.12}px, 0) scale(${0.55 + 0.45 * p}) rotate(${(1 - p) * -12 + tilt}deg)`,
        }}
      />
    </div>
  );
};
