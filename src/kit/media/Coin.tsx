import React from 'react';
import {Img, staticFile} from 'remotion';

export type CoinKind = 'dollar' | 'percent';

/** Объёмная серебряная монета (3D, в стиле иллюстраций). dollar — деньги, percent — доход/купон. */
export const Coin: React.FC<{size?: number; kind?: CoinKind}> = ({size = 56, kind = 'dollar'}) => (
  <Img
    src={staticFile(`illustrations/coin-${kind}-sm.png`)}
    style={{width: size, height: size, display: 'block', flexShrink: 0, filter: 'drop-shadow(0 6px 10px rgba(23,0,72,0.18))'}}
  />
);
