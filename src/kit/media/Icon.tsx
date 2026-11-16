import type {Icon as PhosphorIcon} from '@phosphor-icons/react';
import React from 'react';
import {tone as toneOf, type Tone} from '../tokens';

type Props = {
  /** Любая иконка из @phosphor-icons/react, например `Bank` */
  icon: PhosphorIcon;
  size?: number;
  tone?: Tone;
  /** Круглая цветная подложка под иконкой */
  badge?: boolean;
};

/** Единая иконка: всегда Phosphor, всегда стиль duotone, цвет из палитры. */
export const Icon: React.FC<Props> = ({icon: I, size = 56, tone = 'primary', badge = false}) => {
  const t = toneOf(tone);
  const glyph = <I size={size} weight="duotone" color={t.fg} />;
  if (!badge) return glyph;
  const box = Math.round(size * 1.75);
  return (
    <div
      style={{
        width: box,
        height: box,
        borderRadius: '50%',
        background: t.soft,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      {glyph}
    </div>
  );
};
