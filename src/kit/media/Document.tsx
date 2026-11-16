import {evolvePath} from '@remotion/paths';
import React from 'react';
import {bounceStyle, useBounce, useProgress} from '../anim';
import {color, radius, shadow, type, weight} from '../tokens';

type Props = {
  /** Заголовок документа — одно-два слова */
  title: string;
  /** Крупная сумма на документе, например «1 000 ₽» */
  amount?: string;
  at?: number;
  /** Когда «расписаться» */
  signAt?: number;
  /** Когда шлёпнуть штамп */
  stampAt?: number;
  stampText?: string;
  width?: number;
};

const SIGN = 'M 10 46 C 30 6, 44 6, 40 34 S 58 60, 72 26 S 96 14, 100 40 S 120 52, 150 24';

/**
 * Иллюстрация документа: лист появляется, строки «пишутся», ставится подпись и штамп.
 * Подходит для «расписки», договора, облигации, счёта.
 */
export const Document: React.FC<Props> = ({
  title,
  amount,
  at = 0,
  signAt,
  stampAt,
  stampText = 'ДОЛГ',
  width = 520,
}) => {
  const p = useBounce(at, 'soft');
  const lines = [0.92, 0.78, 0.86, 0.6];
  const sign = useProgress(signAt ?? at + 1.2, 0.7);
  const stamp = useBounce(stampAt ?? at + 2, 'strong');
  const stampVisible = stamp > 0.001;
  const height = width * 1.22;

  return (
    <div style={{position: 'relative', width, height}}>
      <div
        style={{
          ...bounceStyle(p, 0.7),
          position: 'absolute',
          inset: 0,
          background: color.surface,
          borderRadius: radius.lg,
          boxShadow: shadow.card,
          padding: width * 0.1,
          display: 'flex',
          flexDirection: 'column',
          gap: width * 0.05,
          rotate: '-3deg',
          overflow: 'hidden',
        }}
      >
        <div style={{height: 10, width: '30%', borderRadius: 5, background: color.primary}} />
        <div style={{fontSize: type.h3 + 4, fontWeight: weight.black, color: color.ink}}>{title}</div>
        {amount ? (
          <div style={{fontSize: type.h2, fontWeight: weight.black, color: color.primary, letterSpacing: -1}}>
            {amount}
          </div>
        ) : null}
        <div style={{display: 'flex', flexDirection: 'column', gap: 18, marginTop: 8}}>
          {lines.map((w, i) => (
            <Line key={i} at={at + 0.35 + i * 0.12} width={w} />
          ))}
        </div>
        <svg width={160} height={64} style={{marginTop: 'auto', overflow: 'visible'}}>
          <path
            d={SIGN}
            fill="none"
            stroke={color.primaryDeep}
            strokeWidth={4}
            strokeLinecap="round"
            strokeLinejoin="round"
            {...evolvePath(sign, SIGN)}
          />
        </svg>
      </div>
      {stampVisible ? (
        <div
          style={{
            position: 'absolute',
            right: -width * 0.08,
            bottom: height * 0.14,
            transform: `scale(${2.2 - 1.2 * stamp}) rotate(-14deg)`,
            opacity: Math.min(1, stamp * 3),
            border: `8px solid ${color.negative}`,
            color: color.negative,
            borderRadius: radius.md,
            padding: '10px 28px',
            fontSize: type.h2,
            fontWeight: weight.black,
            letterSpacing: 4,
            background: '#FFFEFFcc',
          }}
        >
          {stampText}
        </div>
      ) : null}
    </div>
  );
};

const Line: React.FC<{at: number; width: number}> = ({at, width}) => {
  const p = useProgress(at, 0.4);
  return <div style={{height: 14, borderRadius: 7, background: color.line, width: `${width * p * 100}%`}} />;
};
