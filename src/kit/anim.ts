import type {CSSProperties} from 'react';
import {Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {motion} from './tokens';

/**
 * Все тайминги в kit задаются в СЕКУНДАХ от начала сцены (проп `at`),
 * чтобы их было легко связать с таймингами слов озвучки.
 */

/** Плавный прогресс появления 0→1, стартует в момент `at` (сек). */
export const useEnter = (at = 0, durationSec = 0.6): number => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({
    frame: frame - Math.round(at * fps),
    fps,
    config: {damping: 200},
    durationInFrames: Math.round(durationSec * fps),
  });
};

/** Линейный прогресс 0→1 с easing — для отрисовки линий, счётчиков. */
export const useProgress = (at = 0, durationSec: number = motion.draw): number => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const start = at * fps;
  return interpolate(frame, [start, start + durationSec * fps], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });
};

/** Стандартное появление: снизу вверх + проявление. */
export const enterStyle = (p: number, distance: number = motion.enterDistance): CSSProperties => ({
  opacity: p,
  transform: `translateY(${(1 - p) * distance}px)`,
});

/** Мягкое появление для крупных панелей. */
export const popStyle = (p: number): CSSProperties => ({
  opacity: p,
  transform: `scale(${0.92 + 0.08 * p}) translateY(${(1 - p) * 16}px)`,
});

/** Текущее время сцены в секундах. */
export const useTime = (): number => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return frame / fps;
};

/**
 * Пружинистый прогресс: проскакивает чуть дальше 1 и возвращается.
 * Даёт ощущение веса — для карточек, иконок, чисел.
 */
export const useBounce = (at = 0, bounciness: 'soft' | 'medium' | 'strong' = 'medium'): number => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return springAt(frame, fps, at, bounciness);
};

const BOUNCE = {
  soft: {damping: 18, mass: 0.8, stiffness: 120},
  medium: {damping: 14, mass: 0.7, stiffness: 140},
  strong: {damping: 11, mass: 0.6, stiffness: 160},
} as const;

/** То же, что useBounce, но без хука — для списков и циклов (кадр и fps передаются явно). */
export const springAt = (frame: number, fps: number, at: number, bounciness: keyof typeof BOUNCE = 'medium'): number =>
  spring({frame: frame - Math.round(at * fps), fps, config: BOUNCE[bounciness]});

/** Плавный прогресс 0→1 без хука: t — текущее время сцены, сек. */
export const easeAt = (t: number, at: number, durationSec = 0.6): number =>
  interpolate(t, [at, at + durationSec], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });

/** Кадр и время сцены одним вызовом — для компонентов со множеством анимаций. */
export const useClock = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return {frame, fps, t: frame / fps};
};

/** Появление с пружинкой: вырастает из маленького, чуть перелетает и садится. */
export const bounceStyle = (p: number, from = 0.6): CSSProperties => ({
  opacity: Math.min(1, p * 2.5),
  transform: `scale(${from + (1 - from) * p}) translateY(${(1 - p) * 40}px)`,
});

/** «Окно» 0→1→0 между a и b с плавными краями. Безопасно для коротких и пустых интервалов. */
export const windowAt = (t: number, a: number, b: number, fade = 0.3): number => {
  if (b <= a) return 0;
  const f = Math.min(fade, (b - a) / 2 - 0.001);
  if (f <= 0) return t >= a && t <= b ? 1 : 0;
  return interpolate(t, [a, a + f, b - f, b], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
};
