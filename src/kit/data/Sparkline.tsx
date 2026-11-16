import {evolvePath, getLength, getPointAtLength} from '@remotion/paths';
import {scaleLinear} from 'd3-scale';
import {curveMonotoneX, line} from 'd3-shape';
import React from 'react';
import {useProgress} from '../anim';
import {color, tone as toneOf, type Tone} from '../tokens';

type Props = {
  data: number[];
  width?: number;
  height?: number;
  tone?: Tone;
  at?: number;
  duration?: number;
};

/** Мини-график без осей и подписей — показать характер: «скачет» или «ровно растёт». */
export const Sparkline: React.FC<Props> = ({data, width = 460, height = 160, tone = 'primary', at = 0, duration = 1.4}) => {
  const p = useProgress(at, duration);
  const t = toneOf(tone);
  const x = scaleLinear().domain([0, data.length - 1]).range([10, width - 10]);
  const y = scaleLinear()
    .domain([Math.min(...data), Math.max(...data)])
    .range([height - 10, 10]);
  const d = line<number>()
    .x((_, i) => x(i))
    .y((v) => y(v))
    .curve(curveMonotoneX)(data)!;
  const tip = getPointAtLength(d, getLength(d) * p);
  return (
    <svg width={width} height={height} style={{overflow: 'visible'}}>
      <line x1={0} x2={width} y1={height - 2} y2={height - 2} stroke={color.line} strokeWidth={3} />
      <path d={d} fill="none" stroke={t.fg} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" {...evolvePath(p, d)} />
      {p > 0 && tip ? <circle cx={tip.x} cy={tip.y} r={10} fill={t.fg} stroke={color.surface} strokeWidth={4} /> : null}
    </svg>
  );
};
