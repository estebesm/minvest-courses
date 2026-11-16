#!/usr/bin/env python3
"""
Проверка «простоя» в готовом видео: где экран пустой или надолго замирает.

  python3 scripts/idle-check.py out/demo-lesson.mp4

Анализируется только область сцены (без субтитров и верхней строки с логотипом).
  ПУСТО   — на экране почти нет контента (только фон)
  ЗАМЕР   — контент есть, но ничего не меняется
Без зависимостей: только ffmpeg и стандартная библиотека.
"""
import subprocess
import sys

FPS = 5
W, H = 192, 81            # уменьшенная область сцены
CROP = 'crop=1920:810:0:110'  # сцена без логотипа сверху и без субтитров снизу
EMPTY_EDGES = 0.004       # доля «контрастных» пикселей, ниже — пустой экран
STILL_MOTION = 0.35       # средняя разница кадров, ниже — замерший кадр
MIN_SPAN = 1.0            # сообщать о простое от стольких секунд


def frames(path):
    cmd = ['ffmpeg', '-v', 'error', '-i', path, '-vf', f'fps={FPS},{CROP},scale={W}:{H}',
           '-f', 'rawvideo', '-pix_fmt', 'gray', '-']
    proc = subprocess.Popen(cmd, stdout=subprocess.PIPE)
    size = W * H
    while True:
        buf = proc.stdout.read(size)
        if len(buf) < size:
            break
        yield buf


def edge_density(f):
    strong = 0
    for y in range(H):
        row = y * W
        for x in range(W - 1):
            if abs(f[row + x] - f[row + x + 1]) > 18:
                strong += 1
    return strong / (W * H)


def motion(a, b):
    return sum(abs(a[i] - b[i]) for i in range(0, W * H, 3)) / (W * H / 3)


def spans(flags):
    out, start = [], None
    for i, f in enumerate(flags + [False]):
        if f and start is None:
            start = i
        elif not f and start is not None:
            if (i - start) / FPS >= MIN_SPAN:
                out.append((start / FPS, i / FPS))
            start = None
    return out


def main():
    path = sys.argv[1]
    edges, moves, prev = [], [], None
    for f in frames(path):
        edges.append(edge_density(f))
        moves.append(motion(f, prev) if prev else 99)
        prev = f
    empty = [e < EMPTY_EDGES for e in edges]
    # «замер» считаем по окну 1 сек, чтобы не ловить единичные паузы
    win = FPS
    still = []
    for i in range(len(moves)):
        w = moves[max(0, i - win // 2): i + win // 2 + 1]
        still.append(not empty[i] and max(w) < STILL_MOTION)

    total = len(edges) / FPS
    e_sp, s_sp = spans(empty), spans(still)
    print(f'Длительность: {total:.1f} с')
    for name, sp in (('ПУСТО', e_sp), ('ЗАМЕР', s_sp)):
        dur = sum(b - a for a, b in sp)
        print(f'\n{name}: {len(sp)} отрезков, всего {dur:.1f} с ({dur / total * 100:.0f}%)')
        for a, b in sp:
            print(f'  {a:6.1f} – {b:6.1f} с  ({b - a:.1f} с)')


if __name__ == '__main__':
    main()
