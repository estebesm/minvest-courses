import React from 'react';
import {Img, staticFile} from 'remotion';
import {fontFamily} from '../fonts';
import {color, tone as toneOf, weight, type Tone} from '../tokens';

/** Логотипы компаний и монеты — те же файлы, что в приложении (minvest-app/assets/images) */
export type AvatarName = 'apple' | 'nvidia' | 'tesla' | 'microsoft' | 'btc' | 'eth' | 'trx' | 'usdt';

const AVATAR: Record<AvatarName, {bg: string; pad: number; ring?: boolean}> = {
  apple: {bg: color.ink, pad: 0.22},
  nvidia: {bg: color.white, pad: 0.16, ring: true},
  tesla: {bg: 'transparent', pad: 0},
  microsoft: {bg: color.white, pad: 0.14, ring: true},
  btc: {bg: 'transparent', pad: 0},
  eth: {bg: 'transparent', pad: 0},
  trx: {bg: 'transparent', pad: 0},
  usdt: {bg: 'transparent', pad: 0},
};

type AvatarProps = {
  name?: AvatarName;
  /** Если логотипа нет — буква на цветном круге */
  letter?: string;
  tone?: Tone;
  size?: number;
  shadow?: boolean;
};

/** Круглый логотип компании или монета криптовалюты. */
export const Avatar: React.FC<AvatarProps> = ({name, letter, tone = 'primary', size = 96, shadow = false}) => {
  const a = name ? AVATAR[name] : null;
  const t = toneOf(tone);
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: a ? a.bg : t.soft,
        boxShadow: `${a?.ring ? `inset 0 0 0 ${Math.max(1, size * 0.015)}px ${color.outline}` : '0 0 0 0 transparent'}${
          shadow ? `, 0 ${size * 0.1}px ${size * 0.22}px rgba(23,0,72,0.18)` : ''
        }`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        flexShrink: 0,
        fontFamily,
        fontSize: size * 0.46,
        fontWeight: weight.black,
        color: t.fg,
      }}
    >
      {a && name ? (
        <Img
          src={staticFile(`app/${name}.png`)}
          style={{width: size * (1 - a.pad * 2), height: size * (1 - a.pad * 2), objectFit: 'contain', display: 'block'}}
        />
      ) : (
        letter
      )}
    </div>
  );
};

/** Объёмные картинки из приложения (public/app) */
export type AppImageName =
  | 'briefcase'
  | 'constructor'
  | 'coins-ring'
  | 'percent'
  | 'education'
  | 'order-market'
  | 'order-limit'
  | 'order-stop'
  | 'order-stop-limit';

export const AppImage: React.FC<{name: AppImageName; size?: number; radius?: number; round?: boolean}> = ({name, size = 320, radius = 0, round = false}) => (
  <Img
    src={staticFile(`app/${name}.png`)}
    style={{
      width: size,
      height: size,
      objectFit: round ? 'cover' : 'contain',
      display: 'block',
      // round — круглая «витрина» для картинок, обрезанных по краю файла
      borderRadius: round ? '50%' : radius,
      background: round ? color.primarySoft : undefined,
      flexShrink: 0,
    }}
  />
);

/** Ряд логотипов «внахлёст» — как в подборках приложения. */
export const AvatarStack: React.FC<{names: AvatarName[]; size?: number}> = ({names, size = 72}) => (
  <div style={{display: 'flex'}}>
    {names.map((n, i) => (
      <div key={n} style={{marginLeft: i ? -size * 0.28 : 0, borderRadius: '50%', boxShadow: `0 0 0 ${size * 0.06}px ${color.surface}`}}>
        <Avatar name={n} size={size} />
      </div>
    ))}
  </div>
);
