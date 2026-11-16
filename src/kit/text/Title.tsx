import React from 'react';
import {enterStyle, useEnter, useProgress} from '../anim';
import {color, type, weight} from '../tokens';
import {KineticText} from './KineticText';

type Props = {
  text: string;
  /** Маленькая надпись над заголовком: «Шаг 2», «Итоги» */
  kicker?: string;
  at?: number;
  size?: 'h1' | 'h2';
  align?: 'left' | 'center';
  /** Слова заголовка, которые выделить акцентным цветом */
  highlight?: string[];
};

/** Заголовок раздела: полоска «прочерчивается», слова выезжают по одному. */
export const Title: React.FC<Props> = ({text, kicker, at = 0, size = 'h2', align = 'left', highlight}) => {
  const bar = useProgress(at, 0.5);
  const p = useEnter(at + 0.1);
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: align === 'center' ? 'center' : 'flex-start', gap: 20}}>
      {kicker ? (
        <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
          <div style={{width: 56 * bar, height: 6, borderRadius: 3, background: color.accent}} />
          <span
            style={{
              ...enterStyle(p, 12),
              fontSize: type.caption,
              fontWeight: weight.bold,
              color: color.primary,
              textTransform: 'uppercase',
              letterSpacing: 2,
            }}
          >
            {kicker}
          </span>
        </div>
      ) : null}
      <KineticText
        text={text}
        at={at + 0.15}
        highlight={highlight ? {words: highlight, color: color.primary} : undefined}
        style={{
          fontSize: type[size],
          fontWeight: weight.black,
          lineHeight: 1.1,
          letterSpacing: -1,
          justifyContent: align === 'center' ? 'center' : 'flex-start',
          maxWidth: 1500,
        }}
      />
    </div>
  );
};
