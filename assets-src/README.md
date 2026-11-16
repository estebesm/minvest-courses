# Исходники иллюстраций

3D-иллюстрации в стиле minvest.kg, сгенерированы Figma AI (gpt-image-2.5-flare) в файле
https://www.figma.com/design/Xp87Sqtajd8tpYkpruMXwH (команда M Invest).

- `illustrations/*.png` — оригиналы с белым фоном.
- В `public/illustrations/` лежат версии с прозрачным фоном, полученные так:
  `ffmpeg -i in.png -vf "colorkey=0xFEFEFE:0.06:0.10,format=rgba" out.png`
- `*-sm.png` — уменьшенные (192px) монеты для потоков, где их много в кадре.

Стиль промпта (держать единым для новых картинок):
"3D render of <объект> made of glossy polished silver chrome ... violet (#6E39DD) glossy accent ...,
three-quarter perspective view, soft studio lighting with gentle reflections, minimalist premium fintech style,
isolated on a pure solid white background (#FFFFFF), no text, centered object, high detail"
