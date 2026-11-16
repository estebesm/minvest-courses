import type {Icon as PhosphorIcon} from '@phosphor-icons/react';
import React from 'react';
import {bounceStyle, useBounce} from '../anim';
import {Icon} from '../media/Icon';
import {color, radius, shadow, tone as toneOf, type, weight, type Tone} from '../tokens';

type Props = {
  /** Цифра или 1–2 слова: «12% в год», «100 000 ₽» */
  text: string;
  icon?: PhosphorIcon;
  tone?: Tone;
  at?: number;
  size?: 'md' | 'lg';
};

/** Метка-«таблетка»: выпрыгивает, чтобы зафиксировать на экране цифру из речи диктора. */
export const Pill: React.FC<Props> = ({text, icon, tone = 'primary', at = 0, size = 'lg'}) => {
  const t = toneOf(tone);
  const p = useBounce(at, 'strong');
  const fs = size === 'lg' ? type.h3 + 4 : type.caption;
  return (
    <div
      style={{
        ...bounceStyle(p, 0.4),
        display: 'inline-flex',
        alignItems: 'center',
        gap: 14,
        background: color.surface,
        border: `3px solid ${t.soft}`,
        boxShadow: shadow.pill,
        borderRadius: radius.pill,
        padding: size === 'lg' ? '16px 32px' : '10px 22px',
        fontSize: fs,
        fontWeight: weight.black,
        color: t.fg,
        whiteSpace: 'nowrap',
        fontVariantNumeric: 'tabular-nums',
      }}
    >
      {icon ? <Icon icon={icon} tone={tone} size={fs * 1.1} /> : null}
      {text}
    </div>
  );
};
