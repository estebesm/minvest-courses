# minvest courses — обучающие видео

Видео собираются кодом на [Remotion](https://www.remotion.dev) из единого UI kit (`src/kit`).

> Впервые в проекте? Что установить и какие доступы получить — в [SETUP.md](SETUP.md).

## Команды

```bash
npm run studio        # редактор с предпросмотром в браузере
npm run render:demo   # рендер демо-урока в out/demo-lesson.mp4
npm run qa            # рендер + проверка простоя (пустой или замерший экран)
npm run render:intro  # урок «Знакомство с приложением» → out/intro-lesson.mp4
npm run qa:intro      # то же + проверка простоя
python3 scripts/scene-times.py src/lessons/intro/lesson.tsx   # когда начинается каждая сцена
python3 scripts/sfx-events.py > events.json                   # список звуковых событий (по тем же словам, что анимация) → скилл real-sfx
npm run typecheck
```

## Структура

```
src/kit/            UI kit — единый стиль
  tokens.ts         цвета, шрифты, размеры, тайминги (менять стиль — только здесь)
  lesson.tsx        «движок» урока: сцены + озвучка + субтитры
  layout/           каркас кадра, субтитры, Scene, Place, Camera, Emphasis, Background
  text/             Title, KineticText, BulletList, Term
  diagram/          Card, Arrow, Chain, Orbit, Scatter, Fly, Tile
  compare/          Panel, Row, TwoColumns
  data/             BigNumber, LineChart, CashFlow, Gauge, Sparkline, Donut, ControlCard/Slider/Choice/Counter, Meter
  media/            Illustration (3D), Coin (3D), Logo, MbankTile, Sparkles, Stamp, Icon, Document,
                    Pop (выпрыгивание чего угодно), Avatar / AppImage (логотипы, монеты и 3D из приложения → public/app)
  app/              Phone + мини-экраны приложения: AppScreen, AppRow, AppSearch, AppChips, AppChart, AppButton…
  nav/              LessonIntro
src/lessons/<урок>/ сцены конкретного урока
```

## Правила для сцен (в том числе для агентов-генераторов)

0. **Минимум текста на экране.** Предложения говорит диктор и показывают субтитры. На экране — картинка,
   1–2 слова и цифры. Определения, списки и пояснения — визуализировать (документ, поток денег, спидометр, график).
0.1. **Главные визуалы — 3D-иллюстрации** в стиле minvest.kg (`<Illustration name=…>`, серебро + фиолетовый).
   Новые генерировать тем же промптом (см. `assets-src/README.md`), прогонять через colorkey и класть в `public/illustrations`.
0.2. **Логотип** — только официальный файл `public/brand/minvest-logo.svg` (`<Logo>`, `<LogoMark>`). Не набирать текстом.
0.3. **Фон** — статичный белый. Карточки — серые `#F3F3F6`, как в приложении. Валюта — доллары.
1. Импортировать элементы только из `src/kit`. Свои цвета, шрифты и размеры в сценах не задавать.
   Палитра и шрифт (Inter) — из minvest-app (`lib/src/shared/style/app_theme.dart`).
2. Иконки — только Phosphor (`@phosphor-icons/react`) через `Icon` / проп `icon`.
3. Все тайминги — проп `at` в **секундах от начала сцены**. Привязку к речи делать через `cue('слово')`:
   `<Card at={cue('инвестор')} … />` — карточка появится, когда диктор скажет «инвестор».
4. **Экран не простаивает.** Главная картинка сцены появляется сразу (`at ≈ 0.1`), а `cue()` только
   добавляет детали, фокус (`Emphasis`) и движение. Привязывать к началу фразы, а не к её последнему слову.
   Перед сдачей — `npm run qa`: «ПУСТО» должно быть 0, «ЗАМЕР» — только в самом конце видео.
   Длительность сцены считается автоматически по длине озвучки; `minDuration` — только если идёт анимация.
5. Нижние 160 px кадра — блок субтитров; сцена туда не попадает.

## Озвучка

Сейчас тайминги слов **оцениваются по тексту** (`estimateCaptions`). Когда агент озвучки начнёт
отдавать реальные тайминги, их кладут в поле `captions` сцены (формат `Caption` из `@remotion/captions`,
миллисекунды от начала сцены) — субтитры и все `cue()` синхронизируются автоматически.
