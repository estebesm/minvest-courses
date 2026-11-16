import React from 'react';
import {useBounce, useEnter} from '../anim';
import {color, motion, tone as toneOf, type, weight, type Tone} from '../tokens';

type Props = {
  items: string[];
  /** Начало появления первого пункта, сек */
  at?: number;
  /** Пауза между пунктами, сек. Игнорируется, если задан `itemsAt` */
  step?: number;
  /** Точное время появления каждого пункта (для синхронизации с озвучкой) */
  itemsAt?: number[];
  numbered?: boolean;
  tone?: Tone;
};

const Item: React.FC<{text: string; index: number; at: number; numbered: boolean; tone: Tone}> = ({
  text,
  index,
  at,
  numbered,
  tone,
}) => {
  const pDot = useBounce(at, 'strong');
  const p = useEnter(at + 0.08);
  const t = toneOf(tone);
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 32}}>
      <div
        style={{
          transform: `scale(${pDot})`,
          width: 64,
          height: 64,
          borderRadius: '50%',
          background: t.soft,
          color: t.fg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: type.caption,
          fontWeight: weight.black,
          flexShrink: 0,
        }}
      >
        {numbered ? index + 1 : <div style={{width: 18, height: 18, borderRadius: '50%', background: t.fg}} />}
      </div>
      <div
        style={{
          opacity: p,
          transform: `translateX(${(1 - p) * -40}px)`,
          clipPath: `inset(0 ${(1 - p) * 100}% 0 0)`,
          fontSize: type.h3,
          fontWeight: weight.semibold,
          lineHeight: 1.25,
          color: color.ink,
        }}
      >
        {text}
      </div>
    </div>
  );
};

/** Список, пункты появляются по одному. */
export const BulletList: React.FC<Props> = ({
  items,
  at = 0,
  step = motion.stagger,
  itemsAt,
  numbered = true,
  tone = 'primary',
}) => (
  <div style={{display: 'flex', flexDirection: 'column', gap: 36}}>
    {items.map((text, i) => (
      <Item key={i} text={text} index={i} at={itemsAt?.[i] ?? at + i * step} numbered={numbered} tone={tone} />
    ))}
  </div>
);
