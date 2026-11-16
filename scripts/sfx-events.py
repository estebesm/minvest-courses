#!/usr/bin/env python3
"""
Список звуковых событий урока «Знакомство с приложением» — привязан к тем же словам, что и анимация.
Времена считаются через scripts/scene-times.py, поэтому при смене текста или таймингов озвучки список пересобирается.

  python3 scripts/sfx-events.py > work/events.json      # затем скилл real-sfx: from_cues.py → mix.py
"""
import importlib.util, json, os, sys

here = os.path.dirname(os.path.abspath(__file__))
spec = importlib.util.spec_from_file_location('st', os.path.join(here, 'scene-times.py'))
st = importlib.util.module_from_spec(spec); spec.loader.exec_module(st)
SC = {s['id']: s for s in st.load(os.path.join(here, '..', 'src/lessons/intro/lesson.tsx'))}

EV = []
def scene(sid):
    s = SC[sid]
    def cue(word, nth=1): return st.cue(s, word, nth)
    def ev(t, kind, g=1.0, ln=None):
        e = {'t': round(s['start'] + t, 3), 'type': kind, 'scene': sid}
        if g != 1.0: e['g'] = g
        if ln: e['len'] = round(ln, 2)
        EV.append(e)
    if s['start'] > 0: ev(-0.15, 'wipe', 0.7)          # смена сцены
    return cue, ev

c, e = scene('why')
e(0.1, 'pop'); e(0.35, 'pop', 0.7); e(c('купить') - 0.2, 'whoosh', 0.6, 0.6); e(c('акцию'), 'pop')
for i in range(3): e(c('не') + i * 0.35, 'pop', 0.6)
e(c('Для') - 0.5, 'whoosh', 1.0, 0.9); e(c('Для') + 0.1, 'chime', 0.6)
for i in range(6): e(c('собраны') - 0.2 + i * 0.28, 'tick' if i % 2 else 'pop', 0.55)
e(c('инструменты') - 0.3, 'whoosh', 0.5, 1.0)

c, e = scene('what')
e(c('экосистеме') - 0.3, 'pop'); e(c('MBANK'), 'pop', 0.7); e(c('перейти'), 'whoosh', 0.7, 0.6)
e(c('Через') - 0.4, 'whoosh', 0.8, 0.9)
for i in range(5): e(c('искать') + i * 0.09, 'click', 0.5)
e(c('искать') + 0.02, 'pop', 0.7); e(c('искать') + 0.7, 'click', 0.8)
e(c('изучать') - 0.2, 'whoosh', 0.7, 0.45); e(c('изучать') + 0.05, 'pop', 0.7)
e(c('отправлять'), 'click'); e(c('отправлять') + 0.12, 'whoosh', 0.8, 0.8); e(c('отправлять') + 0.3, 'pop', 0.6)
e(c('покупку'), 'pop', 0.8); e(c('продажу'), 'pop', 0.8)

c, e = scene('exchanges')
e(0.1, 'pop'); e(0.3, 'pop', 0.8); e(0.5, 'pop', 0.5); e(0.7, 'pop', 0.5)
e(c('NASDAQ'), 'pop'); e(c('NYSE'), 'pop'); e(c('например'), 'pop', 0.6); e(c('например') + 0.25, 'pop', 0.6)
e(c('Это') - 0.2, 'whoosh', 1.0, 1.4)
for i in range(5): e(c('две') + i * 0.5, 'tick', 0.5)
e(c('Список') - 0.5, 'whoosh', 0.9, 0.9)
for i in range(4): e(c('Список') + i * 0.15, 'click', 0.4)
e(c('меняться'), 'whoosh', 0.5, 0.4); e(c('меняться') + 0.35, 'pop', 0.7); e(c('актуальные'), 'click', 0.9)

c, e = scene('company')
e(0.12, 'whoosh', 0.6, 0.6)
e(c('информацию') - 0.6, 'whoosh', 0.8, 0.9); e(c('информацию'), 'pop')
e(c('аналитику') - 0.3, 'whoosh', 0.4, 0.5); e(c('аналитику'), 'pop')
e(c('новости') - 0.3, 'whoosh', 0.4, 0.5); e(c('новости'), 'pop')
e(c('Используйте') + 0.3, 'whoosh', 0.45, 0.8)
for w in ('бизнес', 'результаты', 'события'): e(c(w), 'pop', 0.6)
e(c('Чем') - 0.3, 'pop', 0.7); e(c('Чем'), 'riser', 0.5, c('оценить') - c('Чем') + 0.6); e(c('оценить') + 0.6, 'chime', 0.8)

c, e = scene('search')
e(0.12, 'whoosh', 0.6, 0.6)
e(c('сложно'), 'pop', 0.6); e(c('сложно') + 0.3, 'pop', 0.6)
e(c('Инвест-поиском'), 'pop'); e(c('Инвест-поиском') + 0.15, 'click', 0.7)
e(c('заданным'), 'click', 0.7); e(c('параметрам'), 'click', 0.7); e(c('параметрам') + 0.05, 'pop', 0.7)
e(c('фильтрам') - 0.5, 'whoosh', 0.45, 0.6); e(c('фильтрам'), 'click', 0.7); e(c('фильтрам') + 0.25, 'click', 0.7); e(c('фильтрам') + 0.05, 'pop', 0.6)
e(c('фильтрам') + 0.9, 'click'); e(c('фильтрам') + 1.2, 'whoosh', 0.7, 0.45)
e(c('Также') - 0.5, 'whoosh', 0.8, 0.9); e(c('готовые'), 'pop'); e(c('подборки'), 'pop'); e(c('идеи') - 0.3, 'pop'); e(c('идеи') + 0.05, 'chime', 0.6)
for i in range(3): e(c('сориентироваться') + i * 0.3, 'tick', 0.6)

c, e = scene('constructor')
e(0.1, 'pop'); e(0.3, 'whoosh', 0.6, 0.6); e(c('Укажите') - 0.6, 'whoosh', 0.7, 0.9)
e(c('сумму'), 'click', 0.8); e(c('сумму') + 0.2, 'click', 0.6); e(c('цель'), 'click', 0.8); e(c('срок'), 'click', 0.8)
e(c('настройте') - 0.2, 'whoosh', 0.4, 0.6); e(c('риска'), 'click', 0.8); e(c('доходности'), 'click', 0.8)
e(c('другие') - 0.2, 'whoosh', 0.4, 0.6)
for i in range(4): e(c('фильтры') + i * 0.2, 'click', 0.6)
e(c('подберёт') - 0.3, 'click'); e(c('подберёт') + 0.2, 'whoosh', 0.9, 0.5)
for i in range(5): e(c('подберёт') + 0.35 + i * 0.32, 'pop', 0.5)
e(c('состав') - 0.3, 'whoosh', 0.4, 0.6)
step = (c('чтобы') - c('состав')) / 5
for i in range(5): e(c('состав') + i * step, 'tick', 0.5)
e(c('соответствует'), 'chime', 0.8)

c, e = scene('crypto')
for i in range(4): e(0.1 + i * 0.18, 'pop', 0.8)
e(c('криптовалютой'), 'chime', 0.5)
for w in ('покупать', 'продавать', 'хранить', 'переводить'): e(c(w), 'pop')
e(c('Bitcoin') - 0.5, 'whoosh', 0.5, 0.8)
for w in ('Bitcoin', 'Ethereum', 'Tron', 'USDT'): e(c(w), 'pop', 0.8)

c, e = scene('crypto-vs-stock')
e(0.1, 'pop'); e(0.3, 'pop', 0.8); e(0.5, 'pop', 0.6)
e(c('акция', 2), 'pop', 0.6); e(c('долей'), 'pop'); e(c('криптовалюта', 2), 'pop', 0.6); e(c('цифровой'), 'pop')
e(c('Поскольку') - 0.3, 'whoosh', 0.7, 0.9); e(c('стоимость'), 'pop', 0.5); e(c('быстро'), 'pop', 0.7)
e(c('полезно') - 0.3, 'whoosh', 0.5, 0.9); e(c('решить') - 0.3, 'whoosh', 0.5, 0.5); e(c('роль'), 'pop')

c, e = scene('orders')
e(0.12, 'whoosh', 0.6, 0.6); e(c('выбрали'), 'click', 0.9); e(c('заявку'), 'click'); e(c('заявку') + 0.12, 'whoosh', 0.9, 0.9)
e(c('доступны') - 0.6, 'whoosh', 0.8, 0.9); e(c('доступны') - 0.3, 'whoosh', 0.5, 0.45)
for i in range(4): e(c('доступны') - 0.3 + i * 0.12, 'tick', 0.4)
for w in ('рыночный', 'лимитный', 'стоп', 'стоп-лимитный'): e(c(w), 'pop'); e(c(w) + 0.04, 'click', 0.5)
e(c('Они') - 0.2, 'whoosh', 0.5, 1.0); e(c('цену'), 'pop', 0.6); e(c('уровень'), 'pop', 0.6); e(c('уровень') + 0.25, 'pop', 0.6)
e(c('Эти'), 'chime', 0.6)

c, e = scene('goal')
e(0.1, 'pop'); e(c('цель'), 'pop'); e(c('проверить') - 0.5, 'whoosh', 0.7, 0.9); e(c('проверить') - 0.2, 'pop')
e(c('насколько'), 'whoosh', 0.5, 0.5); e(c('соответствует'), 'hit', 0.7)
e(c('Подборки') - 0.5, 'whoosh', 0.7, 0.9)
for w in ('Подборки', 'аналитика', 'новости'): e(c(w), 'pop')
e(c('решение'), 'chime', 0.8)

c, e = scene('summary')
for i in range(4): e(0.1 + i * 0.15, 'tick', 0.6)
for w in ('изучать', 'искать', 'собирать', 'совершать'): e(c(w), 'pop')
e(c('криптовалютой'), 'pop', 0.6)

c, e = scene('next')
for i in range(3): e(0.1 + i * 0.3, 'pop', 0.9)
e(c('шаг') - 0.2, 'whoosh', 0.7, 1.0); e(c('шаг') + 0.45, 'whoosh', 0.4, 0.5)
e(c('разберём'), 'riser', 0.6, c('сделки') + 0.5 - c('разберём'))
for w in ('рынок', 'счёт', 'сделки'): e(c(w), 'pop')
e(c('сделки') + 0.5, 'hit', 0.9); e(c('сделки') + 0.55, 'chime', 0.9)

EV.sort(key=lambda x: x['t'])
json.dump(EV, sys.stdout, ensure_ascii=False, indent=0)
