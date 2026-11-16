import type {Icon as PhosphorIcon} from '@phosphor-icons/react';
import React from 'react';
import {bounceStyle, enterStyle, useBounce, useEnter} from '../anim';
import {defaultSurface, onSurface, surfaceStyle, type SurfaceVariant} from '../surface';
import {type, weight, type Tone} from '../tokens';

export type CardProps = {
  label: string;
  caption?: string;
  icon?: PhosphorIcon;
  tone?: Tone;
  at?: number;
  width?: number;
  /** Стиль поверхности: flat (как в приложении), solid, glass */
  variant?: SurfaceVariant;
  /** vertical — иконка сверху; horizontal — иконка слева, как ячейка списка в приложении */
  layout?: 'vertical' | 'horizontal';
};

/** Блок схемы: иконка + подпись. Появляется с пружинкой, иконка «выпрыгивает» следом. */
export const Card: React.FC<CardProps> = ({
  label,
  caption,
  icon: I,
  tone = 'primary',
  at = 0,
  width,
  variant = defaultSurface,
  layout = 'vertical',
}) => {
  const p = useBounce(at);
  const pIcon = useBounce(at + 0.12, 'strong');
  const pText = useEnter(at + 0.18, 0.5);
  const c = onSurface(variant, tone);
  const horizontal = layout === 'horizontal';
  const iconBox = horizontal ? 96 : 112;

  return (
    <div
      style={{
        ...bounceStyle(p),
        ...surfaceStyle(variant, tone),
        width: width ?? (horizontal ? 420 : 320),
        padding: horizontal ? '28px 40px 28px 28px' : '44px 32px 40px',
        display: 'flex',
        flexDirection: horizontal ? 'row' : 'column',
        alignItems: 'center',
        gap: horizontal ? 28 : 24,
        textAlign: horizontal ? 'left' : 'center',
      }}
    >
      {I ? (
        <div
          style={{
            width: iconBox,
            height: iconBox,
            borderRadius: '50%',
            background: c.iconBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transform: `scale(${pIcon}) rotate(${(1 - pIcon) * -25}deg)`,
          }}
        >
          <I size={iconBox * 0.52} weight="duotone" color={c.icon} />
        </div>
      ) : null}
      <div style={{...enterStyle(pText, 14), display: 'flex', flexDirection: 'column', gap: 6}}>
        <div style={{fontSize: type.h3, fontWeight: weight.bold, lineHeight: 1.15, color: c.title, letterSpacing: -0.5}}>
          {label}
        </div>
        {caption ? (
          <div style={{fontSize: type.small + 4, fontWeight: weight.medium, color: c.caption, lineHeight: 1.3}}>
            {caption}
          </div>
        ) : null}
      </div>
    </div>
  );
};
