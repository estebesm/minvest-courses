import {
  Arrow,
  BigNumber,
  Camera,
  CashFlow,
  Emphasis,
  Gauge,
  Illustration,
  LessonIntro,
  LineChart,
  Logo,
  Panel,
  Pill,
  Place,
  Row,
  Sparkles,
  Sparkline,
  Stack,
  Stamp,
  type Lesson,
} from '../../kit';

/**
 * Принципы:
 * 1. Текст говорит диктор и показывают субтитры. На экране — 3D-иллюстрации, 1–2 слова и цифры.
 * 2. Главная картинка сцены появляется СРАЗУ (at ≈ 0.1). Слова диктора (cue) только добавляют детали.
 * 3. Привязка к началу фразы, а не к её последнему слову.
 * 4. Экран не простаивает: проверка — `npm run qa`.
 * 5. Валюта — доллары (как в приложении minvest).
 */

const growth = [0, 1, 2, 3, 4, 5].map((year) => ({
  x: year === 0 ? 'старт' : `${year} г`,
  y: Math.round(10_000 * 1.12 ** year),
}));
const kUsd = (v: number) => `$${Math.round(v / 1000)}к`;

const stocksPrice = [10, 14, 9, 16, 11, 19, 8, 15, 21, 13, 18];
const bondsPrice = [10, 10.8, 11.6, 12.4, 13.2, 14, 14.8, 15.6, 16.4, 17.2, 18];

export const demoLesson: Lesson = {
  brand: <Logo height={34} />,
  scenes: [
    {
      id: 'intro',
      layout: 'free',
      minDuration: 4.5,
      narration: 'Привет! Это первый урок курса. Сегодня разберёмся, что такое облигация.',
      render: () => <LessonIntro lesson={1} title="Что такое облигация" />,
    },
    {
      id: 'term',
      layout: 'free',
      narration:
        'Облигация — это долговая расписка. Вы даёте деньги в долг компании или государству, а они возвращают их с процентами.',
      render: ({cue}) => (
        <Camera start={{zoom: 0.96}} shots={[{at: cue('даёте'), zoom: 1.04, duration: 4}]}>
          <Sparkles x={960} y={430} radius={340} at={0.6} seed={2} />
          <Place x={960} y={430}>
            <Emphasis pulse={[cue('процентами')]}>
              <Illustration name="bond" size={600} at={0.1} />
            </Emphasis>
          </Place>
          <Place x={1170} y={640}>
            <Stamp text="ДОЛГ" at={cue('долговая')} />
          </Place>
          <Place x={300} y={560}>
            <Illustration name="wallet" size={300} at={cue('даёте') - 0.2} backdrop="none" phase={1} />
          </Place>
          <Arrow
            from={{x: 420, y: 470}}
            to={{x: 690, y: 400}}
            curve={-50}
            at={cue('деньги')}
            flow={{every: 0.32, until: cue('возвращают')}}
          />
          <Place x={1640} y={560}>
            <Illustration name="coin-percent" size={280} at={cue('возвращают') - 0.2} backdrop="none" phase={2} />
          </Place>
          <Arrow
            from={{x: 1230, y: 400}}
            to={{x: 1520, y: 470}}
            curve={-50}
            tone="positive"
            at={cue('возвращают')}
            flow={{every: 0.32, kind: 'percent'}}
          />
        </Camera>
      ),
    },
    {
      id: 'scheme',
      layout: 'free',
      minDuration: 9,
      narration: 'Схема простая: инвестор даёт компании деньги в долг, а компания регулярно платит ему процент — купон.',
      render: ({cue}) => (
        // Камера: крупно «Инвестор» → отъезд на всю схему → наезд на поток купонов
        <Camera
          start={{x: 470, y: 450, zoom: 1.45}}
          shots={[
            {at: cue('компании') - 0.3, zoom: 1, duration: 1.4},
            {at: cue('платит'), x: 960, y: 470, zoom: 1.08, duration: 1.2},
          ]}
        >
          <Place x={470} y={400}>
            <Emphasis pulse={[cue('инвестор'), cue('купон') + 0.4]}>
              <Illustration name="wallet" size={420} at={0.15} />
            </Emphasis>
          </Place>
          <Place x={470} y={690}>
            <Pill text="Инвестор" at={0.4} />
          </Place>
          <Place x={1450} y={400}>
            <Emphasis pulse={[cue('компания')]}>
              <Illustration name="building" size={420} at={cue('компании')} phase={1.5} />
            </Emphasis>
          </Place>
          <Place x={1450} y={690}>
            <Pill text="Компания" tone="accent" at={cue('компании') + 0.25} />
          </Place>
          <Arrow
            from={{x: 700, y: 330}}
            to={{x: 1220, y: 330}}
            curve={80}
            label="$1 000"
            at={cue('деньги')}
            flow={{every: 0.35, until: cue('платит') + 0.6}}
          />
          <Arrow
            from={{x: 1220, y: 500}}
            to={{x: 700, y: 500}}
            curve={80}
            label="купон"
            tone="positive"
            at={cue('платит')}
            flow={{kind: 'percent', every: 0.5}}
          />
        </Camera>
      ),
    },
    {
      id: 'cashflow',
      narration: 'Сначала вы покупаете облигацию. Потом получаете купоны. А в конце срока вам возвращают номинал.',
      render: ({cue}) => (
        <Row>
          <CashFlow
            at={0.1}
            flows={[
              {amount: -1000, at: cue('покупаете')},
              ...[0, 1, 2, 3].map((i) => ({amount: 50, at: cue('получаете') + i * 0.3})),
              {amount: 1000, at: cue('возвращают')},
            ]}
          />
        </Row>
      ),
    },
    {
      id: 'growth',
      narration:
        'Например, десять тысяч долларов под двенадцать процентов годовых за пять лет превратятся почти в семнадцать тысяч шестьсот.',
      render: ({cue}) => (
        <Row gap={70}>
          <LineChart
            data={growth}
            width={1040}
            height={620}
            yFormat={kUsd}
            at={0.1}
            drawAt={cue('годовых')}
            duration={cue('превратятся') - cue('годовых') + 0.6}
          />
          <Stack gap={22}>
            <Illustration name="growth" size={250} at={0.2} />
            <Pill text="$10 000" at={cue('десять')} />
            <Pill text="12% в год" tone="positive" at={cue('двенадцать')} />
            <BigNumber value={76} suffix="%" showSign label="за 5 лет" at={cue('превратятся')} size={130} />
          </Stack>
        </Row>
      ),
    },
    {
      id: 'compare',
      narration:
        'Чем облигации отличаются от акций? Акция — это доля в компании. Облигация — это долг. Поэтому риск у облигаций ниже.',
      render: ({cue}) => (
        <Row gap={56}>
          <Emphasis dim={[[cue('облигация'), cue('риск')]]} pulse={[cue('акция')]}>
            <Panel title="Акции" illustration="pie" tone="accent" at={0.1} width={680}>
              <Sparkline data={stocksPrice} tone="accent" width={580} height={120} at={0.5} />
              <Gauge value={0.82} label="риск" size={280} at={cue('риск')} jitter />
            </Panel>
          </Emphasis>
          <Emphasis dim={[[cue('акция'), cue('облигация')]]} pulse={[cue('облигация')]}>
            <Panel title="Облигации" illustration="bond" tone="primary" at={0.3} width={680}>
              <Sparkline data={bondsPrice} tone="primary" width={580} height={120} at={0.7} />
              <Gauge value={0.2} label="риск" size={280} at={cue('риск') + 0.25} />
            </Panel>
          </Emphasis>
        </Row>
      ),
    },
    {
      id: 'summary',
      narration: 'Итак: облигация — это долг. Купон — ваш доход. А в конце срока вы получаете номинал.',
      render: ({cue}) => (
        <Row gap={70}>
          <Emphasis dim={[[-1, cue('облигация')]]} pulse={[cue('облигация')]}>
            <Stack gap={20}>
              <Illustration name="bond" size={360} at={0.1} />
              <Pill text="Долг" at={0.3} />
            </Stack>
          </Emphasis>
          <Emphasis dim={[[-1, cue('купон')]]} pulse={[cue('купон')]}>
            <Stack gap={20}>
              <Illustration name="coin-percent" size={360} at={0.25} phase={1} />
              <Pill text="Купон" tone="positive" at={0.45} />
            </Stack>
          </Emphasis>
          <Emphasis dim={[[-1, cue('конце')]]} pulse={[cue('конце')]}>
            <Stack gap={20}>
              <Illustration name="hand-coin" size={360} at={0.4} phase={2} />
              <Pill text="Номинал" tone="accent" at={0.6} />
            </Stack>
          </Emphasis>
        </Row>
      ),
    },
  ],
};
