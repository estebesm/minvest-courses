#!/usr/bin/env python3
"""
Озвучка урока через Gemini TTS + точные тайминги слов (whisper.cpp).

  python3 scripts/voice.py intro            # озвучить все сцены, которых ещё нет
  python3 scripts/voice.py intro why goal   # переозвучить только эти сцены
  python3 scripts/voice.py intro --align    # только пересчитать тайминги по готовым файлам

Пишет public/audio/<урок>/<сцена>.wav и src/lessons/<урок>/voice.json (подхватывается движком урока).
Ключ — GEMINI_API_KEY в .env. Модель распознавания — ~/.cache/whisper-cpp/ggml-large-v3-turbo.bin.
"""
import base64, difflib, json, os, re, subprocess, sys, tempfile, time, urllib.request, wave

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
MODEL = os.environ.get('VOICE_MODEL', 'gemini-3.1-flash-tts-preview')
VOICE = 'Sulafat'  # женский, тёплый
STYLE = 'Say in a calm, even, warm and friendly voice, without strong emotion, at an unhurried pace: '
WHISPER = os.path.expanduser('~/.cache/whisper-cpp/ggml-large-v3-turbo.bin')
LEAD_MS = 250

def norm(s): return re.sub(r'[^\w]', '', s.lower().replace('ё', 'е'), flags=re.U).replace('_', '')

def scenes(lesson):
    src = open(os.path.join(ROOT, f'src/lessons/{lesson}/lesson.tsx'), encoding='utf-8').read()
    return [(m.group(1), m.group(2).replace("\\'", "'")) for m in re.finditer(r"id: '([^']+)',.*?narration:\s*'((?:[^'\\]|\\.)*)'", src, re.S)]

def tts(text, out):
    key = [l.split('=', 1)[1].strip().strip('"') for l in open(os.path.join(ROOT, '.env')) if l.startswith('GEMINI_API_KEY')][0]
    body = {'contents': [{'parts': [{'text': STYLE + text}]}],
            'generationConfig': {'responseModalities': ['AUDIO'],
                                 'speechConfig': {'voiceConfig': {'prebuiltVoiceConfig': {'voiceName': VOICE}}}}}
    req = urllib.request.Request(f'https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent',
                                 data=json.dumps(body).encode(), headers={'x-goog-api-key': key, 'Content-Type': 'application/json'})
    for attempt in range(7):
        try:
            d = json.load(urllib.request.urlopen(req, timeout=180))
            part = d['candidates'][0]['content']['parts'][0]['inlineData']
            break
        except Exception as e:
            if attempt == 6: raise
            print('  повтор:', type(e).__name__, getattr(e, 'code', ''), (e.read()[:300] if hasattr(e, 'read') and getattr(e, 'code', 0) != 429 else '')); time.sleep(35)
    rate = int(re.search(r'rate=(\d+)', part.get('mimeType', '')).group(1)) if 'rate=' in part.get('mimeType', '') else 24000
    with wave.open(out, 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(rate); w.writeframes(base64.b64decode(part['data']))

def align(wav, text):
    with tempfile.TemporaryDirectory() as td:
        w16 = os.path.join(td, 'a.wav')
        subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', wav, '-ar', '16000', '-ac', '1', w16], check=True)
        subprocess.run(['whisper-cli', '-m', WHISPER, '-l', 'ru', '-f', w16, '-oj', '-of', os.path.join(td, 'o'),
                        '-ml', '1', '-sow', '--prompt', text[:400]], check=True, capture_output=True)
        segs = json.load(open(os.path.join(td, 'o.json'), encoding='utf-8'))['transcription']
    heard = [(norm(s['text']), s['offsets']['from'], s['offsets']['to']) for s in segs if norm(s['text'])]
    words = text.split()
    idx = [i for i, w in enumerate(words) if norm(w)]           # слова, которые произносятся (тире — нет)
    sm = difflib.SequenceMatcher(None, [norm(words[i]) for i in idx], [h[0] for h in heard], autojunk=False)
    t = {}
    for a, b, n in sm.get_matching_blocks():
        for k in range(n): t[idx[a + k]] = (heard[b + k][1], heard[b + k][2])
    with wave.open(wav) as w: dur = round(w.getnframes() / w.getframerate() * 1000)
    # непойманные слова (бренд латиницей и т.п.) — равномерно между соседями
    known = sorted(t)
    def around(i):
        prev = max([k for k in known if k < i], default=None); nxt = min([k for k in known if k > i], default=None)
        return (t[prev][1] if prev is not None else 0, prev if prev is not None else -1,
                t[nxt][0] if nxt is not None else dur, nxt if nxt is not None else len(words))
    caps = []
    for i, w in enumerate(words):
        if i in t: a, b = t[i]
        else:
            lo, pi, hi, ni = around(i)
            step = (hi - lo) / (ni - pi - 1 or 1)
            a = lo + step * (i - pi - 1); b = a + step
        caps.append({'text': w, 'startMs': round(a) + LEAD_MS, 'endMs': round(b) + LEAD_MS, 'timestampMs': round((a + b) / 2) + LEAD_MS, 'confidence': None})
    for k in range(1, len(caps)):                                 # строго по порядку
        caps[k]['startMs'] = max(caps[k]['startMs'], caps[k - 1]['startMs'] + 1)
        caps[k]['endMs'] = max(caps[k]['endMs'], caps[k]['startMs'] + 1)
    return caps, dur, len(idx) - len(t)

if __name__ == '__main__':
    lesson = sys.argv[1]; only = [a for a in sys.argv[2:] if not a.startswith('--')]; align_only = '--align' in sys.argv
    adir = os.path.join(ROOT, f'public/audio/{lesson}'); os.makedirs(adir, exist_ok=True)
    out = {}
    for sid, text in scenes(lesson):
        wav = os.path.join(adir, f'{sid}.wav')
        if not align_only and (sid in only or not os.path.exists(wav)):
            print('озвучка:', sid); tts(text, wav); time.sleep(20)
        caps, dur, missed = align(wav, text)
        first, last = caps[0]['startMs'] - LEAD_MS, caps[-1]['endMs'] - LEAD_MS
        if first > 400 or dur - last > 700:
            a, b = max(0, first - 120) / 1000, min(dur, last + 350) / 1000
            tmp = wav + '.tmp.wav'
            subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', wav, '-ss', str(a), '-to', str(b), '-af', 'afade=t=in:d=0.02', tmp], check=True)
            os.replace(tmp, wav)
            caps, dur, missed = align(wav, text)
        out[sid] = {'audio': f'audio/{lesson}/{sid}.wav', 'leadMs': LEAD_MS, 'durationMs': dur, 'captions': caps}
        print(f'{sid:16s} {dur / 1000:6.2f} с   не распознано слов: {missed}')
    json.dump(out, open(os.path.join(ROOT, f'src/lessons/{lesson}/voice.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print('всего', round(sum(v['durationMs'] for v in out.values()) / 1000, 1), 'с')
