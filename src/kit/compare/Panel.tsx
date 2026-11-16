import type {Icon as PhosphorIcon} from '@phosphor-icons/react';
import React from 'react';
import {bounceStyle, useBounce} from '../anim';
import {Icon} from '../media/Icon';
import {Illustration, type IllustrationName} from '../media/Illustration';
import {defaultSurface, surfaceStyle} from '../surface';
import {color, tone as toneOf, type, weight, type Tone} from '../tokens';

type Props = {
  /** Одно-два слова */
  title: string;
  icon?: PhosphorIcon;
  /** 3D-иллюстрация в шапке вместо иконки */
  illustration?: IllustrationName;
  tone?: Tone;
  at?: number;
  width?: number;
  children?: React.ReactNode;
};

/** Карточка-контейнер для сравнений: шапка с иконкой и любые визуальные элементы внутри. */
export const Panel: React.FC<Props> = ({title, icon, illustration, tone = 'primary', at = 0, width = 720, children}) => {
  const p = useBounce(at, 'soft');
  const t = toneOf(tone);
  return (
    <div
      style={{
        ...bounceStyle(p, 0.85),
        ...surfaceStyle(defaultSurface, tone),
        width,
        overflow: 'hidden',
      }}
    >
      <div style={{background: t.soft, padding: illustration ? '8px 40px 8px 16px' : '28px 40px', display: 'flex', alignItems: 'center', gap: 16}}>
        {illustration ? <Illustration name={illustration} size={150} at={at + 0.15} backdrop="none" /> : null}
        {icon && !illustration ? <Icon icon={icon} tone={tone} size={56} /> : null}
        <div style={{fontSize: type.h3 + 6, fontWeight: weight.black, color: color.ink}}>{title}</div>
      </div>
      <div style={{padding: '36px 40px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28}}>
        {children}
      </div>
    </div>
  );
};

/** Ряд элементов по центру. */
export const Row: React.FC<{gap?: number; align?: 'center' | 'flex-start' | 'stretch'; children: React.ReactNode}> = ({
  gap = 64,
  align = 'center',
  children,
}) => <div style={{display: 'flex', justifyContent: 'center', alignItems: align, gap}}>{children}</div>;

/** Колонка элементов. */
export const Stack: React.FC<{gap?: number; align?: 'center' | 'flex-start'; children: React.ReactNode}> = ({
  gap = 40,
  align = 'center',
  children,
}) => <div style={{display: 'flex', flexDirection: 'column', alignItems: align, gap}}>{children}</div>;

/** Область фиксированного размера с содержимым по центру — чтобы соседние элементы стояли ровно. */
export const Box: React.FC<{width?: number; height?: number; children: React.ReactNode}> = ({width, height, children}) => (
  <div style={{width, height, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{children}</div>
);
