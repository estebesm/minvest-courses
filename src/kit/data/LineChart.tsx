import {evolvePath, getLength, getPointAtLength} from '@remotion/paths';
import {scaleLinear} from 'd3-scale';
import {area, curveMonotoneX, line} from 'd3-shape';
import React from 'react';
import {popStyle, useEnter, useProgress, useTime} from '../anim';
import {fontFamily} from '../fonts';
import {color, radius, shadow, tone as toneOf, type, weight, type Tone} from '../tokens';

type Datum = {x: string; y: number};

type Props = {
  data: Datum[];
  width?: number;
  height?: number;
  tone?: Tone;
  /** Появление рамки графика, сек */
  at?: number;
  /** Начало отрисовки линии, сек (по умолчанию через 0.3 сек после `at`) */
  drawAt?: number;
  /** Длительность отрисовки линии, сек */
  duration?: number;
  yFormat?: (v: number) => string;
  /** Подпись значения у последней точки */
  showLastValue?: boolean;
  title?: string;
  /** Нижняя граница оси Y (по умолчанию — от минимума данных) */
  yMin?: number;
};

const PAD = {top: 36, right: 48, bottom: 64, left: 120};

/**
 * Линейный график, который рисуется слева направо.
 * d3 считает только геометрию; анимацией управляет кадр видео.
 */
export const LineChart: React.FC<Props> = ({
  data,
  width = 1000,
  height = 560,
  tone = 'primary',
  at = 0,
  drawAt,
  duration = 2,
  yFormat = (v) => new Intl.NumberFormat('ru-RU').format(v),
  showLastValue = true,
  title,
  yMin,
}) => {
  const pBox = useEnter(at);
  const p = useProgress(drawAt ?? at + 0.3, duration);
  const time = useTime();
  const doneAt = (drawAt ?? at + 0.3) + duration;
  // Расходящиеся круги у последней точки после отрисовки — «живая» точка
  const ring = time > doneAt ? ((time - doneAt) % 1.4) / 1.4 : -1;
  const t = toneOf(tone);

  const chartH = height - (title ? 70 : 0);
  const innerW = width - PAD.left - PAD.right;
  const innerH = chartH - PAD.top - PAD.bottom;
  const ys = data.map((d) => d.y);
  const lo = yMin ?? Math.min(...ys);
  const hi = Math.max(...ys);
  const x = scaleLinear().domain([0, data.length - 1]).range([PAD.left, PAD.left + innerW]);
  const y = scaleLinear().domain([lo, hi]).nice(4).range([PAD.top + innerH, PAD.top]);
  const ticks = y.ticks(4);

  const pathD = line<Datum>()
    .x((_, i) => x(i))
    .y((d) => y(d.y))
    .curve(curveMonotoneX)(data)!;
  const areaD = area<Datum>()
    .x((_, i) => x(i))
    .y0(PAD.top + innerH)
    .y1((d) => y(d.y))
    .curve(curveMonotoneX)(data)!;

  const total = getLength(pathD);
  const tip = getPointAtLength(pathD, total * p) ?? {x: PAD.left, y: PAD.top + innerH};
  const evolved = evolvePath(p, pathD);
  const clipId = `clip-${title ?? 'chart'}-${data.length}`.replace(/\s/g, '');
  const last = data[data.length - 1];

  return (
    <div
      style={{
        ...popStyle(pBox),
        width,
        height,
        background: color.surface,
        borderRadius: radius.lg,
        boxShadow: shadow.card,
        paddingTop: title ? 28 : 0,
        boxSizing: 'border-box',
      }}
    >
      {title ? (
        <div style={{fontSize: type.caption, fontWeight: weight.bold, padding: '0 40px', height: 42}}>{title}</div>
      ) : null}
      <svg width={width} height={chartH} style={{fontFamily, overflow: 'visible'}}>
        <defs>
          <clipPath id={clipId}>
            <rect x={0} y={0} width={tip.x} height={chartH} />
          </clipPath>
          <linearGradient id={`${clipId}-grad`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={t.fg} stopOpacity={0.18} />
            <stop offset="100%" stopColor={t.fg} stopOpacity={0} />
          </linearGradient>
        </defs>

        {ticks.map((v) => (
          <g key={v}>
            <line x1={PAD.left} x2={PAD.left + innerW} y1={y(v)} y2={y(v)} stroke={color.line} strokeWidth={2} />
            <text
              x={PAD.left - 20}
              y={y(v)}
              textAnchor="end"
              dominantBaseline="middle"
              fontSize={type.small}
              fill={color.inkSoft}
              fontWeight={weight.medium}
            >
              {yFormat(v)}
            </text>
          </g>
        ))}
        {data.map((d, i) => (
          <text
            key={d.x}
            x={x(i)}
            y={PAD.top + innerH + 42}
            textAnchor="middle"
            fontSize={type.small}
            fill={color.inkSoft}
            fontWeight={weight.medium}
          >
            {d.x}
          </text>
        ))}

        <path d={areaD} fill={`url(#${clipId}-grad)`} clipPath={`url(#${clipId})`} />
        <path d={pathD} fill="none" stroke={t.fg} strokeWidth={7} strokeLinecap="round" {...evolved} />

        {/* Точка видна сразу — это «старт», линия потом от неё вырастает */}
        {pBox > 0.3 ? (
          <>
            <circle cx={tip.x} cy={tip.y} r={18} fill={t.fg} opacity={0.18} />
            {ring >= 0 ? (
              <circle cx={tip.x} cy={tip.y} r={12 + ring * 46} fill="none" stroke={t.fg} strokeWidth={3} opacity={(1 - ring) * 0.6} />
            ) : null}
            <circle cx={tip.x} cy={tip.y} r={10} fill={t.fg} stroke={color.surface} strokeWidth={4} />
          </>
        ) : null}
        {showLastValue && p > 0.98 ? (
          <text
            x={tip.x - 4}
            y={tip.y - 34}
            textAnchor="end"
            fontSize={type.caption}
            fontWeight={weight.black}
            fill={t.fg}
          >
            {yFormat(last.y)}
          </text>
        ) : null}
      </svg>
    </div>
  );
};
