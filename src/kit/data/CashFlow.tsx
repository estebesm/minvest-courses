import React from 'react';
import {useBounce, useProgress, useTime} from '../anim';
import {Coin} from '../media/Coin';
import {color, type, weight} from '../tokens';

export type Flow = {
  /** Сумма: >0 — деньги приходят (вверх), <0 — уходят (вниз) */
  amount: number;
  /** Когда появляется, сек */
  at: number;
  /** Подпись над/под столбиком; по умолчанию — сама сумма */
  label?: string;
};

type Props = {
  flows: Flow[];
  /** Знак валюты перед суммой */
  currency?: string;
  /** Когда прочертить ось времени */
  at?: number;
  width?: number;
  height?: number;
};

const fmt = (n: number, cur: string) => `${n > 0 ? '+' : '−'}${cur}${new Intl.NumberFormat('ru-RU').format(Math.abs(n))}`;

/**
 * Денежный поток во времени: ось слева направо, входящие деньги — столбики вверх (золото),
 * исходящие — вниз (фиолетовые). Классическая схема для облигаций, вкладов, кредитов.
 */
export const CashFlow: React.FC<Props> = ({flows, currency = '$', at = 0, width = 1500, height = 700}) => {
  const axis = useProgress(at, 0.9);
  const max = Math.max(...flows.map((f) => Math.abs(f.amount)));
  const axisY = height * 0.5;
  const step = width / (flows.length + 0.5);
  return (
    <div style={{position: 'relative', width, height}}>
      <svg width={width} height={height} style={{position: 'absolute', overflow: 'visible'}}>
        <line
          x1={0}
          y1={axisY}
          x2={(width - 10) * axis}
          y2={axisY}
          stroke={color.ink}
          strokeWidth={5}
          strokeLinecap="round"
        />
        {axis > 0.95 ? (
          <polygon points={`${width},${axisY} ${width - 26},${axisY - 15} ${width - 26},${axisY + 15}`} fill={color.ink} />
        ) : null}
      </svg>
      {flows.map((f, i) => (
        <Bar key={i} flow={f} x={step * (i + 0.6)} axisY={axisY} max={max} currency={currency} />
      ))}
    </div>
  );
};

const Bar: React.FC<{flow: Flow; x: number; axisY: number; max: number; currency: string}> = ({flow, x, axisY, max, currency}) => {
  const p = useBounce(flow.at, 'medium');
  const pCoin = useBounce(flow.at + 0.2, 'strong');
  const time = useTime();
  // Монетки слегка покачиваются — кадр не замирает
  const bob = time > flow.at + 0.8 ? Math.sin(time * 2.4 + x * 0.01) * 6 : 0;
  const up = flow.amount > 0;
  const full = 50 + 170 * Math.sqrt(Math.abs(flow.amount) / max);
  const h = Math.max(0, full * p);
  const w = 64;
  const barColor = up
    ? `linear-gradient(180deg, ${color.gold}, ${color.goldLight})`
    : `linear-gradient(0deg, ${color.primary}, ${color.primaryLight})`;
  const label = flow.label ?? fmt(flow.amount, currency);
  return (
    <>
      {/* засечка на оси */}
      <div
        style={{
          position: 'absolute',
          left: x - 3,
          top: axisY - 12,
          width: 6,
          height: 24,
          borderRadius: 3,
          background: color.ink,
          opacity: Math.min(1, p * 3),
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: x - w / 2,
          width: w,
          height: h,
          top: up ? axisY - h : axisY,
          borderRadius: up ? '18px 18px 6px 6px' : '6px 6px 18px 18px',
          background: barColor,
          boxShadow: up ? '0 10px 24px #E9A80044' : '0 10px 24px #6E39DD44',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: x,
          top: up ? axisY - h - 44 : axisY + h + 44,
          transform: `translate3d(0, ${bob}px, 0) translate(-50%, -50%) scale(${pCoin})`,
          display: 'flex',
          flexDirection: up ? 'column-reverse' : 'column',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <Coin size={76} />
        <div
          style={{
            fontSize: type.caption + 4,
            fontWeight: weight.black,
            color: up ? color.ink : color.primary,
            whiteSpace: 'nowrap',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {label}
        </div>
      </div>
    </>
  );
};
