import React from 'react';
import {bounceStyle, enterStyle, useBounce, useEnter, useProgress} from '../anim';
import {KineticText} from './KineticText';
import {color, radius, shadow, type, weight} from '../tokens';

type Props = {
  term: string;
  definition: string;
  /** Появление термина, сек */
  at?: number;
  /** Появление определения, сек (по умолчанию через 0.8 сек после термина) */
  definitionAt?: number;
  label?: string;
};

/** Термин + определение. Термин выделяется «маркером». */
export const Term: React.FC<Props> = ({term, definition, at = 0, definitionAt, label = 'Термин'}) => {
  const pTerm = useEnter(at);
  const marker = useProgress(at + 0.3, 0.5);
  const pDef = useBounce(definitionAt ?? at + 0.8, 'soft');
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 48}}>
      <div style={{...enterStyle(pTerm), display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20}}>
        <span
          style={{
            fontSize: type.caption,
            fontWeight: weight.bold,
            color: color.inkSoft,
            textTransform: 'uppercase',
            letterSpacing: 2,
          }}
        >
          {label}
        </span>
        <span style={{position: 'relative', display: 'inline-block', padding: '0 24px'}}>
          <span
            style={{
              position: 'absolute',
              left: 0,
              bottom: 14,
              height: '42%',
              width: `${marker * 100}%`,
              background: color.accentSoft,
              borderRadius: radius.sm,
            }}
          />
          <span style={{position: 'relative', display: 'inline-block'}}>
            <KineticText text={term} at={at} style={{fontSize: type.display, fontWeight: weight.black, letterSpacing: -2}} />
          </span>
        </span>
      </div>
      <div
        style={{
          ...bounceStyle(pDef, 0.85),
          maxWidth: 1300,
          background: color.surface,
          borderRadius: radius.lg,
          boxShadow: shadow.card,
          padding: '40px 56px',
          fontSize: type.h3,
          fontWeight: weight.medium,
          lineHeight: 1.4,
          textAlign: 'center',
          color: color.ink,
        }}
      >
        {definition}
      </div>
    </div>
  );
};
