import {Buildings, Coins, User} from '@phosphor-icons/react';
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Background, Card, color, fontFamily, type, weight} from '../kit';
import type {SurfaceVariant} from '../kit/surface';

type Option = {key: string; title: string; variant: SurfaceVariant; layout: 'vertical' | 'horizontal'};

const options: Option[] = [
  {key: 'A', title: 'Как в приложении', variant: 'flat', layout: 'vertical'},
  {key: 'B', title: 'Как ячейки приложения', variant: 'flat', layout: 'horizontal'},
  {key: 'C', title: 'Цветные', variant: 'solid', layout: 'vertical'},
  {key: 'D', title: 'Стекло', variant: 'glass', layout: 'vertical'},
];

/** Витрина вариантов карточек — чтобы выбрать стиль глазами. */
export const CardStyles: React.FC = () => (
  <AbsoluteFill style={{fontFamily, color: color.ink}}>
    <Background />
    <div style={{position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr'}}>
      {options.map((o) => (
        <div key={o.key} style={{position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 28}}>
          {o.variant === 'glass' ? (
            <div style={{position: 'absolute', width: 620, height: 360, borderRadius: '50%', background: `radial-gradient(circle, ${color.primaryLight} 0%, ${color.primaryGlow} 45%, transparent 72%)`, opacity: 0.9}} />
          ) : null}
          <div style={{position: 'relative', fontSize: type.caption, fontWeight: weight.black, color: color.primary}}>
            {o.key} · {o.title}
          </div>
          <div style={{position: 'relative', display: 'flex', gap: 24}}>
            {o.layout === 'horizontal' ? (
              <div style={{display: 'flex', flexDirection: 'column', gap: 20}}>
                <Card icon={User} label="Инвестор" caption="это вы" variant={o.variant} layout="horizontal" />
                <Card icon={Buildings} label="Компания" caption="эмитент" tone="accent" variant={o.variant} layout="horizontal" />
              </div>
            ) : (
              <>
                <Card icon={User} label="Инвестор" variant={o.variant} width={270} />
                <Card icon={Buildings} label="Компания" tone="accent" variant={o.variant} width={270} />
                <Card icon={Coins} label="Купон" tone="positive" variant={o.variant} width={270} />
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  </AbsoluteFill>
);
