#!/usr/bin/env python3
"""
Тайминги сцен и слов урока — та же оценка, что в src/kit/captions.ts (estimateCaptions) и lesson.tsx (buildLesson).
Нужны, чтобы привязать звуковые эффекты к тем же словам, что и анимацию.

  python3 scripts/scene-times.py src/lessons/intro/lesson.tsx            # таблица сцен
  python3 scripts/scene-times.py src/lessons/intro/lesson.tsx --json     # всё в JSON
"""
import json, math, re, sys

FPS, LEAD_MS, TAIL_MS, MS_PER_CHAR = 60, 250, 500, 62

def norm(s):
    return re.sub(r'[^\w]', '', s.lower().replace('ё', 'е'), flags=re.U).replace('_', '')

def captions(text):
    out, t = [], LEAD_MS
    for w in text.strip().split():
        d = max(180, len(w) * MS_PER_CHAR)
        out.append((w, t, t + d))
        t += d
        if re.search(r'[.!?…]$', w): t += 350
        elif re.search(r'[,:;—–-]$', w) or w == '—': t += 160
    return out

def load(path):
    src = open(path, encoding='utf-8').read()
    scenes, cursor = [], 0
    for m in re.finditer(r"id: '([^']+)',(.*?)narration:\s*'((?:[^'\\]|\\.)*)'", src, re.S):
        sid, mid, text = m.group(1), m.group(2), m.group(3)
        md = re.search(r'minDuration:\s*([\d.]+)', mid)
        caps = captions(text)
        dur_ms = max((float(md.group(1)) if md else 0) * 1000, caps[-1][2] + TAIL_MS)
        frames = math.ceil(dur_ms / 1000 * FPS)
        scenes.append({'id': sid, 'start': cursor / FPS, 'dur': frames / FPS,
                       'words': [{'w': w, 'n': norm(w), 't': a / 1000} for w, a, _ in caps]})
        cursor += frames
    return scenes

def cue(scene, word, nth=1):
    target, seen = norm(word), 0
    for w in scene['words']:
        if w['n'].startswith(target):
            seen += 1
            if seen == nth: return w['t']
    raise KeyError(f"{scene['id']}: {word}#{nth}")

if __name__ == '__main__':
    sc = load(sys.argv[1])
    if '--json' in sys.argv:
        print(json.dumps(sc, ensure_ascii=False))
    else:
        for s in sc:
            print(f"{s['start']:7.2f}  {s['dur']:6.2f}  {s['id']}")
        print(f"{sc[-1]['start'] + sc[-1]['dur']:7.2f}  всего")
