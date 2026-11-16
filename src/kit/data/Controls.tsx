import type {Icon as PhosphorIcon} from '@phosphor-icons/react';
import React from 'react';
import {interpolate} from 'remotion';
import {bounceStyle, easeAt, springAt, useBounce, useClock} from '../anim';
import {fontFamily} from '../fonts';
import {defaultSurface, surfaceStyle} from '../surface';
import {color, tone as toneOf, type, weight, type Tone} from '../tokens';

/** Панель настроек (как форма конструктора в приложении): строки с ползунками и выбором. */
export const ControlCard: React.FC<{at?: number; width?: number; children: React.ReactNode}> = ({at = 0, width = 660, children}) => {
  const p = useBounce(at, 'soft');
  return (
    <div style={{...bounceStyle(p, 0.85), ...surfaceStyle(defaultSurface, 'primary'), width, padding: '26px 36px', display: 'flex', flexDirection: 'column', fontFamily, boxSizing: 'border-box'}}>
      {children}
    </div>
  );
};

type RowProps = {
  icon: PhosphorIcon;
  /** Одно слово */
  label: string;
  /** Когда строку «заполняют» — до этого она приглушена */
  at: number;
  tone?: Tone;
  children: React.ReactNode;
};

export const ControlRow: React.FC<RowProps> = ({icon: I, label, at, tone = 'primary', children}) => {
  const {frame, fps, t} = useClock();
  const on = easeAt(t, at - 0.15, 0.4);
  const kick = springAt(frame, fps, at, 'strong');
  const tn = toneOf(tone);
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 22, height: 104, opacity: 0.38 + 0.62 * on}}>
      <div
        style={{
          width: 68,
          height: 68,
          borderRadius: '50%',
          background: on > 0.5 ? tn.soft : color.line,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          transform: `scale(${1 + Math.sin(Math.min(1, Math.max(0, kick)) * Math.PI) * 0.22})`,
        }}
      >
        <I size={36} weight="duotone" color={on > 0.5 ? tn.fg : color.inkSoft} />
      </div>
      <div style={{width: 190, fontSize: type.caption + 2, fontWeight: weight.bold, color: color.ink, flexShrink: 0}}>{label}</div>
      <div style={{flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center'}}>{children}</div>
    </div>
  );
};

/** Ползунок: бегунок с пружинкой доезжает до значения. */
export const Slider: React.FC<{value: number; at: number; tone?: Tone; width?: number; label?: string}> = ({value, at, tone = 'primary', width = 300, label}) => {
  const {frame, fps} = useClock();
  const p = springAt(frame, fps, at, 'medium');
  const v = 0.08 + (value - 0.08) * p;
  const tn = toneOf(tone);
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
      {label ? (
        <div style={{fontSize: type.caption, fontWeight: weight.black, color: tn.fg, opacity: Math.min(1, Math.max(0, p) * 2), whiteSpace: 'nowrap'}}>{label}</div>
      ) : null}
      <div style={{position: 'relative', width, height: 40}}>
        <div style={{position: 'absolute', left: 0, right: 0, top: 14, height: 12, borderRadius: 6, background: color.outline}} />
        <div style={{position: 'absolute', left: 0, width: width * v, top: 14, height: 12, borderRadius: 6, background: tn.fg}} />
        <div
          style={{
            position: 'absolute',
            left: width * v - 20,
            top: 0,
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: color.white,
            border: `6px solid ${tn.fg}`,
            boxSizing: 'border-box',
            boxShadow: '0 6px 14px rgba(23,0,72,0.18)',
          }}
        />
      </div>
    </div>
  );
};

/** Выбор из нескольких значков: в момент `at` выбранные подсвечиваются. */
export const Choice: React.FC<{icons: PhosphorIcon[]; selected: number[]; at: number; tone?: Tone}> = ({icons, selected, at, tone = 'primary'}) => {
  const {frame, fps} = useClock();
  const tn = toneOf(tone);
  return (
    <div style={{display: 'flex', gap: 14}}>
      {icons.map((I, i) => {
        const idx = selected.indexOf(i);
        const p = idx < 0 ? 0 : springAt(frame, fps, at + idx * 0.25, 'strong');
        const on = p > 0.5;
        return (
          <div
            key={i}
            style={{
              width: 64,
              height: 64,
              borderRadius: 20,
              background: on ? tn.fg : color.white,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: `scale(${1 + Math.sin(Math.min(1, Math.max(0, p)) * Math.PI) * 0.25})`,
            }}
          >
            <I size={34} weight={on ? 'fill' : 'duotone'} color={on ? color.white : color.inkSoft} />
          </div>
        );
      })}
    </div>
  );
};

/** Число, которое «набегает» прямо в строке панели. */
export const Counter: React.FC<{value: number; at: number; prefix?: string; suffix?: string; tone?: Tone; duration?: number}> = ({
  value,
  at,
  prefix = '',
  suffix = '',
  tone = 'primary',
  duration = 1,
}) => {
  const {t} = useClock();
  const p = easeAt(t, at, duration);
  const n = new Intl.NumberFormat('ru-RU').format(Math.round(value * p));
  return (
    <div style={{fontSize: type.h2 - 4, fontWeight: weight.black, color: toneOf(tone).fg, fontVariantNumeric: 'tabular-nums', letterSpacing: -1, whiteSpace: 'nowrap', opacity: interpolate(t, [at - 0.1, at + 0.15], [0.25, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>
      {prefix}
      {n}
      {suffix}
    </div>
  );
};

/** Шкала-«заряд»: заполняется от `from` до `to`. Подпись — одно слово. */
export const Meter: React.FC<{from?: number; to: number; at: number; duration?: number; width?: number; label?: string; tone?: Tone; icon?: PhosphorIcon}> = ({
  from = 0.1,
  to,
  at,
  duration = 2,
  width = 480,
  label,
  tone = 'positive',
  icon: I,
}) => {
  const pBox = useBounce(at - 0.3, 'soft');
  const {t} = useClock();
  const v = from + (to - from) * easeAt(t, at, duration);
  const tn = toneOf(tone);
  const shine = ((t * 0.6) % 1) * (width + 120) - 120;
  return (
    <div style={{...bounceStyle(pBox, 0.8), ...surfaceStyle(defaultSurface, tone), width, padding: '22px 28px', display: 'flex', flexDirection: 'column', gap: 14, fontFamily, boxSizing: 'border-box'}}>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 12, fontSize: type.caption, fontWeight: weight.bold, color: color.ink}}>
          {I ? <I size={38} weight="duotone" color={tn.fg} /> : null}
          {label}
        </div>
        <div style={{fontSize: type.body, fontWeight: weight.black, color: tn.fg, fontVariantNumeric: 'tabular-nums'}}>{Math.round(v * 100)}%</div>
      </div>
      <div style={{position: 'relative', height: 22, borderRadius: 11, background: color.outline, overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${v * 100}%`, borderRadius: 11, background: tn.fg, overflow: 'hidden'}}>
          <div style={{position: 'absolute', left: shine, top: 0, bottom: 0, width: 80, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent)'}} />
        </div>
      </div>
    </div>
  );
};
