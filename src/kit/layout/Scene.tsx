import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {motion, video} from '../tokens';

type Props = {
  /** Длительность сцены в кадрах (вместе с нахлёстами) — нужна для перехода в конце */
  durationInFrames: number;
  /** Длина входного перехода, кадров (по умолчанию из motion.sceneFade) */
  inFrames?: number;
  /** Длина выходного перехода, кадров */
  outFrames?: number;
  /** Как расположить содержимое */
  layout?: 'center' | 'top' | 'free';
  children: React.ReactNode;
};

/**
 * Обёртка одной сцены: стандартные отступы + переходы.
 * Вход: сцена «прилетает» из лёгкого размытия с небольшим наездом.
 * Выход: уходит вперёд на зрителя, растворяясь — ощущение движения сквозь кадры.
 */
export const Scene: React.FC<Props> = ({durationInFrames, inFrames, outFrames, layout = 'center', children}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const inF = inFrames ?? Math.round(motion.sceneFade * fps);
  const outF = outFrames ?? Math.round(motion.sceneFade * fps);
  const ease = Easing.out(Easing.cubic);
  const pin = interpolate(frame, [0, inF], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
  const pout = interpolate(frame, [durationInFrames - outF, durationInFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.in(Easing.cubic),
  });
  const style: React.CSSProperties = {
    opacity: pin * (1 - pout),
    // Масштаб меняется только во время перехода: постоянный наезд заставлял текст мелко дрожать
    transform: pin < 1 || pout > 0 ? `scale(${0.96 + 0.04 * pin + 0.06 * pout})` : undefined,
    filter: pin < 1 || pout > 0 ? `blur(${(1 - pin) * 8 + pout * 8}px)` : undefined,
  };

  if (layout === 'free') {
    return <AbsoluteFill style={style}>{children}</AbsoluteFill>;
  }

  return (
    <AbsoluteFill
      style={{
        ...style,
        padding: `${video.padding + 40}px ${video.padding}px ${video.padding - 24}px`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: layout === 'center' ? 'center' : 'flex-start',
        alignItems: 'stretch',
        gap: 56,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/** Ставит элемент так, чтобы его ЦЕНТР оказался в точке (x, y) области сцены. */
export const Place: React.FC<{x: number; y: number; children: React.ReactNode}> = ({x, y, children}) => (
  <div style={{position: 'absolute', left: x, top: y, transform: 'translate(-50%, -50%)'}}>{children}</div>
);
