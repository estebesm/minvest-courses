import type {Icon as PhosphorIcon} from '@phosphor-icons/react';
import {evolvePath} from '@remotion/paths';
import React from 'react';
import {useProgress} from '../anim';
import {motion, tone as toneOf, type Tone} from '../tokens';
import {Card} from './Card';

type Step = {label: string; caption?: string; icon?: PhosphorIcon; tone?: Tone};

type Props = {
  steps: Step[];
  at?: number;
  /** Пауза между шагами, сек. Игнорируется, если задан `stepsAt` */
  step?: number;
  /** Точное время появления каждого шага (синхронизация с озвучкой) */
  stepsAt?: number[];
  tone?: Tone;
  cardWidth?: number;
  gap?: number;
};

const Connector: React.FC<{at: number; width: number; tone: Tone}> = ({at, width, tone}) => {
  const p = useProgress(at, motion.draw * 0.7);
  const d = `M 8 20 L ${width - 22} 20`;
  const evolved = evolvePath(p, d);
  const t = toneOf(tone);
  return (
    <svg width={width} height={40} style={{flexShrink: 0, overflow: 'visible'}}>
      <path d={d} stroke={t.fg} strokeWidth={6} strokeLinecap="round" fill="none" {...evolved} />
      <polygon
        points={`${width - 4},20 ${width - 26},7 ${width - 21},20 ${width - 26},33`}
        fill={t.fg}
        opacity={p > 0.85 ? 1 : 0}
      />
    </svg>
  );
};

/** Цепочка шагов A → B → C. Шаги и стрелки появляются по очереди. */
export const Chain: React.FC<Props> = ({
  steps,
  at = 0,
  step = motion.stagger * 2,
  stepsAt,
  tone = 'primary',
  cardWidth = 340,
  gap = 110,
}) => {
  const times = steps.map((_, i) => stepsAt?.[i] ?? at + i * step);
  return (
    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      {steps.map((s, i) => (
        <React.Fragment key={i}>
          {i > 0 ? <Connector at={times[i] - 0.45} width={gap} tone={tone} /> : null}
          <Card {...s} tone={s.tone ?? tone} at={times[i]} width={cardWidth} />
        </React.Fragment>
      ))}
    </div>
  );
};
