import type {Caption} from '@remotion/captions';
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {fontFamily} from '../fonts';
import {color, stage, type, video, weight} from '../tokens';
import {Background} from './Background';
import {Subtitles} from './Subtitles';

type Props = {
  /** Маленькая подпись темы в левом верхнем углу */
  topic?: string;
  /** Логотип/название в правом верхнем углу */
  brand?: React.ReactNode;
  captions: Caption[];
  children: React.ReactNode;
};

/**
 * Постоянный каркас кадра: область сцены сверху + блок субтитров снизу.
 * Сцены рисуются только внутри области сцены и не могут залезть на субтитры.
 */
export const LessonFrame: React.FC<Props> = ({topic, brand, captions, children}) => {
  return (
    <AbsoluteFill style={{background: color.bg, fontFamily, color: color.ink}}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: stage.width,
          height: stage.height,
          overflow: 'hidden',
        }}
      >
        <Background />
        {children}
        {topic || brand ? (
          <div
            style={{
              position: 'absolute',
              top: 40,
              left: video.padding,
              right: video.padding,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: type.small,
              fontWeight: weight.semibold,
              color: color.inkSoft,
              letterSpacing: 0.4,
              pointerEvents: 'none',
            }}
          >
            <span>{topic}</span>
            <span>{brand}</span>
          </div>
        ) : null}
      </div>
      <Subtitles captions={captions} />
    </AbsoluteFill>
  );
};
