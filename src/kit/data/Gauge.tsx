import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {useEnter, useTime} from '../anim';
import {color, type, weight} from '../tokens';

type Props = {
  /** 0 — минимум, 1 — максимум */
  value: number;
  at?: number;
  size?: number;
  /** Короткая подпись под шкалой: «риск» */
  label?: string;
  /** Подрагивание стрелки после остановки (для «нервных» величин) */
  jitter?: boolean;
};

const arc = (cx: number, cy: number, r: number, a0: number, a1: number) => {
  const p = (a: number) => [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  const [x0, y0] = p(a0);
  const [x1, y1] = p(a1);
  return `M ${x0} ${y0} A ${r} ${r} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${x1} ${y1}`;
};

/** Спидометр: стрелка с пружинкой доезжает до значения. Для риска, доходности, «насколько». */
export const Gauge: React.FC<Props> = ({value, at = 0, size = 340, label, jitter = false}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = useTime();
  const pBox = useEnter(at);
  const p = spring({frame: frame - Math.round((at + 0.25) * fps), fps, config: {damping: 9, mass: 0.8, stiffness: 90}});
  const shake = jitter && t > at + 1.2 ? Math.sin(t * 13) * 0.025 + Math.sin(t * 7.3) * 0.02 : 0;
  const v = value * p + shake;

  const cx = size / 2;
  const cy = size * 0.56;
  const r = size * 0.4;
  const segs = [
    {from: 0, to: 0.33, c: color.positive},
    {from: 0.34, to: 0.66, c: color.gold},
    {from: 0.67, to: 1, c: color.negative},
  ];
  const ang = (k: number) => Math.PI + k * Math.PI;
  const needle = interpolate(v, [0, 1], [-90, 90]);

  return (
    <div style={{opacity: pBox, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4}}>
      <svg width={size} height={size * 0.66} style={{overflow: 'visible'}}>
        {segs.map((s, i) => (
          <path
            key={i}
            d={arc(cx, cy, r, ang(s.from), ang(s.to))}
            stroke={s.c}
            strokeWidth={size * 0.09}
            fill="none"
            strokeLinecap="round"
            opacity={0.9}
          />
        ))}
        <g transform={`translate(${cx} ${cy}) rotate(${needle})`}>
          <path d={`M -10 0 L 0 ${-r * 0.92} L 10 0 Z`} fill={color.ink} />
        </g>
        <circle cx={cx} cy={cy} r={size * 0.05} fill={color.ink} />
        <circle cx={cx} cy={cy} r={size * 0.02} fill={color.surface} />
      </svg>
      {label ? (
        <div style={{fontSize: type.caption, fontWeight: weight.bold, color: color.inkSoft, textTransform: 'uppercase', letterSpacing: 2}}>
          {label}
        </div>
      ) : null}
    </div>
  );
};
