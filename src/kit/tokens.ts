/**
 * Дизайн-токены — единственный источник цветов, размеров и таймингов.
 * Компоненты kit берут значения только отсюда. Меняете стиль — меняете здесь.
 */

export const video = {
  width: 1920,
  height: 1080,
  /** 60 к/с — плавнее для motion-графики */
  fps: 60,
  /** Высота нижнего блока субтитров */
  subtitleHeight: 160,
  /** Внутренний отступ сцены от краёв */
  padding: 96,
} as const;

/** Размер области сцены (всё, что выше субтитров) */
export const stage = {
  width: video.width,
  height: video.height - video.subtitleHeight,
} as const;

/**
 * Палитра взята из приложения minvest-app (lib/src/shared/style/app_theme.dart, светлая тема).
 * Золото — из фирменной стрелки-логотипа.
 */
export const color = {
  bg: '#FFFFFF', // фон кадра — статичный белый
  surface: '#F3F3F6', // surfaceContainer — карточки на белом, как в приложении
  white: '#FFFFFF',
  card: '#FFFEFF', // surfaceContainerLowest — белые карточки и строки на сером экране приложения
  surfaceLow: '#F9F9FC', // surfaceContainerLow — «мягкие» карточки-секции
  surfaceDim: '#ECECF0', // surfaceDim — дорожки переключателей, невыбранные чипсы
  disabled: '#C6C6CE',
  ratingNeutral: '#FFE431',
  ink: '#1A1B1F', // onSurface
  inkMuted: '#515259', // onSurfaceSecondary
  inkSoft: '#858590', // onSurfaceSoft
  line: '#E8E9EF', // outlineVariant
  outline: '#DDDEE6', // outline

  primary: '#6E39DD', // primary
  primarySoft: '#EBE4FD', // primaryContainer
  primaryLight: '#9B6BFF', // softPrimary
  primaryGlow: '#D6C2FF', // screenGradientStart
  primaryDeep: '#170048', // constructorGradientEnd

  accent: '#F78A00', // warning
  accentSoft: '#FFF3E5', // warningContainer
  gold: '#FFC800', // логотип
  goldLight: '#FFF4CD', // логотип

  positive: '#1FB353', // success
  positiveSoft: '#E6F8ED', // successContainer
  negative: '#DB588C', // error
  negativeSoft: '#FDE5EB', // errorContainer
  info: '#299FFF', // chartAccent
  infoSoft: '#E3F2FD', // tertiaryContainer

  mbank: '#009171', // mbankGradientStart
  mbankLight: '#00CEA0', // mbankGradientEnd

  subtitleBg: '#170048',
  subtitleText: '#FFFFFF',
  subtitleActive: '#FFC800',
} as const;

export type Tone = 'primary' | 'accent' | 'positive' | 'negative' | 'info' | 'neutral';

export const tone = (t: Tone): {fg: string; soft: string} => {
  switch (t) {
    case 'primary':
      return {fg: color.primary, soft: color.primarySoft};
    case 'accent':
      return {fg: color.accent, soft: color.accentSoft};
    case 'positive':
      return {fg: color.positive, soft: color.positiveSoft};
    case 'negative':
      return {fg: color.negative, soft: color.negativeSoft};
    case 'info':
      return {fg: color.info, soft: color.infoSoft};
    case 'neutral':
      return {fg: color.inkSoft, soft: color.line};
  }
};

export const type = {
  display: 120,
  h1: 80,
  h2: 60,
  h3: 40,
  body: 36,
  caption: 28,
  small: 22,
  subtitle: 42,
} as const;

export const weight = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  black: 800,
} as const;

export const radius = {
  sm: 12,
  md: 20,
  lg: 32,
  pill: 999,
} as const;

export const shadow = {
  card: '0 1px 0 rgba(26,27,31,0.04), 0 18px 40px rgba(110,57,221,0.10)',
  pill: '0 4px 14px rgba(110,57,221,0.12)',
} as const;

export const motion = {
  /** Пауза между появлением соседних элементов, сек */
  stagger: 0.5,
  /** Насколько элемент «выезжает» снизу при появлении, px */
  enterDistance: 28,
  /** Длительность отрисовки линий/стрелок, сек */
  draw: 0.7,
  /** Плавное появление/исчезновение сцены, сек */
  sceneFade: 0.3,
} as const;
