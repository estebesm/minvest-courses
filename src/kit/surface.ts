import type {CSSProperties} from 'react';
import {color, tone as toneOf, type Tone} from './tokens';

/**
 * Стили «поверхностей» — карточек и панелей.
 *  flat  — как в minvest-app: плоская белая карточка, большое скругление, без теней и полосок
 *  solid — цветная заливка-градиент, белый текст
 *  glass — «жидкое стекло», как стеклянные элементы приложения
 */
export type SurfaceVariant = 'flat' | 'solid' | 'glass';

/** Вариант по умолчанию для всего kit */
export const defaultSurface: SurfaceVariant = 'flat';

export const surfaceRadius = 44;

export const surfaceStyle = (variant: SurfaceVariant, t: Tone): CSSProperties => {
  const tn = toneOf(t);
  switch (variant) {
    case 'flat':
      return {
        background: color.surface,
        borderRadius: surfaceRadius,
      };
    case 'solid':
      return {
        background: `linear-gradient(140deg, ${tn.fg} 0%, ${lighten(tn.fg)} 100%)`,
        borderRadius: surfaceRadius,
        boxShadow: `0 24px 48px ${tn.fg}40`,
        color: '#FFFFFF',
      };
    case 'glass':
      return {
        background: 'linear-gradient(160deg, rgba(255,255,255,0.78) 0%, rgba(255,255,255,0.42) 100%)',
        backdropFilter: 'blur(28px) saturate(1.6)',
        border: '2px solid rgba(255,255,255,0.9)',
        borderRadius: surfaceRadius,
        boxShadow: '0 24px 60px rgba(110,57,221,0.16), inset 0 1px 0 rgba(255,255,255,0.9)',
      };
  }
};

/** Цвета содержимого на поверхности */
export const onSurface = (variant: SurfaceVariant, t: Tone) => {
  const tn = toneOf(t);
  return variant === 'solid'
    ? {title: '#FFFFFF', caption: 'rgba(255,255,255,0.8)', iconBg: 'rgba(255,255,255,0.18)', icon: '#FFFFFF'}
    : {title: color.ink, caption: color.inkSoft, iconBg: tn.soft, icon: tn.fg};
};

const lighten = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  const mix = (c: number) => Math.round(c + (255 - c) * 0.28);
  const r = mix(n >> 16);
  const g = mix((n >> 8) & 255);
  const b = mix(n & 255);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
};
