import type {Caption} from '@remotion/captions';
import React from 'react';
import {Audio, Sequence, staticFile} from 'remotion';
import {estimateCaptions, findWordMs} from './captions';
import {LessonFrame} from './layout/LessonFrame';
import {Scene} from './layout/Scene';

export type SceneCtx = {
  /** Секунда (от начала сцены), когда в озвучке звучит слово. Совпадение по началу слова. */
  cue: (word: string, nth?: number) => number;
  /** Длительность сцены, сек */
  duration: number;
};

export type LessonScene = {
  id: string;
  /** Текст озвучки этой сцены */
  narration: string;
  /** Реальные тайминги слов от агента озвучки (мс от начала сцены). Пока нет — оцениваются по тексту. */
  captions?: Caption[];
  layout?: 'center' | 'top' | 'free';
  /** Минимальная длительность, сек (по умолчанию — по длине озвучки) */
  minDuration?: number;
  render: (ctx: SceneCtx) => React.ReactNode;
};

export type Lesson = {
  topic?: string;
  brand?: React.ReactNode;
  /** Готовая дорожка звуковых эффектов (файл в public/), звучит под всем уроком */
  sfx?: string;
  scenes: LessonScene[];
};

/** Пауза перед началом речи в сцене и «хвост» после неё, мс */
const LEAD_IN_MS = 250;
const TAIL_MS = 500;
/** Нахлёст соседних сцен, сек: старая растворяется, пока новая уже появляется — без пустого кадра */
const OVERLAP_SEC = 0.3;

export type BuiltScene = LessonScene & {
  startFrame: number;
  durationInFrames: number;
  /** Тайминги относительно начала сцены */
  localCaptions: Caption[];
};

export const buildLesson = (lesson: Lesson, fps: number) => {
  let cursor = 0;
  const allCaptions: Caption[] = [];
  const scenes: BuiltScene[] = lesson.scenes.map((s) => {
    const localCaptions = s.captions ?? estimateCaptions(s.narration, LEAD_IN_MS);
    const speechEnd = localCaptions.length ? localCaptions[localCaptions.length - 1].endMs : 0;
    const durationMs = Math.max((s.minDuration ?? 0) * 1000, speechEnd + TAIL_MS);
    const durationInFrames = Math.ceil((durationMs / 1000) * fps);
    const startMs = (cursor / fps) * 1000;
    for (const c of localCaptions) {
      allCaptions.push({
        ...c,
        startMs: c.startMs + startMs,
        endMs: c.endMs + startMs,
        timestampMs: c.timestampMs === null ? null : c.timestampMs + startMs,
      });
    }
    const built = {...s, startFrame: cursor, durationInFrames, localCaptions};
    cursor += durationInFrames;
    return built;
  });
  return {scenes, captions: allCaptions, durationInFrames: cursor};
};

export const LessonVideo: React.FC<{lesson: Lesson; fps: number}> = ({lesson, fps}) => {
  const built = buildLesson(lesson, fps);
  return (
    <LessonFrame topic={lesson.topic} brand={lesson.brand} captions={built.captions}>
      {lesson.sfx ? <Audio src={staticFile(lesson.sfx)} /> : null}
      {built.scenes.map((s, i) => {
        const ctx: SceneCtx = {
          cue: (word, nth) => findWordMs(s.localCaptions, word, nth) / 1000,
          duration: s.durationInFrames / fps,
        };
        // Сцена живёт чуть дольше своих границ, чтобы соседние сцены перекрывались
        const ov = Math.round(OVERLAP_SEC * fps);
        const pre = i === 0 ? 0 : ov;
        const post = i === built.scenes.length - 1 ? 0 : ov;
        const total = s.durationInFrames + pre + post;
        return (
          <Sequence key={s.id} from={s.startFrame - pre} durationInFrames={total} name={s.id}>
            <Scene durationInFrames={total} inFrames={pre ? pre * 2 : ov} outFrames={post ? post * 2 : ov} layout={s.layout}>
              {/* Внутри сцены время 0 = реальное начало сцены, чтобы cue() совпадали с озвучкой */}
              <Sequence from={pre} layout="none">
                {s.render(ctx)}
              </Sequence>
            </Scene>
          </Sequence>
        );
      })}
    </LessonFrame>
  );
};
