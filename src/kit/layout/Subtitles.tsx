import type {Caption} from '@remotion/captions';
import React, {useMemo} from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {paginateCaptions} from '../captions';
import {fontFamily} from '../fonts';
import {color, type, video, weight} from '../tokens';

type Props = {
  captions: Caption[];
  maxChars?: number;
  /** Подсвечивать текущее слово */
  highlightWord?: boolean;
};

/** Нижний блок субтитров со статичным фоном. */
export const Subtitles: React.FC<Props> = ({captions, maxChars = 64, highlightWord = true}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = (frame / fps) * 1000;
  const pages = useMemo(() => paginateCaptions(captions, maxChars), [captions, maxChars]);

  const page = pages.find((p, i) => {
    const start = p[0].startMs;
    const next = pages[i + 1];
    const end = Math.min(p[p.length - 1].endMs + 800, next ? next[0].startMs : Infinity);
    return t >= start && t < end;
  });

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: video.subtitleHeight,
        background: color.subtitleBg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: `0 ${video.padding}px`,
        fontFamily,
      }}
    >
      {page ? (
        <div
          style={{
            fontSize: type.subtitle,
            fontWeight: weight.medium,
            lineHeight: 1.3,
            color: color.subtitleText,
            textAlign: 'center',
          }}
        >
          {page.map((w, i) => {
            const nextStart = page[i + 1]?.startMs ?? w.endMs;
            const active = highlightWord && t >= w.startMs && t < Math.max(w.endMs, nextStart);
            return (
              <span key={i} style={{color: active ? color.subtitleActive : undefined}}>
                {i > 0 ? ' ' : ''}
                {w.text.trim()}
              </span>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};
