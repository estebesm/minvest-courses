import type {Caption} from '@remotion/captions';

/**
 * ВРЕМЕННО: грубая оценка таймингов слов по длине текста.
 * Когда агент озвучки начнёт отдавать реальные тайминги (ElevenLabs / Whisper),
 * эта функция заменяется на их данные в формате Caption[].
 */
export const estimateCaptions = (text: string, startMs = 0, msPerChar = 62): Caption[] => {
  const words = text.trim().split(/\s+/);
  const out: Caption[] = [];
  let t = startMs;
  for (const word of words) {
    const dur = Math.max(180, word.length * msPerChar);
    out.push({text: word, startMs: t, endMs: t + dur, timestampMs: t + dur / 2, confidence: null});
    t += dur;
    if (/[.!?…]$/.test(word)) t += 350;
    else if (/[,:;—–-]$/.test(word) || word === '—') t += 160;
  }
  return out;
};

const normalize = (s: string) =>
  s
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/[^\p{L}\p{N}]/gu, '');

/**
 * Находит момент (мс), когда звучит слово. Совпадение по началу слова,
 * поэтому `cue('купон')` найдёт и «купон», и «купоны».
 */
export const findWordMs = (captions: Caption[], word: string, nth = 1): number => {
  const target = normalize(word);
  let seen = 0;
  for (const c of captions) {
    if (normalize(c.text).startsWith(target)) {
      seen++;
      if (seen === nth) return c.startMs;
    }
  }
  throw new Error(`Слово «${word}» (#${nth}) не найдено в озвучке сцены`);
};

/** Разбивка субтитров на «страницы» — по одной фразе на экран. */
export const paginateCaptions = (captions: Caption[], maxChars = 64): Caption[][] => {
  const pages: Caption[][] = [];
  let current: Caption[] = [];
  let chars = 0;
  const flush = () => {
    if (current.length) pages.push(current);
    current = [];
    chars = 0;
  };
  for (const c of captions) {
    const w = c.text.trim();
    const prev = current[current.length - 1];
    if (prev && (chars + 1 + w.length > maxChars || c.startMs - prev.endMs > 700)) flush();
    current.push(c);
    chars += (chars ? 1 : 0) + w.length;
    if (/[.!?…]$/.test(w)) flush();
  }
  flush();
  return pages;
};
