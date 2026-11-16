import React from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';

type Props = {
  text: string;
  at?: number;
  /** Пауза между словами, сек */
  stagger?: number;
  style?: React.CSSProperties;
  /** Слова, которые красим акцентным цветом */
  highlight?: {words: string[]; color: string};
};

/**
 * Кинетический текст: каждое слово выезжает снизу из-под «маски»,
 * с небольшой задержкой относительно предыдущего.
 */
export const KineticText: React.FC<Props> = ({text, at = 0, stagger = 0.07, style, highlight}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const words = text.split(' ');
  return (
    <div style={{...style, display: 'flex', flexWrap: 'wrap', columnGap: '0.26em'}}>
      {words.map((w, i) => {
        const p = spring({
          frame: frame - Math.round((at + i * stagger) * fps),
          fps,
          config: {damping: 14, mass: 0.6, stiffness: 120},
        });
        const isHl = highlight?.words.some((h) => w.toLowerCase().startsWith(h.toLowerCase()));
        return (
          <span key={i} style={{display: 'inline-block', overflow: 'hidden', paddingBottom: '0.12em', marginBottom: '-0.12em'}}>
            <span
              style={{
                display: 'inline-block',
                transform: `translateY(${(1 - p) * 110}%) rotate(${(1 - p) * 6}deg)`,
                transformOrigin: 'left bottom',
                color: isHl ? highlight!.color : undefined,
              }}
            >
              {w}
            </span>
          </span>
        );
      })}
    </div>
  );
};
