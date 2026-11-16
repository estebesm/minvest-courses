import type {Icon as PhosphorIcon} from '@phosphor-icons/react';
import React from 'react';
import {enterStyle, popStyle, useEnter} from '../anim';
import {Icon} from '../media/Icon';
import {color, motion, radius, shadow, tone as toneOf, type, weight, type Tone} from '../tokens';

type Column = {title: string; items: string[]; tone?: Tone; icon?: PhosphorIcon};

type Props = {
  left: Column;
  right: Column;
  at?: number;
  step?: number;
  /** 'columns' — сначала весь левый, потом правый; 'rows' — построчно */
  order?: 'columns' | 'rows';
  /** Явное время появления правой колонки (для синхронизации с озвучкой) */
  rightAt?: number;
};

const Row: React.FC<{text: string; at: number; tone: Tone}> = ({text, at, tone}) => {
  const p = useEnter(at);
  return (
    <div style={{...enterStyle(p, 16), display: 'flex', alignItems: 'center', gap: 20}}>
      <div style={{width: 14, height: 14, borderRadius: '50%', background: toneOf(tone).fg, flexShrink: 0}} />
      <div style={{fontSize: type.body, fontWeight: weight.medium, lineHeight: 1.3}}>{text}</div>
    </div>
  );
};

const Panel: React.FC<{col: Column; at: number; itemTimes: number[]}> = ({col, at, itemTimes}) => {
  const p = useEnter(at);
  const tn = col.tone ?? 'primary';
  const t = toneOf(tn);
  return (
    <div
      style={{
        ...popStyle(p),
        flex: 1,
        background: color.surface,
        borderRadius: radius.lg,
        boxShadow: shadow.card,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{background: t.soft, padding: '32px 44px', display: 'flex', alignItems: 'center', gap: 24}}>
        {col.icon ? <Icon icon={col.icon} tone={tn} size={52} /> : null}
        <div style={{fontSize: type.h3 + 4, fontWeight: weight.black, color: t.fg}}>{col.title}</div>
      </div>
      <div style={{padding: '40px 44px 48px', display: 'flex', flexDirection: 'column', gap: 30}}>
        {col.items.map((it, i) => (
          <Row key={i} text={it} at={itemTimes[i]} tone={tn} />
        ))}
      </div>
    </div>
  );
};

/** Сравнение двух вариантов: «за / против», «акции / облигации». */
export const TwoColumns: React.FC<Props> = ({left, right, at = 0, step = motion.stagger, order = 'columns', rightAt}) => {
  const leftStart = at + 0.3;
  const leftTimes = left.items.map((_, i) => (order === 'rows' ? leftStart + i * 2 * step : leftStart + i * step));
  const rStart = rightAt ?? (order === 'rows' ? at : leftStart + left.items.length * step);
  const rightTimes = right.items.map((_, i) =>
    order === 'rows' ? leftStart + step + i * 2 * step : rStart + 0.3 + i * step,
  );
  return (
    <div style={{display: 'flex', gap: 48, alignItems: 'stretch'}}>
      <Panel col={left} at={at} itemTimes={leftTimes} />
      <Panel col={right} at={order === 'rows' ? at + 0.15 : rStart} itemTimes={rightTimes} />
    </div>
  );
};
