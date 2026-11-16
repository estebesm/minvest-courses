import React from 'react';
import {Img, staticFile} from 'remotion';
import {color} from '../tokens';

/**
 * Официальный логотип minvest (с сайта minvest.kg: /trash/icons/minvest-logo.svg).
 * Не перерисовывать и не набирать текстом — только этот файл.
 */
export const Logo: React.FC<{height?: number; style?: React.CSSProperties}> = ({height = 36, style}) => (
  <Img src={staticFile('brand/minvest-logo.svg')} style={{height, width: 'auto', display: 'block', ...style}} />
);

/** Градиент словесной части логотипа — для фирменных акцентов */
export const brandGradient = 'linear-gradient(135deg, #FEA702 0%, #9840DE 28%, #0E46D7 100%)';

/**
 * Знак «M» из логотипа (LogoShort.svg с minvest.kg): жёлтая стрелка + фиолетово-синий штрих.
 * Штрихи можно анимировать по отдельности: progress 0..1 для каждого.
 */
export const LogoMark: React.FC<{size?: number; left?: number; right?: number}> = ({size = 240, left = 1, right = 1}) => (
  <svg width={size} height={size * (25 / 24)} viewBox="0 0 24 25" style={{overflow: 'visible'}}>
    <defs>
      <linearGradient id="mark-grad" x1="20" y1="5" x2="12" y2="20" gradientUnits="userSpaceOnUse">
        <stop stopColor="#0E46D7" />
        <stop offset="1" stopColor="#9840DE" />
      </linearGradient>
    </defs>
    <g style={{transform: `translateY(${(1 - left) * 8}px)`, opacity: left}}>
      <path
        d="M3.58137 5.07401C4.35254 4.30866 5.60286 4.30866 6.37403 5.07401L10.5521 9.22051C11.3232 9.98586 11.3232 11.2267 10.5521 11.9921C9.78089 12.7574 8.53058 12.7574 7.75941 11.9921L6.94941 11.1882V18.0619C6.94941 19.1443 6.0653 20.0217 4.9747 20.0217C3.88411 20.0217 3 19.1443 3 18.0619V6.46857C3 6.2401 3.03939 6.02076 3.1118 5.81688C3.2065 5.54553 3.36303 5.29071 3.58137 5.07401Z"
        fill="#FAAD14"
      />
    </g>
    <g style={{transform: `translateY(${(1 - right) * 8}px)`, opacity: right}}>
      <path
        d="M19.4186 5.07401C18.6474 4.30866 17.3971 4.30866 16.6259 5.07401L12.4479 9.22052C11.6767 9.98587 11.6767 11.2268 12.4479 11.9921C13.2191 12.7575 14.4694 12.7575 15.2405 11.9921L16.0505 11.1882V18.0619C16.0505 19.1443 16.9346 20.0217 18.0252 20.0217C19.1158 20.0217 19.9999 19.1443 19.9999 18.0619V6.46854C19.9999 6.23945 19.9603 6.01955 19.8876 5.8152C19.7928 5.54448 19.6365 5.29026 19.4186 5.07401Z"
        fill="url(#mark-grad)"
      />
    </g>
  </svg>
);

/** Иконка приложения MBANK (знак из minvest-app/assets/icons/mbank_logo.svg на фирменном градиенте). */
export const MbankTile: React.FC<{size?: number}> = ({size = 200}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size * 0.24,
      background: `linear-gradient(140deg, ${color.mbank} 0%, ${color.mbankLight} 100%)`,
      boxShadow: `0 ${size * 0.12}px ${size * 0.26}px ${color.mbank}55`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <Img src={staticFile('brand/mbank-logo.svg')} style={{width: size * 0.62, height: size * 0.62, display: 'block'}} />
  </div>
);
