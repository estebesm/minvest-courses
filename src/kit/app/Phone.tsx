import {BatteryFull, CellSignalHigh, WifiHigh} from '@phosphor-icons/react';
import React from 'react';
import {useBounce, useTime} from '../anim';
import {fontFamily} from '../fonts';
import {color, weight} from '../tokens';

/** Размер экрана внутри телефона, «дизайнерские» px — как макеты приложения */
export const SCREEN = {width: 390, height: 844, statusBar: 54} as const;
const BEZEL = 12;

type Props = {
  /** Ширина телефона в кадре, px */
  width?: number;
  at?: number;
  /** Постоянный наклон, градусы */
  tilt?: number;
  float?: boolean;
  phase?: number;
  children?: React.ReactNode;
};

/**
 * Телефон с экраном приложения. Внутрь кладутся элементы из kit/app (AppScreen, AppRow…);
 * они верстаются в px макета (390×844) и масштабируются вместе с телефоном.
 */
export const Phone: React.FC<Props> = ({width = 380, at = 0, tilt = 0, float = true, phase = 0, children}) => {
  const p = useBounce(at, 'soft');
  const t = useTime();
  const outerW = SCREEN.width + BEZEL * 2;
  const outerH = SCREEN.height + BEZEL * 2;
  const k = width / outerW;
  const fl = float && t > at ? Math.sin((t - at) * 1.1 + phase) * 7 : 0;
  const sway = float && t > at ? Math.sin((t - at) * 0.7 + phase) * 0.8 : 0;

  return (
    <div
      style={{
        width,
        height: outerH * k,
        opacity: Math.min(1, Math.max(0, p) * 2.5),
        transform: `translate3d(0, ${(1 - p) * 140 + fl}px, 0) rotate(${tilt + sway + (1 - p) * 7}deg) scale(${0.82 + 0.18 * p})`,
      }}
    >
      <div
        style={{
          width: outerW,
          height: outerH,
          transformOrigin: '0 0',
          transform: `scale(${k})`,
          borderRadius: 62,
          background: color.ink,
          padding: BEZEL,
          boxShadow: `0 50px 90px rgba(23,0,72,0.24), 0 0 0 2px ${color.inkMuted} inset`,
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            position: 'relative',
            width: SCREEN.width,
            height: SCREEN.height,
            borderRadius: 50,
            overflow: 'hidden',
            background: color.white,
            fontFamily,
            color: color.ink,
          }}
        >
          {children}
          {/* статус-бар */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              height: SCREEN.statusBar,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '6px 30px 0',
              fontSize: 16,
              fontWeight: weight.semibold,
              boxSizing: 'border-box',
            }}
          >
            <span>9:41</span>
            <div style={{position: 'absolute', left: '50%', top: 12, width: 112, height: 32, marginLeft: -56, borderRadius: 16, background: color.ink}} />
            <span style={{display: 'flex', gap: 5, alignItems: 'center'}}>
              <CellSignalHigh size={17} weight="fill" />
              <WifiHigh size={17} weight="bold" />
              <BatteryFull size={22} weight="fill" />
            </span>
          </div>
          {/* полоска «домой» */}
          <div style={{position: 'absolute', left: '50%', bottom: 8, width: 134, height: 5, marginLeft: -67, borderRadius: 3, background: color.ink, opacity: 0.85}} />
        </div>
      </div>
    </div>
  );
};
