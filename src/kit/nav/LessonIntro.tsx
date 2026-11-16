import React from 'react';
import {AbsoluteFill} from 'remotion';
import {enterStyle, useBounce, useEnter, useProgress, useTime} from '../anim';
import {Coin} from '../media/Coin';
import {LogoMark} from '../media/Logo';
import {KineticText} from '../text/KineticText';
import {color, type, video, weight} from '../tokens';

type Props = {
  lesson: number;
  title: string;
  at?: number;
};

const FloatingCoin: React.FC<{x: number; y: number; size: number; at: number; phase: number}> = ({x, y, size, at, phase}) => {
  const t = useTime();
  const p = useBounce(at, 'strong');
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate3d(0, ${Math.sin(t * 1.4 + phase) * 16}px, 0) scale(${p}) rotate(${Math.sin(t + phase) * 12}deg)`,
      }}
    >
      <Coin size={size} />
    </div>
  );
};

const rnd = (n: number) => {
  const v = Math.sin(n * 91.7) * 43758.5453;
  return v - Math.floor(v);
};

/** Монеты поднимаются снизу вверх вокруг знака — метафора роста, кадр не замирает. */
const RisingCoins: React.FC<{at: number; cx: number; bottom: number; spread: number}> = ({at, cx, bottom, spread}) => {
  const t = useTime();
  const every = 0.38;
  const travel = 2.4;
  const out: React.ReactNode[] = [];
  const first = Math.max(0, Math.floor((t - at - travel) / every));
  for (let i = first; ; i++) {
    const launch = at + i * every;
    if (launch > t) break;
    const k = (t - launch) / travel;
    if (k > 1) continue;
    const x = cx + (rnd(i) - 0.5) * spread;
    const y = bottom - k * 520;
    const size = 40 + rnd(i + 7) * 36;
    const o = Math.min(1, k * 5) * Math.min(1, (1 - k) * 3);
    out.push(
      <div
        key={i}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          opacity: o,
          transform: `translate3d(${x + Math.sin(k * 6 + i) * 14}px, ${y}px, 0) translate(-50%, -50%) rotate(${Math.sin(k * 4 + i) * 20}deg)`,
        }}
      >
        <Coin size={size} />
      </div>,
    );
  }
  return <>{out}</>;
};

/** Заставка урока: номер, название и знак minvest. Используйте в <Scene layout="free">. */
export const LessonIntro: React.FC<Props> = ({lesson, title, at = 0}) => {
  const pNum = useEnter(at + 0.2);
  const bar = useProgress(at + 0.3, 0.6);
  const glow = useBounce(at, 'soft');
  const left = useBounce(at + 0.35, 'medium');
  const right = useBounce(at + 0.6, 'medium');
  const t = useTime();
  const float = Math.sin(t * 1.1) * 10;

  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: 1110,
          top: 80,
          width: 700,
          height: 700,
          borderRadius: '50%',
          background: color.primarySoft,
          transform: `scale(${glow})`,
        }}
      />
      <RisingCoins at={at + 0.9} cx={1460} bottom={800} spread={560} />
      <div style={{position: 'absolute', left: 1230, top: 170, transform: `translate3d(0, ${float}px, 0)`}}>
        <LogoMark size={460} left={left} right={right} />
      </div>
      <FloatingCoin x={1130} y={150} size={92} at={at + 1.0} phase={0} />
      <FloatingCoin x={1700} y={600} size={72} at={at + 1.2} phase={2} />
      <FloatingCoin x={1190} y={640} size={52} at={at + 1.35} phase={4} />

      <div
        style={{
          position: 'absolute',
          left: video.padding,
          top: 0,
          bottom: 0,
          width: 980,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 28,
        }}
      >
        <div style={{...enterStyle(pNum), display: 'flex', alignItems: 'center', gap: 20}}>
          <span style={{fontSize: type.h3, fontWeight: weight.black, color: color.primary, letterSpacing: 1}}>
            Урок {String(lesson).padStart(2, '0')}
          </span>
          <div style={{width: 120 * bar, height: 6, borderRadius: 3, background: color.gold}} />
        </div>
        <KineticText
          text={title}
          at={at + 0.45}
          stagger={0.1}
          style={{fontSize: type.display, fontWeight: weight.black, lineHeight: 1.02, letterSpacing: -4}}
        />
      </div>
    </AbsoluteFill>
  );
};
